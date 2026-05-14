'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import type {
  Violation,
  Property,
  ViolationKnowledgeBase,
  ResolutionTracking,
  ViolationAgency,
} from '@/lib/supabase/types';
import { ContractorMatch } from '@/components/contractor-match';
import { ViolationNotes } from '@/components/violation-notes';
import { ViolationActivity } from '@/components/violation-activity';
import { HowToFixSection } from '@/components/violation-detail/how-to-fix';
import { ResolutionStatusSection } from '@/components/violation-detail/resolution-status';
import { useToast } from '@/components/toast';

/** Map violation source string to agency enum */
function sourceToAgency(source: string): ViolationAgency {
  const map: Record<string, ViolationAgency> = {
    dob: 'DOB',
    hpd: 'HPD',
    ecb: 'ECB',
  };
  return map[source] || 'DOB';
}

function severityColor(severity: string): string {
  const colors: Record<string, string> = {
    'immediately-hazardous': 'bg-red-50 text-red-600',
    hazardous: 'bg-amber-50 text-amber-700',
    'non-hazardous': 'bg-gray-100 text-gray-600',
    info: 'bg-blue-50 text-blue-600',
    SERIOUS: 'bg-red-50 text-red-600',
    'NON-SERIOUS': 'bg-gray-100 text-gray-600',
  };
  return colors[severity] || 'bg-gray-100 text-gray-500';
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-900 mt-1">{value || '--'}</p>
    </div>
  );
}

export default function ViolationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [violationId, setViolationId] = useState<string | null>(null);
  const [violation, setViolation] = useState<Violation | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [kbEntry, setKbEntry] = useState<ViolationKnowledgeBase | null>(null);
  const [resolution, setResolution] = useState<ResolutionTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [kbLoading, setKbLoading] = useState(false);
  const [activeNotesTab, setActiveNotesTab] = useState<'notes' | 'activity'>('notes');
  const [tenantId, setTenantId] = useState<string | null>(null);

  const supabase = createClient();
  const { toast } = useToast();

  // Unwrap params
  useEffect(() => {
    params.then(({ id }) => setViolationId(id));
  }, [params]);

  // Load all violation data -- parallelize independent queries
  useEffect(() => {
    if (!violationId) return;

    async function load() {
      setLoading(true);
      setLoadError(null);

      try {
        // 1. Get violation first (everything depends on it)
        const { data: v, error: vError } = await supabase
          .from('violations')
          .select('*')
          .eq('id', violationId!)
          .single();

        if (vError) {
          toast.error('Failed to load violation details');
          setLoadError('Could not load violation data. Please try again.');
          setLoading(false);
          return;
        }

        if (!v) {
          setLoading(false);
          return;
        }
        setViolation(v);

        // 2. Fire parallel requests for property, tenant, and resolution
        const [propertyResult, tenantResult, resolutionResult] = await Promise.all([
          supabase.from('properties').select('*').eq('id', v.property_id).single()
            .then(res => {
              if (res.error) toast.error('Failed to load property info');
              return res;
            }),
          supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return null;
            const { data: t, error: tErr } = await supabase
              .from('tenants')
              .select('id')
              .eq('user_id', user.id)
              .single();
            if (tErr) toast.error('Failed to load tenant info');
            return t;
          }),
          supabase
            .from('resolution_tracking')
            .select('*')
            .eq('violation_id', violationId!)
            .single()
            .then(res => {
              // Not an error if no resolution exists yet (PGRST116)
              if (res.error && res.error.code !== 'PGRST116') {
                toast.error('Failed to load resolution status');
              }
              return res;
            }),
        ]);

        if (propertyResult.data) setProperty(propertyResult.data);
        if (tenantResult) setTenantId(tenantResult.id);
        if (resolutionResult.data) setResolution(resolutionResult.data);

        // 3. KB lookup (depends on violation data)
        if (v.violation_type && v.source) {
          setKbLoading(true);
          try {
            const agency = sourceToAgency(v.source);
            const { data: kb } = await supabase
              .from('violation_knowledge_base')
              .select('*')
              .eq('violation_type', v.violation_type)
              .eq('agency', agency)
              .single();
            if (kb) setKbEntry(kb);
          } catch {
            // KB lookup is non-critical, silently fail
          }
          setKbLoading(false);
        }
      } catch (err) {
        console.error('Violation detail load error:', err);
        toast.error('Something went wrong loading this violation');
        setLoadError('An unexpected error occurred. Please try again.');
      }

      setLoading(false);
    }

    load();
  }, [violationId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load violation</h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">{loadError}</p>
        <Link href="/violations" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-[0.97] transition-all">
          Back to violations
        </Link>
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Violation not found</h2>
        <Link href="/violations" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-sm">
          Back to violations
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Home', href: '/properties' },
        { label: 'Violations', href: '/violations' },
        { label: violation.violation_type || violation.description || 'Violation Details' },
      ]} />

      {/* Violation Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {violation.source}
              </span>
              <span className="text-gray-200">|</span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  violation.status === 'open' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {violation.status || 'Unknown'}
              </span>
              {violation.severity && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${severityColor(violation.severity)}`}>
                  {violation.severity}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {violation.violation_type || violation.description || 'Violation Details'}
            </h1>
            {property && (
              <p className="text-sm text-gray-400">
                <Link href={`/properties/${property.id}`} className="hover:text-gray-600 transition-colors">
                  {property.address}
                </Link>
                {property.borough && ` \u2014 ${property.borough}`}
              </p>
            )}
          </div>
          {violation.penalty_amount != null && violation.penalty_amount > 0 && (
            <div className="text-right">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Penalty</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">
                ${violation.penalty_amount.toLocaleString()}
              </p>
              {violation.penalty_paid != null && violation.penalty_paid > 0 && (
                <p className="text-xs text-emerald-600 mt-1 tabular-nums">
                  ${violation.penalty_paid.toLocaleString()} paid
                </p>
              )}
            </div>
          )}
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-100">
          <DetailItem label="Violation #" value={violation.violation_number} />
          <DetailItem label="Issued" value={violation.issued_date} />
          <DetailItem label="Disposition Date" value={violation.disposition_date} />
          <DetailItem label="Respondent" value={violation.respondent} />
        </div>

        {violation.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{violation.description}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* How to Fix -- extracted component */}
        <HowToFixSection
          violationType={violation.violation_type}
          violationNumber={violation.violation_number}
          agency={sourceToAgency(violation.source)}
          initialKbEntry={kbEntry}
          kbLoading={kbLoading}
        />

        {/* Resolution Status -- extracted component */}
        {property && (
          <ResolutionStatusSection
            violation={violation}
            violationId={violationId!}
            property={property}
            initialResolution={resolution}
          />
        )}
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

      {/* Notes & Activity Section */}
      {tenantId && violation.property_id && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-100">
            <button
              onClick={() => setActiveNotesTab('notes')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeNotesTab === 'notes'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveNotesTab('activity')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeNotesTab === 'activity'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Activity
            </button>
          </div>

          {activeNotesTab === 'notes' ? (
            <ViolationNotes
              violationSourceId={violation.source_id}
              propertyId={violation.property_id}
              tenantId={tenantId}
            />
          ) : (
            <ViolationActivity
              violationId={violationId!}
              violationSourceId={violation.source_id}
            />
          )}
        </div>
      )}
    </div>
  );
}
