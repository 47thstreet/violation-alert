export default function BillingLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-100 rounded w-64" />
        <div className="h-10 bg-gray-200 rounded w-40" />
      </div>
    </div>
  );
}
