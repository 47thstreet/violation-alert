import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CrmTabs } from './crm-tabs';
import type { BuildingDetails, PropertyContact, PropertyDocument, PropertyNote, MaintenanceRequest } from '@/lib/supabase/types';

export default async function CrmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!property) notFound();

  // Get tenant_id for writes
  const { data: { user } } = await supabase.auth.getUser();
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  if (!tenant) notFound();

  // Load building details
  const { data: buildingDetails } = await supabase
    .from('building_details')
    .select('*')
    .eq('property_id', id)
    .single();

  // Load counts for tab badges
  const { count: contactCount } = await supabase
    .from('property_contacts')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', id);

  const { count: documentCount } = await supabase
    .from('property_documents')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', id);

  const { count: noteCount } = await supabase
    .from('property_notes')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', id);

  const { count: maintenanceCount } = await supabase
    .from('maintenance_requests')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', id)
    .neq('status', 'completed')
    .neq('status', 'cancelled');

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Home', href: '/properties' },
        { label: 'Properties', href: '/properties' },
        { label: property.address, href: `/properties/${id}` },
        { label: 'CRM' },
      ]} />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.address}</h1>
            <p className="text-sm text-gray-500 mt-1">CRM / Property Management</p>
          </div>
          <div className="flex gap-2">
            {property.borough && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{property.borough}</span>
            )}
            {property.bin && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">BIN: {property.bin}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{contactCount || 0}</p>
            <p className="text-xs text-gray-500">Contacts</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{documentCount || 0}</p>
            <p className="text-xs text-gray-500">Documents</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{noteCount || 0}</p>
            <p className="text-xs text-gray-500">Notes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{maintenanceCount || 0}</p>
            <p className="text-xs text-gray-500">Open Requests</p>
          </div>
        </div>
      </div>

      <CrmTabs
        propertyId={id}
        tenantId={tenant.id}
        buildingDetails={(buildingDetails as BuildingDetails) || null}
      />
    </div>
  );
}
