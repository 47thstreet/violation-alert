import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Violation Monitoring for NYC Property Managers — ViolationAlert',
  description: 'Monitor building violations across your entire portfolio. Track DOB, HPD, ECB violations for every property you manage. Team access, CRM, and AI resolution engine.',
  alternates: { canonical: '/for/property-managers' },
};

const FEATURES = [
  { title: 'Portfolio-wide monitoring', desc: 'See every violation across every building you manage on one dashboard. Filter by agency, severity, borough, or status. Know which buildings need immediate attention.' },
  { title: 'Team access', desc: 'Invite your team — supers, maintenance staff, attorneys, and building owners. Set per-property permissions so everyone sees only what they need.' },
  { title: 'CRM per building', desc: 'Track contacts, notes, documents, and maintenance tasks for each property. Log every interaction so nothing falls through the cracks when staff changes.' },
  { title: 'AI resolution engine', desc: 'When a violation lands, our AI generates a step-by-step fix guide with cost estimates, required documents, and contractor recommendations. No more Googling violation codes.' },
  { title: 'Contractor marketplace', desc: 'Connect with licensed NYC contractors who specialize in specific violation types. Get quotes, check reviews, and hire directly through the platform.' },
  { title: 'Client reporting', desc: 'Generate violation reports for building owners showing what was found, what was fixed, and what is still open. Professional reports that demonstrate your value.' },
];

const FAQ = [
  { q: 'How many properties can a property management company monitor?', a: 'Pro plan includes unlimited properties for $29/month. Enterprise plan adds API access, custom integrations, and dedicated support for portfolios over 100 buildings. Contact us for Enterprise pricing.' },
  { q: 'Can building owners see their own violations?', a: 'Yes. You can invite building owners to view violations for their specific properties. They see the violations and resolution status but cannot access other buildings in your portfolio.' },
  { q: 'Does ViolationAlert integrate with property management software?', a: 'Enterprise plan includes API access and webhook integrations. We can push violation data to your existing property management system, accounting software, or CRM. Contact us to discuss your integration needs.' },
];

export default function PropertyManagersPage() {
  return (
    <main>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-red-600 font-medium text-sm mb-3">For Property Managers</p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">Violation Monitoring for NYC Property Managers</h1>
        <p className="text-xl text-gray-500 mt-4 max-w-2xl">
          Manage violations across your entire portfolio from one dashboard. Stop checking DOB and HPD manually for each building. Let ViolationAlert do the monitoring so you can focus on resolution.
        </p>
        <div className="flex gap-3 mt-8">
          <Link href="/signup" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700">Start monitoring free</Link>
          <Link href="/for/landlords" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">For Landlords</Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Built for portfolio management</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The property manager workflow</h2>
          <div className="space-y-8 mt-8">
            <div className="flex gap-4">
              <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="font-semibold text-gray-900">Add your buildings</h3>
                <p className="text-sm text-gray-500 mt-1">Enter any NYC address. We auto-resolve BIN and BBL numbers and immediately scan for existing violations across all agencies.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="font-semibold text-gray-900">Get alerted on new violations</h3>
                <p className="text-sm text-gray-500 mt-1">Every 15 minutes, we check 10+ city agencies. New violations trigger instant alerts to you and your team via email, SMS, or WhatsApp.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="font-semibold text-gray-900">Resolve with AI guidance</h3>
                <p className="text-sm text-gray-500 mt-1">Each violation comes with a resolution guide: what it means, how to fix it, estimated cost, required documents, and recommended contractors.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">4</span>
              <div>
                <h3 className="font-semibold text-gray-900">Report to owners</h3>
                <p className="text-sm text-gray-500 mt-1">Generate professional violation reports for each building owner. Show what was found, what you fixed, and what is pending. Demonstrate your value.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage violations at portfolio scale</h2>
          <p className="text-gray-500 mb-8">Free for 3 properties. Pro unlimited for $29/month.</p>
          <Link href="/signup" className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-700">Get started free</Link>
        </div>
      </section>
    </main>
  );
}
