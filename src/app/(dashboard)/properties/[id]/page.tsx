import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ViolationTable } from '@/components/violation-table';
import { ViolationCharts } from '@/components/violation-charts';
import { ScanNowButton } from '@/components/scan-now-button';
import { Breadcrumbs } from '@/components/breadcrumbs';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!property) notFound();

  const { data: violations } = await supabase
    .from('violations')
    .select('*')
    .eq('property_id', id)
    .order('issued_date', { ascending: false });

  const openCount = violations?.filter(v => v.status === 'open').length || 0;
  const totalPenalties = violations?.reduce((sum, v) => sum + (v.penalty_amount || 0), 0) || 0;

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Home', href: '/properties' },
        { label: 'Properties', href: '/properties' },
        { label: property.address },
      ]} />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{property.address}</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-sm text-gray-500">
              {property.borough && <span>{property.borough}</span>}
              {property.bin && <span>BIN: {property.bin}</span>}
              {property.bbl && <span>BBL: {property.bbl}</span>}
            </div>
          </div>
          <Link
            href={`/properties/${id}/crm`}
            className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition-all shrink-0 w-full sm:w-auto text-center"
          >
            CRM / Manage
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Violations</p>
            <p className="text-2xl font-bold text-gray-900">{violations?.length || 0}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-600">Open</p>
            <p className="text-2xl font-bold text-red-700">{openCount}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-600">Total Penalties</p>
            <p className="text-2xl font-bold text-orange-700">${totalPenalties.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <p className="text-xs text-gray-500">
            {property.last_polled_at
              ? `Last checked ${formatDistanceToNow(new Date(property.last_polled_at), { addSuffix: true })}`
              : 'Not yet checked'
            }
          </p>
          <ScanNowButton propertyId={id} />
        </div>
      </div>

      {violations && violations.length > 0 && (
        <ViolationCharts violations={violations} />
      )}

      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Violations</h2>
        </div>
        {violations && violations.length > 0 ? (
          <ViolationTable violations={violations} />
        ) : (
          <div className="p-8 text-center text-gray-500">
            No violations found. The system checks every 15 minutes.
          </div>
        )}
      </div>
    </div>
  );
}
