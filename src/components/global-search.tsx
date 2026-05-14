'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SearchResult {
  id: string;
  type: 'property' | 'violation';
  title: string;
  subtitle: string;
  href: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Get tenant
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!tenant) { setLoading(false); return; }

    const searchResults: SearchResult[] = [];

    // Search properties by address (ilike)
    const { data: properties } = await supabase
      .from('properties')
      .select('id, address, borough, zip')
      .eq('tenant_id', tenant.id)
      .ilike('address', `%${q}%`)
      .limit(5);

    if (properties) {
      for (const p of properties) {
        searchResults.push({
          id: p.id,
          type: 'property',
          title: p.address,
          subtitle: [p.borough, p.zip].filter(Boolean).join(', ') || 'Property',
          href: `/properties/${p.id}`,
        });
      }
    }

    // Search violations by type or description
    // First get property IDs for this tenant
    const { data: allProps } = await supabase
      .from('properties')
      .select('id, address')
      .eq('tenant_id', tenant.id);

    const propIds = (allProps || []).map(p => p.id);
    const addrMap = new Map((allProps || []).map(p => [p.id, p.address]));

    if (propIds.length > 0) {
      const { data: violations } = await supabase
        .from('violations')
        .select('id, property_id, violation_type, description, source')
        .in('property_id', propIds)
        .or(`violation_type.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(5);

      if (violations) {
        for (const v of violations) {
          searchResults.push({
            id: v.id,
            type: 'violation',
            title: v.violation_type || v.description || 'Violation',
            subtitle: addrMap.get(v.property_id) || v.source?.toUpperCase() || '',
            href: `/violations`,
          });
        }
      }
    }

    setResults(searchResults);
    setActiveIndex(-1);
    setLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!open || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const result = results[activeIndex];
      router.push(result.href);
      setOpen(false);
      setQuery('');
    }
  }

  function selectResult(result: SearchResult) {
    router.push(result.href);
    setOpen(false);
    setQuery('');
  }

  const propertyResults = results.filter(r => r.type === 'property');
  const violationResults = results.filter(r => r.type === 'violation');

  // Flat index helper for keyboard nav
  const allResults = [...propertyResults, ...violationResults];
  function getFlatIndex(result: SearchResult) {
    return allResults.findIndex(r => r.id === result.id);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search... (Cmd+K)"
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 min-h-[38px] search-input-expand"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-50 overflow-hidden max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No results found</div>
          ) : (
            <>
              {propertyResults.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    Properties
                  </div>
                  {propertyResults.map(result => {
                    const flatIdx = getFlatIndex(result);
                    return (
                      <button
                        key={result.id}
                        onClick={() => selectResult(result)}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 text-sm search-result-item search-result-active ${
                          activeIndex === flatIdx ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="3" width="10" height="18" rx="1" />
                          <rect x="13" y="8" width="8" height="13" rx="1" />
                          <line x1="6" y1="7" x2="10" y2="7" />
                          <line x1="6" y1="11" x2="10" y2="11" />
                        </svg>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          <div className="text-xs text-gray-500 truncate">{result.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {violationResults.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    Violations
                  </div>
                  {violationResults.map(result => {
                    const flatIdx = getFlatIndex(result);
                    return (
                      <button
                        key={result.id}
                        onClick={() => selectResult(result)}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 text-sm search-result-item search-result-active ${
                          activeIndex === flatIdx ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          <div className="text-xs text-gray-500 truncate">{result.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
