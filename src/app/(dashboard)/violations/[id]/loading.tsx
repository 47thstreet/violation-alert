import { SkeletonText } from '@/components/skeleton';

export default function ViolationDetailLoading() {
  return (
    <div>
      {/* Back link */}
      <SkeletonText width="w-32" height="h-4 mb-4" />

      {/* Violation header card */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gray-200 animate-pulse rounded w-12 h-5" />
              <div className="bg-gray-200 animate-pulse rounded-full w-14 h-5" />
              <div className="bg-gray-200 animate-pulse rounded-full w-16 h-5" />
            </div>
            <SkeletonText width="w-80" height="h-7" />
            <SkeletonText width="w-48" height="h-4 mt-2" />
          </div>
          {/* Penalty box */}
          <div className="bg-orange-50 rounded-lg px-4 py-3 w-32">
            <SkeletonText width="w-12" height="h-3" />
            <SkeletonText width="w-20" height="h-7 mt-1" />
          </div>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <SkeletonText width="w-20" height="h-3" />
              <SkeletonText width="w-28" height="h-4 mt-1" />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mt-4 pt-4 border-t">
          <SkeletonText width="w-20" height="h-3 mb-2" />
          <SkeletonText width="w-full" height="h-4" />
          <SkeletonText width="w-3/4" height="h-4 mt-1" />
        </div>
      </div>

      {/* Two-column: How to Fix + Resolution Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <SkeletonText width="w-28" height="h-6 mb-4" />
          <div className="space-y-3">
            <SkeletonText width="w-full" />
            <SkeletonText width="w-5/6" />
            <SkeletonText width="w-4/6" />
            <SkeletonText width="w-full" />
            <SkeletonText width="w-3/4" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <SkeletonText width="w-16" height="h-3" />
                <SkeletonText width="w-20" height="h-4 mt-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <SkeletonText width="w-36" height="h-6 mb-4" />
          {/* Status flow bar */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-1 h-2 bg-gray-200 animate-pulse rounded-full" />
            ))}
          </div>
          <div className="space-y-3 mt-6">
            <div className="bg-gray-200 animate-pulse rounded-full w-24 h-7" />
            <SkeletonText width="w-48" height="h-3" />
            <SkeletonText width="w-40" height="h-3" />
            <div className="bg-gray-200 animate-pulse rounded-lg w-full h-10 mt-4" />
          </div>
        </div>
      </div>

      {/* Contractor match placeholder */}
      <div className="mt-6 bg-white rounded-xl border p-6">
        <SkeletonText width="w-48" height="h-6 mb-4" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 animate-pulse rounded-full w-10 h-10" />
                <div className="flex-1">
                  <SkeletonText width="w-28" height="h-4" />
                  <SkeletonText width="w-20" height="h-3 mt-1" />
                </div>
              </div>
              <SkeletonText width="w-full" />
              <SkeletonText width="w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
