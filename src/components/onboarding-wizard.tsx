'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface ResolvedAddress {
  bin: string | null;
  bbl: string | null;
  borough: string | null;
  zip: string | null;
  houseNumber: string | null;
  street: string | null;
  label: string;
}

interface ScanResult {
  violations_found: number;
  agencies_count: number;
  errors: string[];
}

const AGENCIES = [
  'DOB — Dept. of Buildings',
  'HPD — Housing Preservation',
  'ECB — Environmental Control',
  'FDNY — Fire Department',
  'DSNY — Sanitation',
  'DOT — Transportation',
  'DEP — Environmental Protection',
  'DCA — Consumer Affairs',
  'DOH — Health & Mental Hygiene',
  'Landmarks Preservation',
  'SBS — Small Business Services',
];

const ONBOARDING_KEY = 'violationalert_onboarding_complete';

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [resolved, setResolved] = useState<ResolvedAddress | null>(null);
  const [resolving, setResolving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [currentAgency, setCurrentAgency] = useState(0);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  // Cycle through agencies during scanning
  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setCurrentAgency(prev => (prev + 1) % AGENCIES.length);
    }, 800);
    return () => clearInterval(interval);
  }, [scanning]);

  const markComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setDismissed(true);
    router.refresh();
  }, [router]);

  async function handleResolve() {
    setResolving(true);
    setError('');
    setResolved(null);

    try {
      const res = await fetch('/api/properties/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not resolve address');
      } else {
        setResolved(data);
      }
    } catch {
      setError('Network error — please try again');
    }
    setResolving(false);
  }

  async function handleAddAndScan() {
    if (!resolved) return;
    setAdding(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not logged in'); setAdding(false); return; }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!tenant) { setError('No tenant found'); setAdding(false); return; }

    const { data: inserted, error: insertError } = await supabase.from('properties').insert({
      tenant_id: tenant.id,
      address: resolved.label,
      borough: resolved.borough,
      bin: resolved.bin,
      bbl: resolved.bbl,
      zip: resolved.zip,
    }).select('id').single();

    if (insertError || !inserted) {
      setError(insertError?.message || 'Failed to add property');
      setAdding(false);
      return;
    }

    setAdding(false);
    setStep(3);
    setScanning(true);

    try {
      const res = await fetch('/api/properties/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: inserted.id }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch {
      setScanResult({ violations_found: 0, agencies_count: 0, errors: ['Scan failed'] });
    }

    setScanning(false);
    setStep(4);
  }

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 pt-6 pb-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-red-600' : s < step ? 'w-2 bg-red-300' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Skip button (steps 1-2 only) */}
        {step <= 2 && (
          <div className="flex justify-end px-6 pt-1">
            <button
              onClick={markComplete}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip
            </button>
          </div>
        )}

        <div className="px-8 pb-8 pt-2">
          {/* ---- Step 1: Welcome ---- */}
          {step === 1 && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="6" width="20" height="36" rx="2" />
                  <rect x="28" y="16" width="12" height="26" rx="2" />
                  <line x1="14" y1="12" x2="22" y2="12" />
                  <line x1="14" y1="18" x2="22" y2="18" />
                  <line x1="14" y1="24" x2="22" y2="24" />
                  <line x1="14" y1="30" x2="22" y2="30" />
                  <line x1="33" y1="22" x2="36" y2="22" />
                  <line x1="33" y1="28" x2="36" y2="28" />
                  <line x1="33" y1="34" x2="36" y2="34" />
                  <rect x="18" y="36" width="6" height="6" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome to ViolationAlert!</h2>
                <p className="text-gray-500 mt-2 leading-relaxed">
                  We monitor violations from 10+ NYC agencies so you never get blindsided.
                </p>
                <p className="text-gray-500 mt-1 leading-relaxed">
                  Let&apos;s add your first property to get started.
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 active:scale-[0.98] transition-all w-full"
              >
                Get Started
              </button>
            </div>
          )}

          {/* ---- Step 2: Add Property ---- */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Add Your First Property</h2>
                <p className="text-gray-500 text-sm mt-1">Enter an NYC address to look up the building.</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">NYC Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="123 Main Street, Brooklyn, NY"
                    className="flex-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                    onKeyDown={e => e.key === 'Enter' && address.length >= 5 && handleResolve()}
                  />
                  <button
                    onClick={handleResolve}
                    disabled={resolving || address.length < 5}
                    className="bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap text-sm"
                  >
                    {resolving ? 'Looking up...' : 'Look up'}
                  </button>
                </div>
              </div>

              {resolved && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <p className="font-semibold text-green-800">{resolved.label}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                    {resolved.bin && <p>BIN: {resolved.bin}</p>}
                    {resolved.bbl && <p>BBL: {resolved.bbl}</p>}
                    {resolved.borough && <p>Borough: {resolved.borough}</p>}
                    {resolved.zip && <p>ZIP: {resolved.zip}</p>}
                  </div>
                  <button
                    onClick={handleAddAndScan}
                    disabled={adding}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors w-full"
                  >
                    {adding ? 'Adding...' : 'Add & Scan'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---- Step 3: Scanning ---- */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-red-100" />
                <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Scanning 10+ NYC agencies for violations...</h2>
                <div className="mt-4 h-6 flex items-center justify-center">
                  <p className="text-red-600 font-medium text-sm transition-opacity duration-300">
                    {AGENCIES[currentAgency]}
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ---- Step 4: Done ---- */}
          {step === 4 && scanResult && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="18" />
                  <path d="M15 24l6 6 12-12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">You&apos;re all set!</h2>
                <div className="mt-3 space-y-1">
                  <p className="text-gray-600">
                    Property added: <span className="font-semibold text-gray-900">{resolved?.label}</span>
                  </p>
                  <p className="text-gray-600">
                    Found{' '}
                    <span className="font-semibold text-gray-900">
                      {scanResult.violations_found} violation{scanResult.violations_found !== 1 ? 's' : ''}
                    </span>
                    {scanResult.agencies_count > 0 && (
                      <>
                        {' '}across{' '}
                        <span className="font-semibold text-gray-900">
                          {scanResult.agencies_count} agenc{scanResult.agencies_count !== 1 ? 'ies' : 'y'}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  We&apos;ll scan daily and alert you to new violations.
                </p>
              </div>
              <button
                onClick={markComplete}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 active:scale-[0.98] transition-all w-full"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inline animation styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

/** Check if the onboarding wizard has been completed */
export function useOnboardingComplete() {
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    setComplete(localStorage.getItem(ONBOARDING_KEY) === 'true');
  }, []);

  return complete;
}
