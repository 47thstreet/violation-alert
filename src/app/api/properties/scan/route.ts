import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import { fetchAllViolations } from '@/lib/nyc-api';
import type { ViolationSource } from '@/lib/supabase/types';

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

    // Upsert violations (same pattern as cron route)
    let upsertedCount = 0;
    for (const v of normalizedViolations) {
      const { error: upsertError } = await serviceClient
        .from('violations')
        .upsert(
          { property_id: property.id, ...v, source: v.source as ViolationSource },
          { onConflict: 'source,source_id', ignoreDuplicates: true }
        );

      if (!upsertError) upsertedCount++;
      else errors.push(`Upsert error: ${upsertError.message}`);
    }

    // Update last_polled_at
    await serviceClient
      .from('properties')
      .update({ last_polled_at: new Date().toISOString() })
      .eq('id', property.id);

    // Count unique agencies that returned violations
    const agencies = new Set(normalizedViolations.map(v => v.source));

    return NextResponse.json({
      violations_found: normalizedViolations.length,
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
