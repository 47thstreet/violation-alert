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

  const filtered = violations.filter(v => {
    if (filter === 'open' && v.status !== 'open') return false;
    if (filter === 'closed' && v.status === 'open') return false;
    if (sourceFilter !== 'all' && v.source !== sourceFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex gap-2 p-4 border-b">
        {(['all', 'open', 'closed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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
            className="text-sm border rounded-lg px-2 py-1"
          >
            <option value="all">All Sources</option>
            <option value="dob">DOB</option>
            <option value="hpd">HPD</option>
            <option value="ecb">ECB</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
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
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    v.status === 'open'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {v.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {v.penalty_amount ? `$${v.penalty_amount.toLocaleString()}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No violations match your filters.
        </div>
      )}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string | null }) {
  if (!severity) return <span className="text-gray-400 text-xs">Unknown</span>;

  const colors: Record<string, string> = {
    'immediately-hazardous': 'bg-red-100 text-red-700',
    'hazardous': 'bg-orange-100 text-orange-700',
    'non-hazardous': 'bg-yellow-100 text-yellow-700',
    'info': 'bg-blue-100 text-blue-700',
    'SERIOUS': 'bg-red-100 text-red-700',
    'NON-SERIOUS': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[severity] || 'bg-gray-100 text-gray-700'}`}>
      {severity}
    </span>
  );
}
