import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { MobileNav } from '@/components/mobile-nav';
import { GlobalSearch } from '@/components/global-search';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#f8f8fa]">
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-5 sm:gap-8">
              <Link href="/properties" className="text-xl font-bold text-gray-900 shrink-0 tracking-tight">
                Violation<span className="text-red-600">Alert</span>
              </Link>
              <DashboardNav />
            </div>
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="hidden sm:block w-64">
                <GlobalSearch />
              </div>
              <span className="text-sm text-gray-500 truncate hidden sm:inline max-w-[180px]">{tenant?.org_name || user.email}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0 ${
                tenant?.tier === 'pro' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {tenant?.tier || 'free'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24 sm:pb-10">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
