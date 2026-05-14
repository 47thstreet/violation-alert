'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
  if (score <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/4' };
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const router = useRouter();

  const emailError = emailTouched && email && !isValidEmail(email) ? 'Please enter a valid email address.' : '';
  const pwStrength = password ? getPasswordStrength(password) : null;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { org_name: orgName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user && !data.session) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    // Auto-confirmed, update org name
    if (data.user) {
      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('user_id', data.user.id)
        .single();

      if (tenant) {
        await supabase
          .from('tenants')
          .update({ org_name: orgName })
          .eq('id', tenant.id);
      }
    }

    router.push('/properties');
    router.refresh();
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Check your email</h2>
          <p className="text-gray-500">We sent a confirmation link to <strong>{email}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ViolationAlert</h1>
          <p className="text-gray-500 mt-2">Never miss a building violation again</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-semibold">Create account</h2>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company / Org name <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-h-[44px] text-base sm:text-sm"
              placeholder="Brooklyn Properties LLC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              required
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-h-[44px] text-base sm:text-sm ${emailError ? 'border-red-500' : ''}`}
              placeholder="you@company.com"
            />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-h-[44px] text-base sm:text-sm"
              placeholder="Min 8 characters"
            />
            {pwStrength && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pwStrength.color} ${pwStrength.width}`} />
                </div>
                <p className={`text-xs mt-1 ${pwStrength.color === 'bg-red-500' ? 'text-red-600' : pwStrength.color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {pwStrength.label}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors min-h-[48px]"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-red-600 font-medium hover:underline">Sign in</Link>
          </p>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Free plan includes 3 properties. Upgrade anytime.
        </p>
      </div>
    </div>
  );
}
