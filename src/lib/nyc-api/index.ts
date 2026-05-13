// Re-export all agency clients
export * from './dob';
export * from './hpd';
export * from './geo';
export * from './fdny';
export * from './dsny';
export * from './dot';
export * from './lpc';
export * from './dep';
export * from './dohmh';
export * from './ecb';

// Import individual fetchers and normalizers for the unified function
import { fetchDOBViolationsByBIN, fetchECBViolationsByBIN, normalizeDOBViolation, normalizeECBViolation } from './dob';
import { fetchHPDViolationsByBBL, normalizeHPDViolation } from './hpd';
import { fetchFDNYViolationsByAddress, normalizeFDNYViolation } from './fdny';
import { fetchDSNYViolationsByAddress, normalizeDSNYViolation } from './dsny';
import { fetchDOTViolationsByAddress, normalizeDOTViolation } from './dot';
import { fetchLPCViolationsByAddress, normalizeLPCViolation } from './lpc';
import { fetchDEPViolationsByAddress, normalizeDEPViolation } from './dep';
import { fetchDOHMHViolationsByAddress, normalizeDOHMHViolation } from './dohmh';
import { fetchOATHECBViolationsByBIN, fetchOATHECBViolationsByAddress, normalizeOATHECBViolation } from './ecb';

/** Normalized violation record returned by all agency clients */
export interface NormalizedViolation {
  source: string;
  source_id: string;
  violation_type: string;
  violation_number: string | null;
  description: string | null;
  severity: string | null;
  issued_date: string | null;
  disposition_date: string | null;
  status: string;
  penalty_amount: number | null;
  penalty_paid: number | null;
  respondent: string | null;
  raw_json: Record<string, unknown>;
}

interface FetchAllOptions {
  bin?: string | null;
  bbl?: string | null;
  address?: string | null;
  since?: Date;
}

interface FetchAllResult {
  violations: NormalizedViolation[];
  errors: { agency: string; error: string }[];
}

/**
 * Fetch violations from ALL NYC agencies in parallel.
 * Uses BIN where supported, falls back to address for address-only agencies.
 */
export async function fetchAllViolations(opts: FetchAllOptions): Promise<FetchAllResult> {
  const { bin, bbl, address, since } = opts;
  const violations: NormalizedViolation[] = [];
  const errors: { agency: string; error: string }[] = [];

  // Build an array of promises — each one fetches + normalizes from one agency
  const tasks: { agency: string; promise: Promise<NormalizedViolation[]> }[] = [];

  // BIN-based agencies
  if (bin) {
    tasks.push({
      agency: 'dob',
      promise: fetchDOBViolationsByBIN(bin, since).then(rows => rows.map(normalizeDOBViolation)),
    });
    tasks.push({
      agency: 'ecb_dob',
      promise: fetchECBViolationsByBIN(bin, since).then(rows => rows.map(normalizeECBViolation)),
    });
    tasks.push({
      agency: 'ecb_oath',
      promise: fetchOATHECBViolationsByBIN(bin, since).then(rows => rows.map(normalizeOATHECBViolation)),
    });
  }

  // BBL-based agencies
  if (bbl) {
    tasks.push({
      agency: 'hpd',
      promise: fetchHPDViolationsByBBL(bbl, since).then(rows => rows.map(normalizeHPDViolation)),
    });
  }

  // Address-based agencies (always run if we have an address)
  if (address) {
    tasks.push({
      agency: 'fdny',
      promise: fetchFDNYViolationsByAddress(address, since).then(rows => rows.map(normalizeFDNYViolation)),
    });
    tasks.push({
      agency: 'dsny',
      promise: fetchDSNYViolationsByAddress(address, since).then(rows => rows.map(normalizeDSNYViolation)),
    });
    tasks.push({
      agency: 'dot',
      promise: fetchDOTViolationsByAddress(address, since).then(rows => rows.map(normalizeDOTViolation)),
    });
    tasks.push({
      agency: 'lpc',
      promise: fetchLPCViolationsByAddress(address, since).then(rows => rows.map(normalizeLPCViolation)),
    });
    tasks.push({
      agency: 'dep',
      promise: fetchDEPViolationsByAddress(address, since).then(rows => rows.map(normalizeDEPViolation)),
    });
    tasks.push({
      agency: 'dohmh',
      promise: fetchDOHMHViolationsByAddress(address, since).then(rows => rows.map(normalizeDOHMHViolation)),
    });

    // If no BIN, also query OATH/ECB by address
    if (!bin) {
      tasks.push({
        agency: 'ecb_oath',
        promise: fetchOATHECBViolationsByAddress(address, since).then(rows => rows.map(normalizeOATHECBViolation)),
      });
    }
  }

  // Execute all in parallel, collecting results and errors
  const settled = await Promise.allSettled(tasks.map(t => t.promise));

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    if (result.status === 'fulfilled') {
      violations.push(...result.value);
    } else {
      errors.push({
        agency: tasks[i].agency,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      });
    }
  }

  return { violations, errors };
}
