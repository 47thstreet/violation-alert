import Link from 'next/link';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center">
      <div className="w-12 h-12 flex items-center justify-center text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-md mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-block bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* ---- Inline SVG Icons (48px viewBox, no icon library) ---- */

export function BuildingIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="6" width="20" height="36" rx="2" />
      <rect x="28" y="16" width="12" height="26" rx="2" />
      <line x1="14" y1="12" x2="22" y2="12" />
      <line x1="14" y1="18" x2="22" y2="18" />
      <line x1="14" y1="24" x2="22" y2="24" />
      <line x1="14" y1="30" x2="22" y2="30" />
      <line x1="33" y1="22" x2="36" y2="22" />
      <line x1="33" y1="28" x2="36" y2="28" />
      <line x1="33" y1="34" x2="36" y2="34" />
      <rect x="18" y="36" width="6" height="6" />
    </svg>
  );
}

export function CheckmarkIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="18" />
      <path d="M15 24l6 6 12-12" />
    </svg>
  );
}

export function BriefcaseIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="16" width="36" height="22" rx="3" />
      <path d="M18 16V12a4 4 0 014-4h4a4 4 0 014 4v4" />
      <line x1="6" y1="26" x2="42" y2="26" />
    </svg>
  );
}

export function UsersIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="16" r="6" />
      <path d="M6 38c0-6.627 5.373-12 12-12s12 5.373 12 12" />
      <circle cx="34" cy="18" r="5" />
      <path d="M34 26c5.523 0 10 4.477 10 10" />
    </svg>
  );
}
