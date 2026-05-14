'use client';

import { useMemo } from 'react';
import type { Violation } from '@/lib/supabase/types';

const AGENCY_COLORS: Record<string, string> = {
  dob: '#2563eb',
  hpd: '#7c3aed',
  ecb: '#db2777',
  fdny: '#dc2626',
  dsny: '#16a34a',
  dot: '#ca8a04',
  lpc: '#0891b2',
  dep: '#059669',
  dohmh: '#9333ea',
  oath: '#ea580c',
};

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' },
  major: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Major' },
  minor: { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Minor' },
  unknown: { color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Unknown' },
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ViolationCharts({ violations }: { violations: Violation[] }) {
  // --- Agency grouping ---
  const agencyData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of violations) {
      const key = v.source || 'unknown';
      counts[key] = (counts[key] || 0) + 1;
    }
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = entries.length > 0 ? entries[0][1] : 1;
    return { entries, max };
  }, [violations]);

  // --- Monthly grouping (last 12 months) ---
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; year: number; month: number; count: number; isCurrent: boolean }[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: MONTH_LABELS[d.getMonth()],
        year: d.getFullYear(),
        month: d.getMonth(),
        count: 0,
        isCurrent: i === 0,
      });
    }

    for (const v of violations) {
      if (!v.issued_date) continue;
      const d = new Date(v.issued_date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const entry = months.find(m => m.key === key);
      if (entry) entry.count++;
    }

    const max = Math.max(...months.map(m => m.count), 1);
    return { months, max };
  }, [violations]);

  // --- Severity grouping ---
  const severityData = useMemo(() => {
    const counts = { critical: 0, major: 0, minor: 0, unknown: 0 };
    for (const v of violations) {
      const s = (v.severity || '').toLowerCase();
      if (s === 'critical') counts.critical++;
      else if (s === 'major') counts.major++;
      else if (s === 'minor') counts.minor++;
      else counts.unknown++;
    }
    return counts;
  }, [violations]);

  return (
    <div className="space-y-6 mb-6">
      {/* Severity Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(SEVERITY_CONFIG) as Array<keyof typeof severityData>).map(key => {
            const cfg = SEVERITY_CONFIG[key];
            return (
              <div key={key} className={`${cfg.bg} ${cfg.border} border rounded-lg p-4 text-center`}>
                <p className={`text-3xl font-bold ${cfg.color}`}>{severityData[key]}</p>
                <p className={`text-sm mt-1 ${cfg.color} opacity-80`}>{cfg.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violations by Agency */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Agency</h3>
          <div className="space-y-3">
            {agencyData.entries.map(([agency, count]) => (
              <div key={agency} className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase text-gray-600 w-14 shrink-0">
                  {agency}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(count / agencyData.max) * 100}%`,
                      backgroundColor: AGENCY_COLORS[agency] || '#6b7280',
                      minWidth: '24px',
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
              </div>
            ))}
            {agencyData.entries.length === 0 && (
              <p className="text-sm text-gray-500">No data</p>
            )}
          </div>
        </div>

        {/* Violations by Month */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 12 Months</h3>
          <div className="flex items-end gap-1 sm:gap-2 h-40">
            {monthlyData.months.map(m => (
              <div key={m.key} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs font-semibold text-gray-700 mb-1">
                  {m.count > 0 ? m.count : ''}
                </span>
                <div
                  className={`w-full rounded-t transition-all duration-500 ${
                    m.isCurrent ? 'bg-red-500' : 'bg-blue-400'
                  }`}
                  style={{
                    height: m.count > 0 ? `${(m.count / monthlyData.max) * 100}%` : '4px',
                    minHeight: '4px',
                    opacity: m.count > 0 ? 1 : 0.3,
                  }}
                />
                <span className={`text-[10px] mt-1 ${m.isCurrent ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
