import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/lib/i18n/config';
import CookieConsent from '@/components/layout/CookieConsent';
import LocaleHtmlLang from '@/components/layout/LocaleHtmlLang';
import { siteConfig } from '@/lib/site-config';

const SITE_URL = siteConfig.siteUrl;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    authors: [{ name: 'Lonside', url: SITE_URL }],
    creator: 'Lonside',
    publisher: 'Lonside Studio',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
        { url: '/icon', sizes: '48x48', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
      ],
    },
    openGraph: {
      title: t('defaultTitle'),
      description: t('description'),
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_FR'],
      siteName: 'Lonside Studio',
      url: locale === 'fr' ? `${SITE_URL}/` : `${SITE_URL}/en`,
      images: [
        {
          url: `${SITE_URL}/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: t('defaultTitle'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('description'),
      images: [`${SITE_URL}/og?locale=${locale}`],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlLang locale={locale} />
      {children}
      <CookieConsent />
    </NextIntlClientProvider>
  );
}
