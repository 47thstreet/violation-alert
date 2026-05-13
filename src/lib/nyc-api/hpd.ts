const HPD_VIOLATIONS_ENDPOINT = 'https://data.cityofnewyork.us/resource/wvxf-dwi5.json';

interface HPDViolation {
  violationid: string;
  boroid: string;
  block: string;
  lot: string;
  bbl: string;
  buildingid: string;
  registrationid: string;
  streetaddress: string;
  apartment: string;
  story: string;
  inspectiondate: string;
  approveddate: string;
  originalcertifybydate: string;
  originalcorrectbydate: string;
  newcertifybydate: string;
  newcorrectbydate: string;
  certifieddate: string;
  ordernumber: string;
  novid: string;
  novdescription: string;
  novissueddate: string;
  currentstatus: string;
  currentstatusdate: string;
  violationstatus: string;
  class: string; // A, B, C, I
  communityboard: string;
  zip: string;
  [key: string]: string;
}

function buildQuery(params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params);
  const token = process.env.NYC_OPEN_DATA_APP_TOKEN;
  if (token) searchParams.set('$$app_token', token);
  return searchParams.toString();
}

export async function fetchHPDViolationsByBBL(bbl: string, since?: Date): Promise<HPDViolation[]> {
  let where = `bbl='${bbl}'`;
  if (since) {
    where += ` AND inspectiondate > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'inspectiondate DESC',
    '$limit': '200',
  });

  const res = await fetch(`${HPD_VIOLATIONS_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`HPD API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchHPDViolationsByAddress(
  streetAddress: string,
  zip: string,
  since?: Date
): Promise<HPDViolation[]> {
  let where = `upper(streetaddress) like '%${streetAddress.toUpperCase()}%'`;
  if (zip) where += ` AND zip='${zip}'`;
  if (since) {
    where += ` AND inspectiondate > '${since.toISOString().split('T')[0]}'`;
  }
  const query = buildQuery({
    '$where': where,
    '$order': 'inspectiondate DESC',
    '$limit': '200',
  });

  const res = await fetch(`${HPD_VIOLATIONS_ENDPOINT}?${query}`);
  if (!res.ok) throw new Error(`HPD API error: ${res.status} ${res.statusText}`);
  return res.json();
}

function mapSeverity(violationClass: string): string {
  switch (violationClass) {
    case 'A': return 'non-hazardous';
    case 'B': return 'hazardous';
    case 'C': return 'immediately-hazardous';
    case 'I': return 'info';
    default: return violationClass;
  }
}

export function normalizeHPDViolation(v: HPDViolation) {
  return {
    source: 'hpd' as const,
    source_id: `hpd-${v.violationid}`,
    violation_type: `Class ${v.class}`,
    violation_number: v.ordernumber || v.novid,
    description: v.novdescription,
    severity: mapSeverity(v.class),
    issued_date: v.inspectiondate?.split('T')[0] || v.novissueddate?.split('T')[0] || null,
    disposition_date: v.certifieddate?.split('T')[0] || null,
    status: v.violationstatus || v.currentstatus || 'open',
    penalty_amount: null,
    penalty_paid: null,
    respondent: null,
    raw_json: v as unknown as Record<string, unknown>,
  };
}
