import { getTranslations } from 'next-intl/server';
import { reader } from '@/lib/keystatic/reader';
import PortfolioClient from './PortfolioClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.portfolio' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rawProjects = await reader.collections.portfolio.all();

  const projects = rawProjects.map(({ slug, entry }) => ({
    slug,
    client: entry.client,
    industry: locale === 'en' ? (entry.industryEn || entry.industryFr) : entry.industryFr,
    headline: locale === 'en' ? (entry.headlineEn || entry.headlineFr) : entry.headlineFr,
    deliveryDays: entry.deliveryDays ?? 0,
    techStack: [...entry.techStack],
    metrics: entry.metrics.map((m) => ({
      label: locale === 'en' ? (m.labelEn || m.labelFr) : m.labelFr,
      value: locale === 'en' ? (m.valueEn || m.valueFr) : m.valueFr,
      delta: locale === 'en' ? (m.deltaEn || m.deltaFr) : m.deltaFr,
    })),
  }));

  return <PortfolioClient projects={projects} />;
}
