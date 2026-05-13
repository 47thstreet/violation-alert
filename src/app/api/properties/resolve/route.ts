import { NextRequest, NextResponse } from 'next/server';
import { resolveAddress } from '@/lib/nyc-api/geo';

export async function POST(req: NextRequest) {
  const { address } = await req.json() as { address: string };

  if (!address || address.length < 5) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  const result = await resolveAddress(address);

  if (!result) {
    return NextResponse.json({ error: 'Address not found in NYC GeoSearch' }, { status: 404 });
  }

  return NextResponse.json(result);
}
