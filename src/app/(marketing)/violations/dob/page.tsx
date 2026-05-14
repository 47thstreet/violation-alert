import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NYC DOB Violation Alerts & Monitoring — Track Building Department Violations',
  description: 'Monitor NYC Department of Buildings violations in real-time. Get instant alerts for work without permit, boiler, safety, and construction violations. Free for 3 properties.',
  alternates: { canonical: '/violations/dob' },
};

const COMMON_VIOLATIONS = [
  { type: 'Work Without Permit', code: 'WWP', desc: 'Construction or alteration work performed without a valid DOB permit. Penalties range from $2,500 to $25,000.', severity: 'Serious' },
  { type: 'Low Pressure Boiler', code: 'LBLVIO', desc: 'Failure to file annual external boiler inspection reports. Recurring violation that compounds over time.', severity: 'Standard' },
  { type: 'Safety Violations', code: 'SAFETY', desc: 'Unsafe conditions including structural instability, missing fire escapes, or hazardous construction practices.', severity: 'Critical' },
  { type: 'Elevator Violations', code: 'ELEV', desc: 'Failure to maintain, inspect, or certify elevator equipment. Can result in immediate stop-use orders.', severity: 'Serious' },
  { type: 'Stop Work Orders', code: 'SWO', desc: 'DOB orders all construction to halt immediately due to safety concerns or permit violations.', severity: 'Critical' },
  { type: 'Façade Violations', code: 'LL11', desc: 'Local Law 11 requires buildings over 6 stories to inspect and repair exterior walls every 5 years.', severity: 'Serious' },
];

const FAQ = [
  { q: 'How quickly does ViolationAlert detect DOB violations?', a: 'Free tier properties are scanned daily. Pro plan properties are scanned every 15 minutes. You receive alerts via email, SMS, or WhatsApp the moment a new DOB violation appears in the city database.' },
  { q: 'What happens if I ignore a DOB violation?', a: 'DOB violations escalate. A single violation can lead to ECB penalties (fines), stop work orders, vacate orders, and even criminal charges for egregious safety violations. Penalties compound daily for many violation types.' },
  { q: 'Can I check my building for DOB violations right now?', a: 'Yes — sign up for a free ViolationAlert account, enter your NYC address, and we instantly scan all DOB records. You will see every violation on file, sorted by severity, with resolution guidance.' },
  { q: 'What is the difference between a DOB violation and an ECB penalty?', a: 'A DOB violation is the citation itself — the notice that something is wrong. An ECB penalty is the financial consequence — the fine imposed after a hearing. ViolationAlert tracks both so you see the full picture.' },
];

export default function DOBPage() {
  return (
    <main>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-red-600 font-medium text-sm mb-3">NYC Department of Buildings</p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">DOB Violation Alerts & Monitoring</h1>
        <p className="text-xl text-gray-500 mt-4 max-w-2xl">
          Never miss a Department of Buildings violation again. ViolationAlert monitors DOB databases 24/7 and alerts you the moment a new violation is filed against your property.
        </p>
        <div className="flex gap-3 mt-8">
          <Link href="/signup" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700">
            Start monitoring free
          </Link>
          <Link href="/violations/hpd" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">
            See HPD violations
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Common DOB Violation Types</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {COMMON_VIOLATIONS.map(v => (
              <div key={v.code} className="bg-white rounded-xl border p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{v.type}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    v.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    v.severity === 'Serious' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{v.severity}</span>
                </div>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How ViolationAlert Monitors DOB</h2>
          <div className="space-y-6 text-gray-600">
            <p>The NYC Department of Buildings maintains a public database of all violations issued across the five boroughs. ViolationAlert connects directly to this database via the NYC Open Data API and checks your properties on a regular schedule.</p>
            <p>When a new violation appears — whether it is a work-without-permit citation, a boiler inspection failure, or a safety violation — we immediately notify you through your preferred channel: email, SMS, or WhatsApp.</p>
            <p>But we do not stop at alerts. Our AI-powered resolution engine analyzes each violation and generates a step-by-step guide to fix it, including estimated costs, required documents, and which type of contractor you need. If you need professional help, our marketplace connects you with licensed NYC contractors who specialize in that exact violation type.</p>
          </div>
          <Link href="/signup" className="inline-block mt-8 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700">
            Monitor your buildings now
          </Link>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stop checking DOB manually</h2>
          <p className="text-gray-500 mb-8">Free for up to 3 properties. No credit card required.</p>
          <Link href="/signup" className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-700">
            Get started free
          </Link>
          <div className="flex justify-center gap-6 mt-8 text-sm text-gray-400">
            <Link href="/violations/hpd" className="hover:text-gray-600">HPD Violations →</Link>
            <Link href="/violations/ecb" className="hover:text-gray-600">ECB Penalties →</Link>
            <Link href="/for/landlords" className="hover:text-gray-600">For Landlords →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
