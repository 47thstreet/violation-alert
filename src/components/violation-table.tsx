'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Violation } from '@/lib/supabase/types';

interface ViolationTableProps {
  violations: Violation[];
}

function normalizeStatus(s: string | null): 'open' | 'closed' | 'unknown' {
  if (!s) return 'unknown';
  const lower = s.toLowerCase().trim();
  if (lower === 'open' || lower === 'active') return 'open';
  if (lower === 'close' || lower === 'closed' || lower === 'resolved') return 'closed';
  return 'unknown';
}

function normalizeSeverity(s: string | null): { label: string; level: number } {
  if (!s) return { label: 'Unknown', level: 0 };
  const lower = s.toLowerCase();
  if (lower.includes('immediately') || lower.includes('critical')) return { label: 'Critical', level: 3 };
  if (lower.includes('hazardous') && !lower.includes('non')) return { label: 'Hazardous', level: 2 };
  if (lower.includes('non-hazardous') || lower.includes('non-serious')) return { label: 'Minor', level: 1 };
  if (lower.includes('active') || lower.includes('violation')) return { label: 'Active', level: 3 };
  if (lower.includes('info') || lower.includes('class i')) return { label: 'Info', level: 0 };
  return { label: 'Unknown', level: 0 };
}

export function ViolationTable({ violations }: ViolationTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'penalty'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Get unique sources from data
  const sources = useMemo(() => {
    const s = new Set(violations.map(v => v.source));
    return Array.from(s).sort();
  }, [violations]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const open = violations.filter(v => normalizeStatus(v.status) === 'open').length;
    const closed = violations.filter(v => normalizeStatus(v.status) === 'closed').length;
    return { all: violations.length, open, closed };
  }, [violations]);

  const filtered = useMemo(() => {
    let result = violations.filter(v => {
      const status = normalizeStatus(v.status);
      if (statusFilter === 'open' && status !== 'open') return false;
      if (statusFilter === 'closed' && status !== 'closed') return false;
      if (sourceFilter !== 'all' && v.source !== sourceFilter) return false;
      if (severityFilter !== 'all') {
        const sev = normalizeSeverity(v.severity);
        if (sev.label.toLowerCase() !== severityFilter) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') {
        cmp = (a.issued_date || '').localeCompare(b.issued_date || '');
      } else if (sortBy === 'severity') {
        cmp = normalizeSeverity(a.severity).level - normalizeSeverity(b.severity).level;
      } else if (sortBy === 'penalty') {
        cmp = (a.penalty_amount || 0) - (b.penalty_amount || 0);
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [violations, statusFilter, sourceFilter, severityFilter, sortBy, sortDir]);

  const toggleSort = (col: 'date' | 'severity' | 'penalty') => {
    if (sortBy === col) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  };

  const hasActiveFilters = statusFilter !== 'all' || sourceFilter !== 'all' || severityFilter !== 'all';

  return (
    <div>
      {/* Filter bar */}
      <div className="p-4 border-b space-y-3">
        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'open', 'closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                statusFilter === f
                  ? f === 'open' ? 'bg-red-100 text-red-700' : f === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'open' ? 'Open' : 'Closed'}
              <span className="ml-1.5 text-xs opacity-70">{counts[f]}</span>
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={() => { setStatusFilter('all'); setSourceFilter('all'); setSeverityFilter('all'); }}
              className="ml-1 px-2 py-1.5 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div className="flex flex-wrap gap-2">
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 min-h-[36px] bg-white text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            <option value="all">All Agencies</option>
            {sources.map(s => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 min-h-[36px] bg-white text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="hazardous">Hazardous</option>
            <option value="minor">Minor</option>
            <option value="info">Info</option>
          </select>

          <select
            value={`${sortBy}-${sortDir}`}
            onChange={e => {
              const [col, dir] = e.target.value.split('-') as ['date' | 'severity' | 'penalty', 'asc' | 'desc'];
              setSortBy(col);
              setSortDir(dir);
            }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 min-h-[36px] bg-white text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="severity-desc">Most Severe</option>
            <option value="severity-asc">Least Severe</option>
            <option value="penalty-desc">Highest Penalty</option>
            <option value="penalty-asc">Lowest Penalty</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50">
        Showing {filtered.length} of {violations.length} violations
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-gray-50">
              <th className="px-4 py-3 font-medium">Agency</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:text-gray-900 select-none" onClick={() => toggleSort('severity')}>
                Severity {sortBy === 'severity' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
              </th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:text-gray-900 select-none" onClick={() => toggleSort('date')}>
                Issued {sortBy === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right cursor-pointer hover:text-gray-900 select-none" onClick={() => toggleSort('penalty')}>
                Penalty {sortBy === 'penalty' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => router.push(`/violations/${v.id}`)}>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    {v.source}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">{v.violation_type || v.violation_number || 'N/A'}</td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={v.severity} />
                </td>
                <td className="px-4 py-3 max-w-xs truncate text-gray-700" title={v.description || ''}>
                  {v.description || 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{v.issued_date || 'N/A'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">
                  {v.penalty_amount ? `$${v.penalty_amount.toLocaleString()}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y">
        {filtered.map(v => (
          <div
            key={v.id}
            className="p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
            onClick={() => router.push(`/violations/${v.id}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                  {v.source}
                </span>
                <SeverityBadge severity={v.severity} />
              </div>
              <StatusBadge status={v.status} />
            </div>
            <p className="text-sm text-gray-900 line-clamp-2 mb-1">
              {v.description || v.violation_type || v.violation_number || 'N/A'}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{v.issued_date || 'N/A'}</span>
              {v.penalty_amount ? (
                <span className="font-mono font-medium text-orange-700">
                  ${v.penalty_amount.toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500 font-medium">No violations match your filters.</p>
          {hasActiveFilters && (
            <button
              onClick={() => { setStatusFilter('all'); setSourceFilter('all'); setSeverityFilter('all'); }}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const normalized = normalizeStatus(status);
  const isOpen = normalized === 'open';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
      isOpen ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    }`}>
      {isOpen ? 'Open' : 'Closed'}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string | null }) {
  const { label } = normalizeSeverity(severity);

  const colors: Record<string, string> = {
    'Critical': 'bg-red-100 text-red-700',
    'Hazardous': 'bg-orange-100 text-orange-700',
    'Minor': 'bg-yellow-100 text-yellow-800',
    'Active': 'bg-red-100 text-red-700',
    'Info': 'bg-blue-100 text-blue-700',
    'Unknown': 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[label] || colors['Unknown']}`}>
      {label}
    </span>
  );
}
