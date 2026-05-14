'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Contractor } from '@/lib/supabase/types';

interface ContractorMatchProps {
  violationType: string;
  borough: string | null;
}

export function ContractorMatch({ violationType, borough }: ContractorMatchProps) {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();

      // Query contractors that serve this violation type
      let query = supabase
        .from('contractors')
        .select('*')
        .contains('violation_types_served', [violationType])
        .eq('active', true)
        .order('avg_rating', { ascending: false })
        .limit(3);

      if (borough) {
        query = query.contains('boroughs_served', [borough]);
      }

      const { data } = await query;

      if (data && data.length > 0) {
        setContractors(data);
      } else {
        // Fallback: get top-rated active contractors
        const { data: fallback } = await supabase
          .from('contractors')
          .select('*')
          .eq('active', true)
          .order('avg_rating', { ascending: false })
          .limit(3);
        setContractors(fallback || []);
      }

      setLoading(false);
    }

    load();
  }, [violationType, borough]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hire a Pro</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          Finding contractors...
        </div>
      </div>
    );
  }

  if (contractors.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hire a Pro</h2>
        <p className="text-sm text-gray-500 mb-3">
          No contractors found for this violation type yet.
        </p>
        <Link
          href="/marketplace"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Browse all contractors &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Hire a Pro</h2>
        <Link
          href={`/marketplace?type=${encodeURIComponent(violationType)}`}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View all &rarr;
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {contractors.map((contractor) => (
          <Link
            key={contractor.id}
            href={`/marketplace/${contractor.id}`}
            className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                {contractor.profile_image_url ? (
                  <img
                    src={contractor.profile_image_url}
                    alt={contractor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 font-bold">
                    {contractor.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-gray-900 truncate">{contractor.name}</p>
                  {contractor.verified && (
                    <span className="flex-shrink-0 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                {contractor.company_name && (
                  <p className="text-xs text-gray-500 truncate">{contractor.company_name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(contractor.avg_rating) ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {contractor.avg_rating.toFixed(1)} ({contractor.review_count})
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
