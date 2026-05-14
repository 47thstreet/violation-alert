import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PropertyCard } from '@/components/property-card';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PropertiesEmptyOrOnboarding } from '@/components/properties-empty-or-onboarding';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = {
  title: 'My Properties',
};

export default async function PropertiesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, tier')
    .eq('user_id', user!.id)
    .single();

  // Fetch properties and pending resolutions in parallel
  const [propertiesResult, pendingResult] = await Promise.all([
    supabase
      .from('properties')
      .select('*')
      .eq('tenant_id', tenant!.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('resolution_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant!.id)
      .neq('status', 'resolved'),
  ]);

  const properties = propertiesResult.data;
  const pendingResolutions = pendingResult.count || 0;

  // Get violation counts per property (requires property IDs)
  const propertyIds = (properties || []).map(p => p.id);
  const { data: violationCounts } = propertyIds.length > 0
    ? await supabase
        .rpc('get_violation_counts', { property_ids: propertyIds })
    : { data: [] };

  const countMap = new Map(
    (violationCounts || []).map((vc: { property_id: string; count: number }) => [vc.property_id, vc.count])
  );

  // --- Summary stats ---
  const totalProperties = properties?.length || 0;
  const totalViolations = (violationCounts || []).reduce(
    (sum: number, vc: { property_id: string; count: number }) => sum + vc.count, 0
  );

  // Last scan: most recent last_polled_at across all properties
  const lastPolledDates = (properties || [])
    .map(p => p.last_polled_at)
    .filter(Boolean) as string[];
  const lastScan = lastPolledDates.length > 0
    ? new Date(lastPolledDates.sort().reverse()[0])
    : null;
  const lastScanLabel = lastScan
    ? formatDistanceToNow(lastScan, { addSuffix: true })
    : 'Never';

  const maxProperties = tenant?.tier === 'free' ? 3 : Infinity;
  const canAdd = totalProperties < maxProperties;

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Home', href: '/properties' },
        { label: 'Properties' },
      ]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalProperties} of {maxProperties === Infinity ? 'unlimited' : maxProperties} properties
          </p>
        </div>
        {canAdd ? (
          <Link
            href="/properties/new"
            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition-all min-h-[44px] flex items-center shrink-0 text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Property
          </Link>
        ) : (
          <Link
            href="/settings"
            className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors min-h-[44px] flex items-center shrink-0 text-sm"
          >
            Upgrade to add more
          </Link>
        )}
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Total Properties */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Properties</p>
          <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">{totalProperties}</p>
        </div>

        {/* Active Violations */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Active Violations</p>
          <p className={`text-3xl font-bold mt-2 tabular-nums ${totalViolations > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {totalViolations}
          </p>
        </div>

        {/* Pending Resolutions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Pending</p>
          <p className={`text-3xl font-bold mt-2 tabular-nums ${pendingResolutions > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {pendingResolutions}
          </p>
        </div>

        {/* Last Scan */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Last Scan</p>
          <p className="text-lg font-semibold text-gray-900 mt-2 truncate">
            {lastScan ? lastScanLabel : 'Never'}
          </p>
        </div>
      </div>

      {/* Property Grid or Empty State */}
      {(!properties || properties.length === 0) ? (
        <PropertiesEmptyOrOnboarding />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              violationCount={countMap.get(property.id) || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
