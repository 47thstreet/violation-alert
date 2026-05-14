import Link from 'next/link';
import type { Property } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';

interface PropertyCardProps {
  property: Property;
  violationCount: number;
}

export function PropertyCard({ property, violationCount }: PropertyCardProps) {
  // Status color: green (0), yellow (1-5), red (6+)
  const statusColor =
    violationCount === 0
      ? 'bg-green-500'
      : violationCount <= 5
        ? 'bg-yellow-400'
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
      className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow block relative group"
    >
      {/* Violation count badge — top right */}
      {violationCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-sm">
          {violationCount > 99 ? '99+' : violationCount}
        </span>
      )}

      {/* Address + status dot */}
      <div className="flex items-start gap-2.5 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${statusColor}`} title={statusLabel} />
        <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
          {property.address}
        </h3>
      </div>

      {/* Borough badge */}
      {property.borough && (
        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
          {property.borough}
        </span>
      )}

      {/* Meta row */}
      <div className="mt-auto pt-3 border-t flex items-center justify-between text-xs text-gray-400">
        <span>
          {property.last_polled_at
            ? `Scanned ${formatDistanceToNow(new Date(property.last_polled_at), { addSuffix: true })}`
            : 'Not yet scanned'}
        </span>
        <span className={`font-medium ${violationCount === 0 ? 'text-green-600' : violationCount <= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
          {statusLabel}
        </span>
      </div>
    </Link>
  );
}
