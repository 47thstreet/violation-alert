import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <span className="text-xl font-bold text-gray-900">ViolationAlert</span>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
          Never miss a building violation again
        </h1>
        <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
          ViolationAlert monitors DOB, HPD, and ECB violations for all your NYC properties
          and notifies you instantly via email, SMS, or WhatsApp.
        </p>
        <div className="flex justify-center gap-4 mt-10">
          <Link href="/signup" className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors">
            Start monitoring free
          </Link>
          <Link href="/login" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
            Sign in
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-red-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Add your properties</h3>
              <p className="text-gray-500">
                Enter any NYC address. We auto-resolve BIN and BBL numbers using NYC GeoSearch.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-red-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">We monitor 24/7</h3>
              <p className="text-gray-500">
                Every 15 minutes, we check DOB, HPD, and ECB databases for new violations.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-red-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get notified instantly</h3>
              <p className="text-gray-500">
                Email, SMS, or WhatsApp alerts with violation details, severity, and penalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">All NYC violation sources</h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
            We pull from every major NYC agency database so you have a complete picture.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-1">DOB</h3>
              <p className="text-sm text-gray-500">Department of Buildings — construction, safety, zoning violations</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-1">HPD</h3>
              <p className="text-sm text-gray-500">Housing Preservation — maintenance code, habitability, lead paint</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-1">ECB</h3>
              <p className="text-sm text-gray-500">Environmental Control Board — penalties, hearings, fines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Simple pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border p-8 text-left">
              <h3 className="font-semibold text-lg">Free</h3>
              <p className="text-3xl font-bold mt-2">$0<span className="text-sm text-gray-500 font-normal">/mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                <li>Up to 3 properties</li>
                <li>Email notifications</li>
                <li>DOB violations only</li>
                <li>Daily checks</li>
              </ul>
              <Link href="/signup" className="mt-8 block text-center border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Get started
              </Link>
            </div>
            <div className="bg-white rounded-xl border-2 border-red-600 p-8 text-left relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                Popular
              </span>
              <h3 className="font-semibold text-lg">Pro</h3>
              <p className="text-3xl font-bold mt-2">$29<span className="text-sm text-gray-500 font-normal">/mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                <li>Unlimited properties</li>
                <li>Email + SMS + WhatsApp</li>
                <li>DOB + HPD + ECB</li>
                <li>15-min checks</li>
                <li>Penalty tracking</li>
              </ul>
              <Link href="/signup" className="mt-8 block text-center bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                Start free trial
              </Link>
            </div>
            <div className="bg-white rounded-xl border p-8 text-left">
              <h3 className="font-semibold text-lg">Enterprise</h3>
              <p className="text-3xl font-bold mt-2">Custom</p>
              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                <li>Portfolio management</li>
                <li>API access</li>
                <li>Team accounts</li>
                <li>Webhook integrations</li>
                <li>Dedicated support</li>
              </ul>
              <a href="mailto:sales@violationalert.com" className="mt-8 block text-center border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Contact us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          ViolationAlert — NYC Building Violation Monitor for Landlords
        </div>
      </footer>
    </div>
  );
}
