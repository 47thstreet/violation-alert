import Link from 'next/link';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">ViolationAlert</Link>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">Sign in</Link>
            <Link href="/signup" className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
              Get started free
            </Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <p className="font-semibold text-gray-900 mb-3">Violations</p>
              <div className="space-y-2">
                <Link href="/violations/dob" className="block text-gray-500 hover:text-gray-700">DOB Violations</Link>
                <Link href="/violations/hpd" className="block text-gray-500 hover:text-gray-700">HPD Violations</Link>
                <Link href="/violations/ecb" className="block text-gray-500 hover:text-gray-700">ECB Penalties</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-3">Solutions</p>
              <div className="space-y-2">
                <Link href="/for/landlords" className="block text-gray-500 hover:text-gray-700">For Landlords</Link>
                <Link href="/for/property-managers" className="block text-gray-500 hover:text-gray-700">For Property Managers</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-3">Product</p>
              <div className="space-y-2">
                <Link href="/signup" className="block text-gray-500 hover:text-gray-700">Sign Up Free</Link>
                <Link href="/login" className="block text-gray-500 hover:text-gray-700">Sign In</Link>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">ViolationAlert — NYC Building Violation Monitor</p>
        </div>
      </footer>
    </div>
  );
}
