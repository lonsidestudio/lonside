import { getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, Calendar, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/i18n/navigation';
import { getPortfolioProjects, type Locale } from '@/lib/keystatic/reader';
import { SERVICES, SERVICE_KEYS, type LocalizedServiceCopy, type ServiceRouteKey } from '@/lib/services-data';
import { siteConfig } from '@/lib/site-config';

interface ServicePageTemplateProps {
  serviceKey: ServiceRouteKey;
  locale: string;
}

export default async function ServicePageTemplate({ serviceKey, locale }: ServicePageTemplateProps) {
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  const def = SERVICES[serviceKey];

  const [tServices, tCommon, allProjects] = await Promise.all([
    getTranslations({ locale: currentLocale, namespace: 'services' }),
    getTranslations({ locale: currentLocale, namespace: 'common' }),
    getPortfolioProjects(currentLocale),
  ]);

  const copy = tServices.raw(`items.${serviceKey}`) as LocalizedServiceCopy;
  const featuredProjects = allProjects.filter((p) => def.featuredSlugs.includes(p.slug));
  const otherServices = SERVICE_KEYS.filter((k) => k !== serviceKey).map((k) => ({
    def: SERVICES[k],
    copy: tServices.raw(`items.${k}`) as LocalizedServiceCopy,
  }));

  const homeUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;
  const canonicalUrl = currentLocale === 'en' ? `${siteConfig.siteUrl}${def.enPath}` : `${siteConfig.siteUrl}${def.frPath}`;
  const cleanServiceName = copy.metaTitle.replace(/\s*—\s*Lonside Studio$/, '');

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: copy.metaTitle,
    description: copy.metaDescription,
    isPartOf: { '@id': `${siteConfig.siteUrl}/#website` },
    about: { '@id': `${siteConfig.siteUrl}/#organization` },
    inLanguage: currentLocale === 'en' ? 'en-US' : 'fr-FR',
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: cleanServiceName,
    description: copy.metaDescription,
    url: canonicalUrl,
    provider: { '@id': `${siteConfig.siteUrl}/#organization` },
    areaServed: ['FR', 'EU', 'US'],
    offers: {
      '@type': 'Offer',
      price: def.priceNumeric,
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
      { '@type': 'ListItem', position: 1, name: tCommon('home'), item: homeUrl },
      { '@type': 'ListItem', position: 2, name: cleanServiceName, item: canonicalUrl },
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
          <nav aria-label={tCommon('breadcrumbAria')} className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{tCommon('backToStudio')}</span>
            </Link>
            <Link
              href="/estimation"
              className="text-xs font-mono uppercase tracking-[0.14em] text-black underline underline-offset-4 hover:text-zinc-600 transition-colors min-h-[44px] inline-flex items-center"
            >
              {tServices('ui.estimateLink')}
            </Link>
          </nav>

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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 sm:p-6 rounded-xl border border-black/[0.1] bg-zinc-50/50 flex flex-col justify-start gap-2.5">
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>{tServices('ui.fixedInvestmentLabel')}</span>
                </span>
                <span className="font-display uppercase text-xl sm:text-[1.45rem] leading-[1.15] text-black tracking-tight font-medium">
                  {copy.priceLabel}
                </span>
              </div>
              <div className="p-5 sm:p-6 rounded-xl border border-black/[0.1] bg-zinc-50/50 flex flex-col justify-start gap-2.5">
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>{tServices('ui.timelineLabel')}</span>
                </span>
                <span className="font-display uppercase text-xl sm:text-[1.45rem] leading-[1.15] text-black tracking-tight font-medium">
                  {copy.timelineLabel}
                </span>
              </div>
              <div className="p-5 sm:p-6 rounded-xl border border-black/[0.1] bg-zinc-50/50 flex flex-col justify-start gap-2.5">
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>{tServices('ui.warrantyLabel')}</span>
                </span>
                <span className="font-display uppercase text-xl sm:text-[1.45rem] leading-[1.15] text-black tracking-tight font-medium">
                  {copy.warrantyLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={siteConfig.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.16em] transition-colors min-h-[48px] whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{tCommon('bookScoping15min')}</span>
              </a>
              <Link
                href="/estimation"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-black/[0.15] hover:border-black text-black font-mono text-xs uppercase tracking-[0.16em] hover:bg-zinc-50 transition-colors min-h-[48px] whitespace-nowrap"
              >
                <span>{tServices('ui.simulateCta')}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </header>

          <section className="p-6 sm:p-8 rounded-2xl border border-black/[0.08] bg-zinc-50/40 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
              {tServices('ui.idealForHeading')}
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

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {copy.deliverablesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {copy.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-xl border border-black/[0.1] bg-zinc-50/30 flex flex-col justify-start gap-4"
                >
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                    <span className="font-mono text-xl text-zinc-400 font-medium">0{idx + 1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display uppercase text-xl text-black tracking-tight leading-snug font-medium">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                  </div>
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

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {tServices('ui.comparisonTitle')}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-black/[0.08]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/[0.08] bg-zinc-50 font-mono uppercase text-[11px] text-zinc-500">
                    <th className="p-4">{tServices('ui.comparisonHeaders.criterion')}</th>
                    <th className="p-4 text-black font-semibold">{tServices('ui.comparisonHeaders.lonside')}</th>
                    <th className="p-4">{tServices('ui.comparisonHeaders.freelance')}</th>
                    <th className="p-4">{tServices('ui.comparisonHeaders.traditional')}</th>
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

          {featuredProjects.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
                  {tServices('ui.proofTitle')}
                </h2>
                <Link
                  href="/portfolio"
                  className="text-xs font-mono text-black underline underline-offset-4 hover:text-zinc-600 whitespace-nowrap py-2 min-h-[44px] inline-flex items-center"
                >
                  {tServices('ui.allDossiers')}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {featuredProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={{ pathname: '/portfolio/[slug]', params: { slug: project.slug } }}
                    className="group p-6 sm:p-7 rounded-xl border border-black/[0.1] hover:border-black/50 bg-zinc-50/40 hover:bg-white transition-all flex flex-col justify-start gap-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 uppercase border-b border-black/[0.06] pb-3">
                        <span className="truncate">{project.industry}</span>
                        <span className="shrink-0 text-black font-medium">
                          {project.deliveryDays} {tCommon('days')}
                        </span>
                      </div>
                      <h3 className="font-display uppercase text-2xl text-black tracking-tight group-hover:text-zinc-600 transition-colors">
                        {project.client}
                      </h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">{project.headline}</p>
                    </div>
                    <span className="mt-auto pt-4 border-t border-black/[0.06] text-xs font-mono text-black underline underline-offset-4">
                      {tServices('ui.readArchDossier')}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6">
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight text-black font-normal">
              {tServices('ui.faqTitle')}
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

          <section className="pt-8 border-t border-black/[0.08] space-y-5">
            <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
              {tServices('ui.otherCapabilities')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherServices.map(({ def: other, copy: otherCopy }) => (
                <Link
                  key={other.key}
                  href={other.frPath}
                  className="group p-5 sm:p-6 rounded-xl border border-black/[0.1] hover:border-black/50 bg-zinc-50/40 hover:bg-white transition-all flex flex-col justify-start gap-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] pb-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-zinc-500">
                      {otherCopy.priceLabel}
                    </span>
                    <span className="w-7 h-7 rounded-lg border border-black/[0.1] bg-white group-hover:bg-black group-hover:text-white group-hover:border-black text-black flex items-center justify-center transition-colors shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <span className="font-display uppercase text-lg text-black tracking-tight leading-[1.18] group-hover:text-zinc-700 transition-colors">
                    {otherCopy.metaTitle.replace(/\s*—\s*Lonside Studio$/, '')}
                  </span>
                  <span className="mt-auto pt-3 border-t border-black/[0.06] text-[11px] font-mono text-zinc-500">
                    {otherCopy.timelineLabel}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
