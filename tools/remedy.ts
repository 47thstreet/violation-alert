#!/usr/bin/env bun
/**
 * ViolationAlert Remedy Engine — Standalone CLI Tool
 * Uses NVIDIA API (free inference) to generate fixes for violations.
 *
 * Usage:
 *   bun tools/scan.ts "838 Flatbush Ave" --json | bun tools/remedy.ts
 *   bun tools/remedy.ts --file violations.json
 *   bun tools/remedy.ts --violation "FAILURE TO FILE LOW PRESSURE BOILER INSPECTION" --agency DOB
 *   bun tools/remedy.ts --file violations.json --open-only --top 5
 *
 * Env:
 *   NVIDIA_API_KEY — get free key at https://build.nvidia.com
 */

// ── Config ──────────────────────────────────────────────────────────
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1'; // NVIDIA Nemotron Super, 49B params, great at structured JSON

interface NormalizedViolation {
  agency: string;
  source_id: string;
  violation_number: string;
  violation_type: string;
  description: string;
  severity: string;
  severity_rank: number;
  issued_date: string;
  status: string;
  penalty: number;
  penalty_paid: number;
  respondent: string;
}

interface Remedy {
  violation_number: string;
  agency: string;
  severity: string;
  description: string;
  fix_summary: string;
  steps: string[];
  estimated_cost_low: number;
  estimated_cost_high: number;
  timeline_days: number;
  diy_possible: boolean;
  professional_needed: string | null;
  documents_needed: string[];
  filing_info: string;
  consequences_if_ignored: string;
  tips: string[];
}

interface ScanOutput {
  address: string;
  bin: string;
  bbl: string;
  violations: NormalizedViolation[];
}

// ── NVIDIA API Call ─────────────────────────────────────────────────
async function callNvidia(prompt: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error(
      'NVIDIA_API_KEY not set. Get a free key at https://build.nvidia.com\n' +
      'Then: export NVIDIA_API_KEY=nvapi-...'
    );
  }

  const res = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an expert NYC building violations consultant. You know DOB, HPD, ECB, DEP, FDNY, and DSNY regulations inside and out. You provide specific, actionable remediation steps for NYC property owners. Always respond in valid JSON only — no markdown, no explanation text outside the JSON.`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ── Build Remedy Prompt ─────────────────────────────────────────────
function buildPrompt(violation: NormalizedViolation): string {
  return `Research this NYC building violation and provide a complete remediation guide.

VIOLATION:
- Agency: ${violation.agency}
- Type: ${violation.violation_type}
- Description: ${violation.description}
- Severity: ${violation.severity}
- Status: ${violation.status}
- Penalty: $${violation.penalty}
- Violation #: ${violation.violation_number}

Respond in this exact JSON format:
{
  "fix_summary": "One sentence summary of what needs to be done",
  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "estimated_cost_low": <number USD>,
  "estimated_cost_high": <number USD>,
  "timeline_days": <typical days to resolve>,
  "diy_possible": <true/false>,
  "professional_needed": "<type of professional or null if DIY>",
  "documents_needed": ["Doc 1", "Doc 2"],
  "filing_info": "Where and how to file the correction (specific NYC agency, portal, address)",
  "consequences_if_ignored": "What happens if you don't fix this",
  "tips": ["Tip 1", "Tip 2"]
}`;
}

// ── Batch Prompt (multiple violations at once) ──────────────────────
function buildBatchPrompt(violations: NormalizedViolation[]): string {
  const violationList = violations.map((v, i) =>
    `${i + 1}. [${v.agency}] ${v.severity} — ${v.violation_type}: ${v.description.slice(0, 120)} (Penalty: $${v.penalty}, Status: ${v.status})`
  ).join('\n');

  return `You are reviewing ${violations.length} NYC building violations for the same property. Provide a remediation plan for EACH violation, prioritized by severity.

VIOLATIONS:
${violationList}

Respond with a JSON array. Each element must have this exact structure:
{
  "index": <1-based index matching the violation above>,
  "fix_summary": "One sentence summary",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "estimated_cost_low": <number>,
  "estimated_cost_high": <number>,
  "timeline_days": <number>,
  "diy_possible": <boolean>,
  "professional_needed": "<type or null>",
  "documents_needed": ["Doc 1"],
  "filing_info": "Where/how to file",
  "consequences_if_ignored": "What happens",
  "tips": ["Tip 1"]
}

