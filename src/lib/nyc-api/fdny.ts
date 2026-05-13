const FDNY_ENDPOINT = 'https://data.cityofnewyork.us/resource/avgm-ztsb.json';

interface FDNYViolation {
  violation_number: string;
  violation_date: string;
  violation_code: string;
  violation_status: string;
  description: string;
  penalty_amount: string;
  penalty_paid: string;
  address: string;
  borough: string;
  zip_code: string;
  community_board: string;
  inspection_date: string;
  [key: string]: string;
}

function buildQuery(params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params);
  const token = process.env.NYC_OPEN_DATA_APP_TOKEN;
  if (token) searchParams.set('$$app_token', token);
  return searchParams.toString();
}

export async function fetchFDNYViolationsByAddress(
  address: string,
  since?: Date,
  limit = 200,
  offset = 0
): Promise<FDNYViolation[]> {
  let where = `upper(address) like '%${address.toUpperCase()}%'`;
  if (since) {
    where += ` AND violation_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'violation_date DESC',
    '$limit': String(limit),
    '$offset': String(offset),
  });

  const res = await fetch(`${FDNY_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`FDNY API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function normalizeFDNYViolation(v: FDNYViolation) {
  return {
    source: 'fdny' as const,
    source_id: `fdny-${v.violation_number || v.violation_date}`,
    violation_type: v.violation_code || 'Fire Code Violation',
    violation_number: v.violation_number || null,
    description: v.description || null,
    severity: null,
    issued_date: v.violation_date?.split('T')[0] || v.inspection_date?.split('T')[0] || null,
    disposition_date: null,
    status: v.violation_status || 'open',
    penalty_amount: v.penalty_amount ? parseFloat(v.penalty_amount) : null,
    penalty_paid: v.penalty_paid ? parseFloat(v.penalty_paid) : null,
    respondent: null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}
