import Link from 'next/link';
import type { Contractor } from '@/lib/supabase/types';

interface ContractorCardProps {
  contractor: Contractor;
}

export function ContractorCard({ contractor }: ContractorCardProps) {
  return (
    <Link
      href={`/marketplace/${contractor.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          {contractor.profile_image_url ? (
            <img
              src={contractor.profile_image_url}
              alt={contractor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-lg font-bold">
              {contractor.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{contractor.name}</h3>
            {contractor.verified && (
              <span className="flex-shrink-0 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>
          {contractor.company_name && (
            <p className="text-xs text-gray-500 truncate">{contractor.company_name}</p>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mt-3">
        <StarRating rating={contractor.avg_rating} />
        <span className="text-sm font-medium text-gray-900">{contractor.avg_rating.toFixed(1)}</span>
        <span className="text-xs text-gray-500">({contractor.review_count} reviews)</span>
      </div>

      {/* Violation Types */}
      {contractor.violation_types_served && contractor.violation_types_served.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {contractor.violation_types_served.slice(0, 3).map((type) => (
            <span key={type} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {type}
            </span>
          ))}
          {contractor.violation_types_served.length > 3 && (
            <span className="text-xs text-gray-500">+{contractor.violation_types_served.length - 3} more</span>
          )}
        </div>
      )}

      {/* Boroughs */}
      {contractor.boroughs_served && contractor.boroughs_served.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {contractor.boroughs_served.map((borough) => (
            <span key={borough} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {borough}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
