import { MetadataRoute } from 'next';
import { reader } from '@/lib/keystatic/reader';

const BASE_URL = 'https://lonside.ai';
const LOCALES = ['fr', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    '/', '/services', '/services/site-vitrine', '/services/application-web',
    '/services/automatisation', '/services/design',
    '/methode', '/portfolio', '/tarifs', '/blog', '/a-propos', '/contact',
    '/legal/mentions-legales', '/legal/politique-confidentialite', '/legal/cgv',
  ];

  const staticPages = paths.flatMap((path) =>
    LOCALES.map((locale) => {
      const localePath = path === '/' ? `/${locale}` : `/${locale}${path}`;
      return {
        url: `${BASE_URL}${localePath}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: path === '/' ? 1.0 : 0.8,
        alternates: {
          languages: {
            fr: `${BASE_URL}${path === '/' ? '/fr' : `/fr${path}`}`,
            en: `${BASE_URL}${path === '/' ? '/en' : `/en${path}`}`,
          },
        },
      };
    })
  );

  const [blogSlugs, portfolioSlugs] = await Promise.all([
    reader.collections.blog.list(),
    reader.collections.portfolio.list(),
  ]);

  const blogPages = blogSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/blog/${slug}`,
          en: `${BASE_URL}/en/blog/${slug}`,
        },
      },
    }))
  );

  const portfolioPages = portfolioSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/portfolio/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/portfolio/${slug}`,
          en: `${BASE_URL}/en/portfolio/${slug}`,
        },
      },
    }))
  );

  return [...staticPages, ...blogPages, ...portfolioPages];
}
