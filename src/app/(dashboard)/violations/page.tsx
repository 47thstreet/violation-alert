import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ViolationTable } from '@/components/violation-table';

export default async function ViolationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  // Get all violations across all properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, address')
    .eq('tenant_id', tenant!.id);

  const propertyIds = (properties || []).map(p => p.id);

  const { data: violations } = propertyIds.length > 0
    ? await supabase
        .from('violations')
        .select('*')
        .in('property_id', propertyIds)
        .order('issued_date', { ascending: false })
        .limit(500)
    : { data: [] };

  const addressMap = new Map((properties || []).map(p => [p.id, p.address]));

  // Add property address to violations for display
  const enriched = (violations || []).map(v => ({
    ...v,
    description: `[${addressMap.get(v.property_id) || 'Unknown'}] ${v.description || ''}`,
  }));

  const openCount = violations?.filter(v => v.status === 'open').length || 0;
  const totalPenalties = violations?.reduce((sum, v) => sum + (v.penalty_amount || 0), 0) || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">All Violations</h1>
      <p className="text-gray-500 text-sm mb-6">
        {violations?.length || 0} total &middot; {openCount} open &middot; ${totalPenalties.toLocaleString()} in penalties
      </p>

      <div className="bg-white rounded-xl border">
        {enriched.length > 0 ? (
          <ViolationTable violations={enriched} />
        ) : (
          <div className="p-12 text-center text-gray-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No violations found</h3>
            <p>Add properties to start monitoring for violations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
