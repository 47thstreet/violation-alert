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

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('created_at', { ascending: false });

  // Get violation counts per property
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

  // Pending resolutions: status != 'resolved'
  let pendingResolutions = 0;
  if (tenant) {
    const { count } = await supabase
      .from('resolution_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .neq('status', 'resolved');
    pendingResolutions = count || 0;
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalProperties} of {maxProperties === Infinity ? 'unlimited' : maxProperties} properties
          </p>
        </div>
        {canAdd ? (
          <Link
            href="/properties/new"
            className="bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors min-h-[44px] flex items-center shrink-0"
          >
            Add Property
          </Link>
        ) : (
          <Link
            href="/settings"
            className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors min-h-[44px] flex items-center shrink-0"
          >
            Upgrade to add more
          </Link>
        )}
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Properties */}
        <div className="bg-white rounded-xl border p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Properties</p>
          </div>
        </div>

        {/* Active Violations */}
        <div className="bg-white rounded-xl border p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <p className={`text-2xl font-bold ${totalViolations > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {totalViolations}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Active Violations</p>
          </div>
        </div>

        {/* Pending Resolutions */}
        <div className="bg-white rounded-xl border p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <p className={`text-2xl font-bold ${pendingResolutions > 0 ? 'text-orange-500' : 'text-gray-900'}`}>
              {pendingResolutions}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Pending Resolutions</p>
          </div>
        </div>

        {/* Last Scan */}
        <div className="bg-white rounded-xl border p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 truncate max-w-[120px]">
              {lastScan ? lastScanLabel.replace(' ago', '') : '--'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Last Scan</p>
          </div>
        </div>
      </div>

      {/* Property Grid or Empty State */}
      {(!properties || properties.length === 0) ? (
        <PropertiesEmptyOrOnboarding />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
