import type { SupabaseClient } from '@supabase/supabase-js';
import type { NormalizedViolation } from '@/lib/nyc-api';
import type { ViolationSource } from '@/lib/supabase/types';

/**
 * Batch-upsert normalized violations into the database.
 * Uses chunked inserts instead of one-at-a-time to reduce round-trips.
 * Returns the count of successfully upserted rows.
 */
export async function batchUpsertViolations(
  supabase: SupabaseClient,
  propertyId: string,
  violations: NormalizedViolation[],
): Promise<{ upserted: number; errors: string[] }> {
  if (violations.length === 0) {
    return { upserted: 0, errors: [] };
  }

  const errors: string[] = [];
  let upserted = 0;

  // Chunk into batches of 50 to stay within reasonable payload sizes
  const BATCH_SIZE = 50;
  for (let i = 0; i < violations.length; i += BATCH_SIZE) {
    const chunk = violations.slice(i, i + BATCH_SIZE);
    const rows = chunk.map(v => ({
      property_id: propertyId,
      ...v,
      source: v.source as ViolationSource,
    }));

    const { error, count } = await supabase
      .from('violations')
      .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true, count: 'exact' });

    if (error) {
      errors.push(`Batch upsert error: ${error.message}`);
    } else {
      upserted += count ?? chunk.length;
    }
  }

  return { upserted, errors };
}

/**
 * Update the last_polled_at timestamp for a property.
 */
export async function markPropertyPolled(
  supabase: SupabaseClient,
  propertyId: string,
): Promise<void> {
  await supabase
    .from('properties')
    .update({ last_polled_at: new Date().toISOString() })
    .eq('id', propertyId);
}
