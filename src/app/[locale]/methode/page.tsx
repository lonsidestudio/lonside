import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/i18n/navigation';
import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/keystatic/reader';

interface MethodPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: MethodPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'methodPage' });
  const title = t('metaTitle');
  const description = t('metaDescription');
  const frUrl = `${siteConfig.siteUrl}/methode`;
  const enUrl = `${siteConfig.siteUrl}/en/method`;
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

export default async function MethodPage({ params }: MethodPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  setRequestLocale(currentLocale);

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale: currentLocale, namespace: 'methodPage' }),
    getTranslations({ locale: currentLocale, namespace: 'common' }),
  ]);

  const guarantees = t.raw('guarantees') as Array<{ num: string; title: string; desc: string }>;
  const protocolSteps = t.raw('protocolSteps') as Array<{ window: string; title: string; desc: string }>;
  const comparisonRows = t.raw('comparisonRows') as Array<{
    criterion: string;
    lonside: string;
    freelance: string;
    esn: string;
  }>;

  const homeUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const canonicalUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en/method` : `${siteConfig.siteUrl}/methode`;

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

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('protocolTitle'),
    description: t('intro'),
    step: protocolSteps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: `${step.window} — ${step.title}`,
      text: step.desc,
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
          __html: JSON.stringify([webPageJsonLd, howToJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 space-y-16 sm:space-y-20">
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

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {t('guaranteesTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {guarantees.map((item) => (
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

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {t('protocolTitle')}
            </h2>
            <ol className="space-y-4">
              {protocolSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="p-6 rounded-xl border border-black/[0.08] bg-white flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8"
                >
                  <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-xl bg-black text-white font-medium whitespace-nowrap self-start shrink-0">
                    {step.window}
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-display uppercase text-xl text-black tracking-tight font-medium">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {t('comparisonTitle')}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-black/[0.08]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/[0.08] bg-zinc-50 font-mono uppercase text-[11px] text-zinc-500">
                    <th className="p-4">{t('comparisonHeaders.criterion')}</th>
                    <th className="p-4 text-black font-semibold">{t('comparisonHeaders.lonside')}</th>
                    <th className="p-4">{t('comparisonHeaders.freelance')}</th>
                    <th className="p-4">{t('comparisonHeaders.esn')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.06]">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="p-4 font-medium text-black">{row.criterion}</td>
                      <td className="p-4 font-medium text-black bg-zinc-50/50">{row.lonside}</td>
                      <td className="p-4 text-zinc-600">{row.freelance}</td>
                      <td className="p-4 text-zinc-600">{row.esn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-black/[0.08] bg-zinc-50/50 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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
                href="/estimation"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-black/[0.15] hover:border-black bg-white text-black font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <span>{t('ctaEstimator')}</span>
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
