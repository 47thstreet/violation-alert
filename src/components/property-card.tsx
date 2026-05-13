import Link from 'next/link';
import type { Property } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';

interface PropertyCardProps {
  property: Property;
  violationCount: number;
}

export function PropertyCard({ property, violationCount }: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow block"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{property.address}</h3>
        {violationCount > 0 && (
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
            {violationCount}
          </span>
        )}
      </div>

      <div className="space-y-1 text-sm text-gray-500">
        {property.borough && <p>{property.borough}</p>}
        {property.bin && <p>BIN: {property.bin}</p>}
        {property.bbl && <p>BBL: {property.bbl}</p>}
      </div>

      <div className="mt-4 pt-3 border-t flex justify-between text-xs text-gray-400">
        <span>
          {property.last_polled_at
            ? `Checked ${formatDistanceToNow(new Date(property.last_polled_at), { addSuffix: true })}`
            : 'Not yet checked'
          }
        </span>
        {violationCount === 0 && (
          <span className="text-green-600 font-medium">Clean</span>
        )}
      </div>
    </Link>
  );
}
