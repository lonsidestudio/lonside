import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, Calendar, MapPin, ShieldCheck, Code2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/i18n/navigation';
import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/keystatic/reader';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const title = t('metaTitle');
  const description = t('metaDescription');
  const frUrl = `${siteConfig.siteUrl}/a-propos`;
  const enUrl = `${siteConfig.siteUrl}/en/about`;
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

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  setRequestLocale(currentLocale);

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale: currentLocale, namespace: 'about' }),
    getTranslations({ locale: currentLocale, namespace: 'common' }),
  ]);

  const standards = t.raw('standards') as Array<{ num: string; title: string; desc: string }>;
  const homeUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const canonicalUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en/about` : `${siteConfig.siteUrl}/a-propos`;

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: t('schemaName'),
    isPartOf: { '@id': `${siteConfig.siteUrl}/#website` },
    about: { '@id': `${siteConfig.siteUrl}/#organization` },
    inLanguage: currentLocale === 'en' ? 'en-US' : 'fr-FR',
  };

  const founderJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.legal.founderName,
    jobTitle: 'Founder & Lead Architect',
    worksFor: { '@id': `${siteConfig.siteUrl}/#organization` },
    url: canonicalUrl,
    sameAs: [siteConfig.githubUrl].filter(Boolean),
    knowsAbout: [
      'Next.js Architecture',
      'TypeScript Engineering',
      'PostgreSQL Multi-Tenant Systems',
      'SaaS MVP Delivery',
      'Technical SEO & Web Performance',
    ],
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([aboutPageJsonLd, founderJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 space-y-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{tCommon('backToStudio')}</span>
          </Link>

          <header className="space-y-6 border-b border-black/[0.08] pb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>{t('eyebrow')}</span>
            </div>
            <h1 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.04] text-black font-normal">
              {t('h1Prefix')}{' '}
              <span className="text-zinc-500">{t('h1Highlight')}</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl">
              {t('intro')}
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-black/[0.08] bg-zinc-50/50 space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                <Code2 className="w-3.5 h-3.5 text-black" />
                <span>{t('leadershipLabel')}</span>
              </div>
              <h2 className="font-display uppercase text-2xl sm:text-3xl text-black tracking-tight font-normal">
                {t('leadershipTitle', { founder: siteConfig.legal.founderName })}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {t('leadershipBio')}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-black/[0.08] bg-white space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>{t('legalLabel')}</span>
              </div>
              <h2 className="font-display uppercase text-2xl sm:text-3xl text-black tracking-tight font-normal">
                {siteConfig.legal.tradeName}
              </h2>
              <dl className="space-y-2 text-xs sm:text-sm font-mono text-zinc-600">
                <div className="flex justify-between gap-4 py-1 border-b border-black/[0.05]">
                  <dt className="text-zinc-500">{t('siretLabel')}</dt>
                  <dd className="text-black font-medium">{siteConfig.legal.siret}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-black/[0.05]">
                  <dt className="text-zinc-500">{t('sirenApeLabel')}</dt>
                  <dd className="text-black font-medium">
                    {siteConfig.legal.siren} · {siteConfig.legal.apeCode}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-black/[0.05]">
                  <dt className="text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t('officeLabel')}</span>
                  </dt>
                  <dd className="text-black font-medium text-right">
                    {siteConfig.legal.streetAddress}, {siteConfig.legal.postalCode} {siteConfig.legal.addressLocality}, France
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-1">
                  <dt className="text-zinc-500">{t('emailLabel')}</dt>
                  <dd className="text-black font-medium">{siteConfig.contactEmail}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {t('standardsTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {standards.map((pillar) => (
                <div key={pillar.num} className="p-6 rounded-xl border border-black/[0.08] bg-zinc-50/40 space-y-3">
                  <span className="font-mono text-2xl text-zinc-400 block">{pillar.num}</span>
                  <h3 className="font-display uppercase text-xl text-black tracking-tight font-medium">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-black/[0.08] bg-zinc-50/50 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                {t('ctaTitle')}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {t('ctaDescription')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={siteConfig.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{tCommon('book15min')}</span>
              </a>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-black/[0.15] hover:border-black bg-white text-black font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <span>{t('ctaCaseStudies')}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
