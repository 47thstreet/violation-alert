import { SkeletonText } from '@/components/skeleton';

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <SkeletonText width="w-28" height="h-7 mb-2" />
        <SkeletonText width="w-72" height="h-4" />
      </div>

      {/* Notification Channels */}
      <div className="bg-white rounded-xl border p-6">
        <SkeletonText width="w-44" height="h-6 mb-4" />
        <SkeletonText width="w-80" height="h-4 mb-4" />

        {/* Existing prefs */}
        <div className="space-y-2 mb-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 animate-pulse rounded w-14 h-6" />
                <SkeletonText width="w-40" height="h-4" />
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-gray-200 animate-pulse rounded w-10 h-[36px]" />
                <div className="bg-gray-200 animate-pulse rounded w-16 h-[36px]" />
              </div>
            </div>
          ))}
        </div>

        {/* Add form */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="bg-gray-200 animate-pulse rounded-lg w-28 h-[44px]" />
          <div className="bg-gray-200 animate-pulse rounded-lg flex-1 h-[44px]" />
          <div className="bg-gray-200 animate-pulse rounded-lg w-16 h-[44px]" />
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <SkeletonText width="w-16" height="h-6" />
            <SkeletonText width="w-64" height="h-4 mt-2" />
          </div>
          <div className="bg-gray-200 animate-pulse rounded-lg w-28 h-9" />
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl border p-6">
        <SkeletonText width="w-20" height="h-6 mb-4" />
        <div className="bg-gray-200 animate-pulse rounded-lg w-24 h-9" />
      </div>
    </div>
  );
}