Return ONLY the JSON array, no other text.`;
}

// ── Parse Remedy JSON ───────────────────────────────────────────────
function parseRemedyJSON(raw: string): any {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(cleaned);
}

// ── Pretty Print ────────────────────────────────────────────────────
function printRemedy(v: NormalizedViolation, remedy: any, index: number) {
  const severityColors: Record<number, string> = {
    1: '\x1b[31m', // red
    2: '\x1b[33m', // yellow
    3: '\x1b[33m', // yellow
    4: '\x1b[36m', // cyan
    5: '\x1b[37m', // white
  };
  const color = severityColors[v.severity_rank] || '\x1b[0m';
  const reset = '\x1b[0m';

  console.log(`\n${color}${'═'.repeat(70)}${reset}`);
  console.log(`${color}  #${index} — ${v.agency} | ${v.severity} | ${v.status}${reset}`);
  console.log(`${color}  ${v.violation_type}: ${v.description.slice(0, 80)}${reset}`);
  if (v.penalty > 0) console.log(`${color}  Penalty: $${v.penalty.toLocaleString()}${reset}`);
  console.log(`${color}${'═'.repeat(70)}${reset}`);

  console.log(`\n  💡 ${remedy.fix_summary}`);

  console.log('\n  📋 STEPS:');
  (remedy.steps || []).forEach((step: string, i: number) => {
    console.log(`     ${i + 1}. ${step}`);
  });

  console.log(`\n  💰 Cost: $${remedy.estimated_cost_low?.toLocaleString() || '?'} — $${remedy.estimated_cost_high?.toLocaleString() || '?'}`);
  console.log(`  ⏱  Timeline: ${remedy.timeline_days || '?'} days`);
  console.log(`  🔧 DIY: ${remedy.diy_possible ? 'Yes' : 'No'}${remedy.professional_needed ? ` (need: ${remedy.professional_needed})` : ''}`);

  if (remedy.documents_needed?.length > 0) {
    console.log('\n  📄 DOCUMENTS NEEDED:');
    remedy.documents_needed.forEach((doc: string) => console.log(`     • ${doc}`));
  }

  if (remedy.filing_info) {
    console.log(`\n  📬 FILING: ${remedy.filing_info}`);
  }

  if (remedy.consequences_if_ignored) {
    console.log(`\n  ⚠️  IF IGNORED: ${remedy.consequences_if_ignored}`);
  }

  if (remedy.tips?.length > 0) {
    console.log('\n  💡 TIPS:');
    remedy.tips.forEach((tip: string) => console.log(`     • ${tip}`));
  }
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  let violations: NormalizedViolation[] = [];
  let address = '';
  let jsonOutput = args.includes('--json');
  let openOnly = args.includes('--open-only');
  let topN = Infinity;

  // Parse --top N
  const topIdx = args.indexOf('--top');
  if (topIdx !== -1 && args[topIdx + 1]) topN = parseInt(args[topIdx + 1]);

  // Single violation mode
  const violationIdx = args.indexOf('--violation');
  const agencyIdx = args.indexOf('--agency');
  if (violationIdx !== -1) {
    const desc = args[violationIdx + 1];
    const agency = agencyIdx !== -1 ? args[agencyIdx + 1] : 'DOB';
    violations = [{
      agency,
      source_id: 'manual',
      violation_number: 'N/A',
      violation_type: desc,
      description: desc,
      severity: 'UNKNOWN',
      severity_rank: 3,
      issued_date: '',
      status: 'OPEN',
      penalty: 0,
      penalty_paid: 0,
      respondent: '',
    }];
  }

  // File mode
  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const file = Bun.file(args[fileIdx + 1]);
    const data: ScanOutput = await file.json();
    violations = data.violations;
    address = data.address;
  }

  // Stdin pipe mode (from scan.ts --json | remedy.ts)
  if (violations.length === 0 && !process.stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(Buffer.from(chunk));
    }
    const input = Buffer.concat(chunks).toString('utf-8');
    const data: ScanOutput = JSON.parse(input);
    violations = data.violations;
    address = data.address;
  }

  if (violations.length === 0) {
    console.log('Usage:');
    console.log('  bun tools/scan.ts "ADDRESS" --json | bun tools/remedy.ts');
    console.log('  bun tools/remedy.ts --file violations.json');
    console.log('  bun tools/remedy.ts --violation "DESCRIPTION" --agency DOB');
    console.log('  bun tools/remedy.ts --file violations.json --open-only --top 5');
    console.log('');
    console.log('Env: NVIDIA_API_KEY (get free at https://build.nvidia.com)');
    process.exit(1);
  }

  // Filter
  if (openOnly) {
    violations = violations.filter(v => v.status === 'OPEN' || v.status === 'ACTIVE');
  }

  // Already sorted by severity from scan.ts, take top N
  violations = violations.slice(0, topN);

  if (!jsonOutput) {
    console.log(`\n🔧 REMEDY ENGINE — ${address || 'Manual Input'}`);
    console.log(`   Processing ${violations.length} violation${violations.length > 1 ? 's' : ''} via NVIDIA API (${MODEL})`);
    console.log('');
  }

  // Batch if ≤10 violations, otherwise one-by-one
  const remedies: Remedy[] = [];

  if (violations.length <= 10) {
    // Batch mode — one API call
    if (!jsonOutput) console.log('   ⏳ Generating remedies (batch mode)...');
    const prompt = buildBatchPrompt(violations);
    const raw = await callNvidia(prompt);
    const parsed = parseRemedyJSON(raw);

    const batchResults = Array.isArray(parsed) ? parsed : [parsed];

    for (let i = 0; i < violations.length; i++) {
      const v = violations[i];
      const match = batchResults.find((r: any) => r.index === i + 1) || batchResults[i] || {};
      const remedy: Remedy = {
        violation_number: v.violation_number,
        agency: v.agency,
        severity: v.severity,
        description: v.description,
        ...match,
      };
      remedies.push(remedy);

      if (!jsonOutput) printRemedy(v, remedy, i + 1);
    }
  } else {
    // One-by-one mode
    for (let i = 0; i < violations.length; i++) {
      const v = violations[i];
      if (!jsonOutput) console.log(`   ⏳ [${i + 1}/${violations.length}] ${v.agency} — ${v.violation_type.slice(0, 50)}...`);

      try {
        const prompt = buildPrompt(v);
        const raw = await callNvidia(prompt);
        const parsed = parseRemedyJSON(raw);
        const remedy: Remedy = {
          violation_number: v.violation_number,
          agency: v.agency,
          severity: v.severity,
          description: v.description,
          ...parsed,
        };
        remedies.push(remedy);

        if (!jsonOutput) printRemedy(v, remedy, i + 1);
      } catch (err) {
        if (!jsonOutput) console.log(`   ❌ Failed: ${err instanceof Error ? err.message : String(err)}`);
        remedies.push({
          violation_number: v.violation_number,
          agency: v.agency,
          severity: v.severity,
          description: v.description,
          fix_summary: 'Failed to generate remedy',
          steps: [],
          estimated_cost_low: 0,
          estimated_cost_high: 0,
          timeline_days: 0,
          diy_possible: false,
          professional_needed: null,
          documents_needed: [],
          filing_info: '',
          consequences_if_ignored: '',
          tips: [],
        });
      }
    }
  }

  // JSON output
  if (jsonOutput) {
    console.log(JSON.stringify({
      address,
      generated_at: new Date().toISOString(),
      model: MODEL,
      total_remedies: remedies.length,
      total_estimated_cost: {
        low: remedies.reduce((s, r) => s + (r.estimated_cost_low || 0), 0),
        high: remedies.reduce((s, r) => s + (r.estimated_cost_high || 0), 0),
      },
      remedies,
    }, null, 2));
    return;
  }

  // Summary
  const totalLow = remedies.reduce((s, r) => s + (r.estimated_cost_low || 0), 0);
  const totalHigh = remedies.reduce((s, r) => s + (r.estimated_cost_high || 0), 0);
  const diyCount = remedies.filter(r => r.diy_possible).length;

  console.log(`\n${'━'.repeat(70)}`);
  console.log('  REMEDY SUMMARY');
  console.log(`${'━'.repeat(70)}`);
  console.log(`  Total violations analyzed: ${remedies.length}`);
  console.log(`  Estimated total cost: $${totalLow.toLocaleString()} — $${totalHigh.toLocaleString()}`);
  console.log(`  DIY possible: ${diyCount} of ${remedies.length}`);
  console.log(`  Professional needed: ${remedies.length - diyCount} of ${remedies.length}`);
  console.log(`${'━'.repeat(70)}\n`);
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
