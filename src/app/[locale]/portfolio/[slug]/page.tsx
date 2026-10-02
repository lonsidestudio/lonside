import React from 'react';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { reader } from '@/lib/keystatic/reader';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/lib/i18n/config';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Zap,
  Code,
  ShieldCheck,
  Quote,
  Compass,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export async function generateStaticParams() {
  const slugs = await reader.collections.portfolio.list();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const entry = await reader.collections.portfolio.read(slug);
  if (!entry) return {};

  const t = await getTranslations({ locale, namespace: 'portfolioData' });
  const seoTitle = locale === 'en' ? (entry.seoTitleEn || entry.seoTitleFr) : entry.seoTitleFr;
  const seoDescription = locale === 'en' ? (entry.seoDescriptionEn || entry.seoDescriptionFr) : entry.seoDescriptionFr;
  const headline = locale === 'en' ? (entry.headlineEn || entry.headlineFr) : entry.headlineFr;

  return {
    title: seoTitle || `${entry.client} — ${t('tabReport')} | Lonside`,
    description: seoDescription || headline,
  };
}

export default async function PortfolioProjectDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const entry = await reader.collections.portfolio.read(slug);
  if (!entry) return notFound();

  const t = await getTranslations({ locale, namespace: 'portfolio' });
  const tData = await getTranslations({ locale, namespace: 'portfolioData' });

  const testimonialQuote = locale === 'en' ? (entry.testimonialQuoteEn || entry.testimonialQuoteFr) : entry.testimonialQuoteFr;
  const testimonialRole = locale === 'en' ? (entry.testimonialRoleEn || entry.testimonialRoleFr) : entry.testimonialRoleFr;

  const testimonial = testimonialQuote
    ? { quote: testimonialQuote, author: entry.testimonialAuthor ?? '', role: testimonialRole ?? '' }
    : undefined;

  const industry = locale === 'en' ? (entry.industryEn || entry.industryFr) : entry.industryFr;
  const headline = locale === 'en' ? (entry.headlineEn || entry.headlineFr) : entry.headlineFr;
  const challenge = locale === 'en' ? (entry.challengeEn || entry.challengeFr) : entry.challengeFr;
  const solution = locale === 'en' ? (entry.solutionEn || entry.solutionFr) : entry.solutionFr;
  const clientFeedback = locale === 'en' ? (entry.clientFeedbackEn || entry.clientFeedbackFr) : entry.clientFeedbackFr;

  const isProprietary = Boolean(entry.isProprietary);
  const studioNote = locale === 'en' ? (entry.studioNoteEn || entry.studioNoteFr) : entry.studioNoteFr;

  const architectureSummary = locale === 'en'
    ? (entry.architectureSummaryEn || entry.architectureSummaryFr)
    : entry.architectureSummaryFr;

  const clientNeeds = entry.clientNeeds?.map((n) => ({
    title: locale === 'en' ? (n.titleEn || n.titleFr) : n.titleFr,
    desc: locale === 'en' ? (n.descEn || n.descFr) : n.descFr,
  })) ?? [];

  const constraints = entry.constraints?.map((c) => ({
    title: locale === 'en' ? (c.titleEn || c.titleFr) : c.titleFr,
    badge: locale === 'en' ? (c.badgeEn || c.badgeFr) : c.badgeFr,
    risk: locale === 'en' ? (c.riskEn || c.riskFr) : c.riskFr,
    resolution: locale === 'en' ? (c.resolutionEn || c.resolutionFr) : c.resolutionFr,
  })) ?? [];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-xs text-slate-400 hover:text-brand-purple gap-1.5 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {locale === 'en' ? 'Back to portfolio' : 'Retour au portfolio'}
          </Link>

          {/* En-tête */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 border border-purple-500/20 text-brand-purple font-mono">
                {industry}
              </span>
              {isProprietary && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {locale === 'en' ? 'Lonside Studio Venture' : 'Produit Propriétaire Lonside'}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 border border-white/5 text-slate-400 font-mono">
                {t('deliveredIn')} {entry.deliveryDays} {t('days')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              {entry.client} — {headline}
            </h1>

            {entry.liveUrl && (
              <div>
                <a
                  href={entry.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all duration-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t('projectLink')}</span>
                </a>
              </div>
            )}
          </div>

          {/* Indicateurs clés */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {entry.metrics.map((m, i) => {
              const colors = ['from-brand-purple to-purple-400', 'from-emerald-400 to-teal-500', 'from-blue-400 to-indigo-500'];
              const color = colors[i % colors.length];
              const metricLabel = locale === 'en' ? (m.labelEn || m.labelFr) : m.labelFr;
              const metricValue = locale === 'en' ? (m.valueEn || m.valueFr) : m.valueFr;
              const metricDelta = locale === 'en' ? (m.deltaEn || m.deltaFr) : m.deltaFr;
              return (
                <div key={m.labelFr} className="p-6 rounded-2xl border border-white/5 bg-[#0d0d11]/60 backdrop-blur-sm shadow-xl flex flex-col justify-between">
                  <div className={`text-2xl sm:text-3xl font-extrabold font-mono bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                    {metricValue}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 tracking-wider mt-2">{metricLabel}</div>
                    {metricDelta && <div className="text-[10px] text-slate-500 font-mono mt-0.5">{metricDelta}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Résumé Défi & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="p-6 rounded-2xl bg-[#0d0d11]/60 border border-white/5 backdrop-blur-sm space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>{tData('challengeLabel')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{challenge}</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0d11]/60 border border-white/5 backdrop-blur-sm space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{tData('solutionLabel')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{solution}</p>
            </div>
          </div>

          {/* Section 1 : Besoins & Contexte Client */}
          {clientNeeds.length > 0 && (
            <div className="space-y-6 pt-6">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-purple" />
                  <span>{tData('needsLabel')}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {tData('needsSubtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientNeeds.map((need, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#0d0d11]/60 border border-white/5 backdrop-blur-sm space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-[10px] font-mono font-bold text-brand-purple shrink-0">
                        0{idx + 1}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white">{need.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-8.5">{need.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2 : Contraintes Subies & Arbitrages Techniques */}
          {constraints.length > 0 && (
            <div className="space-y-6 pt-6">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-purple" />
                  <span>{tData('constraintsLabel')}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {tData('constraintsSubtitle')}
                </p>
              </div>

              <div className="space-y-4">
                {constraints.map((c, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#0d0d11]/60 border border-white/5 backdrop-blur-sm p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-slate-500">0{idx + 1}</span>
                        <span>{c.title}</span>
                      </h3>
                      {c.badge && (
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                          {c.badge}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
                        <div className="text-[10px] font-bold text-amber-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>{tData('riskLabel')}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{c.risk}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-purple-950/20 border border-brand-purple/20 space-y-2">
                        <div className="text-[10px] font-bold text-brand-purple font-mono flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                          <span>{tData('resolutionLabel')}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{c.resolution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3 : Architecture Déployée */}
          {architectureSummary && (
            <div className="space-y-4 pt-6">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>{tData('architectureLabel')}</span>
              </h2>
              <div className="p-6 rounded-2xl bg-[#0d0d11]/70 border border-white/5 backdrop-blur-sm space-y-3">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {architectureSummary}
                </p>
              </div>
            </div>
          )}

          {/* Section 4 : Processus Projet */}
          {entry.process && entry.process.length > 0 && (
            <div className="space-y-6 pt-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-purple" />
                <span>{tData('processLabel')}</span>
              </h2>
              <div className="border border-white/5 rounded-2xl bg-[#0d0d11]/40 overflow-hidden divide-y divide-white/5">
                {entry.process.map((step, idx) => {
                  const stepDay = locale === 'en' ? (step.dayEn || step.dayFr) : step.dayFr;
                  const stepActor = locale === 'en' ? (step.actorEn || step.actorFr) : step.actorFr;
                  const stepAction = locale === 'en' ? (step.actionEn || step.actionFr) : step.actionFr;
                  return (
                    <div key={idx} className="p-6 flex flex-col md:flex-row gap-4 justify-between">
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] font-bold font-mono tracking-wider text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-full">
                          {stepDay}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-xs font-bold text-white font-mono">{stepActor}</div>
                        <p className="text-xs text-slate-400 leading-relaxed">{stepAction}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 5 : Témoignage client OU Note du Studio Lonside */}
          {isProprietary ? (
            studioNote ? (
              <div className="p-8 rounded-2xl bg-[#0d0d11]/80 border border-purple-500/20 space-y-4 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full -z-10" />
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    <span>{locale === 'en' ? 'Lonside Studio Venture' : 'Actif Propriétaire & Laboratoire Lonside'}</span>
                  </h2>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    {locale === 'en' ? 'Proprietary Asset' : 'Produit Studio'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {studioNote}
                </p>
                <div className="text-xs text-slate-500 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-400">Équipe Produit Lonside</span>
                  <span className="text-[11px] text-slate-500 font-mono">Conception, R&D & Exploitation Directe</span>
                </div>
              </div>
            ) : null
          ) : (
            clientFeedback ? (
              <div className="p-8 rounded-2xl bg-slate-900/10 border border-white/5 space-y-4 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full -z-10" />
                <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Quote className="w-4 h-4 text-brand-purple" />
                  <span>{tData('feedbackLabel')}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;{clientFeedback}&rdquo;
                </p>
                {testimonial && (
                  <div className="text-xs text-slate-500 pt-2">
                    <span className="font-bold text-slate-400">{testimonial.author}</span>
                    {' — '}{testimonial.role}
                  </div>
                )}
              </div>
            ) : null
          )}

          {/* Section 6 : Stack technique */}
          <div className="space-y-4 pt-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
              <Code className="w-4 h-4 text-brand-purple" />
              <span>{tData('stackLabel')}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-xs font-mono text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Bottom Banner */}
          <div className="p-8 rounded-2xl bg-[#0d0d11]/80 border border-white/5 text-center space-y-4 mt-12 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-bold text-white">{tData('ctaTitle')}</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              {tData('ctaSubtitle')}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-xs font-semibold text-white rounded-lg transition-all duration-200 gap-2 border border-brand-purple/10 shadow-md shadow-purple-500/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
              >
                <span>{tData('ctaContact')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
