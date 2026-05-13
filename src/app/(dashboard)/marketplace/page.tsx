'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Contractor } from '@/lib/supabase/types';
import { ContractorCard } from '@/components/contractor-card';

const BOROUGHS = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
const RATINGS = [
  { label: 'Any rating', value: 0 },
  { label: '4+ stars', value: 4 },
  { label: '4.5+ stars', value: 4.5 },
];

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || '';

  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [boroughFilter, setBoroughFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [violationTypes, setViolationTypes] = useState<string[]>([]);

  const supabase = createClient();

  // Load contractors
  useEffect(() => {
    async function load() {
      setLoading(true);

      let query = supabase
        .from('contractors')
        .select('*')
        .eq('active', true)
        .order('avg_rating', { ascending: false });

      if (ratingFilter > 0) {
        query = query.gte('avg_rating', ratingFilter);
      }

      if (typeFilter) {
        query = query.contains('violation_types_served', [typeFilter]);
      }

      if (boroughFilter) {
        query = query.contains('boroughs_served', [boroughFilter]);
      }

      const { data } = await query;
      let results = (data || []) as Contractor[];

      // Client-side search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        results = results.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.company_name && c.company_name.toLowerCase().includes(q)),
        );
      }

      setContractors(results);

      // Build unique violation types for filter dropdown
      if (violationTypes.length === 0 && data) {
        const types = new Set<string>();
        (data as Contractor[]).forEach((c) => {
          (c.violation_types_served || []).forEach((t: string) => types.add(t));
        });
        setViolationTypes(Array.from(types).sort());
      }

      setLoading(false);
    }

    load();
  }, [typeFilter, boroughFilter, ratingFilter, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Contractor Marketplace</h1>
      <p className="text-gray-500 text-sm mb-6">
        Find verified contractors to help resolve your building violations.
      </p>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Violation Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All violation types</option>
            {violationTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Borough */}
          <select
            value={boroughFilter}
            onChange={(e) => setBoroughFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All boroughs</option>
            {BOROUGHS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Rating */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {RATINGS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active filters */}
        {(typeFilter || boroughFilter || ratingFilter > 0 || search) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-xs text-gray-500">Active filters:</span>
            {typeFilter && (
              <FilterTag label={typeFilter} onRemove={() => setTypeFilter('')} />
            )}
            {boroughFilter && (
              <FilterTag label={boroughFilter} onRemove={() => setBoroughFilter('')} />
            )}
            {ratingFilter > 0 && (
              <FilterTag label={`${ratingFilter}+ stars`} onRemove={() => setRatingFilter(0)} />
            )}
            {search && (
              <FilterTag label={`"${search}"`} onRemove={() => setSearch('')} />
            )}
            <button
              onClick={() => {
                setTypeFilter('');
                setBoroughFilter('');
                setRatingFilter(0);
                setSearch('');
              }}
              className="text-xs text-red-600 hover:text-red-700 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      ) : contractors.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {contractors.length} contractor{contractors.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contractors.map((contractor) => (
              <ContractorCard key={contractor.id} contractor={contractor} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contractors found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-red-900">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
