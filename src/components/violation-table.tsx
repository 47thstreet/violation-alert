'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
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
      <div className="p-5 border-b border-gray-100 space-y-4">
        {/* Status pills + count */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['all', 'open', 'closed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all min-h-[36px] ${
                  statusFilter === f
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {f === 'all' ? 'All' : f === 'open' ? 'Open' : 'Closed'}
                <span className="ml-1.5 text-xs opacity-60 tabular-nums">{counts[f]}</span>
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400">
            {filtered.length} of {violations.length}
          </span>
        </div>

        {/* Dropdowns row */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 min-h-[36px] bg-white text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Agencies</option>
            {sources.map(s => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 min-h-[36px] bg-white text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 min-h-[36px] bg-white text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="severity-desc">Most Severe</option>
            <option value="severity-asc">Least Severe</option>
            <option value="penalty-desc">Highest Penalty</option>
            <option value="penalty-asc">Lowest Penalty</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => { setStatusFilter('all'); setSourceFilter('all'); setSeverityFilter('all'); }}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-100">
              <th className="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Agency</th>
              <th className="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Type</th>
              <th className="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 select-none transition-colors" onClick={() => toggleSort('severity')}>
                Severity {sortBy === 'severity' && <span className="sort-arrow" data-dir={sortDir}>{'\u2193'}</span>}
              </th>
              <th className="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Description</th>
              <th className="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 select-none transition-colors" onClick={() => toggleSort('date')}>
                Issued {sortBy === 'date' && <span className="sort-arrow" data-dir={sortDir}>{'\u2193'}</span>}
              </th>
              <th className="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide text-right cursor-pointer hover:text-gray-600 select-none transition-colors" onClick={() => toggleSort('penalty')}>
                Penalty {sortBy === 'penalty' && <span className="sort-arrow" data-dir={sortDir}>{'\u2193'}</span>}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((v, index) => (
              <motion.tr
                key={v.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="cursor-pointer group table-row-hover"
                onClick={() => router.push(`/violations/${v.id}`)}
              >
                <td className="px-5 py-3.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {v.source}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{v.violation_type || v.violation_number || '--'}</td>
                <td className="px-5 py-3.5">
                  <SeverityBadge severity={v.severity} />
                </td>
                <td className="px-5 py-3.5 max-w-xs truncate text-gray-600 group-hover:text-gray-900 transition-colors" title={v.description || ''}>
                  {v.description || '--'}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-gray-500 tabular-nums">{v.issued_date || '--'}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-gray-600 tabular-nums">
                  {v.penalty_amount ? `$${v.penalty_amount.toLocaleString()}` : '--'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-gray-50">
        {filtered.map((v, index) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="px-5 py-4 hover:bg-gray-50/50 cursor-pointer active:bg-gray-100 transition-colors"
            onClick={() => router.push(`/violations/${v.id}`)}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {v.source}
                </span>
                <SeverityBadge severity={v.severity} />
              </div>
              <StatusBadge status={v.status} />
            </div>
            <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
              {v.description || v.violation_type || v.violation_number || '--'}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <span className="tabular-nums">{v.issued_date || '--'}</span>
              {v.penalty_amount ? (
                <span className="font-mono font-medium text-gray-600">
                  ${v.penalty_amount.toLocaleString()}
                </span>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-5 py-16 text-center">
          <p className="text-gray-400">No violations match your filters.</p>
          {hasActiveFilters && (
            <button
              onClick={() => { setStatusFilter('all'); setSourceFilter('all'); setSeverityFilter('all'); }}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
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
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
      isOpen ? 'bg-red-100 text-red-700 shadow-sm shadow-red-200/50' : 'bg-emerald-100 text-emerald-700'
    }`}>
      {isOpen ? 'Open' : 'Closed'}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string | null }) {
  const { label } = normalizeSeverity(severity);

  const colors: Record<string, string> = {
    'Critical': 'bg-red-600 text-white font-bold shadow-sm shadow-red-300',
    'Hazardous': 'bg-amber-100 text-amber-800 font-semibold',
    'Minor': 'bg-yellow-100 text-yellow-800',
    'Active': 'bg-red-100 text-red-700 font-semibold',
    'Info': 'bg-blue-100 text-blue-700',
    'Unknown': 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full ${colors[label] || colors['Unknown']}`}>
      {label}
    </span>
  );
}
