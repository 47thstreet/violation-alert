'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type {
  Violation,
  Property,
  ViolationKnowledgeBase,
  ResolutionTracking,
  ResolutionStatus,
  ViolationAgency,
} from '@/lib/supabase/types';
import { ContractorMatch } from '@/components/contractor-match';

const STATUS_FLOW: ResolutionStatus[] = ['open', 'researching', 'in_progress', 'submitted', 'resolved'];

const STATUS_COLORS: Record<ResolutionStatus, string> = {
  open: 'bg-red-100 text-red-700',
  researching: 'bg-purple-100 text-purple-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  submitted: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  dismissed: 'bg-gray-100 text-gray-500',
};

const STATUS_LABELS: Record<ResolutionStatus, string> = {
  open: 'Open',
  researching: 'Researching',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-orange-100 text-orange-700',
  professional_only: 'bg-red-100 text-red-700',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  professional_only: 'Professional Only',
};

// Map violation source to agency type
function sourceToAgency(source: string): ViolationAgency {
  const map: Record<string, ViolationAgency> = {
    dob: 'DOB',
    hpd: 'HPD',
    ecb: 'ECB',
  };
  return map[source] || 'DOB';
}

export default function ViolationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [violationId, setViolationId] = useState<string | null>(null);
  const [violation, setViolation] = useState<Violation | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [kbEntry, setKbEntry] = useState<ViolationKnowledgeBase | null>(null);
  const [resolution, setResolution] = useState<ResolutionTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [kbLoading, setKbLoading] = useState(false);
  const [researchLoading, setResearchLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const supabase = createClient();

  // Unwrap params
  useEffect(() => {
    params.then(({ id }) => setViolationId(id));
  }, [params]);

  // Load violation data
  useEffect(() => {
    if (!violationId) return;

    async function load() {
      setLoading(true);

      // Get violation
      const { data: v } = await supabase
        .from('violations')
        .select('*')
        .eq('id', violationId!)
        .single();

      if (!v) {
        setLoading(false);
        return;
      }
      setViolation(v);

      // Get property
      const { data: p } = await supabase
        .from('properties')
        .select('*')
        .eq('id', v.property_id)
        .single();
      if (p) setProperty(p);

      // Get KB entry
      if (v.violation_type && v.source) {
        setKbLoading(true);
        const agency = sourceToAgency(v.source);
        const { data: kb } = await supabase
          .from('violation_knowledge_base')
          .select('*')
          .eq('violation_type', v.violation_type)
          .eq('agency', agency)
          .single();
        if (kb) setKbEntry(kb);
        setKbLoading(false);
      }

      // Get resolution tracking
      const { data: res } = await supabase
        .from('resolution_tracking')
        .select('*')
        .eq('violation_id', violationId!)
        .single();
      if (res) {
        setResolution(res);
      }

      setLoading(false);
    }

    load();
  }, [violationId]);

  async function triggerResearch() {
    if (!violation) return;
    setResearchLoading(true);
    try {
      const res = await fetch('/api/knowledge-base/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violation_type: violation.violation_type,
          violation_code: violation.violation_number,
          agency: sourceToAgency(violation.source),
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

  async function startResolution(method: 'diy' | 'hired_pro') {
    if (!violation || !violationId || !property) return;
    setStatusUpdating(true);

    // Get tenant
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!tenant) return;

    const { data: res } = await supabase
      .from('resolution_tracking')
      .insert({
        violation_id: violationId,
        property_id: property.id,
        tenant_id: tenant.id,
        status: 'in_progress' as ResolutionStatus,
        resolution_method: method,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (res) {
      setResolution(res);
    }

    setStatusUpdating(false);
  }

  async function advanceStatus() {
    if (!resolution) return;
    const currentIdx = STATUS_FLOW.indexOf(resolution.status);
    if (currentIdx < 0 || currentIdx >= STATUS_FLOW.length - 1) return;

    const nextStatus = STATUS_FLOW[currentIdx + 1];
    setStatusUpdating(true);

    const updates: Record<string, unknown> = { status: nextStatus, updated_at: new Date().toISOString() };
    if (nextStatus === 'submitted') updates.submitted_at = new Date().toISOString();
    if (nextStatus === 'resolved') updates.resolved_at = new Date().toISOString();

    await supabase
      .from('resolution_tracking')
      .update(updates)
      .eq('id', resolution.id);

    setResolution({ ...resolution, ...updates } as ResolutionTracking);
    setStatusUpdating(false);
  }

  async function dismissViolation() {
    if (!violation || !violationId || !property) return;
    setStatusUpdating(true);

    if (resolution) {
      await supabase
        .from('resolution_tracking')
        .update({ status: 'dismissed' as ResolutionStatus, updated_at: new Date().toISOString() })
        .eq('id', resolution.id);
      setResolution({ ...resolution, status: 'dismissed' as ResolutionStatus });
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!tenant) return;

      const { data: res } = await supabase
        .from('resolution_tracking')
        .insert({
          violation_id: violationId,
          property_id: property.id,
          tenant_id: tenant.id,
          status: 'dismissed' as ResolutionStatus,
          resolution_method: 'dismissed',
        })
        .select()
        .single();
      if (res) setResolution(res);
    }

    setStatusUpdating(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Violation not found</h2>
        <Link href="/violations" className="text-red-600 hover:text-red-700 text-sm">
          Back to violations
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/violations" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        &larr; Back to violations
      </Link>

      {/* Violation Header */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                {violation.source}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  violation.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {violation.status || 'Unknown'}
              </span>
              {violation.severity && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColor(violation.severity)}`}>
                  {violation.severity}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {violation.violation_type || violation.description || 'Violation Details'}
            </h1>
            {property && (
              <p className="text-sm text-gray-500 mt-1">
                <Link href={`/properties/${property.id}`} className="hover:text-gray-700 underline">
                  {property.address}
                </Link>
                {property.borough && ` - ${property.borough}`}
              </p>
            )}
          </div>
          {violation.penalty_amount != null && violation.penalty_amount > 0 && (
            <div className="bg-orange-50 rounded-lg px-4 py-3 text-right">
              <p className="text-xs text-orange-600">Penalty</p>
              <p className="text-2xl font-bold text-orange-700">
                ${violation.penalty_amount.toLocaleString()}
              </p>
              {violation.penalty_paid != null && violation.penalty_paid > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  ${violation.penalty_paid.toLocaleString()} paid
                </p>
              )}
            </div>
          )}
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <DetailItem label="Violation #" value={violation.violation_number} />
          <DetailItem label="Issued" value={violation.issued_date} />
          <DetailItem label="Disposition Date" value={violation.disposition_date} />
          <DetailItem label="Respondent" value={violation.respondent} />
        </div>

        {violation.description && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 font-medium mb-1">Description</p>
            <p className="text-sm text-gray-700">{violation.description}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* How to Fix Section */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Fix</h2>

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
                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {step.order}
                        </span>
                        <div className="pt-0.5">
                          <span className="text-gray-700">{step.instruction}</span>
                          {step.estimated_time && (
                            <span className="text-gray-400 text-xs ml-2">({step.estimated_time})</span>
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
                    <p className="text-xs text-gray-500">Est. Cost</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${kbEntry.estimated_cost_min?.toLocaleString() || '?'} - $
                      {kbEntry.estimated_cost_max?.toLocaleString() || '?'}
                    </p>
                  </div>
                )}
                {kbEntry.timeline_days != null && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Timeline</p>
                    <p className="text-sm font-semibold text-gray-900">{kbEntry.timeline_days} days</p>
                  </div>
                )}
                {kbEntry.diy_difficulty && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">DIY Difficulty</p>
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
                    <p className="text-xs text-gray-500">Source</p>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
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
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
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
                Researching this violation type...
              </p>
              <button
                onClick={triggerResearch}
                disabled={researchLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {researchLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Researching...
                  </span>
                ) : (
                  'Research with AI'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Resolution Status Section */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resolution Status</h2>

          {resolution && resolution.status !== 'dismissed' ? (
            <div className="space-y-5">
              {/* Status Flow */}
              <div className="flex items-center gap-1">
                {STATUS_FLOW.map((s, i) => {
                  const currentIdx = STATUS_FLOW.indexOf(resolution.status);
                  const isActive = i <= currentIdx;
                  const isCurrent = s === resolution.status;
                  return (
                    <div key={s} className="flex items-center gap-1 flex-1">
                      <div
                        className={`flex-1 h-2 rounded-full ${
                          isActive ? 'bg-red-500' : 'bg-gray-200'
                        } ${isCurrent ? 'ring-2 ring-red-300' : ''}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                {STATUS_FLOW.map((s) => (
                  <span key={s} className={s === resolution.status ? 'text-red-700 font-medium' : ''}>
                    {STATUS_LABELS[s]}
                  </span>
                ))}
              </div>

              {/* Current Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[resolution.status]}`}>
                  {STATUS_LABELS[resolution.status]}
                </span>
                {resolution.resolution_method && (
                  <span className="text-xs text-gray-500">
                    via {resolution.resolution_method === 'diy' ? 'DIY' : resolution.resolution_method === 'hired_pro' ? 'Contractor' : resolution.resolution_method}
                  </span>
                )}
              </div>

              {/* Timestamps */}
              <div className="space-y-1 text-xs text-gray-500">
                {resolution.started_at && (
                  <p>Started: {new Date(resolution.started_at).toLocaleString()}</p>
                )}
                {resolution.submitted_at && (
                  <p>Submitted: {new Date(resolution.submitted_at).toLocaleString()}</p>
                )}
                {resolution.resolved_at && (
                  <p>Resolved: {new Date(resolution.resolved_at).toLocaleString()}</p>
                )}
              </div>

              {/* Notes */}
              {resolution.resolution_notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{resolution.resolution_notes}</p>
                </div>
              )}

              {/* Advance Button */}
              {resolution.status !== 'resolved' && (
                <button
                  onClick={advanceStatus}
                  disabled={statusUpdating}
                  className="w-full border border-red-600 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {statusUpdating
                    ? 'Updating...'
                    : `Mark as ${STATUS_LABELS[STATUS_FLOW[STATUS_FLOW.indexOf(resolution.status) + 1]] || 'Next'}`}
                </button>
              )}
            </div>
          ) : resolution?.status === 'dismissed' ? (
            <div className="text-center py-6">
              <span className="bg-gray-100 text-gray-500 text-sm font-medium px-3 py-1 rounded-full">
                Dismissed
              </span>
              <p className="text-sm text-gray-500 mt-3">This violation has been dismissed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">No resolution started yet. Choose how to proceed:</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startResolution('diy')}
                  disabled={statusUpdating}
                  className="w-full bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Start Resolution (DIY)
                </button>
                <Link
                  href={`/marketplace${violation.violation_type ? `?type=${encodeURIComponent(violation.violation_type)}` : ''}`}
                  className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Hire a Pro
                </Link>
                <button
                  onClick={dismissViolation}
                  disabled={statusUpdating}
                  className="w-full text-gray-500 px-4 py-2 text-sm hover:text-gray-700 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hire a Pro -- Contractor Match */}
      {violation.violation_type && (
        <div className="mt-6">
          <ContractorMatch
            violationType={violation.violation_type}
            borough={property?.borough || null}
          />
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || 'N/A'}</p>
    </div>
  );
}

function severityColor(severity: string): string {
  const colors: Record<string, string> = {
    'immediately-hazardous': 'bg-red-100 text-red-700',
    hazardous: 'bg-orange-100 text-orange-700',
    'non-hazardous': 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    SERIOUS: 'bg-red-100 text-red-700',
    'NON-SERIOUS': 'bg-yellow-100 text-yellow-700',
  };
  return colors[severity] || 'bg-gray-100 text-gray-700';
}
