export const locales = ['fr', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'fr';

export const pathnames = {
  '/': '/',
  '/a-propos': {
    fr: '/a-propos',
    en: '/about'
  },
  '/estimation': {
    fr: '/estimation',
    en: '/estimate'
  },
  '/portfolio': {
    fr: '/portfolio',
    en: '/portfolio'
  },
  '/portfolio/[slug]': {
    fr: '/portfolio/[slug]',
    en: '/portfolio/[slug]'
  },
  '/contact': {
    fr: '/contact',
    en: '/contact'
  },
  '/blog': {
    fr: '/blog',
    en: '/blog'
  },
  '/blog/[slug]': {
    fr: '/blog/[slug]',
    en: '/blog/[slug]'
  },
  '/services': {
    fr: '/services',
    en: '/services'
  },
  '/services/sprint-mvp-14-jours': {
    fr: '/services/sprint-mvp-14-jours',
    en: '/services/14-day-mvp-sprint'
  },
  '/services/application-web-nextjs': {
    fr: '/services/application-web-nextjs',
    en: '/services/nextjs-web-application'
  },
  '/services/plateforme-saas-sur-mesure': {
    fr: '/services/plateforme-saas-sur-mesure',
    en: '/services/custom-saas-platform'
  },
  '/services/regie-tech-senior': {
    fr: '/services/regie-tech-senior',
    en: '/services/senior-engineering-squad'
  },
  '/services/site-vitrine': {
    fr: '/services/site-vitrine',
    en: '/services/landing-page'
  },
  '/services/automatisation': {
    fr: '/services/automatisation',
    en: '/services/automation'
  },
  '/services/design': {
    fr: '/services/design',
    en: '/services/design'
  },
  '/services/application-web': {
    fr: '/services/application-web',
    en: '/services/web-application'
  },
  '/services/regie': {
    fr: '/services/regie',
    en: '/services/staff-augmentation'
  },
  '/methode': {
    fr: '/methode',
    en: '/method'
  },
  '/legal/mentions-legales': {
    fr: '/legal/mentions-legales',
    en: '/legal/legal-notice'
  },
  '/legal/politique-confidentialite': {
    fr: '/legal/politique-confidentialite',
    en: '/legal/privacy-policy'
  },
  '/legal/cgv': {
    fr: '/legal/cgv',
    en: '/legal/terms-of-sale'
  },
  '/legal/cookies': {
    fr: '/legal/cookies',
    en: '/legal/cookie-policy'
  }
} as const;

