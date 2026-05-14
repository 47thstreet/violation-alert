import Link from 'next/link';
import type { Property } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';

interface PropertyCardProps {
  property: Property;
  violationCount: number;
}

export function PropertyCard({ property, violationCount }: PropertyCardProps) {
  const statusColor =
    violationCount === 0
      ? 'bg-emerald-500'
      : violationCount <= 5
        ? 'bg-amber-500'
        : 'bg-red-500';

  const statusLabel =
    violationCount === 0
      ? 'Clean'
      : violationCount <= 5
        ? 'Attention'
        : 'Critical';

  return (
    <Link
      href={`/properties/${property.id}`}
      className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200 block group"
    >
      {/* Address + borough */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
          {property.address}
        </h3>
        {property.borough && (
          <p className="text-sm text-gray-400 mt-1">{property.borough}</p>
        )}
      </div>

      {/* Violations indicator */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor}`} />
          <span className="text-sm text-gray-500">{statusLabel}</span>
        </div>
        {violationCount > 0 ? (
          <span className="text-sm font-semibold text-red-600 tabular-nums">
            {violationCount} {violationCount === 1 ? 'violation' : 'violations'}
          </span>
        ) : (
          <span className="text-sm text-gray-400">No violations</span>
        )}
      </div>

      {/* Last scanned */}
      <p className="text-xs text-gray-400 mt-3">
        {property.last_polled_at
          ? `Scanned ${formatDistanceToNow(new Date(property.last_polled_at), { addSuffix: true })}`
          : 'Not yet scanned'}
      </p>
    </Link>
  );
}
