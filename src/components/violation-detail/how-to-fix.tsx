'use client';

import { useState } from 'react';
import type { ViolationKnowledgeBase, ViolationAgency } from '@/lib/supabase/types';

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-emerald-50 text-emerald-700',
  moderate: 'bg-amber-50 text-amber-700',
  hard: 'bg-orange-50 text-orange-700',
  professional_only: 'bg-red-50 text-red-600',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  professional_only: 'Professional Only',
};

interface HowToFixProps {
  violationType: string | null;
  violationNumber: string | null;
  agency: ViolationAgency;
  initialKbEntry: ViolationKnowledgeBase | null;
  kbLoading: boolean;
}

export function HowToFixSection({
  violationType,
  violationNumber,
  agency,
  initialKbEntry,
  kbLoading: initialKbLoading,
}: HowToFixProps) {
  const [kbEntry, setKbEntry] = useState<ViolationKnowledgeBase | null>(initialKbEntry);
  const [kbLoading, setKbLoading] = useState(initialKbLoading);
  const [researchLoading, setResearchLoading] = useState(false);

  async function triggerResearch() {
    if (!violationType) return;
    setResearchLoading(true);
    try {
      const res = await fetch('/api/knowledge-base/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violation_type: violationType,
          violation_code: violationNumber,
          agency,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setKbEntry(json.data as ViolationKnowledgeBase);
      }
    } catch (err) {
      console.error('Research failed:', err);
    }
    setResearchLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-base font-semibold text-gray-900 mb-5">How to Fix</h2>

      {kbLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          Loading resolution guide...
        </div>
      ) : kbEntry ? (
        <div className="space-y-5">
          {kbEntry.description && (
            <p className="text-sm text-gray-600">{kbEntry.description}</p>
          )}

          {/* Steps */}
          {kbEntry.resolution_steps && kbEntry.resolution_steps.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Steps to Resolve</h3>
              <ol className="space-y-2">
                {kbEntry.resolution_steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {step.order}
                    </span>
                    <div className="pt-0.5">
                      <span className="text-gray-700">{step.instruction}</span>
                      {step.estimated_time && (
                        <span className="text-gray-500 text-xs ml-2">({step.estimated_time})</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-3">
            {(kbEntry.estimated_cost_min != null || kbEntry.estimated_cost_max != null) && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Est. Cost</p>
                <p className="text-sm font-semibold text-gray-900">
                  ${kbEntry.estimated_cost_min?.toLocaleString() || '?'} - $
                  {kbEntry.estimated_cost_max?.toLocaleString() || '?'}
                </p>
              </div>
            )}
            {kbEntry.timeline_days != null && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Timeline</p>
                <p className="text-sm font-semibold text-gray-900">{kbEntry.timeline_days} days</p>
              </div>
            )}
            {kbEntry.diy_difficulty && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Difficulty</p>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    DIFFICULTY_COLORS[kbEntry.diy_difficulty] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {DIFFICULTY_LABELS[kbEntry.diy_difficulty] || kbEntry.diy_difficulty}
                </span>
              </div>
            )}
            {kbEntry.ai_generated && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Source</p>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  AI Generated
                </span>
              </div>
            )}
          </div>

          {/* Required Docs */}
          {kbEntry.required_documents && kbEntry.required_documents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Required Documents</h3>
              <ul className="space-y-1">
                {kbEntry.required_documents.map((doc, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            No remedy found yet for this violation type.
          </p>
          <button
            onClick={triggerResearch}
            disabled={researchLoading}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {researchLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Finding remedy...
              </span>
            ) : (
              'Get Remedy'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
