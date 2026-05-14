import { SkeletonCard, SkeletonText } from '@/components/skeleton';

export default function PropertiesLoading() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <SkeletonText width="w-40" height="h-7" />
          <SkeletonText width="w-48" height="h-4 mt-2" />
        </div>
        <div className="bg-gray-200 animate-pulse rounded-lg w-32 h-[44px]" />
      </div>

      {/* Stat widgets row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-4">
            <SkeletonText width="w-20" height="h-3" />
            <SkeletonText width="w-12" height="h-6 mt-2" />
          </div>
        ))}
      </div>

      {/* Property cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
