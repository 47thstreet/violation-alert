import { SkeletonText, SkeletonTable } from '@/components/skeleton';

export default function PropertyDetailLoading() {
  return (
    <div>
      {/* Back link */}
      <SkeletonText width="w-32" height="h-4 mb-4" />

      {/* Property header card */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex-1">
            <SkeletonText width="w-64" height="h-7" />
            <div className="flex gap-4 mt-2">
              <SkeletonText width="w-20" height="h-4" />
              <SkeletonText width="w-24" height="h-4" />
              <SkeletonText width="w-28" height="h-4" />
            </div>
          </div>
          <div className="bg-gray-200 animate-pulse rounded-lg w-full sm:w-28 h-[44px]" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <SkeletonText width="w-24" height="h-3" />
            <SkeletonText width="w-12" height="h-7 mt-2" />
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <SkeletonText width="w-12" height="h-3" />
            <SkeletonText width="w-8" height="h-7 mt-2" />
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <SkeletonText width="w-24" height="h-3" />
            <SkeletonText width="w-16" height="h-7 mt-2" />
          </div>
        </div>

        {/* Last checked + scan button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <SkeletonText width="w-40" height="h-3" />
          <div className="bg-gray-200 animate-pulse rounded-lg w-24 h-9" />
        </div>
      </div>

      {/* Violations table */}
      <SkeletonTable rows={5} />
    </div>
  );
}
