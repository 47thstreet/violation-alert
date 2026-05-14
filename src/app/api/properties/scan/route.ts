import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase/server';
import { fetchAllViolations } from '@/lib/nyc-api';
import { batchUpsertViolations, markPropertyPolled } from '@/lib/violations/upsert';

export const maxDuration = 120; // 2 min max for on-demand scan

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { property_id } = body;

  if (!property_id) {
    return NextResponse.json({ error: 'property_id is required' }, { status: 400 });
  }

  // Verify user owns this property via tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!tenant) {
    return NextResponse.json({ error: 'No tenant found' }, { status: 403 });
  }

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', property_id)
    .eq('tenant_id', tenant.id)
    .single();

  if (!property) {
    return NextResponse.json({ error: 'Property not found or access denied' }, { status: 404 });
  }

  // Use service client for upserts (bypasses RLS)
  const serviceClient = createServiceClient();
  const errors: string[] = [];

  try {
    // Fetch from ALL agencies in parallel
    const { violations: normalizedViolations, errors: agencyErrors } = await fetchAllViolations({
      bin: property.bin || null,
      bbl: property.bbl || null,
      address: property.address || null,
    });

    for (const ae of agencyErrors) {
      errors.push(`[${ae.agency}]: ${ae.error}`);
    }

    // Batch-upsert violations (shared utility)
    const { upserted, errors: upsertErrors } = await batchUpsertViolations(
      serviceClient, property.id, normalizedViolations
    );
    errors.push(...upsertErrors);

    await markPropertyPolled(serviceClient, property.id);

    // Count unique agencies that returned violations
    const agencies = new Set(normalizedViolations.map(v => v.source));

    return NextResponse.json({
      violations_found: normalizedViolations.length,
      upserted_count: upserted,
      agencies_count: agencies.size,
      errors,
    });
  } catch (err) {
    return NextResponse.json(
      { violations_found: 0, agencies_count: 0, errors: [err instanceof Error ? err.message : String(err)] },
      { status: 500 }
    );
  }
}
