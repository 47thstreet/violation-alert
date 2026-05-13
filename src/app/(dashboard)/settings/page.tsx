'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { NotificationPref } from '@/lib/supabase/types';

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPref[]>([]);
  const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string>('');
  const [message, setMessage] = useState('');

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
    setLoading(true);

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
              <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded uppercase">
                    {p.channel}
                  </span>
                  <span className="text-sm">{p.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePref(p.id, p.enabled)}
                    className={`text-xs px-2 py-1 rounded ${
                      p.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {p.enabled ? 'On' : 'Off'}
                  </button>
                  <button
                    onClick={() => deletePref(p.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={addPref} className="flex gap-2">
          <select
            value={channel}
            onChange={e => setChannel(e.target.value as 'email' | 'sms' | 'whatsapp')}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder={channel === 'email' ? 'email@example.com' : '+1234567890'}
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
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
