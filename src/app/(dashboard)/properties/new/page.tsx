'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/toast';
import { Breadcrumbs } from '@/components/breadcrumbs';

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

export default function NewPropertyPage() {
  const [address, setAddress] = useState('');
  const [resolved, setResolved] = useState<ResolvedAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [newPropertyId, setNewPropertyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  async function handleResolve() {
    setAddressError('');
    setDuplicateId(null);

    if (!address.trim()) {
      setAddressError('Please enter an address.');
      return;
    }

    setResolving(true);
    setError('');
    setResolved(null);
    setScanResult(null);
    setNewPropertyId(null);

    try {
      const res = await fetch('/api/properties/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();

      if (!res.ok) {
        setAddressError("We couldn't find this address. Make sure it's a valid NYC address.");
      } else if (!data.bin && !data.bbl) {
        setAddressError("We couldn't find this address. Make sure it's a valid NYC address.");
      } else {
        // Check for duplicate BIN in user's properties
        if (data.bin) {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: tenant } = await supabase
              .from('tenants')
              .select('id')
              .eq('user_id', user.id)
              .single();
            if (tenant) {
              const { data: existing } = await supabase
                .from('properties')
                .select('id')
                .eq('bin', data.bin)
                .eq('tenant_id', tenant.id);
              if (existing && existing.length > 0) {
                setDuplicateId(existing[0].id);
                setResolved(data);
                setResolving(false);
                return;
              }
            }
          }
        }
        setResolved(data);
      }
    } catch {
      setError('Network error');
    }
    setResolving(false);
  }

  async function handleAdd() {
    if (!resolved) return;
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not logged in'); setLoading(false); return; }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!tenant) { setError('No tenant found'); setLoading(false); return; }

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
      setLoading(false);
      return;
    }

    setNewPropertyId(inserted.id);
    setLoading(false);
    toast.success('Property added successfully');

    // Immediately trigger a scan
    setScanning(true);
    try {
      const res = await fetch('/api/properties/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: inserted.id }),
      });
      const data = await res.json();
      setScanResult(data);
      toast.info(`Scan complete — found ${data.violations_found} violation${data.violations_found !== 1 ? 's' : ''}`);
    } catch {
      setScanResult({ violations_found: 0, agencies_count: 0, errors: ['Scan failed — violations will appear after the next polling cycle'] });
    }
    setScanning(false);
  }

  return (
    <div className="max-w-lg">
      <Breadcrumbs items={[
        { label: 'Home', href: '/properties' },
        { label: 'Properties', href: '/properties' },
        { label: 'Add Property' },
      ]} />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Property</h1>
      <p className="text-gray-600 mb-6">Enter an NYC address to look up the building and start monitoring.</p>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      {/* Scan results after adding */}
      {scanning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="font-semibold text-blue-800">Scanning for violations...</p>
          <p className="text-sm text-blue-600 mt-1">Checking DOB, HPD, ECB, FDNY, DSNY, DOT, and more</p>
        </div>
      )}

      {scanResult && newPropertyId && !scanning && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
          <p className="font-semibold text-green-800 text-lg">Property added successfully</p>
          <p className="text-green-700 mt-1">
            Found {scanResult.violations_found} violation{scanResult.violations_found !== 1 ? 's' : ''}
            {scanResult.agencies_count > 0 && ` across ${scanResult.agencies_count} agenc${scanResult.agencies_count !== 1 ? 'ies' : 'y'}`}
          </p>
          {scanResult.errors.length > 0 && (
            <p className="text-orange-600 text-sm mt-2">
              {scanResult.errors.length} agency error{scanResult.errors.length !== 1 ? 's' : ''} (partial results)
            </p>
          )}
          <div className="flex gap-3 mt-4">
            <Link
              href={`/properties/${newPropertyId}`}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              View Property
            </Link>
            <Link
              href="/properties"
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              All Properties
            </Link>
          </div>
        </div>
      )}

      {/* Hide the form once scan results are shown */}
      {!scanResult && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NYC Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={e => { setAddress(e.target.value); setAddressError(''); setDuplicateId(null); }}
                placeholder="123 Main Street, Brooklyn, NY"
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none ${addressError ? 'border-red-500' : ''}`}
                onKeyDown={e => e.key === 'Enter' && handleResolve()}
              />
              <button
                onClick={handleResolve}
                disabled={resolving || address.length < 5}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {resolving ? 'Looking up...' : 'Look up'}
              </button>
            </div>
            {addressError && <p className="text-red-600 text-sm mt-1">{addressError}</p>}
          </div>

          {duplicateId && resolved && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-yellow-800">This property is already in your account</p>
              <p className="text-sm text-yellow-700">{resolved.label}</p>
              <Link
                href={`/properties/${duplicateId}`}
                className="inline-block mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
              >
                View Existing Property
              </Link>
            </div>
          )}

          {resolved && !duplicateId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-green-800">{resolved.label}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                {resolved.bin && <p>BIN: {resolved.bin}</p>}
                {resolved.bbl && <p>BBL: {resolved.bbl}</p>}
                {resolved.borough && <p>Borough: {resolved.borough}</p>}
                {resolved.zip && <p>ZIP: {resolved.zip}</p>}
              </div>
              <button
                onClick={handleAdd}
                disabled={loading || scanning}
                className="mt-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {loading ? 'Adding...' : 'Add This Property'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
