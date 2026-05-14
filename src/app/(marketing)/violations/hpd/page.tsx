import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NYC HPD Violation Monitoring — Track Housing Maintenance Code Violations',
  description: 'Monitor HPD violations across all your NYC rental properties. Track Class A, B, and C violations, lead paint hazards, and habitability issues. Instant alerts.',
  alternates: { canonical: '/violations/hpd' },
};

const CLASSES = [
  { class: 'C', label: 'Immediately Hazardous', color: 'bg-red-100 text-red-700 border-red-200', desc: 'Conditions that pose an immediate threat to life or safety. Must be corrected within 24 hours. Examples: no heat in winter, no hot water, lead paint hazards, gas leaks, fire damage.', deadline: '24 hours' },
  { class: 'B', label: 'Hazardous', color: 'bg-orange-100 text-orange-700 border-orange-200', desc: 'Conditions that are hazardous but not immediately life-threatening. Must be corrected within 30 days. Examples: broken windows, defective plumbing, pest infestations, missing smoke detectors.', deadline: '30 days' },
  { class: 'A', label: 'Non-Hazardous', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', desc: 'Conditions that are not hazardous but still violate the housing maintenance code. Must be corrected within 90 days. Examples: peeling paint (non-lead), cracked plaster, missing cabinet doors.', deadline: '90 days' },
  { class: 'I', label: 'Information', color: 'bg-blue-100 text-blue-700 border-blue-200', desc: 'Informational notices that do not require immediate correction but must be addressed. Examples: missing registration, failure to post required notices.', deadline: 'Varies' },
];

const FAQ = [
  { q: 'What is the difference between HPD and DOB violations?', a: 'DOB handles construction, permits, and building safety. HPD handles housing conditions — maintenance, habitability, and tenant-facing issues. If your ceiling is crumbling, that is HPD. If you built a wall without a permit, that is DOB. ViolationAlert monitors both.' },
  { q: 'Can HPD violations lead to fines?', a: 'Yes. While HPD violations themselves do not carry direct monetary penalties, failure to correct them can result in HPD performing emergency repairs and billing the landlord, liens on the property, and referral to ECB/OATH for formal penalties.' },
  { q: 'How does ViolationAlert handle lead paint violations?', a: 'Lead paint violations (Local Law 1) are classified as Class C — immediately hazardous. ViolationAlert flags these as highest priority, provides specific remediation steps including EPA-certified contractor requirements, and tracks the 24-hour correction deadline.' },
];

export default function HPDPage() {
  return (
    <main>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-red-600 font-medium text-sm mb-3">NYC Housing Preservation & Development</p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">HPD Violation Monitoring</h1>
        <p className="text-xl text-gray-500 mt-4 max-w-2xl">
          Track every HPD violation across your rental properties. Know the moment a Class C hazard is filed — before it escalates into emergency repairs at your expense.
        </p>
        <div className="flex gap-3 mt-8">
          <Link href="/signup" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700">Start monitoring free</Link>
          <Link href="/violations/dob" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">See DOB violations</Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">HPD Violation Classes</h2>
          <div className="space-y-4">
            {CLASSES.map(c => (
              <div key={c.class} className={`rounded-xl border p-6 ${c.color.split(' ')[0]} border-${c.color.split('border-')[1]}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-lg font-bold px-3 py-1 rounded-lg ${c.color}`}>Class {c.class}</span>
                  <span className="font-semibold text-gray-900">{c.label}</span>
                  <span className="ml-auto text-sm text-gray-500">Deadline: {c.deadline}</span>
                </div>
                <p className="text-sm text-gray-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why HPD Monitoring Matters</h2>
          <div className="space-y-6 text-gray-600">
            <p>HPD violations are the most common type of building violation in NYC. A typical residential building accumulates dozens of HPD violations over its lifetime — and each one represents a potential liability.</p>
            <p>Unaddressed Class C violations can trigger HPD emergency repairs, where the city sends contractors to fix the problem and bills the landlord at a premium. Multiple open violations can lead to building-wide inspections, liens, and even receivership.</p>
            <p>ViolationAlert scans HPD records daily (or every 15 minutes on Pro) and classifies each violation by urgency. You see Class C hazards first, with clear deadlines and step-by-step resolution guides powered by AI.</p>
          </div>
          <Link href="/signup" className="inline-block mt-8 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700">
            Monitor HPD violations now
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Do not let HPD violations pile up</h2>
          <p className="text-gray-500 mb-8">Free for up to 3 properties. No credit card required.</p>
          <Link href="/signup" className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-700">Get started free</Link>
          <div className="flex justify-center gap-6 mt-8 text-sm text-gray-400">
            <Link href="/violations/dob" className="hover:text-gray-600">DOB Violations →</Link>
            <Link href="/violations/ecb" className="hover:text-gray-600">ECB Penalties →</Link>
            <Link href="/for/landlords" className="hover:text-gray-600">For Landlords →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
