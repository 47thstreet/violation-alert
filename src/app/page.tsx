import Link from 'next/link';
import type { Metadata } from 'next';
import { AGENCIES as AGENCY_DATA } from '@/lib/agency-data';

export const metadata: Metadata = {
  title: 'ViolationAlert — Your Buildings, Protected',
  description:
    'Every NYC agency that can fine your building, watched around the clock. Get alerts, resolution steps, and contractor connections before violations become expensive problems. Free for 3 properties.',
  alternates: {
    canonical: '/',
  },
};

const AGENCIES = [
  { abbr: 'DOB', name: 'Dept. of Buildings', desc: 'Construction, safety, zoning, stop work', icon: '\u{1F3D7}\uFE0F', color: 'border-blue-400' },
  { abbr: 'HPD', name: 'Housing Preservation', desc: 'Maintenance, habitability, lead paint', icon: '\u{1F3E0}', color: 'border-green-400' },
  { abbr: 'ECB', name: 'Environmental Control Board', desc: 'Penalties, hearings, fines', icon: '\u2696\uFE0F', color: 'border-orange-400' },
  { abbr: 'FDNY', name: 'Fire Department', desc: 'Fire code, sprinklers, egress', icon: '\u{1F525}', color: 'border-red-400' },
  { abbr: 'DSNY', name: 'Dept. of Sanitation', desc: 'Waste, recycling, sidewalks', icon: '\u{1F5D1}\uFE0F', color: 'border-amber-400' },
  { abbr: 'DOT', name: 'Dept. of Transportation', desc: 'Sidewalks, curb cuts, scaffolding', icon: '\u{1F6A7}', color: 'border-gray-400' },
  { abbr: 'LPC', name: 'Landmarks Preservation', desc: 'Historic districts, facades, signage', icon: '\u{1F3DB}\uFE0F', color: 'border-purple-400' },
  { abbr: 'DEP', name: 'Environmental Protection', desc: 'Water, sewer, noise, air quality', icon: '\u{1F4A7}', color: 'border-teal-400' },
  { abbr: 'DOHMH', name: 'Dept. of Health', desc: 'Lead, asbestos, mold, pests', icon: '\u{1F3E5}', color: 'border-pink-400' },
  { abbr: 'OATH', name: 'Trials & Hearings', desc: 'Hearings, adjudications', icon: '\u{1F4CB}', color: 'border-indigo-400' },
];

const COMPARISON = [
  { feature: 'Agencies monitored', us: '10+', dob: 'DOB + 311', vwatch: '8+', dguard: '6' },
  { feature: 'How to fix it', us: 'Step-by-step guides', dob: 'Not included', vwatch: 'Not included', dguard: 'Risk scores only' },
  { feature: 'Find a contractor', us: 'Built in', dob: 'No', vwatch: 'No', dguard: 'No' },
  { feature: 'Free tier', us: '3 properties, forever', dob: 'None', vwatch: 'Trial only', dguard: 'Search only' },
  { feature: 'Alert channels', us: 'Email, SMS, WhatsApp', dob: 'Email', vwatch: 'Email, SMS', dguard: 'SMS' },
  { feature: 'Starting price', us: 'Free / $29', dob: '$19/mo', vwatch: '$9.99/mo', dguard: '$49.99/10' },
];

