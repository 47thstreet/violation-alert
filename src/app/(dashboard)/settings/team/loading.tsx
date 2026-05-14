import { SkeletonText } from '@/components/skeleton';

export default function TeamLoading() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-2">
          <SkeletonText width="w-16" height="h-4" />
          <span className="text-gray-300">/</span>
          <SkeletonText width="w-12" height="h-4" />
        </div>
        <SkeletonText width="w-40" height="h-7 mb-2" />
        <SkeletonText width="w-80" height="h-4" />
      </div>

      {/* Invite form */}
      <div className="bg-white rounded-xl border p-6">
        <SkeletonText width="w-40" height="h-6 mb-4" />
        <div className="flex gap-2">
          <div className="bg-gray-200 animate-pulse rounded-lg flex-1 h-10" />
          <div className="bg-gray-200 animate-pulse rounded-lg w-24 h-10" />
          <div className="bg-gray-200 animate-pulse rounded-lg w-20 h-10" />
        </div>
        <SkeletonText width="w-96" height="h-3 mt-2" />
      </div>

      {/* Team list */}
      <div className="bg-white rounded-xl border p-6">
        <SkeletonText width="w-48" height="h-6 mb-4" />

        <div className="space-y-2">
          {/* Owner row */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 animate-pulse rounded-full w-8 h-8" />
              <div>
                <SkeletonText width="w-40" height="h-4" />
                <SkeletonText width="w-8" height="h-3 mt-1" />
              </div>
            </div>
            <div className="bg-gray-200 animate-pulse rounded w-14 h-6" />
          </div>

          {/* Member rows */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 animate-pulse rounded-full w-8 h-8" />
                <div>
                  <SkeletonText width="w-44" height="h-4" />
                  <div className="flex items-center gap-2 mt-1">
                    <div className="bg-gray-200 animate-pulse rounded w-14 h-4" />
                    <SkeletonText width="w-24" height="h-3" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 animate-pulse rounded w-16 h-7" />
                <SkeletonText width="w-14" height="h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
