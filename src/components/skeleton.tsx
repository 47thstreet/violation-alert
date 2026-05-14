export function SkeletonText({
  width = 'w-full',
  height = 'h-4',
}: {
  width?: string;
  height?: string;
}) {
  return <div className={`bg-gray-200 animate-pulse rounded ${width} ${height}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border p-6">
      <SkeletonText width="w-2/3" height="h-5" />
      <div className="mt-4 space-y-3">
        <SkeletonText width="w-full" />
        <SkeletonText width="w-5/6" />
        <SkeletonText width="w-4/6" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Header row */}
      <div className="border-b px-4 py-3 flex gap-4">
        <SkeletonText width="w-1/6" height="h-4" />
        <SkeletonText width="w-1/4" height="h-4" />
        <SkeletonText width="w-1/6" height="h-4" />
        <SkeletonText width="w-1/6" height="h-4" />
        <SkeletonText width="w-1/6" height="h-4" />
      </div>
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b last:border-0 px-4 py-3 flex gap-4">
          <SkeletonText width="w-1/6" height="h-4" />
          <SkeletonText width="w-1/4" height="h-4" />
          <SkeletonText width="w-1/6" height="h-4" />
          <SkeletonText width="w-1/6" height="h-4" />
          <SkeletonText width="w-1/6" height="h-4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'w-10 h-10' }: { size?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded-full ${size}`} />;
}

export function SkeletonStatWidget() {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <SkeletonText width="w-20" height="h-3" />
      <SkeletonText width="w-16" height="h-7 mt-2" />
    </div>
  );
}
