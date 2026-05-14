'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Contractor, ContractorReview } from '@/lib/supabase/types';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function ContractorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [contractorId, setContractorId] = useState<string | null>(null);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [reviews, setReviews] = useState<ContractorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteRequested, setQuoteRequested] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    params.then(({ id }) => setContractorId(id));
  }, [params]);

  useEffect(() => {
    if (!contractorId) return;

    async function load() {
      setLoading(true);

      const { data: c } = await supabase
        .from('contractors')
        .select('*')
        .eq('id', contractorId!)
        .single();

      if (c) {
        setContractor(c);

        const { data: r } = await supabase
          .from('contractor_reviews')
          .select('*')
          .eq('contractor_id', contractorId!)
          .order('created_at', { ascending: false });

        setReviews(r || []);
      }

      setLoading(false);
    }

    load();
  }, [contractorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Contractor not found</h2>
        <Link href="/marketplace" className="text-indigo-600 hover:text-indigo-800 text-sm">
          Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Home', href: '/properties' },
        { label: 'Marketplace', href: '/marketplace' },
        { label: contractor.name },
      ]} />

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {contractor.profile_image_url ? (
              <img
                src={contractor.profile_image_url}
                alt={contractor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-2xl font-bold">
                {contractor.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{contractor.name}</h1>
              {contractor.verified && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  Verified
                </span>
              )}
            </div>
            {contractor.company_name && (
              <p className="text-gray-500">{contractor.company_name}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(contractor.avg_rating) ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">{contractor.avg_rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({contractor.review_count} reviews)</span>
            </div>

            {contractor.years_experience != null && (
              <p className="text-sm text-gray-500 mt-1">{contractor.years_experience} years experience</p>
            )}
          </div>

          {/* Request Quote Button */}
          <div className="flex-shrink-0">
            {quoteRequested ? (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center">
                <p className="text-sm font-medium text-green-700">Quote requested</p>
                <p className="text-xs text-green-600 mt-0.5">We will be in touch soon</p>
              </div>
            ) : (
              <button
                onClick={() => setQuoteRequested(true)}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 active:scale-[0.97] transition-all"
              >
                Request Quote
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        {contractor.description && (
          <p className="text-sm text-gray-600 mt-4 pt-4 border-t">{contractor.description}</p>
        )}

        {/* Contact & Details */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {contractor.email && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Email</p>
              <a href={`mailto:${contractor.email}`} className="text-sm text-indigo-600 hover:text-indigo-800">
                {contractor.email}
              </a>
            </div>
          )}
          {contractor.phone && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Phone</p>
              <a href={`tel:${contractor.phone}`} className="text-sm text-indigo-600 hover:text-indigo-800">
                {contractor.phone}
              </a>
            </div>
          )}
          {contractor.website && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Website</p>
              <a
                href={contractor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {contractor.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {contractor.license_number && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">License</p>
              <p className="text-sm text-gray-900">
                {contractor.license_type ? `${contractor.license_type}: ` : ''}
                {contractor.license_number}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Services & Coverage */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Violation Types Served</h2>
          {contractor.violation_types_served && contractor.violation_types_served.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {contractor.violation_types_served.map((type) => (
                <span key={type} className="bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full">
                  {type}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No specific types listed</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Service Areas</h2>
          {contractor.boroughs_served && contractor.boroughs_served.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {contractor.boroughs_served.map((borough) => (
                <span key={borough} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {borough}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">All NYC boroughs</p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Reviews ({reviews.length})
          </h2>
        </div>

        {reviews.length > 0 ? (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-500">R</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Reviewer</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-200'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.violation_type && (
                  <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full mb-2 inline-block">
                    {review.violation_type}
                  </span>
                )}
                {review.review_text && (
                  <p className="text-sm text-gray-600 mt-1">{review.review_text}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
