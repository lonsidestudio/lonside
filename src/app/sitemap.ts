import { MetadataRoute } from 'next';

const BASE_URL = 'https://lonside.ai';
const LOCALES = ['fr', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    '/',
    '/legal/mentions-legales',
    '/legal/politique-confidentialite',
    '/legal/cgv',
    '/legal/cookies',
  ];

  const staticPages = paths.flatMap((path) =>
    LOCALES.map((locale) => {
      const localePath = path === '/' ? `/${locale}` : `/${locale}${path}`;
      return {
        url: `${BASE_URL}${localePath}`,
        lastModified: new Date(),
        changeFrequency: path === '/' ? ('weekly' as const) : ('yearly' as const),
        priority: path === '/' ? 1.0 : 0.3,
        alternates: {
          languages: {
            fr: `${BASE_URL}${path === '/' ? '/fr' : `/fr${path}`}`,
            en: `${BASE_URL}${path === '/' ? '/en' : `/en${path}`}`,
          },
        },
      };
    })
  );

  return staticPages;
}
