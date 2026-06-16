import React from 'react';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { reader } from '@/lib/keystatic/reader';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/lib/i18n/config';
import { ArrowLeft, ExternalLink, CheckCircle2, Zap, Code, ShieldCheck, Quote } from 'lucide-react';

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

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 border border-purple-500/20 text-brand-purple">
                {industry}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 border border-white/5 text-slate-400">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
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
                    <div key={idx} className="p-6 flex flex-col md:flex-row gap-4 justify-between hover:bg-[#0d0d11]/80 transition-colors duration-300">
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

          {clientFeedback && (
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
          )}

          <div className="space-y-4 pt-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
              <Code className="w-4 h-4 text-brand-purple" />
              <span>{tData('stackLabel')}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-xs font-mono text-slate-300 hover:border-brand-purple/40 hover:text-white transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
