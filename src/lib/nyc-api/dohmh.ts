const DOHMH_ENDPOINT = 'https://data.cityofnewyork.us/resource/43nn-pn8j.json';

interface DOHMHViolation {
  camis: string;
  dba: string;
  boro: string;
  building: string;
  street: string;
  zipcode: string;
  phone: string;
  cuisine_description: string;
  inspection_date: string;
  action: string;
  violation_code: string;
  violation_description: string;
  critical_flag: string;
  score: string;
  grade: string;
  grade_date: string;
  inspection_type: string;
  [key: string]: string;
}

function buildQuery(params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params);
  const token = process.env.NYC_OPEN_DATA_APP_TOKEN;
  if (token) searchParams.set('$$app_token', token);
  return searchParams.toString();
}

export async function fetchDOHMHViolationsByAddress(
  address: string,
  since?: Date,
  limit = 200,
  offset = 0
): Promise<DOHMHViolation[]> {
  let where = `upper(street) like '%${address.toUpperCase()}%'`;
  if (since) {
    where += ` AND inspection_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'inspection_date DESC',
    '$limit': String(limit),
    '$offset': String(offset),
  });

  const res = await fetch(`${DOHMH_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`DOHMH API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchDOHMHViolationsByCAMIS(
  camis: string,
  since?: Date,
  limit = 200,
  offset = 0
): Promise<DOHMHViolation[]> {
  let where = `camis='${camis}'`;
  if (since) {
    where += ` AND inspection_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'inspection_date DESC',
    '$limit': String(limit),
    '$offset': String(offset),
  });

  const res = await fetch(`${DOHMH_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`DOHMH API error: ${res.status} ${res.statusText}`);
  return res.json();
}

function mapCriticalFlag(flag: string): string | null {
  switch (flag) {
    case 'Critical': return 'critical';
    case 'Not Critical': return 'non-critical';
    case 'Not Applicable': return 'info';
    default: return null;
  }
}

export function normalizeDOHMHViolation(v: DOHMHViolation) {
  return {
    source: 'dohmh' as const,
    source_id: `dohmh-${v.camis}-${v.inspection_date}-${v.violation_code}`,
    violation_type: v.violation_code || 'Health Violation',
    violation_number: v.violation_code || null,
    description: v.violation_description || null,
    severity: mapCriticalFlag(v.critical_flag),
    issued_date: v.inspection_date?.split('T')[0] || null,
    disposition_date: v.grade_date?.split('T')[0] || null,
    status: v.grade ? `Grade ${v.grade}` : (v.action || 'open'),
    penalty_amount: v.score ? parseFloat(v.score) : null,
    penalty_paid: null,
    respondent: v.dba || null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}
