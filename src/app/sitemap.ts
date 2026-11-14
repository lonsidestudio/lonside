import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

const BASE_URL = siteConfig.siteUrl;

// Date de mise à jour stable et fiable pour éviter la falsification de lastmod à chaque build
const LAST_MODIFIED = new Date('2026-11-14T00:00:00.000Z');

interface SitemapRouteDef {
  fr: string;
  en: string;
  priority: number;
  changeFrequency: 'weekly' | 'monthly' | 'yearly';
}

const ROUTES: SitemapRouteDef[] = [
  {
    fr: '/',
    en: '/en',
    priority: 1.0,
    changeFrequency: 'weekly',
  },
  {
    fr: '/legal/mentions-legales',
    en: '/en/legal/legal-notice',
    priority: 0.3,
    changeFrequency: 'yearly',
  },
  {
    fr: '/legal/politique-confidentialite',
    en: '/en/legal/privacy-policy',
    priority: 0.3,
    changeFrequency: 'yearly',
  },
  {
    fr: '/legal/cgv',
    en: '/en/legal/terms-of-sale',
    priority: 0.3,
    changeFrequency: 'yearly',
  },
  {
    fr: '/legal/cookies',
    en: '/en/legal/cookie-policy',
    priority: 0.3,
    changeFrequency: 'yearly',
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    const frUrl = route.fr === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.fr}`;
    const enUrl = `${BASE_URL}${route.en}`;
    const xDefaultUrl = `${BASE_URL}/`;

    // Entrée FR canonique (200 OK direct, zéro redirection)
    entries.push({
      url: frUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          fr: frUrl,
          en: enUrl,
          'x-default': xDefaultUrl,
        },
      },
    });

    // Entrée EN canonique (200 OK direct, zéro redirection)
    entries.push({
      url: enUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          fr: frUrl || `${BASE_URL}/`,
          en: enUrl,
          'x-default': xDefaultUrl,
        },
      },
    });
  }

  return entries;
}
