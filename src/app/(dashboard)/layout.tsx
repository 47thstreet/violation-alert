import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { MobileNav } from '@/components/mobile-nav';
import { GlobalSearch } from '@/components/global-search';
import { PageTransition } from '@/components/page-transition';
import { ScrollToTop } from '@/components/scroll-to-top';
import { NavigationProgress } from '@/components/navigation-progress';
import { KeyboardHints } from '@/components/keyboard-hints';
import { HeaderScrollShadow } from '@/components/header-scroll-shadow';

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
    <div className="min-h-screen bg-[#FAFAF9]">
      <NavigationProgress />
      <ScrollToTop />
      <KeyboardHints />
      <HeaderScrollShadow className="glass-nav sticky top-0 z-10 border-b border-gray-200/40 header-scroll-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-5 sm:gap-8">
              <Link href="/properties" className="text-xl font-bold text-gray-900 shrink-0 tracking-tight flex items-center gap-1.5">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">VA</span>
                Violation<span className="text-indigo-600">Alert</span>
              </Link>
              <DashboardNav />
            </div>
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="hidden sm:block w-64">
                <GlobalSearch />
              </div>
              <span className="text-sm text-gray-500 truncate hidden sm:inline max-w-[180px]">{tenant?.org_name || user.email}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0 ${
                tenant?.tier === 'pro' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {tenant?.tier || 'free'}
              </span>
            </div>
          </div>
        </div>
      </HeaderScrollShadow>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24 sm:pb-10">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
