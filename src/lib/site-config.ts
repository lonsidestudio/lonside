/**
 * Configuration centralisée des URLs et variables publiques du studio.
 * Toutes les valeurs sont configurables via les variables d'environnement (.env / .env.local).
 */
export const siteConfig = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lonside.com').replace(/\/$/, ''),
  calendarUrl: process.env.NEXT_PUBLIC_CALENDAR_URL || 'https://cal.com',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@lonside.com',
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/lonsidestudio',
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/lonside',
  twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL || '',
};

