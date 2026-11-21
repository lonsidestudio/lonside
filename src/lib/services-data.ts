import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/keystatic/reader';

export type ServiceRouteKey =
  | 'sprint-mvp-14-jours'
  | 'application-web-nextjs'
  | 'plateforme-saas-sur-mesure'
  | 'regie-tech-senior';

export interface LocalizedServiceCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  h1Muted: string;
  intro: string;
  priceLabel: string;
  timelineLabel: string;
  warrantyLabel: string;
  idealFor: string[];
  deliverablesTitle: string;
  deliverables: Array<{ title: string; desc: string }>;
  comparisonRows: Array<{
    criterion: string;
    lonside: string;
    freelance: string;
    traditional: string;
  }>;
  faq: Array<{ q: string; a: string }>;
}

export interface ServiceDefinition {
  key: ServiceRouteKey;
  frPath: `/services/${ServiceRouteKey}`;
  enPath: string;
  priceNumeric: string;
  stack: string[];
  featuredSlugs: string[];
}

export const SERVICES: Record<ServiceRouteKey, ServiceDefinition> = {
  'sprint-mvp-14-jours': {
    key: 'sprint-mvp-14-jours',
    frPath: '/services/sprint-mvp-14-jours',
    enPath: '/en/services/14-day-mvp-sprint',
    priceNumeric: '6900',
    stack: ['Next.js 16 (App Router)', 'TypeScript Strict', 'Tailwind CSS', 'PostgreSQL / Supabase RLS', 'Stripe Billing', 'PostHog EU', 'Resend'],
    featuredSlugs: ['weedin', 'welqo'],
  },
  'application-web-nextjs': {
    key: 'application-web-nextjs',
    frPath: '/services/application-web-nextjs',
    enPath: '/en/services/nextjs-web-application',
    priceNumeric: '6900',
    stack: ['Next.js 16 (App Router / RSC)', 'React 19', 'TypeScript Strict', 'Tailwind CSS v4', 'PostgreSQL / Prisma / Supabase', 'Vercel Edge', 'Playwright / Vitest'],
    featuredSlugs: ['welqo', 'bely'],
  },
  'plateforme-saas-sur-mesure': {
    key: 'plateforme-saas-sur-mesure',
    frPath: '/services/plateforme-saas-sur-mesure',
    enPath: '/en/services/custom-saas-platform',
    priceNumeric: '13900',
    stack: ['Next.js 16', 'PostgreSQL Multi-Tenant (RLS)', 'Node.js / Python FastAPI', 'Stripe Connect & Billing', 'Webhooks & Jobs Temps Réel', 'Vitest / Tests Intégration'],
    featuredSlugs: ['michi', 'bely', 'welqo'],
  },
  'regie-tech-senior': {
    key: 'regie-tech-senior',
    frPath: '/services/regie-tech-senior',
    enPath: '/en/services/senior-engineering-squad',
    priceNumeric: '5500',
    stack: ['Next.js / React / TypeScript', 'Node.js / Python / PostgreSQL', 'CI/CD & Architecture Cloud', 'Slack & GitHub Natif', 'Revues de code & Mentorat'],
    featuredSlugs: ['bely', 'michi'],
  },
};

export const SERVICE_KEYS = Object.keys(SERVICES) as ServiceRouteKey[];

export async function buildServiceMetadata(key: ServiceRouteKey, locale: string): Promise<Metadata> {
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  const def = SERVICES[key];
  const t = await getTranslations({ locale: currentLocale, namespace: 'services' });
  const copy = t.raw(`items.${key}`) as LocalizedServiceCopy;

  const frUrl = `${siteConfig.siteUrl}${def.frPath}`;
  const enUrl = `${siteConfig.siteUrl}${def.enPath}`;
  const canonical = currentLocale === 'en' ? enUrl : frUrl;
  const ogImage = `${siteConfig.siteUrl}/og?locale=${currentLocale}&title=${encodeURIComponent(copy.metaTitle)}&description=${encodeURIComponent(copy.metaDescription)}`;

  return {
    title: { absolute: copy.metaTitle },
    description: copy.metaDescription,
    alternates: {
      canonical,
      languages: {
        fr: frUrl,
        en: enUrl,
        'x-default': frUrl,
      },
    },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: canonical,
      siteName: 'Lonside Studio',
      locale: currentLocale === 'en' ? 'en_US' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: copy.metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: [ogImage],
    },
  };
}
