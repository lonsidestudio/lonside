import { setRequestLocale } from 'next-intl/server';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { buildServiceMetadata } from '@/lib/services-data';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return buildServiceMetadata('application-web-nextjs', locale);
}

export default async function NextjsWebAppPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicePageTemplate serviceKey="application-web-nextjs" locale={locale} />;
}
