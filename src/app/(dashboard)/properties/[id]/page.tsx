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

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{property.address}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
              {property.borough && <span>{property.borough}</span>}
              {property.bin && <span>BIN {property.bin}</span>}
              {property.bbl && <span>BBL {property.bbl}</span>}
            </div>
          </div>
          <Link
            href={`/properties/${id}/crm`}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all shrink-0 w-full sm:w-auto text-center"
          >
            Manage
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{violations?.length || 0}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Open</p>
            <p className={`text-2xl font-bold mt-1 tabular-nums ${openCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{openCount}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Penalties</p>
            <p className={`text-2xl font-bold mt-1 tabular-nums ${totalPenalties > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
              {totalPenalties > 0 ? `$${totalPenalties.toLocaleString()}` : '$0'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400">
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

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Violations</h2>
        </div>
        {violations && violations.length > 0 ? (
          <ViolationTable violations={violations} />
        ) : (
          <div className="px-5 py-16 text-center text-gray-400">
            No violations found. Checking every 15 minutes.
          </div>
        )}
      </div>
    </div>
  );
}
