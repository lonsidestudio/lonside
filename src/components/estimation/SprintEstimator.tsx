'use client';

import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Calendar, Check } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { captureLeadEvent } from '@/lib/posthog';

type ProjectType = 'mvp' | 'saas' | 'webapp' | 'squad';
type ModuleId = 'auth' | 'stripe' | 'api' | 'seo';

interface SprintEstimatorProps {
  isEn: boolean;
}

export default function SprintEstimator({ isEn }: SprintEstimatorProps) {
  const [projectType, setProjectType] = useState<ProjectType>('mvp');
  const [modules, setModules] = useState<ModuleId[]>(['auth', 'stripe']);

  const toggleModule = (id: ModuleId) => {
    setModules((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const recommendation = useMemo(() => {
    if (projectType === 'squad') {
      return {
        tier: isEn ? 'Immersion Squad' : 'Régie d’Immersion',
        price: isEn ? 'From €5,500 excl. VAT / mo' : 'Dès 5 500 € HT / mois',
        timeline: isEn ? 'Start within 5 business days' : 'Démarrage sous 5 jours ouvrés',
        warranty: isEn ? 'Flexible monthly allocation' : 'Allocation mensuelle flexible',
        summary: isEn
          ? 'A dedicated senior Lead Architect embedded directly in your Slack & GitHub to accelerate your roadmap.'
          : 'Un Lead Architect / ingénieur senior intégré directement dans votre Slack et GitHub pour accélérer votre roadmap.',
      };
    }

    const needsScale = projectType === 'saas' || (projectType === 'webapp' && modules.length >= 3);
    if (needsScale) {
      return {
        tier: 'Sprint Scale',
        price: isEn ? '€13,900 excl. VAT (Fixed)' : '13 900 € HT (Forfait ferme)',
        timeline: isEn ? '30 business days (2 milestones)' : '30 jours ouvrés (2 jalons)',
        warranty: isEn ? '45-day corrective warranty' : 'Garantie corrective 45 jours',
        summary: isEn
          ? 'Multi-role platform, hardened multi-tenant PostgreSQL RLS, API & computation engines, automated tests, and 100% GitHub handover.'
          : 'Plateforme multi-rôles, PostgreSQL RLS multi-tenant, moteurs métier & API temps réel, tests automatisés et cession 100 % GitHub.',
      };
    }

    return {
      tier: 'Sprint Launch',
      price: isEn ? '€6,900 excl. VAT (Fixed)' : '6 900 € HT (Forfait ferme)',
      timeline: isEn ? '14 business days guaranteed' : '14 jours ouvrés garantis',
      warranty: isEn ? '30-day corrective warranty' : 'Garantie corrective 30 jours',
      summary: isEn
        ? 'Production-ready web application or SaaS MVP with auth, Stripe billing, technical SEO, and 100% private GitHub code ownership.'
        : 'Application web ou MVP SaaS complet en production avec authentification, Stripe, SEO technique et 100 % du code sur votre GitHub privé.',
    };
  }, [projectType, modules, isEn]);

  const projectOptions: Array<{ id: ProjectType; title: string; subtitle: string }> = [
    {
      id: 'mvp',
      title: isEn ? 'SaaS MVP / First Launch' : 'MVP SaaS / Première V1',
      subtitle: isEn ? 'Validate fast with paying users' : 'Lancer vite et encaisser les premiers clients',
    },
    {
      id: 'webapp',
      title: isEn ? 'Custom Next.js Web App' : 'Application Web Next.js',
      subtitle: isEn ? 'Portal, marketplace, or business tool' : 'Portail client, marketplace ou outil métier',
    },
    {
      id: 'saas',
      title: isEn ? 'Multi-Role B2B SaaS' : 'Plateforme SaaS Multi-Rôles',
      subtitle: isEn ? 'Complex workflows, data & multi-tenancy' : 'Workflows avancés, data & multi-tenancy',
    },
    {
      id: 'squad',
      title: isEn ? 'Senior Engineering Squad' : 'Régie Tech Senior',
      subtitle: isEn ? 'Continuous monthly product velocity' : 'Renfort senior continu sur votre roadmap',
    },
  ];

  const moduleOptions: Array<{ id: ModuleId; label: string }> = [
    { id: 'auth', label: isEn ? 'Multi-role auth & permissions (RLS)' : 'Authentification & rôles sécurisés (RLS)' },
    { id: 'stripe', label: isEn ? 'Stripe billing & subscriptions' : 'Paiements & abonnements Stripe' },
    { id: 'api', label: isEn ? 'Third-party APIs, webhooks & AI pipelines' : 'API tierces, webhooks & automatisations IA' },
    { id: 'seo', label: isEn ? 'Multi-language SEO & PostHog analytics' : 'SEO multi-langue & télémétrie PostHog' },
  ];

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
            {isEn ? '01 // Select your primary objective' : '01 // Sélectionnez votre objectif principal'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projectOptions.map((option) => {
              const active = projectType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setProjectType(option.id)}
                  className={`p-4 sm:p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[84px] ${
                    active
                      ? 'border-black bg-black text-white'
                      : 'border-black/[0.08] bg-zinc-50/40 hover:border-black/40 text-black'
                  }`}
                >
                  <span className="font-display uppercase text-lg tracking-tight block font-medium">
                    {option.title}
                  </span>
                  <span className={`text-xs mt-1 block ${active ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {option.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
            {isEn ? '02 // Core technical modules required' : '02 // Briques techniques souhaitées'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {moduleOptions.map((mod) => {
              const selected = modules.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  aria-pressed={selected}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer min-h-[56px] ${
                    selected
                      ? 'border-black bg-zinc-50 text-black'
                      : 'border-black/[0.08] bg-white hover:border-black/30 text-zinc-600'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{mod.label}</span>
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
            {isEn ? 'Recommended format' : 'Format recommandé'}
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
            <span className="text-zinc-500">{isEn ? 'Delivery' : 'Délai'}</span>
            <span className="text-black font-medium">{recommendation.timeline}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-black/[0.05]">
            <span className="text-zinc-500">{isEn ? 'Warranty' : 'Garantie'}</span>
            <span className="text-black font-medium">{recommendation.warranty}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-500">{isEn ? 'Code IP' : 'Propriété code'}</span>
            <span className="text-black font-medium">100 % GitHub</span>
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
            <span>{isEn ? 'Lock scope in 15 min' : 'Valider ce périmètre (15 min)'}</span>
          </a>
          <a
            href={isEn ? '/en#contact' : '/#contact'}
            onClick={handleBookClick}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-black/[0.15] hover:border-black bg-white text-black font-mono text-xs uppercase tracking-[0.15em] transition-colors min-h-[46px]"
          >
            <span>{isEn ? 'Send written brief' : 'Envoyer mon brief écrit'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      </aside>
    </div>
  );
}
