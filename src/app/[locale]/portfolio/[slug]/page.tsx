import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, ExternalLink, Layers, ShieldCheck, Cpu, Users, LayoutGrid, HelpCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import YouTubeFacade from '@/components/portfolio/YouTubeFacade';
import { Link } from '@/lib/i18n/navigation';
import { locales } from '@/lib/i18n/config';
import { getPortfolioProjects, getProjectBySlug, type Locale } from '@/lib/keystatic/reader';
import { siteConfig } from '@/lib/site-config';

interface CaseStudyPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPortfolioProjects('fr');
  return locales.flatMap((locale) =>
    projects.map((project) => ({
      locale,
      slug: project.slug,
    }))
  );
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  const isEn = currentLocale === 'en';
  const project = await getProjectBySlug(slug, currentLocale);

  if (!project) {
    return {
      title: isEn ? 'Case study not found — Lonside Studio' : 'Étude de cas introuvable — Lonside Studio',
      robots: { index: false, follow: false },
    };
  }

  const rawTitle =
    project.seoTitle ||
    (isEn
      ? `${project.client} — ${project.industry} Case Study`
      : `${project.client} — Étude de cas ${project.industry}`);
  const title = rawTitle.replace(/\s*\|\s*(Projet Lonside|Lonside Project)$/i, ' — Lonside Studio');
  const description = (project.seoDescription || project.headline).slice(0, 160);
  const frUrl = `${siteConfig.siteUrl}/portfolio/${project.slug}`;
  const enUrl = `${siteConfig.siteUrl}/en/portfolio/${project.slug}`;
  const canonical = isEn ? enUrl : frUrl;
  const ogImage = `${siteConfig.siteUrl}/og?locale=${currentLocale}&title=${encodeURIComponent(
    `${project.client} — ${project.industry}`
  )}&description=${encodeURIComponent(project.headline)}`;

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
      type: 'article',
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { locale, slug } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  setRequestLocale(currentLocale);
  const isEn = currentLocale === 'en';

  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug, currentLocale),
    getPortfolioProjects(currentLocale),
  ]);

  if (!project) {
    notFound();
  }

  const otherProjects = allProjects.filter((p) => p.slug !== project.slug);
  const homeUrl = isEn ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const portfolioUrl = isEn ? `${siteConfig.siteUrl}/en/portfolio` : `${siteConfig.siteUrl}/portfolio`;
  const canonicalUrl = `${portfolioUrl}/${project.slug}`;

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: project.seoTitle || project.client,
    description: project.seoDescription || project.headline,
    isPartOf: { '@id': `${siteConfig.siteUrl}/#website` },
    about: { '@id': `${siteConfig.siteUrl}/#organization` },
    inLanguage: isEn ? 'en-US' : 'fr-FR',
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${project.client} — ${project.headline}`,
    description: project.seoDescription || project.headline,
    url: canonicalUrl,
    inLanguage: isEn ? 'en-US' : 'fr-FR',
    image: `${siteConfig.siteUrl}/og?locale=${currentLocale}&title=${encodeURIComponent(project.client)}`,
    author: { '@id': `${siteConfig.siteUrl}/#organization` },
    publisher: { '@id': `${siteConfig.siteUrl}/#organization` },
    about: [project.industry, ...project.techStack],
    proficiencyLevel: 'Expert',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Accueil', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: isEn ? 'Case Studies' : 'Études de cas', item: portfolioUrl },
      { '@type': 'ListItem', position: 3, name: project.client, item: canonicalUrl },
    ],
  };

  const structuredData: Record<string, unknown>[] = [webPageJsonLd, articleJsonLd, breadcrumbJsonLd];

  if (project.isProprietary) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.client,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: project.headline,
      creator: { '@id': `${siteConfig.siteUrl}/#organization` },
    });
  }

  if (project.youtubeVideoId) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: project.youtubeTitle || `${project.client} — ${project.headline}`,
      description: project.seoDescription || project.headline,
      thumbnailUrl: [`https://i.ytimg.com/vi/${project.youtubeVideoId}/hqdefault.jpg`],
      embedUrl: `https://www.youtube-nocookie.com/embed/${project.youtubeVideoId}`,
      contentUrl: `https://www.youtube.com/watch?v=${project.youtubeVideoId}`,
      ...(project.youtubeDuration ? { duration: project.youtubeDuration } : {}),
      publisher: { '@id': `${siteConfig.siteUrl}/#organization` },
    });
  }

  if (project.productFaq.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: project.productFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-28">
        <article className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 space-y-14 sm:space-y-16">
          {/* Navigation fil d'Ariane */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Link href="/" className="hover:text-black transition-colors py-2 min-h-[44px] inline-flex items-center">
                {isEn ? 'Studio' : 'Accueil'}
              </Link>
              <span>/</span>
              <Link
                href="/portfolio"
                className="hover:text-black transition-colors py-2 min-h-[44px] inline-flex items-center"
              >
                {isEn ? 'Case Studies' : 'Études de cas'}
              </Link>
              <span>/</span>
              <span className="text-black font-medium">{project.client}</span>
            </div>

            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'All dossiers' : 'Tous les dossiers'}</span>
            </Link>
          </nav>

          {/* En-tête du dossier */}
          <header className="space-y-6 border-b border-black/[0.08] pb-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                {project.industry}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-zinc-50 border border-black/[0.08] text-black uppercase font-medium">
                {isEn ? `Shipped in ${project.deliveryDays} days` : `Livré en ${project.deliveryDays} jours`}
              </span>
              {project.isProprietary && (
                <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-black text-white uppercase font-medium">
                  {isEn ? 'Lonside Studio Venture' : 'Produit Propriétaire Lonside'}
                </span>
              )}
            </div>

            <h1 className="font-display uppercase text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.03] text-black font-normal">
              {project.client}
            </h1>

            <p className="text-lg sm:text-2xl text-zinc-700 font-light leading-snug max-w-3xl">
              {project.headline}
            </p>

            {project.studioNote && (
              <p className="text-sm text-zinc-600 leading-relaxed border-l-2 border-black pl-4 py-1.5 bg-zinc-50 rounded-r-lg max-w-3xl">
                {project.studioNote}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-black/[0.15] hover:border-black text-xs font-mono uppercase tracking-[0.14em] text-black transition-colors min-h-[44px]"
                >
                  <span>{isEn ? 'Visit live platform' : 'Visiter la plateforme'}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              )}
              <a
                href={isEn ? '/en#contact' : '/#contact'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 text-xs font-mono uppercase tracking-[0.14em] text-white transition-colors min-h-[44px]"
              >
                <span>{isEn ? 'Build a similar product' : 'Concevoir un produit similaire'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </header>

          {/* Démo vidéo YouTube (zéro impact LCP, activée automatiquement dès qu'un ID est renseigné) */}
          {project.youtubeVideoId && (
            <section className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
                {isEn ? 'Product Walkthrough & Architecture Teardown' : 'Démo Produit & Visite d’Architecture'}
              </h2>
              <YouTubeFacade
                videoId={project.youtubeVideoId}
                title={project.youtubeTitle || `${project.client} — ${project.headline}`}
                isEn={isEn}
              />
            </section>
          )}

          {/* Galerie captures produit (activée dès que des visuels sont ajoutés dans Keystatic) */}
          {project.screenshots.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                {isEn ? 'Product interfaces in production' : 'Interfaces produit en production'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.screenshots.map((shot, idx) => (
                  <figure
                    key={idx}
                    className="rounded-xl overflow-hidden border border-black/[0.08] bg-zinc-50/40 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] w-full bg-zinc-100">
                      <Image
                        src={shot.src}
                        alt={shot.alt || shot.caption || project.client}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    {shot.caption && (
                      <figcaption className="px-4 py-3 text-xs font-mono text-zinc-600 border-t border-black/[0.06]">
                        {shot.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Résultats chiffrés */}
          {project.metrics.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
                {isEn ? 'Measured Production Impact' : 'Impact Mesuré en Production'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl bg-zinc-50/50 border border-black/[0.08] flex flex-col justify-between space-y-2"
                  >
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      {metric.label}
                    </span>
                    <div className="font-display text-3xl sm:text-4xl text-black tracking-tight font-medium">
                      {metric.value}
                    </div>
                    {metric.delta && (
                      <span className="text-xs font-mono text-zinc-600">{metric.delta}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Acte I : Récit d'ouverture — Le Point de Rupture (Storytelling éditorial) */}
          {(project.storyOpening || project.storyLeadQuote) && (
            <section className="space-y-8 border-b border-black/[0.08] pb-14">
              <div className="space-y-3 max-w-3xl">
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500 block">
                  {isEn ? 'Act I // The Inflection Point' : 'Acte I // Le Point de Rupture'}
                </span>
                {project.storyLeadQuote && (
                  <p className="font-serif italic text-xl sm:text-2xl md:text-[1.65rem] text-black leading-[1.45] border-l-2 border-black pl-5 py-1">
                    &ldquo;{project.storyLeadQuote}&rdquo;
                  </p>
                )}
              </div>

              {project.storyOpening && (
                <div className="max-w-3xl space-y-4">
                  {project.storyOpening.split('\n\n').map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-base sm:text-[17px] text-zinc-700 leading-[1.78] font-normal"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Registre Avant / Après (Transformation Opérationnelle Mesurable) */}
              {project.beforeAfter.length > 0 && (
                <div className="pt-2">
                  <div className="overflow-x-auto rounded-xl border border-black/[0.08]">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-black/[0.08] bg-zinc-50 font-mono uppercase text-[10px] sm:text-[11px] text-zinc-500 tracking-wider">
                          <th className="p-4">{isEn ? 'Operational Reality' : 'Réalité Opérationnelle'}</th>
                          <th className="p-4">{isEn ? 'Before Lonside' : 'Avant Lonside'}</th>
                          <th className="p-4 text-black font-semibold">
                            {isEn ? 'After Production Launch' : 'Après Déploiement'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.06]">
                        {project.beforeAfter.map((row, idx) => (
                          <tr key={idx} className="bg-white">
                            <td className="p-4 font-mono text-xs uppercase tracking-wide text-black font-medium">
                              {row.dimension}
                            </td>
                            <td className="p-4 text-zinc-500 leading-relaxed">{row.before}</td>
                            <td className="p-4 text-black font-medium bg-zinc-50/50 leading-relaxed">
                              {row.after}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Acte II : Arbitrage Produit — Ce que nous avons refusé de construire */}
          {project.storyTurningPoint && (
            <section className="p-6 sm:p-10 rounded-2xl border border-black/[0.1] bg-zinc-50/40 space-y-5">
              <div className="space-y-2 max-w-3xl">
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500 block">
                  {isEn ? 'Act II // Product Thesis & Strategic Refusals' : 'Acte II // Thèse Produit & Choix Stratégiques'}
                </span>
                <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                  {isEn ? 'What we deliberately refused to build' : 'Ce que nous avons délibérément refusé de construire'}
                </h2>
              </div>
              <div className="max-w-3xl space-y-4">
                {project.storyTurningPoint.split('\n\n').map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base text-zinc-700 leading-[1.78] font-normal"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Acte III : Le Produit en Scène (Scénario d'usage réel) */}
          {project.storyWalkthrough && (
            <section className="space-y-5 max-w-3xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500 block">
                {isEn ? 'Act III // The Product in Motion' : 'Acte III // Le Produit en Action'}
              </span>
              <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                {isEn ? 'Sixty seconds inside the live product' : 'Soixante secondes dans le produit en production'}
              </h2>
              <div className="space-y-4">
                {project.storyWalkthrough.split('\n\n').map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-base sm:text-[17px] text-zinc-700 leading-[1.78] font-normal"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Défi métier vs Solution livrée */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-xl bg-zinc-50/50 border border-black/[0.08] space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
                {isEn ? '01 // Context & Business Challenge' : '01 // Contexte & Enjeu Métier'}
              </h2>
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
                {project.challenge}
              </p>
            </div>
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-black/[0.12] space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-black font-semibold">
                {isEn ? '02 // Engineered Solution' : '02 // Solution d’Ingénierie Livrée'}
              </h2>
              <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-normal">
                {project.solution}
              </p>
            </div>
          </section>

          {/* Anatomie Produit : Rôles & Parcours Utilisateurs */}
          {project.productRoles.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  <Users className="w-3.5 h-3.5 text-black" />
                  <span>{isEn ? 'Product Anatomy // User Roles' : 'Anatomie Produit // Rôles & Parcours'}</span>
                </div>
                <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                  {isEn ? 'How each persona operates the platform' : 'Comment chaque rôle utilise le produit au quotidien'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.productRoles.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl border border-black/[0.08] bg-zinc-50/40 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white border border-black/[0.08] text-zinc-600 inline-block">
                        {item.accessLevel}
                      </span>
                      <h3 className="font-display uppercase text-xl text-black tracking-tight font-medium">
                        {item.role}
                      </h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">{item.workflow}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Anatomie Produit : Modules Clés & Règles Métier */}
          {project.productModules.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  <LayoutGrid className="w-3.5 h-3.5 text-black" />
                  <span>{isEn ? 'Product Deep-Dive // Core Modules' : 'Anatomie Produit // Modules & Règles Métier'}</span>
                </div>
                <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                  {isEn ? 'Inside the product mechanics' : 'Sous le capot des écrans et règles métier'}
                </h2>
              </div>
              <div className="space-y-4">
                {project.productModules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-xl border border-black/[0.08] bg-white space-y-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {mod.tag && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black text-white font-medium">
                          {mod.tag}
                        </span>
                      )}
                      <h3 className="font-display uppercase text-lg sm:text-xl text-black tracking-tight font-medium">
                        {mod.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-zinc-50/70 border border-black/[0.05] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                          {isEn ? 'User Experience & Flow' : 'Expérience & Parcours Écran'}
                        </span>
                        <p className="text-sm text-zinc-700 leading-relaxed">{mod.behavior}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-zinc-50/70 border border-black/[0.08] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-black font-semibold block">
                          {isEn ? 'Business & Guardrail Logic' : 'Règle Métier & Sécurité'}
                        </span>
                        <p className="text-sm text-zinc-800 leading-relaxed">{mod.businessRule}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Besoins stratégiques */}
          {project.clientNeeds.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  <Layers className="w-3.5 h-3.5 text-black" />
                  <span>{isEn ? 'Product Requirements' : 'Exigences Produit'}</span>
                </div>
                <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                  {isEn ? 'Key business objectives' : 'Objectifs métier adressés'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.clientNeeds.map((need, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl bg-zinc-50/40 border border-black/[0.08] space-y-2"
                  >
                    <h3 className="font-display uppercase text-lg text-black tracking-tight font-medium">
                      {need.title}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{need.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contraintes techniques & Arbitrages d'architecture */}
          {project.constraints.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  <span>{isEn ? 'Engineering Trade-offs' : 'Arbitrages d’Architecture'}</span>
                </div>
                <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                  {isEn ? 'Technical constraints & resolutions' : 'Contraintes techniques & résolutions'}
                </h2>
              </div>
              <div className="space-y-4">
                {project.constraints.map((constraint, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-xl border border-black/[0.08] bg-white space-y-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {constraint.badge && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg bg-zinc-100 text-black font-medium">
                          {constraint.badge}
                        </span>
                      )}
                      <h3 className="font-display uppercase text-lg sm:text-xl text-black tracking-tight font-medium">
                        {constraint.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-lg bg-zinc-50/70 border border-black/[0.05] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                          {isEn ? 'Risk & Friction' : 'Contrainte & Risque'}
                        </span>
                        <p className="text-sm text-zinc-600 leading-relaxed">{constraint.risk}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-zinc-50/70 border border-black/[0.08] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-black font-semibold block">
                          {isEn ? 'Lonside Resolution' : 'Arbitrage Lonside'}
                        </span>
                        <p className="text-sm text-zinc-800 leading-relaxed">{constraint.resolution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Synthèse d'architecture & Stack */}
          {(project.architectureSummary || project.techStack.length > 0) && (
            <section className="p-6 sm:p-8 rounded-2xl border border-black/[0.08] bg-zinc-50/40 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  <Cpu className="w-3.5 h-3.5 text-black" />
                  <span>{isEn ? 'System Architecture & Stack' : 'Architecture Système & Stack'}</span>
                </div>
                <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                  {isEn ? 'Technical blueprint' : 'Socle technique déployé'}
                </h2>
              </div>

              {project.architectureSummary && (
                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                  {project.architectureSummary}
                </p>
              )}

              {project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white border border-black/[0.08] text-black"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Chronologie d'exécution du sprint */}
          {project.process.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                {isEn ? 'Sprint execution timeline' : 'Chronologie d’exécution du sprint'}
              </h2>
              <ol className="space-y-3">
                {project.process.map((step, idx) => (
                  <li
                    key={idx}
                    className="p-5 rounded-xl border border-black/[0.08] bg-white flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6"
                  >
                    <div className="shrink-0 sm:w-36 space-y-1">
                      <span className="text-xs font-mono font-semibold text-black uppercase block">
                        {step.day}
                      </span>
                      {step.actor && (
                        <span className="text-[11px] font-mono text-zinc-500 block">{step.actor}</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-700 leading-relaxed">{step.action}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Acte V : Impact Durable & Après-Lancement */}
          {project.storyOutcome && (
            <section className="p-6 sm:p-10 rounded-2xl border border-black/[0.12] bg-white space-y-5">
              <div className="space-y-2 max-w-3xl">
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500 block">
                  {isEn ? 'Act V // Production Reality & Lasting Edge' : 'Acte V // L’Après-Lancement & L’Avantage Durable'}
                </span>
                <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                  {isEn ? 'What changed once the platform went live' : 'Ce qui a changé dès la mise en production'}
                </h2>
              </div>
              <div className="max-w-3xl space-y-4">
                {project.storyOutcome.split('\n\n').map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-base sm:text-[17px] text-zinc-700 leading-[1.78] font-normal"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="pt-2">
                <a
                  href={siteConfig.calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-zinc-800 text-xs font-mono uppercase tracking-[0.14em] text-white transition-colors min-h-[46px]"
                >
                  <span>{isEn ? 'Scope a similar sprint (15 min)' : 'Cadrer un sprint similaire (15 min)'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </section>
          )}

          {/* Témoignage client */}
          {(project.testimonialQuote || project.clientFeedback) && (
            <section className="p-6 sm:p-10 rounded-2xl border border-black/[0.1] bg-zinc-50/60 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
                {isEn ? 'Client Verdict' : 'Retour Client'}
              </span>
              <blockquote className="text-base sm:text-lg italic text-zinc-900 leading-relaxed font-normal">
                &ldquo;{project.testimonialQuote || project.clientFeedback}&rdquo;
              </blockquote>
              {project.testimonialAuthor && (
                <div className="pt-3 border-t border-black/[0.06]">
                  <p className="text-sm font-semibold text-black">{project.testimonialAuthor}</p>
                  {project.testimonialRole && (
                    <p className="text-xs font-mono text-zinc-500">{project.testimonialRole}</p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* FAQ Produit & Sectorielle (rendue 100% SSR + FAQPage JSON-LD) */}
          {project.productFaq.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  <HelpCircle className="w-3.5 h-3.5 text-black" />
                  <span>{isEn ? 'Product & Industry FAQ' : 'FAQ Produit & Secteur'}</span>
                </div>
                <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                  {isEn ? `Key questions on ${project.client}` : `Questions fréquentes autour de ${project.client}`}
                </h2>
              </div>
              <div className="space-y-3">
                {project.productFaq.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl border border-black/[0.08] bg-zinc-50/30 space-y-2"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-black">{item.question}</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Maillage interne vers les autres études de cas */}
          {otherProjects.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-black/[0.08]">
              <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                {isEn ? 'Other engineering dossiers' : 'Autres dossiers d’ingénierie'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherProjects.map((other) => (
                  <Link
                    key={other.slug}
                    href={{ pathname: '/portfolio/[slug]', params: { slug: other.slug } }}
                    className="group p-5 rounded-xl border border-black/[0.08] hover:border-black/40 bg-zinc-50/40 hover:bg-white transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block truncate">
                        {other.industry}
                      </span>
                      <h3 className="font-display uppercase text-xl text-black tracking-tight group-hover:text-zinc-600 transition-colors">
                        {other.client}
                      </h3>
                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {other.headline}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-black underline underline-offset-4">
                      {isEn ? 'Open dossier →' : 'Lire le dossier →'}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
