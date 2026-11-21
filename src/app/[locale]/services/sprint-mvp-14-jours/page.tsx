import { setRequestLocale } from 'next-intl/server';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { buildServiceMetadata } from '@/lib/services-data';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return buildServiceMetadata('sprint-mvp-14-jours', locale);
}

export default async function SprintMvpPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicePageTemplate serviceKey="sprint-mvp-14-jours" locale={locale} />;
}
