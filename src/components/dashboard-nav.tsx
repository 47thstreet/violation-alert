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
    <nav className="hidden sm:flex gap-0.5">
      {navItems.map(item => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      {isCrmPage && (
        <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-900">
          CRM
        </span>
      )}
    </nav>
  );
}
