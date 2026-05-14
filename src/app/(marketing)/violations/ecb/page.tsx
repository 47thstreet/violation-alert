import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NYC ECB Penalties & Violation Tracking — Monitor OATH Hearing Fines',
  description: 'Track ECB penalties and OATH hearing outcomes for your NYC properties. Monitor fine escalation, payment deadlines, and compliance orders. Prevent penalty accumulation.',
  alternates: { canonical: '/violations/ecb' },
};

const PENALTY_TIERS = [
  { label: 'First offense', range: '$500 – $5,000', desc: 'Initial penalty for most violation types. Lower for administrative failures, higher for safety issues.' },
  { label: 'Repeat offense', range: '$2,000 – $25,000', desc: 'Penalties increase significantly for violations that have been previously cited and not corrected.' },
  { label: 'Failure to comply', range: '$5,000 – $50,000+', desc: 'When you ignore a Commissioner\'s Order or fail to appear at a hearing, fines escalate rapidly.' },
  { label: 'Daily penalties', range: '$100 – $1,000/day', desc: 'Some violations accrue daily penalties until corrected. A $500 violation can become $15,000 in a month.' },
];

const FAQ = [
  { q: 'What is the difference between ECB and OATH?', a: 'ECB (Environmental Control Board) was the original name. It is now part of OATH (Office of Administrative Trials and Hearings). ECB/OATH handles penalty hearings for violations issued by DOB, FDNY, DEP, DSNY, and other city agencies. ViolationAlert tracks violations from all referring agencies.' },
  { q: 'Can I fight an ECB penalty?', a: 'Yes. You have the right to a hearing at OATH. ViolationAlert provides hearing prep guidance including what evidence to bring, common defense strategies, and what to expect. Many penalties are reduced or dismissed at hearing if you can demonstrate correction.' },
  { q: 'How do ECB penalties compound?', a: 'ECB issues escalating penalties for non-compliance. A first offense might be $500, but if you fail to correct the violation after the hearing, a follow-up summons can be $2,000-$5,000. Some violations carry daily penalties. ViolationAlert tracks the full penalty timeline so you know exactly where you stand.' },
];

export default function ECBPage() {
  return (
    <main>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-red-600 font-medium text-sm mb-3">Environmental Control Board / OATH</p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">ECB Penalties & Violation Tracking</h1>
        <p className="text-xl text-gray-500 mt-4 max-w-2xl">
          ECB penalties are the financial consequence of building violations. They compound fast. Track every penalty, hearing date, and payment deadline across your portfolio.
        </p>
        <div className="flex gap-3 mt-8">
          <Link href="/signup" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700">Start monitoring free</Link>
          <Link href="/violations/dob" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">See DOB violations</Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How ECB Penalties Escalate</h2>
          <div className="space-y-4">
            {PENALTY_TIERS.map((tier, i) => (
              <div key={i} className="bg-white rounded-xl border p-6 flex items-start gap-4">
                <span className="text-2xl font-bold text-red-600 w-8">{i + 1}</span>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{tier.label}</h3>
                    <span className="text-sm font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded">{tier.range}</span>
                  </div>
                  <p className="text-sm text-gray-500">{tier.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why ECB Monitoring Saves You Money</h2>
          <div className="space-y-6 text-gray-600">
            <p>The average NYC landlord does not know about an ECB penalty until they receive a lien notice or try to sell their property. By then, a $500 violation has compounded into thousands in fines, interest, and legal fees.</p>
            <p>ViolationAlert tracks ECB penalties from the moment they are issued. We monitor hearing dates, payment deadlines, and compliance orders. When a new penalty appears, we alert you immediately with the exact amount, the referring agency, and a step-by-step guide to resolve it — including whether it makes sense to fight it at a hearing.</p>
            <p>Our AI resolution engine has analyzed thousands of ECB cases and can estimate your likely outcome at hearing based on violation type, history, and correction status.</p>
          </div>
          <Link href="/signup" className="inline-block mt-8 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700">
            Track your penalties now
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stop letting penalties compound</h2>
          <p className="text-gray-500 mb-8">Free for up to 3 properties. No credit card required.</p>
          <Link href="/signup" className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-700">Get started free</Link>
          <div className="flex justify-center gap-6 mt-8 text-sm text-gray-400">
            <Link href="/violations/dob" className="hover:text-gray-600">DOB Violations →</Link>
            <Link href="/violations/hpd" className="hover:text-gray-600">HPD Violations →</Link>
            <Link href="/for/landlords" className="hover:text-gray-600">For Landlords →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
