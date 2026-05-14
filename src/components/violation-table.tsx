'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Violation } from '@/lib/supabase/types';

interface ViolationTableProps {
  violations: Violation[];
}

export function ViolationTable({ violations }: ViolationTableProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const normalizeStatus = (s: string | null) => {
    if (!s) return 'unknown';
    const lower = s.toLowerCase().trim();
    if (lower === 'open' || lower === 'active') return 'open';
    if (lower === 'close' || lower === 'closed' || lower === 'resolved') return 'closed';
    return lower;
  };

  const filtered = violations.filter(v => {
    const status = normalizeStatus(v.status);
    if (filter === 'open' && status !== 'open') return false;
    if (filter === 'closed' && status !== 'closed') return false;
    if (sourceFilter !== 'all' && v.source !== sourceFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-4 border-b">
        {(['all', 'open', 'closed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
              filter === f
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="ml-auto">
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="text-sm border rounded-lg px-2 py-1.5 min-h-[36px]"
          >
            <option value="all">All Sources</option>
            <option value="dob">DOB</option>
            <option value="hpd">HPD</option>
            <option value="ecb">ECB</option>
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Violation #</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Issued</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Penalty</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/violations/${v.id}`)}>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    {v.source}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{v.violation_number || 'N/A'}</td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={v.severity} />
                </td>
                <td className="px-4 py-3 max-w-xs truncate" title={v.description || ''}>
                  {v.description || 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{v.issued_date || 'N/A'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-3 text-right font-mono">
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
            className="p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
            onClick={() => router.push(`/violations/${v.id}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                  {v.source}
                </span>
                <SeverityBadge severity={v.severity} />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                v.status === 'open'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {v.status || 'Unknown'}
              </span>
            </div>
            <p className="text-sm text-gray-900 line-clamp-2 mb-1">
              {v.description || v.violation_number || 'N/A'}
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
        <div className="p-8 text-center text-gray-500">
          No violations match your filters.
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Unknown</span>;
  const lower = status.toLowerCase().trim();
  const isOpen = lower === 'open' || lower === 'active';
  const label = isOpen ? 'Open' : 'Closed';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
      isOpen ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    }`}>
      {label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string | null }) {
  if (!severity) return <span className="text-gray-500 text-xs">Unknown</span>;

  const lower = severity.toLowerCase();
  let color = 'bg-gray-100 text-gray-700';
  let label = severity;

  if (lower.includes('immediately') || lower.includes('critical')) {
    color = 'bg-red-100 text-red-700';
    label = 'Critical';
  } else if (lower.includes('hazardous') && !lower.includes('non')) {
    color = 'bg-orange-100 text-orange-700';
    label = 'Hazardous';
  } else if (lower.includes('non-hazardous') || lower.includes('non-serious')) {
    color = 'bg-yellow-100 text-yellow-800';
    label = 'Minor';
  } else if (lower.includes('info') || lower.includes('class i')) {
    color = 'bg-blue-100 text-blue-700';
    label = 'Info';
  } else if (lower.includes('active') || lower.includes('violation')) {
    color = 'bg-red-100 text-red-700';
    label = 'Active';
  }

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
}
