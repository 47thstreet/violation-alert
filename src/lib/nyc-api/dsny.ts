const DSNY_ENDPOINT = 'https://data.cityofnewyork.us/resource/rzh9-p7nt.json';

interface DSNYViolation {
  ticket_number: string;
  violation_date: string;
  violation_code: string;
  violation_type: string;
  description: string;
  status: string;
  penalty_amount: string;
  penalty_paid: string;
  amount_due: string;
  respondent_name: string;
  house_number: string;
  street: string;
  borough: string;
  zip_code: string;
  [key: string]: string;
}

function buildQuery(params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params);
  const token = process.env.NYC_OPEN_DATA_APP_TOKEN;
  if (token) searchParams.set('$$app_token', token);
  return searchParams.toString();
}

export async function fetchDSNYViolationsByAddress(
  address: string,
  since?: Date,
  limit = 200,
  offset = 0
): Promise<DSNYViolation[]> {
  let where = `upper(street) like '%${address.toUpperCase()}%'`;
  if (since) {
    where += ` AND violation_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'violation_date DESC',
    '$limit': String(limit),
    '$offset': String(offset),
  });

  const res = await fetch(`${DSNY_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`DSNY API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function normalizeDSNYViolation(v: DSNYViolation) {
  return {
    source: 'dsny' as const,
    source_id: `dsny-${v.ticket_number || v.violation_date}`,
    violation_type: v.violation_type || v.violation_code || 'Sanitation Violation',
    violation_number: v.ticket_number || null,
    description: v.description || null,
    severity: null,
    issued_date: v.violation_date?.split('T')[0] || null,
    disposition_date: null,
    status: v.status || 'open',
    penalty_amount: v.penalty_amount ? parseFloat(v.penalty_amount) : null,
    penalty_paid: v.penalty_paid ? parseFloat(v.penalty_paid) : null,
    respondent: v.respondent_name || null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}
