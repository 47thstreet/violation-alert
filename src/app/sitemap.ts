import type { MetadataRoute } from 'next';
import { AGENCIES } from '@/lib/agency-data';

const SITE_URL = 'https://violationalert.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const agencyPages: MetadataRoute.Sitemap = AGENCIES.map((agency) => ({
    url: `${SITE_URL}/agency/${agency.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...agencyPages,
  ];
}
