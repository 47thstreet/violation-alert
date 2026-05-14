import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { resolveAddress } from '@/lib/nyc-api/geo';

export async function POST(req: NextRequest) {
  // Auth check -- only authenticated users can resolve addresses
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
