const DOT_ENDPOINT = 'https://data.cityofnewyork.us/resource/6kbp-uz6m.json';

interface DOTViolation {
  violation_number: string;
  violation_date: string;
  inspection_date: string;
  violation_type: string;
  violation_status: string;
  description: string;
  penalty_amount: string;
  address: string;
  house_number: string;
  street_name: string;
  borough: string;
  block: string;
  lot: string;
  zip_code: string;
  [key: string]: string;
}

function buildQuery(params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params);
  const token = process.env.NYC_OPEN_DATA_APP_TOKEN;
  if (token) searchParams.set('$$app_token', token);
  return searchParams.toString();
}

export async function fetchDOTViolationsByAddress(
  address: string,
  since?: Date,
  limit = 200,
  offset = 0
): Promise<DOTViolation[]> {
  let where = `upper(street_name) like '%${address.toUpperCase()}%'`;
  if (since) {
    where += ` AND violation_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'violation_date DESC',
    '$limit': String(limit),
    '$offset': String(offset),
  });

  const res = await fetch(`${DOT_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`DOT API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function normalizeDOTViolation(v: DOTViolation) {
  return {
    source: 'dot' as const,
    source_id: `dot-${v.violation_number || v.violation_date}`,
    violation_type: v.violation_type || 'Sidewalk Violation',
    violation_number: v.violation_number || null,
    description: v.description || null,
    severity: null,
    issued_date: v.violation_date?.split('T')[0] || v.inspection_date?.split('T')[0] || null,
    disposition_date: null,
    status: v.violation_status || 'open',
    penalty_amount: v.penalty_amount ? parseFloat(v.penalty_amount) : null,
    penalty_paid: null,
    respondent: null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}
