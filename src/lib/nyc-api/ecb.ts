const ECB_ENDPOINT = 'https://data.cityofnewyork.us/resource/db6c-hpns.json';

interface OATHECBViolation {
  ticket_number: string;
  violation_date: string;
  violation_time: string;
  issuing_agency: string;
  violation_type: string;
  violation_details: string;
  respondent_name: string;
  penalty_amount: string;
  penalty_paid: string;
  amount_due: string;
  status: string;
  hearing_status: string;
  hearing_date: string;
  house_number: string;
  street: string;
  boro: string;
  block: string;
  lot: string;
  bin: string;
  zip_code: string;
  [key: string]: string;
}

function buildQuery(params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params);
  const token = process.env.NYC_OPEN_DATA_APP_TOKEN;
  if (token) searchParams.set('$$app_token', token);
  return searchParams.toString();
}

export async function fetchOATHECBViolationsByBIN(
  bin: string,
  since?: Date,
  limit = 200,
  offset = 0
): Promise<OATHECBViolation[]> {
  let where = `bin='${bin}'`;
  if (since) {
    where += ` AND violation_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'violation_date DESC',
    '$limit': String(limit),
    '$offset': String(offset),
  });

  const res = await fetch(`${ECB_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`OATH/ECB API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchOATHECBViolationsByAddress(
  address: string,
  since?: Date,
  limit = 200,
  offset = 0
): Promise<OATHECBViolation[]> {
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

  const res = await fetch(`${ECB_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`OATH/ECB API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function normalizeOATHECBViolation(v: OATHECBViolation) {
  return {
    source: 'ecb_oath' as const,
    source_id: `ecb-oath-${v.ticket_number || v.violation_date}`,
    violation_type: v.violation_type || 'OATH/ECB Violation',
    violation_number: v.ticket_number || null,
    description: v.violation_details || null,
    severity: null,
    issued_date: v.violation_date?.split('T')[0] || null,
    disposition_date: v.hearing_date?.split('T')[0] || null,
    status: v.status || v.hearing_status || 'open',
    penalty_amount: v.penalty_amount ? parseFloat(v.penalty_amount) : null,
    penalty_paid: v.penalty_paid ? parseFloat(v.penalty_paid) : null,
    respondent: v.respondent_name || null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}
