import Link from 'next/link';
import type { Metadata } from 'next';
import { AGENCIES as AGENCY_DATA } from '@/lib/agency-data';

export const metadata: Metadata = {
  title: 'NYC Building Violation Monitor — Track 10+ Agency Violations | ViolationAlert',
  description:
    'Monitor DOB, HPD, ECB, FDNY, DSNY, DOT, LPC, DEP violations for all your NYC properties. AI-powered resolution guides, contractor marketplace, instant email/SMS/WhatsApp alerts. Free for 3 properties.',
  alternates: {
    canonical: '/',
  },
};

const AGENCIES = [
  { abbr: 'DOB', name: 'Dept. of Buildings', desc: 'Construction, safety, zoning, stop work orders', icon: '\u{1F3D7}\uFE0F' },
  { abbr: 'HPD', name: 'Housing Preservation', desc: 'Maintenance code, habitability, lead paint', icon: '\u{1F3E0}' },
  { abbr: 'ECB', name: 'Environmental Control Board', desc: 'Penalties, hearings, fines enforcement', icon: '\u2696\uFE0F' },
  { abbr: 'FDNY', name: 'Fire Department', desc: 'Fire code, sprinklers, egress, inspections', icon: '\u{1F525}' },
  { abbr: 'DSNY', name: 'Dept. of Sanitation', desc: 'Waste, recycling, sidewalk cleanliness', icon: '\u{1F5D1}\uFE0F' },
  { abbr: 'DOT', name: 'Dept. of Transportation', desc: 'Sidewalk, curb cuts, scaffolding, street', icon: '\u{1F6A7}' },
  { abbr: 'LPC', name: 'Landmarks Preservation', desc: 'Historic districts, facade, signage', icon: '\u{1F3DB}\uFE0F' },
  { abbr: 'DEP', name: 'Environmental Protection', desc: 'Water, sewer, noise, air quality', icon: '\u{1F4A7}' },
  { abbr: 'DOHMH', name: 'Dept. of Health', desc: 'Lead, asbestos, mold, pest control', icon: '\u{1F3E5}' },
  { abbr: 'OATH', name: 'Trials & Hearings', desc: 'Administrative hearings, adjudications', icon: '\u{1F4CB}' },
];

const COMPARISON = [
  { feature: 'Agencies covered', us: '10+', dob: 'DOB + 311', vwatch: '8+', dguard: '6' },
  { feature: 'Resolution guidance', us: 'AI-powered', dob: 'None', vwatch: 'None', dguard: 'Risk scoring' },
  { feature: 'Contractor matching', us: 'Yes', dob: 'No', vwatch: 'No', dguard: 'No' },
  { feature: 'Free tier', us: '3 properties', dob: 'No', vwatch: 'Trial only', dguard: 'Lookup only' },
  { feature: 'AI-powered', us: 'Yes', dob: 'No', vwatch: 'No', dguard: 'Partial' },
  { feature: 'SMS + WhatsApp', us: 'Yes', dob: 'No', vwatch: 'Yes', dguard: 'SMS only' },
  { feature: 'Price (starting)', us: 'Free / $29', dob: '$19/mo', vwatch: '$9.99/mo', dguard: '$49.99/10' },
];

