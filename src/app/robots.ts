import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/properties/', '/violations/', '/settings/', '/marketplace/'],
      },
    ],
    sitemap: 'https://violationalert.com/sitemap.xml',
  };
}
