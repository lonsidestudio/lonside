import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, Calendar, MapPin, ShieldCheck, Code2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/i18n/navigation';
import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/keystatic/reader';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const title = isEn
    ? 'About Lonside Studio — Independent Software Engineering (Bordeaux, France)'
    : 'À Propos de Lonside Studio — Ingénierie Logicielle Indépendante (Bordeaux)';
  const description = isEn
    ? 'Meet Lonside Studio (Lonside Corp., SIRET 999 912 173 00013, Bouliac/Bordeaux, France). Independent Lead Architect studio delivering Next.js & SaaS sprints.'
    : 'Découvrez Lonside Studio (Lonside Corp., SIRET 999 912 173 00013, Bouliac / Bordeaux). Studio indépendant d’ingénierie logicielle Next.js & SaaS au forfait ferme.';
  const frUrl = `${siteConfig.siteUrl}/a-propos`;
  const enUrl = `${siteConfig.siteUrl}/en/about`;
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

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  setRequestLocale(currentLocale);
  const isEn = currentLocale === 'en';

  const homeUrl = isEn ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const canonicalUrl = isEn ? `${siteConfig.siteUrl}/en/about` : `${siteConfig.siteUrl}/a-propos`;

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: isEn ? 'About Lonside Studio' : 'À Propos de Lonside Studio',
    isPartOf: { '@id': `${siteConfig.siteUrl}/#website` },
    about: { '@id': `${siteConfig.siteUrl}/#organization` },
    inLanguage: isEn ? 'en-US' : 'fr-FR',
  };

  const founderJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.legal.founderName,
    jobTitle: 'Founder & Lead Architect',
    worksFor: { '@id': `${siteConfig.siteUrl}/#organization` },
    url: canonicalUrl,
    sameAs: [siteConfig.githubUrl].filter(Boolean),
    knowsAbout: [
      'Next.js Architecture',
      'TypeScript Engineering',
      'PostgreSQL Multi-Tenant Systems',
      'SaaS MVP Delivery',
      'Technical SEO & Web Performance',
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Accueil', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: isEn ? 'About' : 'À propos', item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([aboutPageJsonLd, founderJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 space-y-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Back to studio' : 'Retour au studio'}</span>
          </Link>

          <header className="space-y-6 border-b border-black/[0.08] pb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>{isEn ? 'Independent Engineering Studio' : 'Studio Indépendant d’Ingénierie'}</span>
            </div>
            <h1 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.04] text-black font-normal">
              {isEn ? 'Precision software engineering,' : 'L’ingénierie logicielle,'}{' '}
              <span className="text-zinc-500">
                {isEn ? 'without middlemen.' : 'sans aucun intermédiaire.'}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl">
              {isEn
                ? 'Founded in Bouliac (Bordeaux area, France), Lonside Studio builds production web applications and SaaS platforms for founders and ambitious teams across Europe and North America—with sealed fixed pricing, contractual timelines, and 100% source code ownership.'
                : 'Établi à Bouliac (métropole de Bordeaux, France), Lonside Studio conçoit et déploie des applications web et plateformes SaaS en production pour les fondateurs et équipes exigeantes en France et à l’international — au forfait scellé, à délai contractuel et avec cession intégrale du code source.'}
            </p>
          </header>

          {/* Direction & Expertise */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-black/[0.08] bg-zinc-50/50 space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                <Code2 className="w-3.5 h-3.5 text-black" />
                <span>{isEn ? 'Leadership & Craft' : 'Direction Technique'}</span>
              </div>
              <h2 className="font-display uppercase text-2xl sm:text-3xl text-black tracking-tight font-normal">
                {siteConfig.legal.founderName} — Founder &amp; Lead Architect
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {isEn
                  ? 'Every client platform at Lonside is architected, coded, and reviewed directly at Lead Architect level. We intentionally cap concurrent sprints so your product receives senior-only engineering, zero delegation, and direct Slack/GitHub communication.'
                  : 'Chaque plateforme livrée par Lonside est architecturée, développée et revue directement à niveau Lead Architect. Nous limitons volontairement le nombre de sprints simultanés pour garantir zéro sous-traitance, zéro couche commerciale et une exécution irréprochable.'}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-black/[0.08] bg-white space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>{isEn ? 'Verified Legal Identity' : 'Identité Légale Vérifiée'}</span>
              </div>
              <h2 className="font-display uppercase text-2xl sm:text-3xl text-black tracking-tight font-normal">
                {siteConfig.legal.tradeName}
              </h2>
              <dl className="space-y-2 text-xs sm:text-sm font-mono text-zinc-600">
                <div className="flex justify-between gap-4 py-1 border-b border-black/[0.05]">
                  <dt className="text-zinc-500">SIRET</dt>
                  <dd className="text-black font-medium">{siteConfig.legal.siret}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-black/[0.05]">
                  <dt className="text-zinc-500">SIREN / APE</dt>
                  <dd className="text-black font-medium">
                    {siteConfig.legal.siren} · {siteConfig.legal.apeCode}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-black/[0.05]">
                  <dt className="text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Office' : 'Siège'}</span>
                  </dt>
                  <dd className="text-black font-medium text-right">
                    {siteConfig.legal.streetAddress}, {siteConfig.legal.postalCode} {siteConfig.legal.addressLocality}, France
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-1">
                  <dt className="text-zinc-500">Email</dt>
                  <dd className="text-black font-medium">{siteConfig.contactEmail}</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Principes d'ingénierie */}
          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {isEn ? 'Non-negotiable engineering standards' : 'Nos standards d’ingénierie non-négociables'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  num: '01',
                  title: isEn ? 'Contractual delivery & fixed scope' : 'Délai contractuel & forfait fixe',
                  desc: isEn
                    ? 'Scope is locked before line one of code. Pricing never moves, and every 48h of studio delay triggers an automatic 10% fee penalty.'
                    : 'Le périmètre est verrouillé avant la première ligne de code. Le budget ne bouge jamais et tout retard imputable au studio déclenche 10 % de pénalité par 48 h.',
                },
                {
                  num: '02',
                  title: isEn ? '100% private GitHub IP transfer' : 'Cession 100 % sur votre GitHub',
                  desc: isEn
                    ? 'Every commit, SQL migration, and UI component lives on your private GitHub repository from day one. Zero proprietary lock-in.'
                    : 'Chaque commit, schéma SQL et composant d’interface est poussé dès le premier jour sur votre propre dépôt GitHub privé. Zéro dépendance.',
                },
                {
                  num: '03',
                  title: isEn ? 'Production-grade security & SEO' : 'Sécurité, SEO & Core Web Vitals',
                  desc: isEn
                    ? 'Strict TypeScript, PostgreSQL RLS, CSP/HSTS headers, GDPR telemetry, and technical SEO baked into every shipped build.'
                    : 'TypeScript strict, PostgreSQL RLS, en-têtes CSP/HSTS, télémétrie RGPD et SEO technique intégrés nativement dans chaque livraison.',
                },
              ].map((pillar) => (
                <div key={pillar.num} className="p-6 rounded-xl border border-black/[0.08] bg-zinc-50/40 space-y-3">
                  <span className="font-mono text-2xl text-zinc-400 block">{pillar.num}</span>
                  <h3 className="font-display uppercase text-xl text-black tracking-tight font-medium">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-black/[0.08] bg-zinc-50/50 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-black font-normal">
                {isEn ? 'Talk directly with the Lead Architect' : 'Échangez directement avec le Lead Architect'}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {isEn
                  ? '15 minutes to scope your product architecture, lock your timeline, and confirm fixed pricing.'
                  : '15 minutes pour cadrer l’architecture de votre produit, valider le délai et confirmer le forfait ferme.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={siteConfig.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Book 15 min' : 'Réserver 15 min'}</span>
              </a>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-black/[0.15] hover:border-black bg-white text-black font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <span>{isEn ? 'Case studies' : 'Études de cas'}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
