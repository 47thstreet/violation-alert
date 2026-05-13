import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, ViolationKnowledgeBase, ViolationAgency } from '@/lib/supabase/types';

/**
 * Look up a knowledge base entry by violation type and agency.
 * Returns null if no entry exists yet.
 */
export async function lookupKnowledgeBase(
  supabase: SupabaseClient<Database>,
  violationType: string,
  agency: ViolationAgency,
): Promise<ViolationKnowledgeBase | null> {
  const { data, error } = await supabase
    .from('violation_knowledge_base')
    .select('*')
    .eq('violation_type', violationType)
    .eq('agency', agency)
    .single();

  if (error || !data) return null;
  return data as ViolationKnowledgeBase;
}

/**
 * Increment the search_count for a knowledge base entry.
 * Called each time a user views resolution info for this violation type.
 */
export async function incrementSearchCount(
  supabase: SupabaseClient<Database>,
  entryId: string,
): Promise<void> {
  // Read-then-write since RPC may not exist
  const { data } = await supabase
    .from('violation_knowledge_base')
    .select('search_count')
    .eq('id', entryId)
    .single();

  if (data) {
    await supabase
      .from('violation_knowledge_base')
      .update({ search_count: (data.search_count || 0) + 1 })
      .eq('id', entryId);
  }
}
