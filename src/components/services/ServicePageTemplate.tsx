import { ArrowLeft, ArrowUpRight, Calendar, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/i18n/navigation';
import { getPortfolioProjects, type Locale } from '@/lib/keystatic/reader';
import { SERVICES, SERVICE_KEYS, type ServiceRouteKey } from '@/lib/services-data';
import { siteConfig } from '@/lib/site-config';

interface ServicePageTemplateProps {
  serviceKey: ServiceRouteKey;
  locale: string;
}

export default async function ServicePageTemplate({ serviceKey, locale }: ServicePageTemplateProps) {
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  const isEn = currentLocale === 'en';
  const def = SERVICES[serviceKey];
  const copy = isEn ? def.en : def.fr;

  const allProjects = await getPortfolioProjects(currentLocale);
  const featuredProjects = allProjects.filter((p) => def.featuredSlugs.includes(p.slug));
  const otherServices = SERVICE_KEYS.filter((k) => k !== serviceKey).map((k) => SERVICES[k]);

  const homeUrl = isEn ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const canonicalUrl = isEn ? `${siteConfig.siteUrl}${def.enPath}` : `${siteConfig.siteUrl}${def.frPath}`;

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: copy.metaTitle,
    description: copy.metaDescription,
    isPartOf: { '@id': `${siteConfig.siteUrl}/#website` },
    about: { '@id': `${siteConfig.siteUrl}/#organization` },
    inLanguage: isEn ? 'en-US' : 'fr-FR',
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: copy.metaTitle.replace(/\s*—\s*Lonside Studio$/, ''),
    description: copy.metaDescription,
    url: canonicalUrl,
    provider: { '@id': `${siteConfig.siteUrl}/#organization` },
    areaServed: ['FR', 'EU', 'US'],
    offers: {
      '@type': 'Offer',
      price: copy.priceNumeric,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: canonicalUrl,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Accueil', item: homeUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: copy.metaTitle.replace(/\s*—\s*Lonside Studio$/, ''),
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webPageJsonLd, serviceJsonLd, faqJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 space-y-16 sm:space-y-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to studio' : 'Retour au studio'}</span>
            </Link>
            <Link
              href="/estimation"
              className="text-xs font-mono uppercase tracking-[0.14em] text-black underline underline-offset-4 hover:text-zinc-600 transition-colors min-h-[44px] inline-flex items-center"
            >
              {isEn ? 'Estimate my scope →' : 'Estimer mon périmètre →'}
            </Link>
          </nav>

          {/* Hero */}
          <header className="space-y-6 border-b border-black/[0.08] pb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>{copy.eyebrow}</span>
            </div>

            <h1 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.04] text-black font-normal">
              {copy.h1} <br />
              <span className="text-zinc-500">{copy.h1Muted}</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl font-normal">
              {copy.intro}
            </p>

            {/* Ruban de métriques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 sm:p-5 rounded-xl border border-black/[0.08] bg-zinc-50/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  {isEn ? 'Fixed Investment' : 'Forfait Transparent'}
                </span>
                <span className="font-display uppercase text-2xl sm:text-3xl text-black font-medium mt-1 block">
                  {copy.priceLabel}
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-xl border border-black/[0.08] bg-zinc-50/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  {isEn ? 'Timeline' : 'Délai Engagé'}
                </span>
                <span className="font-display uppercase text-2xl sm:text-3xl text-black font-medium mt-1 block">
                  {copy.timelineLabel}
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-xl border border-black/[0.08] bg-zinc-50/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  {isEn ? 'Protection' : 'Garantie'}
                </span>
                <span className="font-display uppercase text-2xl sm:text-3xl text-black font-medium mt-1 block">
                  {copy.warrantyLabel}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={siteConfig.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.16em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Book 15-min scoping call' : 'Réserver un cadrage (15 min)'}</span>
              </a>
              <Link
                href="/estimation"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-black/[0.15] hover:border-black text-black font-mono text-xs uppercase tracking-[0.16em] hover:bg-zinc-50 transition-colors min-h-[48px] whitespace-nowrap"
              >
                <span>{isEn ? 'Simulate scope & budget' : 'Simuler périmètre & budget'}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </header>

          {/* Pour qui ? */}
          <section className="p-6 sm:p-8 rounded-2xl border border-black/[0.08] bg-zinc-50/40 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
              {isEn ? 'Designed specifically for' : 'Conçu spécifiquement pour'}
            </h2>
            <ul className="space-y-3">
              {copy.idealFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-zinc-800 leading-relaxed">
                  <Check className="w-4 h-4 text-black shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Livrables */}
          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {copy.deliverablesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {copy.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-black/[0.08] bg-white space-y-2.5"
                >
                  <span className="text-[11px] font-mono text-zinc-500">0{idx + 1}</span>
                  <h3 className="font-display uppercase text-xl text-black tracking-tight font-medium">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {def.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-3 py-1.5 rounded-xl bg-zinc-50 border border-black/[0.08] text-black"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Tableau comparatif B2B */}
          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {isEn ? 'Lonside Studio vs alternatives' : 'Studio Lonside face aux alternatives'}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-black/[0.08]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/[0.08] bg-zinc-50 font-mono uppercase text-[11px] text-zinc-500">
                    <th className="p-4">{isEn ? 'Criterion' : 'Critère'}</th>
                    <th className="p-4 text-black font-semibold">Lonside Studio</th>
                    <th className="p-4">{isEn ? 'Solo Freelancer' : 'Freelance isolé'}</th>
                    <th className="p-4">{isEn ? 'Traditional Consultancy' : 'ESN / Prestataire classique'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.06]">
                  {copy.comparisonRows.map((row, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="p-4 font-medium text-black">{row.criterion}</td>
                      <td className="p-4 font-medium text-black bg-zinc-50/50">{row.lonside}</td>
                      <td className="p-4 text-zinc-600">{row.freelance}</td>
                      <td className="p-4 text-zinc-600">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Études de cas liées */}
          {featuredProjects.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
                  {isEn ? 'Shipped proof in production' : 'Preuves livrées en production'}
                </h2>
                <Link
                  href="/portfolio"
                  className="text-xs font-mono text-black underline underline-offset-4 hover:text-zinc-600 whitespace-nowrap py-2 min-h-[44px] inline-flex items-center"
                >
                  {isEn ? 'All dossiers →' : 'Tous les dossiers →'}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={{ pathname: '/portfolio/[slug]', params: { slug: project.slug } }}
                    className="group p-6 rounded-xl border border-black/[0.08] hover:border-black/40 bg-zinc-50/40 hover:bg-white transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 uppercase">
                        <span className="truncate">{project.industry}</span>
                        <span className="shrink-0 text-black font-medium">
                          {project.deliveryDays} {isEn ? 'days' : 'jours'}
                        </span>
                      </div>
                      <h3 className="font-display uppercase text-2xl text-black tracking-tight group-hover:text-zinc-600">
                        {project.client}
                      </h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">{project.headline}</p>
                    </div>
                    <span className="text-xs font-mono text-black underline underline-offset-4">
                      {isEn ? 'Read architecture dossier →' : 'Lire le dossier d’architecture →'}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ complète rendue dans le DOM SSR */}
          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {isEn ? 'Frequently asked questions' : 'Questions fréquentes'}
            </h2>
            <div className="space-y-3">
              {copy.faq.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-black/[0.08] bg-zinc-50/30 space-y-2"
                >
                  <h3 className="text-base sm:text-lg font-medium text-black">{item.q}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Maillage vers les autres expertises */}
          <section className="pt-8 border-t border-black/[0.08] space-y-5">
            <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
              {isEn ? 'Other Lonside Studio capabilities' : 'Autres expertises du studio Lonside'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {otherServices.map((other) => {
                const otherCopy = isEn ? other.en : other.fr;
                return (
                  <Link
                    key={other.key}
                    href={other.frPath}
                    className="p-4 rounded-xl border border-black/[0.08] hover:border-black/40 bg-white transition-colors flex flex-col justify-between gap-2 min-h-[88px]"
                  >
                    <span className="text-xs font-mono text-zinc-500">{otherCopy.priceLabel}</span>
                    <span className="font-display uppercase text-base text-black tracking-tight">
                      {otherCopy.metaTitle.replace(/\s*—\s*Lonside Studio$/, '')}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
