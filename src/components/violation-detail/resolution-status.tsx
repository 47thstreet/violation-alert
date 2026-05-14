'use client';

import Link from 'next/link';
import type { ResolutionTracking, ResolutionStatus, Violation, Property } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

const STATUS_FLOW: ResolutionStatus[] = ['open', 'researching', 'in_progress', 'submitted', 'resolved'];

const STATUS_COLORS: Record<ResolutionStatus, string> = {
  open: 'bg-red-50 text-red-600',
  researching: 'bg-purple-50 text-purple-600',
  in_progress: 'bg-amber-50 text-amber-700',
  submitted: 'bg-blue-50 text-blue-600',
  resolved: 'bg-emerald-50 text-emerald-700',
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

interface ResolutionStatusProps {
  violation: Violation;
  violationId: string;
  property: Property;
  initialResolution: ResolutionTracking | null;
}

export function ResolutionStatusSection({
  violation,
  violationId,
  property,
  initialResolution,
}: ResolutionStatusProps) {
  const [resolution, setResolution] = useState<ResolutionTracking | null>(initialResolution);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const supabase = createClient();

  async function startResolution(method: 'diy' | 'hired_pro') {
    setStatusUpdating(true);
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

    if (res) setResolution(res);
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-base font-semibold text-gray-900 mb-5">Resolution Status</h2>

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
                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-gray-900' : 'bg-gray-200'
                    } ${isCurrent ? 'ring-2 ring-gray-300' : ''}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
            {STATUS_FLOW.map((s) => (
              <span key={s} className={`text-center ${s === resolution.status ? 'text-gray-900 font-medium' : ''}`}>
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
            {resolution.started_at && <p>Started: {new Date(resolution.started_at).toLocaleString()}</p>}
            {resolution.submitted_at && <p>Submitted: {new Date(resolution.submitted_at).toLocaleString()}</p>}
            {resolution.resolved_at && <p>Resolved: {new Date(resolution.resolved_at).toLocaleString()}</p>}
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
              className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 transition-all"
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
        <div className="space-y-4">
          <p className="text-sm text-gray-500">No resolution started yet. Choose how to proceed:</p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => startResolution('diy')}
              disabled={statusUpdating}
              className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              Start Resolution (DIY)
            </button>
            <Link
              href={`/marketplace${violation.violation_type ? `?type=${encodeURIComponent(violation.violation_type)}` : ''}`}
              className="w-full border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Hire a Pro
            </Link>
            <button
              onClick={dismissViolation}
              disabled={statusUpdating}
              className="w-full text-gray-400 px-4 py-2 text-sm hover:text-gray-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