const FAQ_ITEMS = [
  {
    question: 'Is this really free?',
    answer:
      'Completely. Add up to 3 properties, get daily DOB scans and email alerts, and use it as long as you want. No credit card. No trial period. No catch.',
  },
  {
    question: 'How is this different from DOB Alerts?',
    answer:
      'DOB Alerts watches one agency. We watch ten. And we don\u2019t just tell you about a violation \u2014 we tell you how to fix it, what it\u2019ll cost, and which contractor can handle it. They charge $19/month with no free option. We start at free.',
  },
  {
    question: 'How quickly will I find out about a new violation?',
    answer:
      'On the free plan, we check daily. On Pro, every 15 minutes \u2014 with instant alerts to your email, phone, or WhatsApp. Most of our users hear about violations before their supers do.',
  },
  {
    question: 'Which agencies do you monitor?',
    answer:
      'DOB, HPD, ECB, FDNY, DSNY, DOT, LPC, DEP, DOHMH, and OATH. If a city agency can issue a violation against your building, we\u2019re watching it.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'Nothing. It works in your browser. Sign up, type in an address, and you\u2019re covered. The whole thing takes about 30 seconds.',
  },
  {
    question: 'How does the resolution guide work?',
    answer:
      'Every violation comes with a plain-English breakdown: what went wrong, exactly what to do, estimated cost, required permits, and your deadline. Think of it as a playbook, not a legal document.',
  },
  {
    question: 'What about contractors?',
    answer:
      'When a violation lands, we match you with licensed NYC contractors who specialize in that exact issue. You get multiple quotes, see their track record, and hire directly. No cold-calling, no Googling.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Anytime. No contracts, no cancellation fees. Your free tier access stays forever, even after you cancel Pro.',
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
      'Every NYC agency that can fine your building, watched around the clock. Alerts, resolution guides, and contractor matching for property owners across all five boroughs.',
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
    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
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
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-200/60 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <span className="text-xl font-bold text-gray-900">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">VA</span>
              Violation<span className="text-indigo-600">Alert</span>
            </span>
          </span>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.97] transition-all duration-200">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ===== 1. HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-indigo-950 to-indigo-900">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="inline-block bg-white/10 text-indigo-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/10 backdrop-blur-sm">
            Now watching 10+ NYC agencies
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl mx-auto bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Your buildings, protected.
          </h1>
          <p className="text-lg sm:text-xl text-indigo-200 mt-6 max-w-2xl mx-auto leading-relaxed">
            While you sleep, we&apos;re watching every agency in New York City.
            DOB. HPD. FDNY. ECB. All of them. When something hits your building,
            you&apos;ll know &mdash; with a plan to fix it.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link href="/signup" className="bg-white text-gray-900 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-indigo-50 hover:shadow-xl hover:shadow-black/20 active:scale-[0.97] transition-all duration-200">
              Protect your first property
            </Link>
            <a href="#how-it-works" className="border border-white/30 text-white px-8 py-3.5 rounded-xl text-lg font-medium hover:bg-white/10 active:scale-[0.97] transition-all duration-200">
              See how it works
            </a>
          </div>
          <p className="text-sm text-indigo-300/70 mt-4">Free for 3 properties. No credit card. No time limit.</p>
        </div>
        {/* Smooth transition gradient to light bg */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#FAFAF9]" />
      </section>

      {/* ===== 2. PROBLEM / PAIN ===== */}
      <section className="py-16 sm:py-20 bg-[#FAFAF9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              The violation you don&apos;t see is the one that costs you.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              Most tools only watch DOB. But HPD, FDNY, DSNY, DEP &mdash; they&apos;re
              all filing violations against your building too. By the time you find out,
              the fines have doubled. The deadline has passed. And the tenant&apos;s lawyer
              has already called.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { stat: '$10K+', label: 'In fines per building, per year, when violations go unchecked', color: 'text-red-500', accent: 'border-t-4 border-t-red-400' },
              { stat: '10+', label: 'City agencies that can file against your property right now', color: 'text-indigo-600', accent: 'border-t-4 border-t-indigo-400' },
              { stat: '72hrs', label: 'The window on some violations before fines double', color: 'text-amber-500', accent: 'border-t-4 border-t-amber-400' },
              { stat: '3x', label: 'More tenant lawsuits when violations sit unresolved', color: 'text-red-500', accent: 'border-t-4 border-t-red-400' },
            ].map((item) => (
              <div key={item.stat} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${item.accent}`}>
                <div className={`text-4xl sm:text-5xl font-bold ${item.color} mb-3`}>{item.stat}</div>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. SOLUTION - 3 PILLARS ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Know it. Fix it. Move on.
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              From the moment a violation is filed to the moment it&apos;s resolved. One platform, start to finish.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Monitor */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Watch</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every 15 minutes, we check ten city agency databases for your
                properties. If something gets filed, you know about it &mdash; before the
                inspector even leaves the building.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckIcon /> 10+ agencies, one dashboard</li>
                <li className="flex items-center gap-2"><CheckIcon /> Alerts by email, SMS, or WhatsApp</li>
                <li className="flex items-center gap-2"><CheckIcon /> Urgent violations flagged first</li>
              </ul>
            </div>
            {/* Resolve */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Understand</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every violation comes with a fix. What went wrong. What to do
                about it. What it&apos;ll cost. When the deadline is. Plain English,
                not legal jargon.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckIcon /> Step-by-step resolution guides</li>
                <li className="flex items-center gap-2"><CheckIcon /> Cost and timeline estimates</li>
                <li className="flex items-center gap-2"><CheckIcon /> Permit and filing requirements</li>
              </ul>
            </div>
            {/* Connect */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fix</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Handle it yourself, or tap one button to get matched with licensed
                NYC contractors who&apos;ve fixed this exact violation before.
                Multiple quotes. Verified track records.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckIcon /> Contractors matched to your violation</li>
                <li className="flex items-center gap-2"><CheckIcon /> Multiple quotes, real reviews</li>
                <li className="flex items-center gap-2"><CheckIcon /> Hire and track through the platform</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. ALL AGENCIES ===== */}
      <section id="agencies" className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Ten agencies. One place to watch them all.
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              If a city agency can fine your building, it&apos;s on our radar. No blind spots. No surprises.
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
                  className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm border-t-4 ${agency.color} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center group`}
                >
                  <div className="text-3xl mb-2">{agency.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{agency.abbr}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{agency.desc}</p>
                </Link>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Plus 311 complaints, DOB NOW, and more sources added every quarter.
          </p>
        </div>
      </section>

      {/* ===== 5. COMPARISON TABLE ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Other tools alert you. We actually help.
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              An alert without a resolution plan is just a notification that you owe money.
            </p>
          </div>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 px-4 text-sm font-medium text-gray-500 w-48">Feature</th>
                  <th className="py-4 px-4 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-t-lg">ViolationAlert</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500">DOB Alerts</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500">ViolationWatch</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500">DOBGuard</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3.5 px-4 text-sm font-medium text-gray-700">{row.feature}</td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 bg-indigo-50">{row.us}</td>
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
              <div key={row.feature} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="font-medium text-gray-700 text-sm mb-3">{row.feature}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-indigo-50 rounded-lg p-2">
                    <div className="text-xs text-indigo-600 font-medium">ViolationAlert</div>
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
      <section id="how-it-works" className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Up and running in 30 seconds.</h2>
            <p className="text-lg text-gray-600 mt-4">No setup. No software. Just type an address.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Add your building',
                desc: 'Type any NYC address. We handle the BIN, BBL, and all the lookup details automatically.',
              },
              {
                step: '2',
                title: 'We start watching',
                desc: 'Ten agency databases, checked continuously. If anything gets filed against your property, we see it.',
              },
              {
                step: '3',
                title: 'You get the full picture',
                desc: 'Not just an alert \u2014 the violation, a resolution guide, cost estimate, and your deadline. All in one message.',
              },
              {
                step: '4',
                title: 'Resolve it your way',
                desc: 'Follow the steps yourself, or tap to get matched with a contractor who\u2019s fixed this exact issue before.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white text-sm font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. SOCIAL PROOF ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              They found out in time.
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              Property owners across all five boroughs trust ViolationAlert to keep them ahead of city agencies.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: '\u201CWe had an HPD lead paint violation we didn\u2019t know about. ViolationAlert caught it before it turned into a $25K problem. DOB Alerts never would have flagged that.\u201D',
                name: 'Rachel M.',
                role: 'Property Manager \u2014 Bed-Stuy, 45 units',
              },
              {
                quote: '\u201CI used to call my attorney every time a violation came in. Now I open the resolution guide, and nine times out of ten, I can handle it myself. It\u2019s paid for itself many times over.\u201D',
                name: 'David K.',
                role: 'Building Owner \u2014 Upper West Side, 12 buildings',
              },
              {
                quote: '\u201CWe were on DOB Alerts for two years and missed every FDNY violation in our portfolio. Switched to ViolationAlert and found six open issues in the first week. Six.\u201D',
                name: 'Angela Torres',
                role: 'Greenpoint Property Management \u2014 Queens, 200+ units',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm border-l-4 border-l-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">{testimonial.quote}</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Start free. Stay free if you want.</h2>
            <p className="text-lg text-gray-600 mt-4">No trials. No gimmicks. Upgrade only when your portfolio demands it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="font-semibold text-lg text-gray-900">Free</h3>
              <p className="text-4xl font-bold mt-2 text-gray-900">$0<span className="text-base text-gray-500 font-normal">/forever</span></p>
              <p className="text-sm text-gray-500 mt-2">Real protection, no strings attached</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2"><CheckIcon /> 3 properties included</li>
                <li className="flex items-center gap-2"><CheckIcon /> Daily DOB monitoring</li>
                <li className="flex items-center gap-2"><CheckIcon /> Email alerts</li>
                <li className="flex items-center gap-2"><CheckIcon /> No credit card, ever</li>
                <li className="flex items-center gap-2 text-gray-500"><XIcon /> Multi-agency coverage</li>
                <li className="flex items-center gap-2 text-gray-500"><XIcon /> Resolution guides</li>
              </ul>
              <Link href="/signup" className="mt-8 block text-center border border-gray-300 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                Add your building &mdash; free
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-indigo-600 p-8 text-left relative flex flex-col shadow-xl ring-4 ring-indigo-50 hover:-translate-y-0.5 transition-all duration-200">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg shadow-indigo-300/50">
                Most popular
              </span>
              <h3 className="font-semibold text-lg text-gray-900">Pro</h3>
              <p className="text-4xl font-bold mt-2 text-gray-900">$29<span className="text-base text-gray-500 font-normal">/mo</span></p>
              <p className="text-sm text-gray-500 mt-2">Less than the cost of one missed violation</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2"><CheckIcon /> Unlimited properties</li>
                <li className="flex items-center gap-2"><CheckIcon /> <strong>All 10+ agencies</strong></li>
                <li className="flex items-center gap-2"><CheckIcon /> Checks every 15 minutes</li>
                <li className="flex items-center gap-2"><CheckIcon /> Email, SMS, and WhatsApp</li>
                <li className="flex items-center gap-2"><CheckIcon /> Resolution guides for every violation</li>
                <li className="flex items-center gap-2"><CheckIcon /> Contractor matching</li>
                <li className="flex items-center gap-2"><CheckIcon /> Priority support</li>
              </ul>
              <Link href="/signup" className="mt-8 block text-center bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.97] transition-all duration-200">
                Try Pro free for 14 days
              </Link>
            </div>
            {/* Enterprise */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="font-semibold text-lg text-gray-900">Enterprise</h3>
              <p className="text-4xl font-bold mt-2 text-gray-900">Custom</p>
              <p className="text-sm text-gray-500 mt-2">For portfolios that can&apos;t afford blind spots</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2"><CheckIcon /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckIcon /> API access</li>
                <li className="flex items-center gap-2"><CheckIcon /> Team accounts and roles</li>
                <li className="flex items-center gap-2"><CheckIcon /> Webhook integrations</li>
                <li className="flex items-center gap-2"><CheckIcon /> Dedicated account manager</li>
                <li className="flex items-center gap-2"><CheckIcon /> Custom reporting</li>
                <li className="flex items-center gap-2"><CheckIcon /> SLA guarantee</li>
              </ul>
              <a href="mailto:sales@violationalert.com" className="mt-8 block text-center border border-gray-300 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 9. FAQ ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Questions you&apos;re probably asking</h2>
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
                <p className="mt-3 text-gray-600 leading-relaxed pr-8">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10. FINAL CTA ===== */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-700 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Know before they knock.
          </h2>
          <p className="text-lg text-indigo-200 mt-4 max-w-xl mx-auto">
            Your first three properties are free. No credit card.
            No time limit. Just protection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/signup" className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-indigo-50 hover:shadow-xl active:scale-[0.97] transition-all duration-200">
              Protect your first property
            </Link>
            <a href="mailto:sales@violationalert.com" className="border border-white/40 text-white px-8 py-3.5 rounded-xl text-lg font-medium hover:bg-white/10 active:scale-[0.97] transition-all duration-200">
              Talk to sales
            </a>
          </div>
          <p className="text-sm text-indigo-200 mt-4">30 seconds to set up. Watching your building by tonight.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Top: Brand + Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-lg font-bold text-white inline-flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-md bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">VA</span>
                Violation<span className="text-indigo-400">Alert</span>
              </span>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Every agency. Every violation. One dashboard.
              </p>
            </div>
            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#agencies" className="text-gray-400 hover:text-white transition-colors">Agencies</a></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="mailto:sales@violationalert.com" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
                <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Built in Brooklyn. Protecting buildings across all 5 boroughs.
            </p>
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} ViolationAlert. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
