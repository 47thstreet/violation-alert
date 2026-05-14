import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Building Violation Alerts for NYC Landlords — ViolationAlert',
  description: 'Stop getting surprised by building violations. ViolationAlert monitors DOB, HPD, ECB and 7+ more agencies for all your NYC properties. AI-powered resolution guides. Free for 3 properties.',
  alternates: { canonical: '/for/landlords' },
};

const PAIN_POINTS = [
  { problem: 'Surprise violations', solution: 'Get instant alerts the moment any agency files a violation against your property. Email, SMS, or WhatsApp — your choice.', icon: '1' },
  { problem: 'Missed inspections', solution: 'CRM task reminders for boiler inspections, facade filings, insurance renewals, and every recurring obligation.', icon: '2' },
  { problem: 'Penalty accumulation', solution: 'Track every ECB penalty and hearing date. See exactly how much you owe and when, before liens are filed.', icon: '3' },
  { problem: 'Not knowing how to fix it', solution: 'AI-powered resolution engine generates step-by-step fix guides with cost estimates, timelines, and required documents.', icon: '4' },
  { problem: 'Finding reliable contractors', solution: 'Marketplace connects you with licensed NYC contractors who specialize in your exact violation type. See ratings and reviews.', icon: '5' },
  { problem: 'Managing multiple buildings', solution: 'Portfolio dashboard shows all properties at a glance. See which buildings need attention and which are clean.', icon: '6' },
];

const FAQ = [
  { q: 'How many properties can I monitor for free?', a: 'The free tier includes up to 3 properties with daily DOB scanning and email alerts. No credit card required, no time limit. Pro plan ($29/mo) adds unlimited properties, 15-minute scanning, all 10+ agencies, and SMS/WhatsApp alerts.' },
  { q: 'I own buildings in multiple boroughs. Does ViolationAlert work across all of NYC?', a: 'Yes. ViolationAlert works for all five boroughs — Manhattan, Brooklyn, Queens, Bronx, and Staten Island. Just enter any NYC address and we auto-resolve the BIN and BBL numbers.' },
  { q: 'Can my property manager also access ViolationAlert?', a: 'Yes. Pro and Enterprise plans support team accounts. You can invite your property manager, super, or attorney to view violations and manage resolutions for specific properties.' },
  { q: 'What if I already have open violations?', a: 'When you add a property, ViolationAlert immediately scans all historical violations — not just new ones. You will see every open violation on file, sorted by severity, with resolution guidance for each.' },
];

export default function LandlordsPage() {
  return (
    <main>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-red-600 font-medium text-sm mb-3">For Landlords</p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">Building Violation Alerts for NYC Landlords</h1>
        <p className="text-xl text-gray-500 mt-4 max-w-2xl">
          You should not have to check DOB, HPD, and ECB websites manually. ViolationAlert monitors 10+ agencies and tells you exactly what is wrong, how to fix it, and who can help.
        </p>
        <div className="flex gap-3 mt-8">
          <Link href="/signup" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700">Start monitoring free</Link>
          <Link href="/for/property-managers" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">For Property Managers</Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Every landlord pain point, solved</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PAIN_POINTS.map(p => (
              <div key={p.icon} className="bg-white rounded-xl border p-6">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">{p.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{p.problem}</h3>
                    <p className="text-sm text-gray-500">{p.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Simple pricing</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-xl border p-6 text-left">
              <h3 className="font-semibold">Free</h3>
              <p className="text-3xl font-bold mt-1">$0</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Up to 3 properties</li>
                <li>DOB violations</li>
                <li>Email alerts</li>
                <li>Daily scanning</li>
              </ul>
              <Link href="/signup" className="block mt-6 text-center border py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Get started</Link>
            </div>
            <div className="bg-white rounded-xl border-2 border-red-600 p-6 text-left">
              <h3 className="font-semibold">Pro</h3>
              <p className="text-3xl font-bold mt-1">$29<span className="text-sm text-gray-500 font-normal">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Unlimited properties</li>
                <li>10+ agencies</li>
                <li>Email + SMS + WhatsApp</li>
                <li>15-minute scanning</li>
                <li>AI resolution engine</li>
                <li>Contractor marketplace</li>
              </ul>
              <Link href="/signup" className="block mt-6 text-center bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700">Start free trial</Link>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your buildings, protected</h2>
          <p className="text-gray-500 mb-8">Join NYC landlords who never miss a violation.</p>
          <Link href="/signup" className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-700">Get started free</Link>
        </div>
      </section>
    </main>
  );
}
