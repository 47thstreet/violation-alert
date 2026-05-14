import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PropertyCard } from '@/components/property-card';

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

  const maxProperties = tenant?.tier === 'free' ? 3 : Infinity;
  const canAdd = (properties?.length || 0) < maxProperties;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">
            {properties?.length || 0} of {maxProperties === Infinity ? 'unlimited' : maxProperties} properties
          </p>
        </div>
        {canAdd ? (
          <Link
            href="/properties/new"
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Add Property
          </Link>
        ) : (
          <Link
            href="/settings"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Upgrade to add more
          </Link>
        )}
      </div>

      {(!properties || properties.length === 0) ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-500 mb-4">Add your first NYC property to start monitoring violations.</p>
          <Link
            href="/properties/new"
            className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Add Your First Property
          </Link>
        </div>
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
