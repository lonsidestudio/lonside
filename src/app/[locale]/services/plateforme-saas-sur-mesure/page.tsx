import { setRequestLocale } from 'next-intl/server';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { buildServiceMetadata } from '@/lib/services-data';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return buildServiceMetadata('plateforme-saas-sur-mesure', locale);
}

export default async function CustomSaasPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicePageTemplate serviceKey="plateforme-saas-sur-mesure" locale={locale} />;
}
