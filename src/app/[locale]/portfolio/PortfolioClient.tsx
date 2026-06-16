'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, TrendingUp, Clock } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

interface ProjectMetric {
  label: string;
  value: string;
  delta?: string;
}

interface PortfolioProject {
  slug: string;
  client: string;
  industry: string;
  headline: string;
  deliveryDays: number;
  techStack: string[];
  metrics: ProjectMetric[];
}

interface Props {
  projects: PortfolioProject[];
}

export default function PortfolioClient({ projects }: Props) {
  const t = useTranslations('portfolio');
  const tData = useTranslations('portfolioData');

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 mb-20">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-radial-purple opacity-20 pointer-events-none -z-10" />
          <Badge icon={<TrendingUp className="w-3.5 h-3.5" />}>{t('badge')}</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
            {t('headline')} <br />
            <span className="shimmer-text">{t('headlineHighlight')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed">
            {t('subheadline')}
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="group relative rounded-2xl border border-white/5 bg-[#0d0d11]/40 hover:bg-[#0d0d11]/80 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-brand-purple/30 transition-all duration-500"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <span className="text-[10px] font-bold tracking-wider text-brand-purple font-mono bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-full">
                      {project.industry}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {t('deliveredIn')} {project.deliveryDays} {t('days')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-purple transition-colors duration-300">
                      {project.client}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1.5 line-clamp-2">
                      {project.headline}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {project.metrics.slice(0, 2).map((m, i) => {
                      const colors = ['from-brand-purple to-purple-400', 'from-emerald-400 to-teal-500'];
                      const color = colors[i % colors.length];
                      return (
                        <div key={m.label} className="p-3 rounded-xl border border-white/5 bg-slate-950/40 text-center">
                          <div className={`text-base font-extrabold font-mono bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                            {m.value}
                          </div>
                          <div className="text-[9px] font-bold text-slate-500 tracking-wider mt-0.5 truncate">
                            {m.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5">
                  <Link
                    href={{ pathname: '/portfolio/[slug]', params: { slug: project.slug } }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[11px] font-bold transition-all duration-300 border border-white/10 hover:border-brand-purple/30 bg-[#0d0d11] hover:bg-brand-purple text-slate-300 hover:text-white"
                  >
                    <span>{t('viewDetails') || 'Voir le dossier technique'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="p-8 rounded-2xl bg-[#0d0d11]/60 backdrop-blur-sm border border-white/5 hover:border-brand-purple/20 transition-all duration-500 text-center space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white">{tData('ctaTitle')}</h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              {tData('ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-purple hover:bg-brand-purple-hover text-xs font-bold text-white rounded-lg transition-all duration-300 hover:scale-[1.02] space-x-2 border border-brand-purple/10 shadow-lg shadow-purple-500/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                <span>{tData('ctaContact')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/tarifs"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/10 hover:border-brand-purple/30 text-xs font-bold text-slate-300 rounded-lg transition-all duration-300 hover:scale-[1.02] bg-[#0d0d11] hover:bg-[#121216]"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {tData('ctaTarifs')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
