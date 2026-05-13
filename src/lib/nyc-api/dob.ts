const DOB_VIOLATIONS_ENDPOINT = 'https://data.cityofnewyork.us/resource/3h2n-5cm9.json';
const DOB_ECB_ENDPOINT = 'https://data.cityofnewyork.us/resource/6bgk-3dad.json';

interface DOBViolation {
  isn_dob_bis_extract: string;
  violation_type: string;
  violation_number: string;
  violation_category: string;
  violation_type_code: string;
  description: string;
  issue_date: string;
  disposition_date: string;
  disposition_comments: string;
  device_number: string;
  house_number: string;
  street: string;
  boro: string;
  block: string;
  lot: string;
  bin: string;
  violation_date_closed: string;
  [key: string]: string;
}

interface ECBViolation {
  isn_dob_bis_extract: string;
  ecb_violation_number: string;
  ecb_violation_status: string;
  violation_type: string;
  violation_number: string;
  violation_date: string;
  severity: string;
  respondent_name: string;
  penalty_applied: string;
  penalty_paid: string;
  amount_paid: string;
  amount_baldue: string;
  infraction_codes: string;
  violation_description: string;
  bin: string;
  boro: string;
  block: string;
  lot: string;
  [key: string]: string;
}

function buildQuery(params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params);
  const token = process.env.NYC_OPEN_DATA_APP_TOKEN;
  if (token) searchParams.set('$$app_token', token);
  return searchParams.toString();
}

export async function fetchDOBViolationsByBIN(bin: string, since?: Date): Promise<DOBViolation[]> {
  let where = `bin='${bin}'`;
  if (since) {
    where += ` AND issue_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'issue_date DESC',
    '$limit': '200',
  });

  const res = await fetch(`${DOB_VIOLATIONS_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`DOB API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchDOBViolationsByAddress(
  houseNumber: string,
  street: string,
  borough: string,
  since?: Date
): Promise<DOBViolation[]> {
  let where = `house_number='${houseNumber}' AND street='${street.toUpperCase()}' AND boro='${borough}'`;
  if (since) {
    where += ` AND issue_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'issue_date DESC',
    '$limit': '200',
  });

  const res = await fetch(`${DOB_VIOLATIONS_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`DOB API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchECBViolationsByBIN(bin: string, since?: Date): Promise<ECBViolation[]> {
  let where = `bin='${bin}'`;
  if (since) {
    where += ` AND violation_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'violation_date DESC',
    '$limit': '200',
  });

  const res = await fetch(`${DOB_ECB_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`ECB API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function normalizeDOBViolation(v: DOBViolation) {
  return {
    source: 'dob' as const,
    source_id: `dob-${v.isn_dob_bis_extract}`,
    violation_type: v.violation_type || v.violation_category,
    violation_number: v.violation_number,
    description: v.description,
    severity: v.violation_category,
    issued_date: v.issue_date?.split('T')[0] || null,
    disposition_date: v.disposition_date?.split('T')[0] || null,
    status: v.violation_date_closed ? 'closed' : 'open',
    penalty_amount: null,
    penalty_paid: null,
    respondent: null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}

export function normalizeECBViolation(v: ECBViolation) {
  return {
    source: 'ecb' as const,
    source_id: `ecb-${v.ecb_violation_number || v.isn_dob_bis_extract}`,
    violation_type: v.violation_type,
    violation_number: v.ecb_violation_number || v.violation_number,
    description: v.violation_description,
    severity: v.severity,
    issued_date: v.violation_date?.split('T')[0] || null,
    disposition_date: null,
    status: v.ecb_violation_status || 'open',
    penalty_amount: v.penalty_applied ? parseFloat(v.penalty_applied) : null,
    penalty_paid: v.amount_paid ? parseFloat(v.amount_paid) : null,
    respondent: v.respondent_name || null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}
