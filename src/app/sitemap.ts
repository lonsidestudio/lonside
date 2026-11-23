import fs from 'node:fs';
import path from 'node:path';
import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

const BASE_URL = siteConfig.siteUrl;

// Date de mise à jour stable et fiable pour éviter la falsification de lastmod à chaque build
const LAST_MODIFIED = new Date('2026-11-21T00:00:00.000Z');

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
    fr: '/services/sprint-mvp-14-jours',
    en: '/en/services/14-day-mvp-sprint',
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    fr: '/services/application-web-nextjs',
    en: '/en/services/nextjs-web-application',
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    fr: '/services/plateforme-saas-sur-mesure',
    en: '/en/services/custom-saas-platform',
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    fr: '/services/regie-tech-senior',
    en: '/en/services/senior-engineering-squad',
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    fr: '/services/boutique-shopify-sur-mesure',
    en: '/en/services/custom-shopify-store',
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    fr: '/estimation',
    en: '/en/estimate',
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    fr: '/portfolio',
    en: '/en/portfolio',
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    fr: '/methode',
    en: '/en/method',
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    fr: '/a-propos',
    en: '/en/about',
    priority: 0.7,
    changeFrequency: 'monthly',
  },
  {
    fr: '/bordeaux',
    en: '/en/bordeaux',
    priority: 0.85,
    changeFrequency: 'monthly',
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

function getPortfolioSlugs(): string[] {
  const portfolioDir = path.join(process.cwd(), 'content', 'portfolio');
  if (!fs.existsSync(portfolioDir)) return [];
  return fs
    .readdirSync(portfolioDir)
    .filter((file) => /\.ya?ml$/i.test(file))
    .map((file) => file.replace(/\.ya?ml$/i, ''))
    .sort();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const portfolioRoutes: SitemapRouteDef[] = getPortfolioSlugs().map((slug) => ({
    fr: `/portfolio/${slug}`,
    en: `/en/portfolio/${slug}`,
    priority: 0.8,
    changeFrequency: 'monthly',
  }));

  for (const route of [...ROUTES, ...portfolioRoutes]) {
    const frUrl = route.fr === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.fr}`;
    const enUrl = `${BASE_URL}${route.en}`;
    const xDefaultUrl = frUrl;

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
