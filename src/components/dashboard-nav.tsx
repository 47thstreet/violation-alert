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

  return (
    <nav className="flex gap-1">
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
    </nav>
  );
}
