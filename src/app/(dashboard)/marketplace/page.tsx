'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Contractor } from '@/lib/supabase/types';
import { ContractorCard } from '@/components/contractor-card';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { EmptyState, BriefcaseIcon } from '@/components/empty-state';

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
      <Breadcrumbs items={[
        { label: 'Home', href: '/properties' },
        { label: 'Marketplace' },
      ]} />
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Contractor Marketplace</h1>
      <p className="text-gray-400 text-sm mb-8">
        Find verified contractors to help resolve your building violations.
      </p>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <input
              type="text"
              placeholder="Search by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
            />
          </div>

          {/* Violation Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
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
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
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
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
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
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
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
              className="text-xs text-gray-400 hover:text-gray-600 ml-1 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : contractors.length > 0 ? (
        <>
          <p className="text-sm text-gray-400 mb-5">
            {contractors.length} contractor{contractors.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contractors.map((contractor) => (
              <ContractorCard key={contractor.id} contractor={contractor} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<BriefcaseIcon />}
          title="No contractors yet"
          description="The contractor marketplace is coming soon."
        />
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-gray-900 transition-colors">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
