import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export type Locale = 'fr' | 'en';

export interface LocalizedProject {
  slug: string;
  client: string;
  industry: string;
  headline: string;
  challenge: string;
  solution: string;
  clientFeedback: string;
  isProprietary: boolean;
  studioNote: string;
  clientNeeds: Array<{ title: string; desc: string }>;
  constraints: Array<{ title: string; badge: string; risk: string; resolution: string }>;
  architectureSummary: string;
  services: readonly string[];
  techStack: readonly string[];
  metrics: Array<{ label: string; value: string; delta: string }>;
  process: Array<{ day: string; actor: string; action: string }>;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
  deliveryDays: number;
  coverColor: string;
  liveUrl: string;
}

export interface LocalizedFaqItem {
  slug: string;
  order: number;
  question: string;
  answer: string;
  category: 'pricing' | 'ip' | 'tech' | 'guarantee' | 'handover' | 'quality';
}

/**
 * Récupère tous les projets du portfolio traduits pour la locale donnée
 */
export async function getPortfolioProjects(locale: Locale = 'fr'): Promise<LocalizedProject[]> {
  const slugs = await reader.collections.portfolio.list();
  const rawProjects = await Promise.all(
    slugs.map(async (slug) => {
      const data = await reader.collections.portfolio.read(slug);
      return data ? { slug, data } : null;
    })
  );

  const isEn = locale === 'en';

  return rawProjects
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map(({ slug, data }) => ({
      slug,
      client: data.client || slug,
      industry: (isEn ? data.industryEn : data.industryFr) || data.industryFr || '',
      headline: (isEn ? data.headlineEn : data.headlineFr) || data.headlineFr || '',
      challenge: (isEn ? data.challengeEn : data.challengeFr) || data.challengeFr || '',
      solution: (isEn ? data.solutionEn : data.solutionFr) || data.solutionFr || '',
      clientFeedback: (isEn ? data.clientFeedbackEn : data.clientFeedbackFr) || data.clientFeedbackFr || '',
      isProprietary: Boolean(data.isProprietary),
      studioNote: (isEn ? data.studioNoteEn : data.studioNoteFr) || data.studioNoteFr || '',
      clientNeeds: (data.clientNeeds || []).map((need) => ({
        title: (isEn ? need.titleEn : need.titleFr) || need.titleFr || '',
        desc: (isEn ? need.descEn : need.descFr) || need.descFr || '',
      })),
      constraints: (data.constraints || []).map((c) => ({
        title: (isEn ? c.titleEn : c.titleFr) || c.titleFr || '',
        badge: (isEn ? c.badgeEn : c.badgeFr) || c.badgeFr || '',
        risk: (isEn ? c.riskEn : c.riskFr) || c.riskFr || '',
        resolution: (isEn ? c.resolutionEn : c.resolutionFr) || c.resolutionFr || '',
      })),
      architectureSummary:
        (isEn ? data.architectureSummaryEn : data.architectureSummaryFr) || data.architectureSummaryFr || '',
      services: data.services || [],
      techStack: data.techStack || [],
      metrics: (data.metrics || []).map((m) => ({
        label: (isEn ? m.labelEn : m.labelFr) || m.labelFr || '',
        value: (isEn ? m.valueEn : m.valueFr) || m.valueFr || '',
        delta: (isEn ? m.deltaEn : m.deltaFr) || m.deltaFr || '',
      })),
      process: (data.process || []).map((p) => ({
        day: (isEn ? p.dayEn : p.dayFr) || p.dayFr || '',
        actor: (isEn ? p.actorEn : p.actorFr) || p.actorFr || '',
        action: (isEn ? p.actionEn : p.actionFr) || p.actionFr || '',
      })),
      testimonialQuote:
        (isEn ? data.testimonialQuoteEn : data.testimonialQuoteFr) || data.testimonialQuoteFr || '',
      testimonialAuthor: data.testimonialAuthor || '',
      testimonialRole:
        (isEn ? data.testimonialRoleEn : data.testimonialRoleFr) || data.testimonialRoleFr || '',
      deliveryDays: Number(data.deliveryDays) || 14,
      coverColor: data.coverColor || '#0a0a0a',
      liveUrl: data.liveUrl || '',
    }));
}

/**
 * Récupère un projet spécifique par son slug
 */
export async function getProjectBySlug(
  slug: string,
  locale: Locale = 'fr'
): Promise<LocalizedProject | null> {
  const projects = await getPortfolioProjects(locale);
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * Récupère les questions/réponses de la FAQ ordonnées
 */
export async function getFaqItems(locale: Locale = 'fr'): Promise<LocalizedFaqItem[]> {
  const isEn = locale === 'en';
  const faqDir = path.join(process.cwd(), 'content', 'faq');

  let slugs: string[] = [];
  try {
    slugs = await reader.collections.faq.list();
  } catch {
    if (fs.existsSync(faqDir)) {
      slugs = fs
        .readdirSync(faqDir)
        .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
        .map((f) => f.replace(/\.ya?ml$/, ''));
    }
  }

  const rawItems = await Promise.all(
    slugs.map(async (slug) => {
      let data: Record<string, unknown> | null = null;
      try {
        data = (await reader.collections.faq.read(slug)) as Record<string, unknown> | null;
      } catch {}

      // Si data est incomplet ou que questionFr est nul (problème de slugField Keystatic)
      if (!data || !data.questionFr) {
        try {
          const filePath = path.join(faqDir, `${slug}.yaml`);
          if (fs.existsSync(filePath)) {
            const rawContent = fs.readFileSync(filePath, 'utf8');
            data = yaml.parse(rawContent) as Record<string, unknown>;
          }
        } catch {}
      }

      return data ? { slug, data } : null;
    })
  );

  return rawItems
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map(({ slug, data }) => {
      const qFr = String(data.questionFr || '');
      const qEn = String(data.questionEn || '');
      const aFr = String(data.answerFr || '');
      const aEn = String(data.answerEn || '');

      return {
        slug,
        order: Number(data.order) || 99,
        question: (isEn ? qEn : qFr) || qFr || qEn || '',
        answer: (isEn ? aEn : aFr) || aFr || aEn || '',
        category: (data.category as LocalizedFaqItem['category']) || 'pricing',
      };
    })
    .filter((item) => Boolean(item.question && item.answer))
    .sort((a, b) => a.order - b.order);
}

/**
 * Récupère un document légal
 */
export async function getLegalDocument(
  kind: 'mentionsLegales' | 'politiqueConfidentialite' | 'cgv' | 'cookies',
  locale: Locale = 'fr'
) {
  const data = await reader.singletons[kind].read();
  if (!data) return null;

  const isEn = locale === 'en';
  return {
    title: (isEn ? data.titleEn : data.titleFr) || data.titleFr,
    sections: isEn ? data.sectionsEn : data.sectionsFr,
  };
}
