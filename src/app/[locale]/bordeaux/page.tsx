import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/i18n/navigation';
import { getPortfolioProjects, type Locale } from '@/lib/keystatic/reader';
import { SERVICES, type LocalizedServiceCopy } from '@/lib/services-data';
import { siteConfig } from '@/lib/site-config';

interface BordeauxPageProps {
  params: Promise<{ locale: string }>;
}

const LOCAL_SERVICE_KEYS = [
  'sprint-mvp-14-jours',
  'application-web-nextjs',
  'plateforme-saas-sur-mesure',
  'boutique-shopify-sur-mesure',
] as const;

export async function generateMetadata({ params }: BordeauxPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bordeauxPage' });
  const title = t('metaTitle');
  const description = t('metaDescription');
  const frUrl = `${siteConfig.siteUrl}/bordeaux`;
  const enUrl = `${siteConfig.siteUrl}/en/bordeaux`;
  const canonical = locale === 'en' ? enUrl : frUrl;
  const ogImage = `${siteConfig.siteUrl}/og?locale=${locale}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

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
          url: ogImage,
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
      images: [ogImage],
    },
  };
}

export default async function BordeauxPage({ params }: BordeauxPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  setRequestLocale(currentLocale);

  const [t, tCommon, tServices, allProjects] = await Promise.all([
    getTranslations({ locale: currentLocale, namespace: 'bordeauxPage' }),
    getTranslations({ locale: currentLocale, namespace: 'common' }),
    getTranslations({ locale: currentLocale, namespace: 'services' }),
    getPortfolioProjects(currentLocale),
  ]);

  const zones = t.raw('zones') as string[];
  const advantages = t.raw('advantages') as Array<{ num: string; title: string; desc: string }>;
  const faq = t.raw('faq') as Array<{ q: string; a: string }>;

  const localServices = LOCAL_SERVICE_KEYS.map((key) => ({
    def: SERVICES[key],
    copy: tServices.raw(`items.${key}`) as LocalizedServiceCopy,
  }));

  const featuredProjects = allProjects.filter((p) => ['welqo', 'eunice-km'].includes(p.slug));
  const homeUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const canonicalUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en/bordeaux` : `${siteConfig.siteUrl}/bordeaux`;

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: t('metaTitle'),
    description: t('metaDescription'),
    isPartOf: { '@id': `${siteConfig.siteUrl}/#website` },
    about: { '@id': `${siteConfig.siteUrl}/#organization` },
    inLanguage: currentLocale === 'en' ? 'en-US' : 'fr-FR',
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${canonicalUrl}#localbusiness`,
    name: siteConfig.legal.brandName,
    legalName: siteConfig.legal.tradeName,
    url: canonicalUrl,
    email: siteConfig.contactEmail,
    priceRange: '4900€+',
    image: `${siteConfig.siteUrl}/og?locale=${currentLocale}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.legal.streetAddress,
      postalCode: siteConfig.legal.postalCode,
      addressLocality: siteConfig.legal.addressLocality,
      addressRegion: siteConfig.legal.addressRegion,
      addressCountry: siteConfig.legal.addressCountry,
    },
    areaServed: [
      { '@type': 'City', name: 'Bordeaux' },
      { '@type': 'City', name: 'Bouliac' },
      { '@type': 'City', name: 'Mérignac' },
      { '@type': 'City', name: 'Pessac' },
      { '@type': 'City', name: 'Talence' },
      { '@type': 'City', name: 'Bègles' },
      { '@type': 'AdministrativeArea', name: 'Gironde' },
      { '@type': 'AdministrativeArea', name: 'Nouvelle-Aquitaine' },
    ],
    parentOrganization: { '@id': `${siteConfig.siteUrl}/#organization` },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
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
          __html: JSON.stringify([webPageJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 space-y-16 sm:space-y-20">
          <nav aria-label={tCommon('breadcrumbAria')} className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{tCommon('backToStudio')}</span>
            </Link>
            <Link
              href="/estimation"
              className="text-xs font-mono uppercase tracking-[0.14em] text-black underline underline-offset-4 hover:text-zinc-600 transition-colors min-h-[44px] inline-flex items-center"
            >
              {tServices('ui.estimateLink')}
            </Link>
          </nav>

          <header className="space-y-6 border-b border-black/[0.08] pb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>{t('eyebrow')}</span>
            </div>

            <h1 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.04] text-black font-normal">
              {t('h1Prefix')} <br />
              <span className="text-zinc-500">{t('h1Highlight')}</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl font-normal">
              {t('intro')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 sm:p-6 rounded-xl border border-black/[0.1] bg-zinc-50/50 flex flex-col justify-start gap-2.5">
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>{t('kpi1Label')}</span>
                </span>
                <span className="font-display uppercase text-xl sm:text-[1.45rem] leading-[1.15] text-black tracking-tight font-medium">
                  {t('kpi1Value')}
                </span>
              </div>
              <div className="p-5 sm:p-6 rounded-xl border border-black/[0.1] bg-zinc-50/50 flex flex-col justify-start gap-2.5">
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>{t('kpi2Label')}</span>
                </span>
                <span className="font-display uppercase text-xl sm:text-[1.45rem] leading-[1.15] text-black tracking-tight font-medium">
                  {t('kpi2Value')}
                </span>
              </div>
              <div className="p-5 sm:p-6 rounded-xl border border-black/[0.1] bg-zinc-50/50 flex flex-col justify-start gap-2.5">
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>{t('kpi3Label')}</span>
                </span>
                <span className="font-display uppercase text-xl sm:text-[1.45rem] leading-[1.15] text-black tracking-tight font-medium">
                  {t('kpi3Value')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={siteConfig.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.16em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{tCommon('bookScoping15min')}</span>
              </a>
              <Link
                href="/estimation"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-black/[0.15] hover:border-black text-black font-mono text-xs uppercase tracking-[0.16em] hover:bg-zinc-50 transition-colors min-h-[48px] whitespace-nowrap"
              >
                <span>{tServices('ui.simulateCta')}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-black/[0.1] bg-zinc-50/50 flex flex-col justify-start gap-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 border-b border-black/[0.06] pb-3">
                <MapPin className="w-3.5 h-3.5 text-black" />
                <span>{t('territoryLabel')}</span>
              </div>
              <h2 className="font-display uppercase text-2xl sm:text-3xl text-black tracking-tight leading-[1.12] font-normal">
                {t('territoryTitle')}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {t('territoryDesc')}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {zones.map((zone) => (
                  <span
                    key={zone}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-black/[0.08] text-zinc-700"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-black/[0.1] bg-white flex flex-col justify-start gap-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 border-b border-black/[0.06] pb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>{t('officeCardLabel')}</span>
              </div>
              <h2 className="font-display uppercase text-2xl sm:text-3xl text-black tracking-tight leading-[1.12] font-normal">
                {siteConfig.legal.brandName} — {siteConfig.legal.addressLocality}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {t('officeCardDesc')}
              </p>
              <dl className="mt-auto pt-3 border-t border-black/[0.06] space-y-2 text-xs font-mono text-zinc-600">
                <div className="flex justify-between gap-4 py-1 border-b border-black/[0.05]">
                  <dt className="text-zinc-500">{t('officeAddressLabel')}</dt>
                  <dd className="text-black font-medium text-right">
                    {siteConfig.legal.postalCode} {siteConfig.legal.addressLocality}, Gironde
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-black/[0.05]">
                  <dt className="text-zinc-500">SIRET</dt>
                  <dd className="text-black font-medium">{siteConfig.legal.siret}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1">
                  <dt className="text-zinc-500">{t('officeEmailLabel')}</dt>
                  <dd className="text-black font-medium">{siteConfig.contactEmail}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {t('servicesHeading')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {localServices.map(({ def, copy }) => (
                <Link
                  key={def.key}
                  href={def.frPath}
                  className="group p-6 sm:p-7 rounded-xl border border-black/[0.1] hover:border-black/50 bg-zinc-50/40 hover:bg-white transition-all flex flex-col justify-start gap-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] pb-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-zinc-500">
                      {copy.priceLabel}
                    </span>
                    <span className="w-7 h-7 rounded-lg border border-black/[0.1] bg-white group-hover:bg-black group-hover:text-white group-hover:border-black text-black flex items-center justify-center transition-colors shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display uppercase text-xl text-black tracking-tight leading-snug group-hover:text-zinc-700 transition-colors font-medium">
                      {copy.metaTitle.replace(/\s*—\s*Lonside Studio$/, '')}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
                      {copy.intro}
                    </p>
                  </div>
                  <span className="mt-auto pt-3 border-t border-black/[0.06] text-[11px] font-mono text-zinc-500">
                    {copy.timelineLabel}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {t('advantagesTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {advantages.map((item) => (
                <div
                  key={item.num}
                  className="p-6 sm:p-7 rounded-xl border border-black/[0.1] bg-zinc-50/40 flex flex-col justify-start gap-4"
                >
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                    <span className="font-mono text-xl text-zinc-400 font-medium">{item.num}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display uppercase text-xl text-black tracking-tight leading-snug font-medium">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {featuredProjects.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
                  {t('proofTitle')}
                </h2>
                <Link
                  href="/portfolio"
                  className="text-xs font-mono text-black underline underline-offset-4 hover:text-zinc-600 whitespace-nowrap py-2 min-h-[44px] inline-flex items-center"
                >
                  {tServices('ui.allDossiers')}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {featuredProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={{ pathname: '/portfolio/[slug]', params: { slug: project.slug } }}
                    className="group p-6 sm:p-7 rounded-xl border border-black/[0.1] hover:border-black/50 bg-zinc-50/40 hover:bg-white transition-all flex flex-col justify-start gap-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 uppercase border-b border-black/[0.06] pb-3">
                        <span className="truncate">{project.industry}</span>
                        <span className="shrink-0 text-black font-medium">
                          {project.deliveryDays} {tCommon('days')}
                        </span>
                      </div>
                      <h3 className="font-display uppercase text-2xl text-black tracking-tight group-hover:text-zinc-600 transition-colors">
                        {project.client}
                      </h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">{project.headline}</p>
                    </div>
                    <span className="mt-auto pt-4 border-t border-black/[0.06] text-xs font-mono text-black underline underline-offset-4">
                      {tServices('ui.readArchDossier')}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {t('faqTitle')}
            </h2>
            <div className="space-y-3">
              {faq.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-black/[0.08] bg-zinc-50/30 space-y-2"
                >
                  <h3 className="text-base sm:text-lg font-medium text-black">{item.q}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-black/[0.1] bg-zinc-50/50 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                {t('ctaTitle')}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{t('ctaDescription')}</p>
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
                href="/a-propos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-black/[0.15] hover:border-black bg-white text-black font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <span>{t('ctaAbout')}</span>
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
