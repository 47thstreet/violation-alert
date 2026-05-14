import { SkeletonText } from '@/components/skeleton';

export default function CrmLoading() {
  return (
    <div>
      {/* Back link */}
      <SkeletonText width="w-32" height="h-4 mb-4" />

      {/* Header card */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <SkeletonText width="w-64" height="h-7" />
            <SkeletonText width="w-40" height="h-4 mt-2" />
          </div>
          <div className="flex gap-2">
            <div className="bg-gray-200 animate-pulse rounded-full w-16 h-6" />
            <div className="bg-gray-200 animate-pulse rounded-full w-20 h-6" />
          </div>
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
              <SkeletonText width="w-8 mx-auto" height="h-7" />
              <SkeletonText width="w-16 mx-auto" height="h-3 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="bg-white rounded-xl border">
        <div className="border-b px-4 py-3 flex gap-4">
          {['w-20', 'w-24', 'w-16', 'w-20', 'w-28'].map((w, i) => (
            <div key={i} className={`bg-gray-200 animate-pulse rounded h-8 ${w}`} />
          ))}
        </div>

        {/* Tab content - form fields placeholder */}
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <SkeletonText width="w-24" height="h-3 mb-2" />
              <div className="bg-gray-200 animate-pulse rounded-lg w-full h-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
