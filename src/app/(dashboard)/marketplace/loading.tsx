import { SkeletonText, SkeletonCard } from '@/components/skeleton';

export default function MarketplaceLoading() {
  return (
    <div>
      <SkeletonText width="w-56" height="h-7 mb-2" />
      <SkeletonText width="w-80" height="h-4 mb-6" />

      {/* Filter bar */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="bg-gray-200 animate-pulse rounded-lg w-full h-[44px]" />
          </div>
          <div className="bg-gray-200 animate-pulse rounded-lg w-full h-[44px]" />
          <div className="bg-gray-200 animate-pulse rounded-lg w-full h-[44px]" />
          <div className="bg-gray-200 animate-pulse rounded-lg w-full h-[44px]" />
        </div>
      </div>

      {/* Results count */}
      <SkeletonText width="w-36" height="h-4 mb-4" />

      {/* Contractor cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
