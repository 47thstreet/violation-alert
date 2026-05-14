'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import type { SubscriptionTier } from '@/lib/supabase/types';
import { TIER_LABELS, PLAN_FEATURES } from '@/lib/tier-limits';

const TIER_BADGE_COLORS: Record<SubscriptionTier, string> = {
  free: 'bg-gray-100 text-gray-700',
  pro: 'bg-red-100 text-red-700',
  enterprise: 'bg-purple-100 text-purple-700',
};

export default function BillingPage() {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBillingData();

    // Check for success/cancelled query params
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setMessage('Subscription activated! Your account has been upgraded.');
    } else if (params.get('cancelled') === 'true') {
      setMessage('Checkout cancelled. No changes were made.');
    }
  }, []);

  async function loadBillingData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, tier, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!tenant) return;

    setTier(tenant.tier as SubscriptionTier);
    setStripeCustomerId(tenant.stripe_customer_id as string | null);

    // Get property count
    const { count } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id);

    setPropertyCount(count || 0);
    setLoading(false);
  }

  async function handleUpgrade(targetTier: 'pro' | 'enterprise') {
    setActionLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: targetTier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Failed to start checkout');
        setActionLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setMessage('Something went wrong. Please try again.');
      setActionLoading(false);
    }
  }

  async function handleManageSubscription() {
    setActionLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Failed to open billing portal');
        setActionLoading(false);
        return;
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch {
      setMessage('Something went wrong. Please try again.');
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', href: '/properties' },
            { label: 'Settings', href: '/settings' },
            { label: 'Billing' },
          ]} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing</h1>
        </div>
        <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
          Loading billing information...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Breadcrumbs items={[
          { label: 'Home', href: '/properties' },
          { label: 'Settings', href: '/settings' },
          { label: 'Billing' },
        ]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-500 text-sm">Manage your subscription and billing details.</p>
      </div>

      {message && (
        <div className={`rounded-lg p-4 text-sm ${
          message.includes('cancelled') || message.includes('wrong') || message.includes('Failed')
            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            : 'bg-green-50 text-green-800 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${TIER_BADGE_COLORS[tier]}`}>
                {TIER_LABELS[tier]}
              </span>
              {tier === 'pro' && (
                <span className="text-sm text-gray-500">$29/mo</span>
              )}
            </div>
          </div>
          {tier === 'free' ? (
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={actionLoading}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {actionLoading ? 'Loading...' : 'Upgrade to Pro'}
            </button>
          ) : stripeCustomerId ? (
            <button
              onClick={handleManageSubscription}
              disabled={actionLoading}
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {actionLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
          ) : null}
        </div>

        {/* Usage */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Properties used</span>
            <span className="font-semibold text-gray-900">
              {propertyCount} / {tier === 'free' ? '3' : 'Unlimited'}
            </span>
          </div>
          {tier === 'free' && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((propertyCount / 3) * 100, 100)}%` }}
                />
              </div>
              {propertyCount >= 3 && (
                <p className="text-xs text-red-600 mt-1">
                  You&apos;ve reached the free plan limit. Upgrade to add more properties.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Compare Plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Free */}
          <div className={`rounded-xl border p-5 ${tier === 'free' ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}>
            <h3 className="font-semibold text-gray-900">Free</h3>
            <p className="text-2xl font-bold mt-1">$0<span className="text-sm text-gray-400 font-normal">/mo</span></p>
            <ul className="mt-4 space-y-2">
              {PLAN_FEATURES.free.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {tier === 'free' && (
              <div className="mt-4 text-center text-xs text-gray-400 font-medium uppercase">Current plan</div>
            )}
          </div>

          {/* Pro */}
          <div className={`rounded-xl border-2 p-5 ${tier === 'pro' ? 'border-red-600 bg-red-50/30' : 'border-red-300'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Pro</h3>
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">Popular</span>
            </div>
            <p className="text-2xl font-bold mt-1">$29<span className="text-sm text-gray-400 font-normal">/mo</span></p>
            <ul className="mt-4 space-y-2">
              {PLAN_FEATURES.pro.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {tier === 'pro' ? (
              <div className="mt-4 text-center text-xs text-red-600 font-medium uppercase">Current plan</div>
            ) : tier === 'free' ? (
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={actionLoading}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Upgrade
              </button>
            ) : null}
          </div>

          {/* Enterprise */}
          <div className={`rounded-xl border p-5 ${tier === 'enterprise' ? 'border-purple-400 bg-purple-50/30' : 'border-gray-200'}`}>
            <h3 className="font-semibold text-gray-900">Enterprise</h3>
            <p className="text-2xl font-bold mt-1">Custom</p>
            <ul className="mt-4 space-y-2">
              {PLAN_FEATURES.enterprise.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {tier === 'enterprise' ? (
              <div className="mt-4 text-center text-xs text-purple-600 font-medium uppercase">Current plan</div>
            ) : (
              <a
                href="mailto:sales@violationalert.com"
                className="mt-4 block w-full text-center border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Contact Sales
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
