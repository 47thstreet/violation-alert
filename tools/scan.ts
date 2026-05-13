#!/usr/bin/env bun
/**
 * ViolationAlert Scanner — Standalone CLI Tool
 * No AI needed. Pulls ALL violations for any NYC address.
 *
 * Usage:
 *   bun tools/scan.ts "838 Flatbush Ave, Brooklyn NY"
 *   bun tools/scan.ts --bin 3116573
 *   bun tools/scan.ts --bbl 3050820023
 *   bun tools/scan.ts "838 Flatbush Ave" --json
 *   bun tools/scan.ts "838 Flatbush Ave" --json > violations.json
 */

// ── Config ──────────────────────────────────────────────────────────
const GEOSEARCH = 'https://geosearch.planninglabs.nyc/v2/search';
const DOB_VIOLATIONS = 'https://data.cityofnewyork.us/resource/3h2n-5cm9.json';
const DOB_ECB = 'https://data.cityofnewyork.us/resource/6bgk-3dad.json';
const HPD_VIOLATIONS = 'https://data.cityofnewyork.us/resource/wvxf-dwi5.json';
const DOB_COMPLAINTS = 'https://data.cityofnewyork.us/resource/eabe-havv.json';
const DOB_SAFETY = 'https://data.cityofnewyork.us/resource/855j-jady.json';

const APP_TOKEN = process.env.NYC_OPEN_DATA_APP_TOKEN || '';

// ── Types ───────────────────────────────────────────────────────────
interface GeoResult {
  address: string;
  bin: string | null;
  bbl: string | null;
  borough: string | null;
  zip: string | null;
}

interface NormalizedViolation {
  agency: string;
  source_id: string;
  violation_number: string;
  violation_type: string;
  description: string;
  severity: string;
  severity_rank: number; // 1=critical, 2=hazardous, 3=serious, 4=non-hazardous, 5=info
  issued_date: string;
  status: string;
  penalty: number;
  penalty_paid: number;
  respondent: string;
}

// ── Severity Ranking ────────────────────────────────────────────────
function rankSeverity(agency: string, severity: string, violationClass?: string): { label: string; rank: number } {
  const s = (severity || '').toLowerCase();
  const c = (violationClass || '').toUpperCase();

  // HPD classes
  if (c === 'C') return { label: 'IMMEDIATELY HAZARDOUS', rank: 1 };
  if (c === 'B') return { label: 'HAZARDOUS', rank: 2 };
  if (c === 'A') return { label: 'NON-HAZARDOUS', rank: 4 };
  if (c === 'I') return { label: 'INFO', rank: 5 };

  // ECB severity
  if (s.includes('class - 1') || s.includes('immediately')) return { label: 'IMMEDIATELY HAZARDOUS', rank: 1 };
  if (s.includes('class - 2') || s.includes('hazardous')) return { label: 'HAZARDOUS', rank: 2 };
  if (s.includes('serious')) return { label: 'SERIOUS', rank: 3 };
  if (s.includes('non-hazardous') || s.includes('non hazardous')) return { label: 'NON-HAZARDOUS', rank: 4 };

  // DOB
  if (agency === 'DOB-SAFETY') return { label: 'SAFETY', rank: 2 };
  if (agency === 'DOB') return { label: 'STANDARD', rank: 4 };

  return { label: severity || 'UNKNOWN', rank: 5 };
}

// ── GeoSearch ───────────────────────────────────────────────────────
async function resolveAddress(address: string): Promise<GeoResult> {
  const res = await fetch(`${GEOSEARCH}?text=${encodeURIComponent(address)}`);
  if (!res.ok) throw new Error(`GeoSearch failed: ${res.status}`);
  const data = await res.json();
  const features = data.features;
  if (!features || features.length === 0) throw new Error(`Address not found: ${address}`);

  const props = features[0].properties;
  const pad = props.addendum?.pad || {};
  return {
    address: props.label,
    bin: pad.bin || null,
    bbl: pad.bbl || null,
    borough: props.borough || null,
    zip: props.postalcode || null,
  };
}

// ── Fetchers ────────────────────────────────────────────────────────
function buildParams(where: string, order: string, limit = 1000): string {
  const p = new URLSearchParams({ '$where': where, '$order': order, '$limit': String(limit) });
  if (APP_TOKEN) p.set('$$app_token', APP_TOKEN);
  return p.toString();
}

function buildURL(base: string, field: string, value: string, order: string, limit = 1000): string {
  return base + '?' + buildParams(field + "='" + value + "'", order, limit);
}

