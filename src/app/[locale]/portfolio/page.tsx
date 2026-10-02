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
    isProprietary: Boolean(entry.isProprietary),
    techStack: [...entry.techStack],
    metrics: entry.metrics.map((m) => ({
      label: locale === 'en' ? (m.labelEn || m.labelFr) : m.labelFr,
      value: locale === 'en' ? (m.valueEn || m.valueFr) : m.valueFr,
      delta: locale === 'en' ? (m.deltaEn || m.deltaFr) : m.deltaFr,
    })),
  }));

  const preferredOrder = ['welqo', 'michi', 'bely', 'weedin'];
  projects.sort((a, b) => {
    const idxA = preferredOrder.indexOf(a.slug);
    const idxB = preferredOrder.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.slug.localeCompare(b.slug);
  });

  return <PortfolioClient projects={projects} />;
}
