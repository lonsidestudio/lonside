'use client';

import React, { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight, Calendar, Check } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { captureLeadEvent } from '@/lib/posthog';

type ProjectType = 'mvp' | 'saas' | 'webapp' | 'squad';
type ModuleId = 'auth' | 'stripe' | 'api' | 'seo';
type RecommendationKey = 'launch' | 'scale' | 'squad';

const PROJECT_IDS: ProjectType[] = ['mvp', 'webapp', 'saas', 'squad'];
const MODULE_IDS: ModuleId[] = ['auth', 'stripe', 'api', 'seo'];

export default function SprintEstimator() {
  const t = useTranslations('estimation');
  const locale = useLocale();
  const [projectType, setProjectType] = useState<ProjectType>('mvp');
  const [modules, setModules] = useState<ModuleId[]>(['auth', 'stripe']);

  const toggleModule = (id: ModuleId) => {
    setModules((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const recKey: RecommendationKey = useMemo(() => {
    if (projectType === 'squad') return 'squad';
    if (projectType === 'saas' || (projectType === 'webapp' && modules.length >= 3)) return 'scale';
    return 'launch';
  }, [projectType, modules]);

  const recommendation = {
    tier: t(`recommendations.${recKey}.tier`),
    price: t(`recommendations.${recKey}.price`),
    timeline: t(`recommendations.${recKey}.timeline`),
    warranty: t(`recommendations.${recKey}.warranty`),
    summary: t(`recommendations.${recKey}.summary`),
  };

  const contactHref = locale === 'en' ? '/en#contact' : '/#contact';

  const handleBookClick = () => {
    captureLeadEvent('pricing_tier_selected', {
      tier: recommendation.tier,
      price: recommendation.price,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
            {t('step1Label')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROJECT_IDS.map((id) => {
              const active = projectType === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setProjectType(id)}
                  className={`p-4 sm:p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[88px] flex flex-col justify-start gap-1.5 ${
                    active
                      ? 'border-black bg-black text-white'
                      : 'border-black/[0.1] bg-zinc-50/40 hover:border-black/50 hover:bg-white text-black'
                  }`}
                >
                  <span className="font-display uppercase text-lg tracking-tight leading-snug block font-medium">
                    {t(`projectOptions.${id}.title`)}
                  </span>
                  <span className={`text-xs leading-relaxed block ${active ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {t(`projectOptions.${id}.subtitle`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
            {t('step2Label')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODULE_IDS.map((id) => {
              const selected = modules.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleModule(id)}
                  aria-pressed={selected}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer min-h-[56px] ${
                    selected
                      ? 'border-black bg-zinc-50 text-black'
                      : 'border-black/[0.08] bg-white hover:border-black/30 text-zinc-600'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{t(`moduleOptions.${id}`)}</span>
                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      selected ? 'bg-black border-black text-white' : 'border-black/20'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5 rounded-2xl border border-black/[0.14] bg-zinc-50/50 p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
        <div className="space-y-2 border-b border-black/[0.08] pb-5">
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 block">
            {t('recommendedLabel')}
          </span>
          <h3 className="font-display uppercase text-3xl text-black tracking-tight font-medium">
            {recommendation.tier}
          </h3>
          <p className="font-display text-2xl sm:text-3xl text-black font-semibold">
            {recommendation.price}
          </p>
        </div>

        <div className="space-y-2 text-xs font-mono text-zinc-700">
          <div className="flex items-center justify-between py-1 border-b border-black/[0.05]">
            <span className="text-zinc-500">{t('deliveryLabel')}</span>
            <span className="text-black font-medium">{recommendation.timeline}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-black/[0.05]">
            <span className="text-zinc-500">{t('warrantyLabel')}</span>
            <span className="text-black font-medium">{recommendation.warranty}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-500">{t('ipLabel')}</span>
            <span className="text-black font-medium">{t('ipValue')}</span>
          </div>
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed">{recommendation.summary}</p>

        <div className="space-y-2.5 pt-1">
          <a
            href={siteConfig.calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBookClick}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[48px]"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{t('lockScopeCta')}</span>
          </a>
          <a
            href={contactHref}
            onClick={handleBookClick}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-black/[0.15] hover:border-black bg-white text-black font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[46px]"
          >
            <span>{t('writtenBriefCta')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      </aside>
    </div>
  );
}
