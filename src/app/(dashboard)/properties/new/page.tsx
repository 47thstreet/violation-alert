'use client';

import { useState } from 'react';
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

export default function NewPropertyPage() {
  const [address, setAddress] = useState('');
  const [resolved, setResolved] = useState<ResolvedAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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

    const { error: insertError } = await supabase.from('properties').insert({
      tenant_id: tenant.id,
      address: resolved.label,
      borough: resolved.borough,
      bin: resolved.bin,
      bbl: resolved.bbl,
      zip: resolved.zip,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/properties');
      router.refresh();
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Property</h1>
      <p className="text-gray-500 mb-6">Enter an NYC address to look up the building and start monitoring.</p>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NYC Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main Street, Brooklyn, NY"
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
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
        </div>

        {resolved && (
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
              disabled={loading}
              className="mt-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add This Property'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