const FAQ_ITEMS = [
  {
    question: 'What agencies does ViolationAlert cover?',
    answer:
      'We monitor 10+ NYC agencies including DOB, HPD, ECB, FDNY, DSNY, DOT, LPC, DEP, DOHMH, and OATH. No other monitoring tool covers this many sources, which means you get the most comprehensive violation coverage available.',
  },
  {
    question: 'How fast will I get notified?',
    answer:
      'Free tier properties are scanned daily. Pro plan properties are scanned every 15 minutes across all agencies, with instant alerts via email, SMS, or WhatsApp the moment a new violation is filed.',
  },
  {
    question: 'Is ViolationAlert really free?',
    answer:
      'Yes. The free tier includes up to 3 properties with daily DOB scanning and email alerts. No credit card required, no time limit. Use it forever.',
  },
  {
    question: 'How is this different from DOB Alerts?',
    answer:
      'DOB Alerts only monitors DOB and 311 complaints. ViolationAlert monitors 10+ agencies, includes AI-powered resolution guidance that tells you exactly how to fix each violation, and connects you with vetted contractors. Plus, we have a free tier \u2014 they don\u2019t.',
  },
  {
    question: 'What is the resolution engine?',
    answer:
      'Our AI resolution engine analyzes each violation and generates a step-by-step guide to resolve it, including estimated costs, required permits, filing deadlines, and which type of contractor you need. It learns from thousands of past violations to give increasingly accurate guidance.',
  },
  {
    question: 'How does the contractor marketplace work?',
    answer:
      'When you receive a violation, we match you with licensed NYC contractors who specialize in that exact violation type. You get quotes from multiple contractors, see their track record with similar violations, and hire directly through the platform.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No. ViolationAlert is a web app that works in any browser. Just sign up, add your properties, and we handle the rest. Nothing to download, no software to maintain.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your Pro subscription at any time. You\u2019ll keep access until the end of your billing period, and your free tier access remains forever. No cancellation fees, no contracts.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ViolationAlert',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://violationalert.com',
    description:
      'Monitor DOB, HPD, ECB, FDNY, DSNY, DOT, LPC, DEP violations for all your NYC properties. AI-powered resolution guides and contractor marketplace.',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        name: 'Free',
        description: 'Up to 3 properties, daily DOB checks, email alerts',
      },
      {
        '@type': 'Offer',
        price: '29',
        priceCurrency: 'USD',
        name: 'Pro',
        description:
          'Unlimited properties, 15-min checks, 10+ agencies, email + SMS + WhatsApp, AI resolution engine, contractor marketplace',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '120',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ViolationAlert',
    url: 'https://violationalert.com',
    logo: 'https://violationalert.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'sales@violationalert.com',
      contactType: 'sales',
    },
    sameAs: [],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <span className="text-xl font-bold text-gray-900">
            Violation<span className="text-red-600">Alert</span>
          </span>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* ===== 1. HERO ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <div className="inline-block bg-red-50 text-red-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Monitoring 10+ NYC agencies &mdash; not just DOB
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
          Never miss a violation.{' '}
          <span className="text-red-600">From any NYC agency.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
          The only platform that monitors DOB, HPD, ECB, FDNY, and 6 more agencies,
          tells you exactly how to fix each violation, and connects you with
          contractors who can do the work.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link href="/signup" className="bg-red-600 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors shadow-sm">
            Start monitoring free
          </Link>
          <a href="#how-it-works" className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
            See how it works
          </a>
        </div>
        <p className="text-sm text-gray-400 mt-4">Free forever for 3 properties. No credit card required.</p>
      </section>

      {/* ===== 2. PROBLEM / PAIN ===== */}
      <section className="bg-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              NYC landlords lose millions to violations they never saw coming
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-12">
              Your properties face violations from 10+ different city agencies. Most monitoring
              tools only check DOB. That means HPD complaints, FDNY fire code issues, DSNY
              sanitation fines, and DEP water violations are hitting your bottom line &mdash; and
              you don&apos;t even know about them.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { stat: '$10K+', label: 'Average annual fines per building with unchecked violations' },
              { stat: '10+', label: 'NYC agencies that can issue violations against your property' },
              { stat: '72hrs', label: 'Some violations must be corrected within 72 hours or fines double' },
              { stat: '3x', label: 'Properties with unresolved violations face 3x more tenant lawsuits' },
            ].map((item) => (
              <div key={item.stat} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-red-500 mb-2">{item.stat}</div>
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. SOLUTION - 3 PILLARS ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              See it. Understand it. Fix it.
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              ViolationAlert is the only end-to-end platform that takes you from discovery to resolution.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Monitor */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monitor</h3>
              <p className="text-gray-500 leading-relaxed mb-4">
                We scan 10+ NYC agency databases every 15 minutes. DOB, HPD, ECB,
                FDNY, DSNY, DOT, LPC, DEP, DOHMH, and OATH &mdash; all in one dashboard.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckIcon /> Daily to 15-min scan frequency</li>
                <li className="flex items-center gap-2"><CheckIcon /> Email, SMS, and WhatsApp alerts</li>
                <li className="flex items-center gap-2"><CheckIcon /> Severity scoring and prioritization</li>
              </ul>
            </div>
            {/* Resolve */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resolve</h3>
              <p className="text-gray-500 leading-relaxed mb-4">
                Our AI resolution engine analyzes each violation and gives you a
                step-by-step guide: what to fix, what it costs, what permits you
                need, and when the deadline is.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckIcon /> AI-generated resolution guides</li>
                <li className="flex items-center gap-2"><CheckIcon /> Cost estimates and timelines</li>
                <li className="flex items-center gap-2"><CheckIcon /> Permit and filing requirements</li>
              </ul>
            </div>
            {/* Connect */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-500 leading-relaxed mb-4">
                Don&apos;t want to DIY? Our contractor marketplace matches you with licensed
                professionals who specialize in the exact type of violation you&apos;re facing.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckIcon /> Matched by violation type</li>
                <li className="flex items-center gap-2"><CheckIcon /> Multiple quotes, verified reviews</li>
                <li className="flex items-center gap-2"><CheckIcon /> Track record on similar violations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. ALL AGENCIES ===== */}
      <section id="agencies" className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Every NYC agency. One dashboard.
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              No other violation monitoring tool covers this many agencies. If a city
              agency can fine your property, we&apos;re watching it.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {AGENCIES.map((agency) => {
              const agencyData = AGENCY_DATA.find((a) => a.abbr === agency.abbr);
              const href = agencyData ? `/agency/${agencyData.slug}` : '#';
              return (
                <Link
                  key={agency.abbr}
                  href={href}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-center group"
                >
                  <div className="text-3xl mb-2">{agency.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">{agency.abbr}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{agency.desc}</p>
                </Link>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">
            Plus 311 complaints, DOB NOW, and more sources added regularly.
          </p>
        </div>
      </section>

      {/* ===== 5. COMPARISON TABLE ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              See how we compare
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              We built ViolationAlert because existing tools leave you with alerts and no answers.
            </p>
          </div>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 px-4 text-sm font-medium text-gray-500 w-48">Feature</th>
                  <th className="py-4 px-4 text-sm font-bold text-red-600 bg-red-50 rounded-t-lg">ViolationAlert</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500">DOB Alerts</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500">ViolationWatch</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500">DOBGuard</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3.5 px-4 text-sm font-medium text-gray-700">{row.feature}</td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 bg-red-50">{row.us}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">{row.dob}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">{row.vwatch}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">{row.dguard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile comparison cards */}
          <div className="md:hidden space-y-4">
            {COMPARISON.map((row) => (
              <div key={row.feature} className="bg-white rounded-xl border p-4">
                <div className="font-medium text-gray-700 text-sm mb-3">{row.feature}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-red-50 rounded-lg p-2">
                    <div className="text-xs text-red-600 font-medium">ViolationAlert</div>
                    <div className="font-semibold text-gray-900">{row.us}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500">DOB Alerts</div>
                    <div className="text-gray-600">{row.dob}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500">ViolationWatch</div>
                    <div className="text-gray-600">{row.vwatch}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500">DOBGuard</div>
                    <div className="text-gray-600">{row.dguard}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. HOW IT WORKS ===== */}
      <section id="how-it-works" className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-4 text-lg">Four steps to full violation coverage.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Add your properties',
                desc: 'Enter any NYC address. We auto-resolve BIN and BBL numbers using NYC GeoSearch. Takes 30 seconds.',
              },
              {
                step: '2',
                title: 'We scan 10+ agencies',
                desc: 'Every 15 minutes, we check DOB, HPD, ECB, FDNY, DSNY, DOT, LPC, DEP, DOHMH, and OATH databases.',
              },
              {
                step: '3',
                title: 'Get alerts + resolution guides',
                desc: 'New violation? You get an alert with severity, deadline, and an AI-generated step-by-step resolution guide.',
              },
              {
                step: '4',
                title: 'Fix it \u2014 DIY or hire a pro',
                desc: 'Follow the guide yourself or tap our contractor marketplace to get quotes from specialists in minutes.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-7 border border-gray-200 h-full">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white text-sm font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. SOCIAL PROOF ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Trusted by NYC property managers
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              Landlords and management companies rely on ViolationAlert to protect their portfolios.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: '\u201CViolationAlert caught an HPD lead paint violation that DOB Alerts completely missed. Saved us from a $25K fine.\u201D',
                name: 'Property Manager',
                role: 'Brooklyn, 45 units',
              },
              {
                quote: '\u201CThe resolution guides alone are worth the price. Instead of calling my lawyer for every violation, I know exactly what to do.\u201D',
                name: 'Building Owner',
                role: 'Manhattan, 12 buildings',
              },
              {
                quote: '\u201CWe switched from DOB Alerts after missing FDNY violations for 6 months. ViolationAlert covers everything in one place.\u201D',
                name: 'Property Management Co.',
                role: 'Queens, 200+ units',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">{testimonial.quote}</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. PRICING ===== */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="text-gray-500 mt-4 text-lg">Start free. Upgrade when you need more coverage.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left flex flex-col">
              <h3 className="font-semibold text-lg text-gray-900">Free</h3>
              <p className="text-4xl font-bold mt-2 text-gray-900">$0<span className="text-base text-gray-400 font-normal">/mo</span></p>
              <p className="text-sm text-gray-500 mt-2">Perfect for getting started</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2"><CheckIcon /> Up to 3 properties</li>
                <li className="flex items-center gap-2"><CheckIcon /> DOB violations only</li>
                <li className="flex items-center gap-2"><CheckIcon /> Daily scanning</li>
                <li className="flex items-center gap-2"><CheckIcon /> Email notifications</li>
                <li className="flex items-center gap-2 text-gray-400"><XIcon /> Resolution engine</li>
                <li className="flex items-center gap-2 text-gray-400"><XIcon /> Contractor marketplace</li>
              </ul>
              <Link href="/signup" className="mt-8 block text-center border border-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                Get started free
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-red-600 p-8 text-left relative flex flex-col shadow-lg shadow-red-100">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-4 py-1 rounded-full font-medium">
                Most popular
              </span>
              <h3 className="font-semibold text-lg text-gray-900">Pro</h3>
              <p className="text-4xl font-bold mt-2 text-gray-900">$29<span className="text-base text-gray-400 font-normal">/mo</span></p>
              <p className="text-sm text-gray-500 mt-2">Full coverage for serious landlords</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2"><CheckIcon /> Unlimited properties</li>
                <li className="flex items-center gap-2"><CheckIcon /> <strong>All 10+ agencies</strong></li>
                <li className="flex items-center gap-2"><CheckIcon /> 15-minute scanning</li>
                <li className="flex items-center gap-2"><CheckIcon /> Email + SMS + WhatsApp</li>
                <li className="flex items-center gap-2"><CheckIcon /> AI resolution engine</li>
                <li className="flex items-center gap-2"><CheckIcon /> Contractor marketplace</li>
                <li className="flex items-center gap-2"><CheckIcon /> Priority support</li>
              </ul>
              <Link href="/signup" className="mt-8 block text-center bg-red-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                Start 14-day free trial
              </Link>
            </div>
            {/* Enterprise */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left flex flex-col">
              <h3 className="font-semibold text-lg text-gray-900">Enterprise</h3>
              <p className="text-4xl font-bold mt-2 text-gray-900">Custom</p>
              <p className="text-sm text-gray-500 mt-2">For management companies and portfolios</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2"><CheckIcon /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckIcon /> API access</li>
                <li className="flex items-center gap-2"><CheckIcon /> Team accounts and roles</li>
                <li className="flex items-center gap-2"><CheckIcon /> Webhook integrations</li>
                <li className="flex items-center gap-2"><CheckIcon /> Dedicated account manager</li>
                <li className="flex items-center gap-2"><CheckIcon /> Custom reporting</li>
                <li className="flex items-center gap-2"><CheckIcon /> SLA guarantee</li>
              </ul>
              <a href="mailto:sales@violationalert.com" className="mt-8 block text-center border border-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 9. FAQ ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {FAQ_ITEMS.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-500 leading-relaxed pr-8">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10. FINAL CTA ===== */}
      <section className="bg-red-600 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Stop paying for violations you didn&apos;t know about.
          </h2>
          <p className="text-red-100 text-lg mt-4 max-w-xl mx-auto">
            Join property managers who monitor all their buildings across 10+
            NYC agencies. Free for 3 properties, forever.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/signup" className="bg-white text-red-600 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-red-50 transition-colors">
              Start monitoring free
            </Link>
            <a href="mailto:sales@violationalert.com" className="border border-white/50 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors">
              Talk to sales
            </a>
          </div>
          <p className="text-red-200 text-sm mt-4">No credit card required. Set up in under 2 minutes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm font-semibold text-white">
              Violation<span className="text-red-500">Alert</span>
            </span>
            <p className="text-sm">NYC Building Violation Monitoring &amp; Resolution Platform</p>
            <div className="flex gap-6 text-sm">
              <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
              <a href="mailto:sales@violationalert.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
