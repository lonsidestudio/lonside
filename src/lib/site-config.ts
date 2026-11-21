/**
 * Configuration centralisée des URLs et variables publiques du studio.
 * Toutes les valeurs sont configurables via les variables d'environnement (.env / .env.local).
 */

const CANONICAL_SITE_URL = 'https://www.lonside.com';

function normalizeSiteUrl(rawUrl?: string): string {
  const cleaned = (rawUrl || CANONICAL_SITE_URL).trim().replace(/\/+$/, '');
  try {
    const parsed = new URL(cleaned);
    // Force systématiquement https://www.lonside.com même si NEXT_PUBLIC_SITE_URL
    // a été configuré sur l'apex sans www (évite toute boucle canonique <-> 308).
    if (parsed.hostname === 'lonside.com' || parsed.hostname === 'www.lonside.com') {
      return CANONICAL_SITE_URL;
    }
    return parsed.origin;
  } catch {
    return CANONICAL_SITE_URL;
  }
}

function normalizeProfileUrl(rawUrl: string | undefined, fallback: string): string {
  const cleaned = (rawUrl ?? fallback).trim();
  if (!cleaned) return '';
  try {
    const parsed = new URL(cleaned);
    // Ignore les homepages génériques (ex. https://linkedin.com ou https://twitter.com)
    // qui polluent le champ sameAs du Knowledge Graph.
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return '';
    }
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return '';
  }
}

export const siteConfig = {
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  calendarUrl: process.env.NEXT_PUBLIC_CALENDAR_URL || 'https://cal.com/lonsidestudio',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@lonside.com',
  githubUrl: normalizeProfileUrl(process.env.NEXT_PUBLIC_GITHUB_URL, 'https://github.com/lonsidestudio'),
  linkedinUrl: normalizeProfileUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL, ''),
  twitterUrl: normalizeProfileUrl(process.env.NEXT_PUBLIC_TWITTER_URL, ''),
  youtubeUrl: normalizeProfileUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL, ''),
  legal: {
    brandName: 'Lonside Studio',
    tradeName: 'Lonside Corp.',
    siret: '999 912 173 00013',
    siretCompact: '99991217300013',
    siren: '999 912 173',
    apeCode: '6820A',
    streetAddress: '1 Allée Silvestre',
    postalCode: '33270',
    addressLocality: 'Bouliac',
    department: '33 - Gironde',
    addressRegion: 'Nouvelle-Aquitaine',
    addressCountry: 'FR',
    founderName: 'Kevin T.',
  },
};

