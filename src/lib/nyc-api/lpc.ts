const LPC_ENDPOINT = 'https://data.cityofnewyork.us/resource/wwpi-9hdf.json';

interface LPCViolation {
  violation_number: string;
  violation_type: string;
  nov_date: string;
  warning_letter_date: string;
  status: string;
  description: string;
  penalty_amount: string;
  landmark_name: string;
  address: string;
  borough: string;
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

export async function fetchLPCViolationsByAddress(
  address: string,
  since?: Date,
  limit = 200,
  offset = 0
): Promise<LPCViolation[]> {
  let where = `upper(address) like '%${address.toUpperCase()}%'`;
  if (since) {
    where += ` AND nov_date > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'nov_date DESC',
    '$limit': String(limit),
    '$offset': String(offset),
  });

  const res = await fetch(`${LPC_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`LPC API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function normalizeLPCViolation(v: LPCViolation) {
  return {
    source: 'lpc' as const,
    source_id: `lpc-${v.violation_number || v.nov_date}`,
    violation_type: v.violation_type ? `Landmark Type ${v.violation_type}` : 'Landmark Violation',
    violation_number: v.violation_number || null,
    description: v.description || (v.landmark_name ? `Landmark: ${v.landmark_name}` : null),
    severity: v.violation_type === 'A' ? 'warning' : v.violation_type === 'B' ? 'violation' : null,
    issued_date: v.nov_date?.split('T')[0] || v.warning_letter_date?.split('T')[0] || null,
    disposition_date: null,
    status: v.status || 'open',
    penalty_amount: v.penalty_amount ? parseFloat(v.penalty_amount) : null,
    penalty_paid: null,
    respondent: null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}
