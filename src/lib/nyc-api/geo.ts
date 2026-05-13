// NYC GeoSearch API — resolves addresses to BIN, BBL, borough
const GEOSEARCH_ENDPOINT = 'https://geosearch.planninglabs.nyc/v2/search';

interface GeoSearchResult {
  bin: string | null;
  bbl: string | null;
  borough: string | null;
  zip: string | null;
  houseNumber: string | null;
  street: string | null;
  label: string;
}

interface GeoSearchFeature {
  properties: {
    label: string;
    addendum?: {
      pad?: {
        bin?: string;
        bbl?: string;
      };
    };
    borough?: string;
    postalcode?: string;
    housenumber?: string;
    street?: string;
  };
}

export async function resolveAddress(address: string): Promise<GeoSearchResult | null> {
  const params = new URLSearchParams({ text: address });
  const res = await fetch(`${GEOSEARCH_ENDPOINT}?${params}`);
  if (!res.ok) return null;

  const data = await res.json();
  const features = data.features as GeoSearchFeature[];
  if (!features || features.length === 0) return null;

  const props = features[0].properties;
  return {
    bin: props.addendum?.pad?.bin || null,
    bbl: props.addendum?.pad?.bbl || null,
    borough: props.borough || null,
    zip: props.postalcode || null,
    houseNumber: props.housenumber || null,
    street: props.street || null,
    label: props.label,
  };
}

export function boroughToCode(borough: string): string {
  const map: Record<string, string> = {
    'Manhattan': '1', 'MN': '1',
    'Bronx': '2', 'BX': '2',
    'Brooklyn': '3', 'BK': '3',
    'Queens': '4', 'QN': '4',
    'Staten Island': '5', 'SI': '5',
  };
  return map[borough] || borough;
}
