'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { NotificationPref } from '@/lib/supabase/types';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPref[]>([]);
  const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [destError, setDestError] = useState('');

  function validateDestination(ch: string, dest: string): string {
    if (!dest.trim()) return 'This field is required.';
    if (ch === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dest)) return 'Please enter a valid email address.';
    }
    if (ch === 'sms' || ch === 'whatsapp') {
      const digits = dest.replace(/[\s\-().+]/g, '');
      if (!/^\d{10,15}$/.test(digits)) return `Please enter a valid ${ch === 'sms' ? 'phone' : 'WhatsApp'} number (10-15 digits).`;
    }
    return '';
  }

  useEffect(() => {
    loadPrefs();
  }, []);

  async function loadPrefs() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!tenant) return;
    setTenantId(tenant.id);

    const { data } = await supabase
      .from('notification_prefs')
      .select('*')
      .eq('tenant_id', tenant.id);

    setPrefs(data || []);
  }

  async function addPref(e: React.FormEvent) {
    e.preventDefault();
    if (!tenantId || !destination) return;

    const validationErr = validateDestination(channel, destination);
    if (validationErr) {
      setDestError(validationErr);
      return;
    }
    setDestError('');
    setLoading(true);

    // Normalize phone numbers: strip formatting for sms/whatsapp
    if (channel === 'sms' || channel === 'whatsapp') {
      const digits = destination.replace(/[\s\-().]/g, '');
      setDestination(digits.startsWith('+') ? digits : '+1' + digits.replace(/^\+/, ''));
    }

    const supabase = createClient();
    const { error } = await supabase.from('notification_prefs').insert({
      tenant_id: tenantId,
      channel,
      destination,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setDestination('');
      setMessage('Added!');
      await loadPrefs();
    }
    setLoading(false);
  }

  async function togglePref(id: string, enabled: boolean) {
    const supabase = createClient();
    await supabase.from('notification_prefs').update({ enabled: !enabled }).eq('id', id);
    await loadPrefs();
  }

  async function deletePref(id: string) {
    const supabase = createClient();
    await supabase.from('notification_prefs').delete().eq('id', id);
    await loadPrefs();
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Breadcrumbs items={[
          { label: 'Home', href: '/properties' },
          { label: 'Settings' },
        ]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your notification preferences and account.</p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Notification Channels</h2>
        <p className="text-sm text-gray-500 mb-4">
          Get notified when new violations are found on your properties.
        </p>

        {prefs.length > 0 && (
          <div className="space-y-2 mb-6">
            {prefs.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded uppercase shrink-0">
                    {p.channel}
                  </span>
                  <span className="text-sm truncate">{p.destination}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePref(p.id, p.enabled)}
                    className={`text-xs px-3 py-1.5 rounded min-h-[36px] min-w-[36px] ${
                      p.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {p.enabled ? 'On' : 'Off'}
                  </button>
                  <button
                    onClick={() => deletePref(p.id)}
                    className="text-xs text-red-600 hover:text-red-700 px-2 py-1.5 min-h-[36px]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={addPref} className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={channel}
              onChange={e => { setChannel(e.target.value as 'email' | 'sms' | 'whatsapp'); setDestError(''); }}
              className="border rounded-lg px-3 py-2.5 text-sm min-h-[44px]"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <input
              type="text"
              value={destination}
              onChange={e => { setDestination(e.target.value); setDestError(''); }}
              placeholder={channel === 'email' ? 'email@example.com' : '+1234567890'}
              className={`flex-1 px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none min-h-[44px] ${destError ? 'border-red-500' : ''}`}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 min-h-[44px]"
            >
              Add
            </button>
          </div>
          {destError && <p className="text-red-600 text-sm">{destError}</p>}
        </form>

        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </div>

      {/* Billing */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Billing</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your subscription, upgrade your plan, or view billing details.
            </p>
          </div>
          <Link
            href="/settings/billing"
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Manage Billing
          </Link>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Team</h2>
            <p className="text-sm text-gray-500 mt-1">
              Invite collaborators to view or manage your properties.
            </p>
          </div>
          <Link
            href="/settings/team"
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Manage Team
          </Link>
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <button
          onClick={handleLogout}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
