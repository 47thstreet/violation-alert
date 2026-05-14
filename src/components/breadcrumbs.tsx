import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

function ChevronSeparator() {
  return (
    <svg
      className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      {/* Desktop: show all items */}
      <ol className="hidden sm:flex items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronSeparator />}
              {isLast || !item.href ? (
                <span className="font-medium text-indigo-700">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-gray-400 hover:text-gray-600 transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: show ellipsis + last 2 items */}
      <ol className="flex sm:hidden items-center gap-1.5 text-sm">
        {items.length > 2 && (
          <li className="flex items-center gap-1.5">
            <span className="text-gray-300">...</span>
            <ChevronSeparator />
          </li>
        )}
        {items.slice(-2).map((item, i, arr) => {
          const isLast = i === arr.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronSeparator />}
              {isLast || !item.href ? (
                <span className="font-medium text-gray-900 truncate max-w-[200px]">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-gray-400 hover:text-gray-600 transition-colors truncate max-w-[150px]">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
