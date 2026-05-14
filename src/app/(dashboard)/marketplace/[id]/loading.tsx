import { SkeletonText, SkeletonAvatar } from '@/components/skeleton';

export default function ContractorProfileLoading() {
  return (
    <div>
      {/* Back link */}
      <SkeletonText width="w-36" height="h-4 mb-4" />

      {/* Profile header */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-start gap-5 flex-wrap">
          <SkeletonAvatar size="w-16 h-16" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <SkeletonText width="w-48" height="h-7" />
              <div className="bg-gray-200 animate-pulse rounded-full w-16 h-5" />
            </div>
            <SkeletonText width="w-32" height="h-4 mt-1" />

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded w-5 h-5" />
                ))}
              </div>
              <SkeletonText width="w-8" height="h-5" />
              <SkeletonText width="w-20" height="h-4" />
            </div>

            <SkeletonText width="w-32" height="h-4 mt-2" />
          </div>

          <div className="bg-gray-200 animate-pulse rounded-lg w-32 h-[44px]" />
        </div>

        {/* Bio */}
        <div className="mt-4 pt-4 border-t space-y-2">
          <SkeletonText width="w-full" />
          <SkeletonText width="w-4/5" />
        </div>

        {/* Contact grid */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <SkeletonText width="w-12" height="h-3" />
              <SkeletonText width="w-36" height="h-4 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Services & Coverage */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-6">
          <SkeletonText width="w-44" height="h-6 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-full w-24 h-7" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <SkeletonText width="w-32" height="h-6 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-full w-24 h-7" />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <SkeletonText width="w-32" height="h-6" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 border-b last:border-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gray-200 animate-pulse rounded-full w-8 h-8" />
              <div>
                <SkeletonText width="w-20" height="h-4" />
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="bg-gray-200 animate-pulse rounded w-3.5 h-3.5" />
                  ))}
                </div>
              </div>
            </div>
            <SkeletonText width="w-full" height="h-4 mt-2" />
            <SkeletonText width="w-2/3" height="h-4 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
