import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SprintEstimator from '@/components/estimation/SprintEstimator';
import { Link } from '@/lib/i18n/navigation';
import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/keystatic/reader';

interface EstimationPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: EstimationPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const title = isEn
    ? 'MVP & Web Application Scope Estimator — Lonside Studio'
    : 'Simulateur de Prix & Délai MVP / Application Web — Lonside Studio';
  const description = isEn
    ? 'Estimate your SaaS MVP or custom Next.js web application scope, fixed budget (€6,900–€13,900), and guaranteed delivery timeline in 30 seconds.'
    : 'Estimez le forfait ferme (6 900 € à 13 900 € HT) et le délai garanti (14 à 30 jours) de votre MVP SaaS ou application web Next.js en 30 secondes.';
  const frUrl = `${siteConfig.siteUrl}/estimation`;
  const enUrl = `${siteConfig.siteUrl}/en/estimate`;
  const canonical = isEn ? enUrl : frUrl;

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
      locale: isEn ? 'en_US' : 'fr_FR',
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

export default async function EstimationPage({ params }: EstimationPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  setRequestLocale(currentLocale);
  const isEn = currentLocale === 'en';

  const homeUrl = isEn ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const canonicalUrl = isEn ? `${siteConfig.siteUrl}/en/estimate` : `${siteConfig.siteUrl}/estimation`;

  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: isEn ? 'Lonside Sprint Scope & Pricing Estimator' : 'Simulateur de Périmètre & Forfait Lonside',
    url: canonicalUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    provider: { '@id': `${siteConfig.siteUrl}/#organization` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Accueil', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: isEn ? 'Estimator' : 'Estimation', item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webAppJsonLd, breadcrumbJsonLd]) }}
      />
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 space-y-12 sm:space-y-14">
          <div className="space-y-6 max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to studio' : 'Retour au studio'}</span>
            </Link>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-500 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>{isEn ? 'Interactive Scope Simulator' : 'Simulateur de Périmètre & Forfait'}</span>
              </div>
              <h1 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.04] text-black font-normal">
                {isEn ? 'Estimate your sprint,' : 'Estimez votre sprint,'}{' '}
                <span className="text-zinc-500">
                  {isEn ? 'in 30 seconds.' : 'en 30 secondes.'}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                {isEn
                  ? 'Select your product type and required technical modules to identify the exact Lonside fixed-price sprint and guaranteed delivery window.'
                  : 'Sélectionnez votre type de produit et les briques techniques nécessaires pour identifier le forfait ferme Lonside et le délai garanti adaptés.'}
              </p>
            </div>
          </div>

          <SprintEstimator isEn={isEn} />
        </div>
      </main>
      <Footer />
    </>
  );
}
