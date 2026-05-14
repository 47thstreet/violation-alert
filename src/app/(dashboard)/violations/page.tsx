import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ViolationTable } from '@/components/violation-table';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { EmptyState, CheckmarkIcon } from '@/components/empty-state';

export const metadata: Metadata = {
  title: 'Violations',
};

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
      <Breadcrumbs items={[
        { label: 'Home', href: '/properties' },
        { label: 'Violations' },
      ]} />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">All Violations</h1>
      <p className="text-gray-600 text-sm mb-6">
        {violations?.length || 0} total &middot; {openCount} open &middot; ${totalPenalties.toLocaleString()} in penalties
      </p>

      {enriched.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <ViolationTable violations={enriched} />
        </div>
      ) : (
        <EmptyState
          icon={<CheckmarkIcon />}
          title="No violations found"
          description="Your properties are clean! We'll alert you when anything changes."
        />
      )}
    </div>
  );
}
