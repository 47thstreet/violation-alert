import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { fetchAllViolations } from '@/lib/nyc-api';
import type { ViolationSource } from '@/lib/supabase/types';

export const maxDuration = 300; // 5 min max for Vercel Pro

export async function GET(req: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const results = { polled: 0, newViolations: 0, errors: [] as string[] };

  // Get all properties that need polling (oldest first, max 50 per run)
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('*')
    .order('last_polled_at', { ascending: true, nullsFirst: true })
    .limit(50);

  if (propError || !properties) {
    return NextResponse.json({ error: propError?.message || 'No properties' }, { status: 500 });
  }

  for (const property of properties) {
    try {
      const since = property.last_polled_at ? new Date(property.last_polled_at) : undefined;

      // Fetch from ALL agencies in parallel via unified fetcher
      const { violations: normalizedViolations, errors: agencyErrors } = await fetchAllViolations({
        bin: property.bin || null,
        bbl: property.bbl || null,
        address: property.address || null,
        since,
      });

      // Log any per-agency errors but continue processing
      for (const ae of agencyErrors) {
        results.errors.push(`${property.address} [${ae.agency}]: ${ae.error}`);
      }

      // Upsert violations (skip duplicates via source+source_id unique constraint)
      for (const v of normalizedViolations) {
        const { error: upsertError } = await supabase
          .from('violations')
          .upsert(
            { property_id: property.id, ...v, source: v.source as ViolationSource },
            { onConflict: 'source,source_id', ignoreDuplicates: true }
          );

        if (!upsertError) results.newViolations++;
      }

      // Update last_polled_at
      await supabase
        .from('properties')
        .update({ last_polled_at: new Date().toISOString() })
        .eq('id', property.id);

      results.polled++;
    } catch (err) {
      results.errors.push(`${property.address}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Trigger notifications for un-notified violations
  const { data: unnotified } = await supabase
    .from('violations')
    .select('id, property_id')
    .is('notified_at', null)
    .limit(100);

  if (unnotified && unnotified.length > 0) {
    // Group by property
    const byProperty = new Map<string, string[]>();
    for (const v of unnotified) {
      const list = byProperty.get(v.property_id) || [];
      list.push(v.id);
      byProperty.set(v.property_id, list);
    }

    // Call notification endpoint for each property batch
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    for (const [propertyId, violationIds] of byProperty) {
      try {
        await fetch(`${appUrl}/api/notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CRON_SECRET}`,
          },
          body: JSON.stringify({ propertyId, violationIds }),
        });
      } catch {
        results.errors.push(`Notify failed for property ${propertyId}`);
      }
    }
  }

  return NextResponse.json(results);
}
