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
    keywords: t('keywords'),
    authors: [{ name: 'lonside', url: SITE_URL }],
    openGraph: {
      title: t('defaultTitle'),
      description: t('description'),
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_FR'],
      siteName: 'lonside',
      url: SITE_URL,
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