async function fetchJSON(url: string): Promise<any[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function fetchDOB(bin: string): Promise<NormalizedViolation[]> {
  const raw = await fetchJSON(buildURL(DOB_VIOLATIONS, 'bin', bin, 'issue_date DESC'));
  return raw.map(v => {
    const sev = rankSeverity('DOB', v.violation_category || '');
    return {
      agency: 'DOB',
      source_id: `dob-${v.isn_dob_bis_extract}`,
      violation_number: v.violation_number || '',
      violation_type: v.violation_type || v.violation_category || '',
      description: v.description || '',
      severity: sev.label,
      severity_rank: sev.rank,
      issued_date: (v.issue_date || '').slice(0, 10),
      status: v.violation_date_closed ? 'CLOSED' : 'OPEN',
      penalty: 0,
      penalty_paid: 0,
      respondent: '',
    };
  });
}

async function fetchDOBSafety(bin: string): Promise<NormalizedViolation[]> {
  const raw = await fetchJSON(buildURL(DOB_SAFETY, "bin", bin, "issue_date DESC"));
  return raw.map(v => {
    const sev = rankSeverity('DOB-SAFETY', v.violation_category || '');
    return {
      agency: 'DOB-SAFETY',
      source_id: `dob-safety-${v.isn_dob_bis_extract || v.violation_number}`,
      violation_number: v.violation_number || '',
      violation_type: v.violation_type || '',
      description: v.description || '',
      severity: sev.label,
      severity_rank: sev.rank,
      issued_date: (v.issue_date || '').slice(0, 10),
      status: v.violation_date_closed ? 'CLOSED' : 'OPEN',
      penalty: 0,
      penalty_paid: 0,
      respondent: '',
    };
  });
}

async function fetchECB(bin: string): Promise<NormalizedViolation[]> {
  const raw = await fetchJSON(buildURL(DOB_ECB, "bin", bin, "issue_date DESC"));
  return raw.map(v => {
    const sev = rankSeverity('ECB', v.severity || '');
    return {
      agency: 'ECB',
      source_id: `ecb-${v.ecb_violation_number || v.isn_dob_bis_extract}`,
      violation_number: v.ecb_violation_number || v.dob_violation_number || '',
      violation_type: v.violation_type || '',
      description: v.violation_description || '',
      severity: sev.label,
      severity_rank: sev.rank,
      issued_date: (v.issue_date || v.served_date || '').slice(0, 10),
      status: (v.ecb_violation_status || 'UNKNOWN').toUpperCase(),
      penalty: parseFloat(v.penality_imposed || v.penalty_applied || '0'),
      penalty_paid: parseFloat(v.amount_paid || '0'),
      respondent: v.respondent_name || '',
    };
  });
}

async function fetchHPD(bbl: string): Promise<NormalizedViolation[]> {
  const raw = await fetchJSON(buildURL(HPD_VIOLATIONS, "bbl", bbl, "inspectiondate DESC"));
  return raw.map(v => {
    const sev = rankSeverity('HPD', '', v.class);
    return {
      agency: 'HPD',
      source_id: `hpd-${v.violationid}`,
      violation_number: v.ordernumber || v.novid || '',
      violation_type: `Class ${v.class || '?'}`,
      description: v.novdescription || '',
      severity: sev.label,
      severity_rank: sev.rank,
      issued_date: (v.inspectiondate || v.novissueddate || '').slice(0, 10),
      status: (v.violationstatus === 'Close' ? 'CLOSED' : v.currentstatus || 'OPEN').toUpperCase(),
      penalty: 0,
      penalty_paid: 0,
      respondent: '',
    };
  });
}

async function fetchDOBComplaints(bin: string): Promise<NormalizedViolation[]> {
  const raw = await fetchJSON(buildURL(DOB_COMPLAINTS, "bin", bin, "date_entered DESC", 200));
  return raw.map(v => {
    return {
      agency: 'DOB-COMPLAINT',
      source_id: `complaint-${v.complaint_number}`,
      violation_number: v.complaint_number || '',
      violation_type: v.complaint_category || '',
      description: v.complaint_category || '',
      severity: 'INFO',
      severity_rank: 5,
      issued_date: (v.date_entered || '').slice(0, 10),
      status: (v.status || 'UNKNOWN').toUpperCase(),
      penalty: 0,
      penalty_paid: 0,
      respondent: '',
    };
  });
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: bun tools/scan.ts "ADDRESS" [--json] [--open-only] [--bin BIN] [--bbl BBL]');
    process.exit(1);
  }

  const jsonOutput = args.includes('--json');
  const openOnly = args.includes('--open-only');
  let bin: string | null = null;
  let bbl: string | null = null;
  let addressLabel = '';

  // Parse flags
  const binIdx = args.indexOf('--bin');
  if (binIdx !== -1 && args[binIdx + 1]) bin = args[binIdx + 1];

  const bblIdx = args.indexOf('--bbl');
  if (bblIdx !== -1 && args[bblIdx + 1]) bbl = args[bblIdx + 1];

  // If no BIN/BBL given, resolve address
  if (!bin && !bbl) {
    const address = args.find(a => !a.startsWith('--'))!;
    if (!jsonOutput) console.log(`\n🔍 Resolving address: ${address}\n`);

    const geo = await resolveAddress(address);
    bin = geo.bin;
    bbl = geo.bbl;
    addressLabel = geo.address;

    if (!jsonOutput) {
      console.log(`  Address: ${geo.address}`);
      console.log(`  Borough: ${geo.borough}`);
      console.log(`  ZIP:     ${geo.zip}`);
      console.log(`  BIN:     ${bin}`);
      console.log(`  BBL:     ${bbl}`);
      console.log('');
    }
  }

  if (!bin && !bbl) {
    console.error('ERROR: Could not resolve BIN or BBL for this address.');
    process.exit(1);
  }

  if (!jsonOutput) console.log('⏳ Fetching violations from all agencies...\n');

  // Fetch ALL sources in parallel
  const results = await Promise.allSettled([
    bin ? fetchDOB(bin) : Promise.resolve([]),
    bin ? fetchDOBSafety(bin) : Promise.resolve([]),
    bin ? fetchECB(bin) : Promise.resolve([]),
    bbl ? fetchHPD(bbl) : Promise.resolve([]),
    bin ? fetchDOBComplaints(bin) : Promise.resolve([]),
  ]);

  let all: NormalizedViolation[] = [];
  const agencyNames = ['DOB', 'DOB-SAFETY', 'ECB', 'HPD', 'DOB-COMPLAINTS'];

  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      all.push(...r.value);
    } else if (!jsonOutput) {
      console.log(`  ⚠ ${agencyNames[i]} fetch failed: ${r.reason}`);
    }
  });

  // Filter open only if requested
  if (openOnly) {
    all = all.filter(v => v.status === 'OPEN' || v.status === 'ACTIVE');
  }

  // Sort by severity (most critical first), then by date (newest first)
  all.sort((a, b) => {
    if (a.severity_rank !== b.severity_rank) return a.severity_rank - b.severity_rank;
    return b.issued_date.localeCompare(a.issued_date);
  });

  // Deduplicate by source_id
  const seen = new Set<string>();
  all = all.filter(v => {
    if (seen.has(v.source_id)) return false;
    seen.add(v.source_id);
    return true;
  });

  // ── JSON output ──
  if (jsonOutput) {
    const output = {
      address: addressLabel,
      bin,
      bbl,
      scanned_at: new Date().toISOString(),
      total: all.length,
      open: all.filter(v => v.status === 'OPEN' || v.status === 'ACTIVE').length,
      total_penalties: all.reduce((s, v) => s + v.penalty, 0),
      by_severity: {
        critical: all.filter(v => v.severity_rank === 1).length,
        hazardous: all.filter(v => v.severity_rank === 2).length,
        serious: all.filter(v => v.severity_rank === 3).length,
        non_hazardous: all.filter(v => v.severity_rank === 4).length,
        info: all.filter(v => v.severity_rank === 5).length,
      },
      by_agency: {
        DOB: all.filter(v => v.agency === 'DOB').length,
        'DOB-SAFETY': all.filter(v => v.agency === 'DOB-SAFETY').length,
        ECB: all.filter(v => v.agency === 'ECB').length,
        HPD: all.filter(v => v.agency === 'HPD').length,
        'DOB-COMPLAINT': all.filter(v => v.agency === 'DOB-COMPLAINT').length,
      },
      violations: all,
    };
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  // ── Pretty output ──
  const openCount = all.filter(v => v.status === 'OPEN' || v.status === 'ACTIVE').length;
  const totalPenalties = all.reduce((s, v) => s + v.penalty, 0);

  console.log('━'.repeat(70));
  console.log(`  VIOLATION REPORT: ${addressLabel || `BIN ${bin}`}`);
  console.log('━'.repeat(70));
  console.log(`  Total: ${all.length}  |  Open: ${openCount}  |  Penalties: $${totalPenalties.toLocaleString()}`);
  console.log('');

  // Group by severity
  const groups = [
    { rank: 1, label: '🔴 IMMEDIATELY HAZARDOUS', color: '\x1b[31m' },
    { rank: 2, label: '🟠 HAZARDOUS / SAFETY', color: '\x1b[33m' },
    { rank: 3, label: '🟡 SERIOUS', color: '\x1b[33m' },
    { rank: 4, label: '🔵 NON-HAZARDOUS / STANDARD', color: '\x1b[36m' },
    { rank: 5, label: '⚪ INFO / COMPLAINTS', color: '\x1b[37m' },
  ];

  for (const group of groups) {
    const items = all.filter(v => v.severity_rank === group.rank);
    if (items.length === 0) continue;

    console.log(`${group.color}  ── ${group.label} (${items.length}) ──\x1b[0m`);
    for (const v of items) {
      const status = v.status === 'OPEN' ? '\x1b[31mOPEN\x1b[0m' : '\x1b[32m' + v.status + '\x1b[0m';
      const penalty = v.penalty > 0 ? ` | $${v.penalty.toLocaleString()}` : '';
      console.log(`    [${v.agency}] ${v.issued_date || 'N/A'} | ${status}${penalty}`);
      console.log(`      #${v.violation_number || 'N/A'} — ${v.description.slice(0, 90)}`);
    }
    console.log('');
  }

  // Summary
  console.log('━'.repeat(70));
  console.log('  AGENCY BREAKDOWN:');
  for (const agency of ['DOB', 'DOB-SAFETY', 'ECB', 'HPD', 'DOB-COMPLAINT']) {
    const count = all.filter(v => v.agency === agency).length;
    if (count > 0) console.log(`    ${agency}: ${count}`);
  }
  console.log('━'.repeat(70));
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
