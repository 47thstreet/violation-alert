import { SkeletonText, SkeletonTable } from '@/components/skeleton';

export default function ViolationsLoading() {
  return (
    <div>
      <SkeletonText width="w-40" height="h-7 mb-2" />
      <SkeletonText width="w-72" height="h-4 mb-6" />

      <SkeletonTable rows={8} />
    </div>
  );
}
