import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/i18n/navigation';
import { getPortfolioProjects, type Locale } from '@/lib/keystatic/reader';
import { siteConfig } from '@/lib/site-config';

interface PortfolioHubProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PortfolioHubProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'portfolio' });
  const title = t('hubMetaTitle');
  const description = t('hubMetaDescription');
  const frUrl = `${siteConfig.siteUrl}/portfolio`;
  const enUrl = `${siteConfig.siteUrl}/en/portfolio`;
  const canonical = locale === 'en' ? enUrl : frUrl;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        fr: frUrl,
        en: enUrl,
        'x-default': frUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Lonside Studio',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: `${siteConfig.siteUrl}/og?locale=${locale}&title=${encodeURIComponent(title)}`,
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
      images: [`${siteConfig.siteUrl}/og?locale=${locale}&title=${encodeURIComponent(title)}`],
    },
  };
}

export default async function PortfolioPage({ params }: PortfolioHubProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  setRequestLocale(currentLocale);

  const [t, tCommon, projects] = await Promise.all([
    getTranslations({ locale: currentLocale, namespace: 'portfolio' }),
    getTranslations({ locale: currentLocale, namespace: 'common' }),
    getPortfolioProjects(currentLocale),
  ]);

  const canonicalUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en/portfolio` : `${siteConfig.siteUrl}/portfolio`;
  const homeUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const contactHref = currentLocale === 'en' ? '/en#contact' : '/#contact';

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: t('hubMetaTitle'),
    isPartOf: { '@id': `${siteConfig.siteUrl}/#website` },
    about: { '@id': `${siteConfig.siteUrl}/#organization` },
    inLanguage: currentLocale === 'en' ? 'en-US' : 'fr-FR',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.client,
        url: currentLocale === 'en'
          ? `${siteConfig.siteUrl}/en/portfolio/${project.slug}`
          : `${siteConfig.siteUrl}/portfolio/${project.slug}`,
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tCommon('home'), item: homeUrl },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbLabel'), item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionJsonLd, breadcrumbJsonLd]) }}
      />
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-14 sm:space-y-16">
          <div className="space-y-6 max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{tCommon('backToStudio')}</span>
            </Link>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-500 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>{t('eyebrow')}</span>
              </div>
              <h1 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.04] text-black font-normal">
                {t('h1Prefix')}{' '}
                <span className="text-zinc-500">{t('h1Highlight')}</span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                {t('intro')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                href={{ pathname: '/portfolio/[slug]', params: { slug: project.slug } }}
                className="group rounded-xl bg-zinc-50/40 hover:bg-white border border-black/[0.08] hover:border-black/40 p-6 sm:p-8 transition-all duration-200 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider truncate">
                      0{index + 1} {'//'} {project.industry}
                    </span>
                    <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-white border border-black/[0.08] text-black font-medium whitespace-nowrap uppercase">
                      {project.deliveryDays} {tCommon('days')}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display uppercase text-2xl sm:text-3xl text-black tracking-tight group-hover:text-zinc-600 transition-colors font-medium">
                      {project.client}
                    </h2>
                    <span className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                    {project.headline}
                  </p>

                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white border border-black/[0.08] text-zinc-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between gap-3 text-xs font-mono">
                  {project.metrics[0] ? (
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <span className="text-black font-semibold whitespace-nowrap">
                        {project.metrics[0].value}
                      </span>
                      <span className="text-zinc-500 truncate">{project.metrics[0].label}</span>
                    </div>
                  ) : (
                    <span className="text-zinc-500 uppercase">
                      {tCommon('liveInProduction')}
                    </span>
                  )}
                  <span className="text-black underline underline-offset-4 font-medium whitespace-nowrap">
                    {t('readDossier')}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <section className="rounded-2xl border border-black/[0.08] bg-zinc-50/50 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                {t('ctaTitle')}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {t('ctaDescription')}
              </p>
            </div>
            <a
              href={contactHref}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-black text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-[0.16em] transition-colors min-h-[48px] whitespace-nowrap shrink-0"
            >
              <span>{t('ctaButton')}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
