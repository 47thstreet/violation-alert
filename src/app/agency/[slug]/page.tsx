import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AGENCIES, getAgencyBySlug, getOtherAgencies } from '@/lib/agency-data';

export function generateStaticParams() {
  return AGENCIES.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);
  if (!agency) return {};

  const title = `${agency.fullName} Violations \u2014 NYC Violation Monitor`;
  const description = `Check ${agency.abbr} violations for your NYC property. ${agency.description.slice(0, 120)}... Monitor ${agency.abbr} violations with instant alerts.`;

  return {
    title,
    description,
    keywords: [
      `${agency.abbr} violations NYC`,
      `${agency.abbr} violation checker`,
      `${agency.abbr} violation lookup`,
      `NYC ${agency.abbr} penalties`,
      `${agency.name} violations`,
      `${agency.abbr} violation search`,
      `NYC building violations ${agency.abbr}`,
      `${agency.abbr} fines NYC`,
    ],
    alternates: {
      canonical: `/agency/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/agency/${slug}`,
      siteName: 'ViolationAlert',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${agency.abbr} Violations - ViolationAlert`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function AgencyPage({ params }: Props) {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);

  if (!agency) {
    notFound();
  }

  const otherAgencies = getOtherAgencies(slug);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${agency.fullName} Violations`,
      description: agency.description,
      url: `https://violationalert.com/agency/${slug}`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'ViolationAlert',
        url: 'https://violationalert.com',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: agency.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Violation<span className="text-red-600">Alert</span>
          </Link>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 active:scale-[0.98] transition-all"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/#agencies" className="hover:text-gray-900 transition-colors">
              Agencies
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{agency.abbr}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{agency.icon}</span>
            <span className="bg-red-50 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
              {agency.abbr}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {agency.fullName} Violations{' '}
            <span className="text-red-600">&mdash; NYC Violation Monitor</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed max-w-3xl">
            {agency.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/signup"
              className="bg-red-600 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm text-center"
            >
              Check your property
            </Link>
            <a
              href={agency.officialSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Official {agency.abbr} website
            </a>
          </div>
        </div>
      </section>

      {/* What this agency does */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              What does {agency.abbr} do?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">{agency.whatTheyDo}</p>
          </div>
        </div>
      </section>

      {/* Common violations + Penalty range */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Common violations */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Common {agency.abbr} violation types
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {agency.commonViolations.map((violation) => (
                  <div
                    key={violation}
                    className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <svg
                      className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <span className="text-gray-700 text-sm font-medium">{violation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Penalty sidebar */}
            <div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Penalty range</h3>
                <p className="text-2xl font-bold text-red-600 mb-4">{agency.penaltyRange}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Penalties vary based on violation severity, correction timeline, and repeat
                  offense history. Penalties increase for non-compliance and can become liens on
                  your property.
                </p>
                <Link
                  href="/signup"
                  className="block text-center bg-red-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Monitor {agency.abbr} violations free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to resolve */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            How to resolve {agency.abbr} violations
          </h2>
          <div className="max-w-3xl">
            <ol className="space-y-4">
              {agency.resolutionSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{i + 1}</span>
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 max-w-3xl">
            <h3 className="font-bold text-gray-900 mb-2">
              Need help resolving {agency.abbr} violations?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              ViolationAlert&apos;s AI resolution engine generates step-by-step guides for each
              violation, including cost estimates, permit requirements, and contractor
              recommendations specific to your violation type.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Get AI-powered resolution guides
            </Link>
          </div>
        </div>
      </section>

      {/* Data source */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 text-white rounded-2xl p-8 sm:p-10 max-w-4xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">NYC Open Data source</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              ViolationAlert pulls {agency.abbr} violation data directly from the official NYC Open
              Data portal. This is the same data used by city agencies, attorneys, and title
              companies.
            </p>
            <a
              href={agency.datasetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              View {agency.abbr} dataset on NYC Open Data
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            {agency.abbr} violation FAQ
          </h2>
          <div className="divide-y divide-gray-200 bg-white rounded-2xl border border-gray-200">
            {agency.faq.map((faq) => (
              <details key={faq.question} className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none px-6 py-5">
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links to other agencies */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Also monitor these NYC agencies
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            {agency.abbr} is just one of 10+ agencies that can issue violations against your
            property. ViolationAlert monitors all of them in one dashboard.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {otherAgencies.map((other) => (
              <Link
                key={other.slug}
                href={`/agency/${other.slug}`}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{other.icon}</span>
                  <span className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {other.abbr}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{other.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Stop missing {agency.abbr} violations.
          </h2>
          <p className="text-red-100 text-lg mt-4 max-w-xl mx-auto">
            Monitor your properties for {agency.abbr} violations and 9 other NYC agencies. Free
            for 3 properties, forever.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              href="/signup"
              className="bg-white text-red-600 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-red-50 active:scale-[0.98] transition-all"
            >
              Start monitoring free
            </Link>
          </div>
          <p className="text-red-100 text-sm mt-4">
            No credit card required. Set up in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-white">
              Violation<span className="text-red-500">Alert</span>
            </Link>
            <p className="text-sm">NYC Building Violation Monitoring &amp; Resolution Platform</p>
            <div className="flex gap-6 text-sm">
              <Link href="/login" className="hover:text-white transition-colors">
                Sign in
              </Link>
              <a
                href="mailto:sales@violationalert.com"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
