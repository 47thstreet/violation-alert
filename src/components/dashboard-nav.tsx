'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/properties', label: 'Properties' },
  { href: '/violations', label: 'Violations' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/settings', label: 'Settings' },
];

export function DashboardNav() {
  const pathname = usePathname();
  const isCrmPage = pathname.includes('/crm');

  return (
    <nav className="hidden sm:flex gap-1">
      {navItems.map(item => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-red-50 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      {isCrmPage && (
        <span className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700">
          CRM
        </span>
      )}
    </nav>
  );
}
