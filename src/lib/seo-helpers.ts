import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export type LegalRouteKey = 'mentions-legales' | 'politique-confidentialite' | 'cgv' | 'cookies';

interface LegalPathConfig {
  frSlug: string;
  enSlug: string;
}

export const LEGAL_PATHS: Record<LegalRouteKey, LegalPathConfig> = {
  'mentions-legales': {
    frSlug: 'mentions-legales',
    enSlug: 'legal-notice',
  },
  'politique-confidentialite': {
    frSlug: 'politique-confidentialite',
    enSlug: 'privacy-policy',
  },
  cgv: {
    frSlug: 'cgv',
    enSlug: 'terms-of-sale',
  },
  cookies: {
    frSlug: 'cookies',
    enSlug: 'cookie-policy',
  },
};

/**
 * Calcule l'URL canonique et les balises d'alternatives hreflang pour les pages légales,
 * en tenant compte des slugs traduits par langue et du mode localePrefix 'as-needed'.
 */
export function getLegalCanonicalAndAlternates(key: LegalRouteKey, locale: string) {
  const isEn = locale === 'en';
  const config = LEGAL_PATHS[key];
  const frUrl = `${siteConfig.siteUrl}/legal/${config.frSlug}`;
  const enUrl = `${siteConfig.siteUrl}/en/legal/${config.enSlug}`;
  const canonical = isEn ? enUrl : frUrl;

  return {
    canonical,
    alternates: {
      canonical,
      languages: {
        fr: frUrl,
        en: enUrl,
        'x-default': frUrl,
      },
    },
  };
}

/**
 * Génère un objet Metadata complet pour une page légale (Canonique, Hreflang, OG, Twitter).
 */
export function buildLegalMetadata(
  key: LegalRouteKey,
  locale: string,
  title: string,
  description: string
): Metadata {
  const { canonical, alternates } = getLegalCanonicalAndAlternates(key, locale);
  const isEn = locale === 'en';

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Lonside Studio',
      locale: isEn ? 'en_US' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: `${siteConfig.siteUrl}/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteConfig.siteUrl}/og?locale=${locale}`],
    },
  };
}

/**
 * Construit les données structurées BreadcrumbList (Schema.org) pour le référencement naturel.
 */
export function buildLegalBreadcrumbJsonLd(name: string, canonicalUrl: string, locale: string) {
  const isEn = locale === 'en';
  const homeUrl = isEn ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : 'Accueil',
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: canonicalUrl,
      },
    ],
  };
}
