"use client";

import React from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

interface PricingSectionProps {
  locale?: string;
}

export default function PricingSection({ locale = "fr" }: PricingSectionProps) {
  const isEn = locale === "en";

  const tiers = [
    {
      name: isEn ? "Sprint Launch" : "Sprint Launch",
      tagline: isEn ? "SaaS & Web App MVP Ready to Monetize" : "MVP SaaS & Application Web Prêt à Encaisser",
      price: "6 900 €",
      period: isEn ? "fixed price • 14 business days" : "forfait ferme • 14 jours ouvrés",
      popular: false,
      features: isEn
        ? [
            "Full-stack Next.js 16 + Supabase / PostgreSQL architecture",
            "Secure authentication & RBAC user roles",
            "Stripe payment integration (subscriptions or one-off)",
            "2 business workflow integrations (APIs, webhooks, CRM)",
            "100% intellectual property transfer on your GitHub",
            "30-day post-launch warranty with contractual SLA",
          ]
        : [
            "Architecture full-stack Next.js 16 + Supabase / PostgreSQL",
            "Authentification sécurisée & gestion des rôles RBAC",
            "Intégration paiements Stripe (abonnements ou one-shot)",
            "2 connecteurs de flux métier (APIs, webhooks, CRM)",
            "Code source 100% cédé sur votre GitHub dès le jour 1",
            "30 jours de garantie corrective avec SLA contractuel",
          ],
      cta: isEn ? "Launch in 14 Days" : "Lancer mon Sprint 14j",
    },
    {
      name: isEn ? "Sprint Scale" : "Sprint Scale",
      tagline: isEn ? "Complex Digital Platform & Business Engine" : "Plateforme Métier Complexe & Moteurs Avancés",
      price: "13 900 €",
      period: isEn ? "fixed price • 30 business days" : "forfait ferme • 30 jours ouvrés",
      popular: true,
      features: isEn
        ? [
            "Everything in Sprint Launch, plus:",
            "Complex data pipelines & business algorithms (Python / FastAPI)",
            "Multi-tenant dashboards & enterprise permission systems",
            "Advanced background queues & event-driven architecture",
            "Automated test suites (unit + integration coverage > 85%)",
            "Complete Handover Pack: architecture docs & Loom videos",
          ]
        : [
            "Tout le contenu du Sprint Launch, augmenté de :",
            "Pipelines de données complexes & algorithmes métier (Python)",
            "Tableaux de bord multi-rôles & administration granulaire",
            "Système de files d'attente asynchrones (Redis / Background workers)",
            "Suite de tests automatisés (couverture > 85%)",
            "Pack Handover complet : documentation vivante et vidéos Loom",
          ],
      cta: isEn ? "Start Scale Sprint" : "Lancer mon Sprint 30j",
    },
    {
      name: isEn ? "Immersion Squad" : "Régie d'Immersion",
      tagline: isEn ? "Senior Embedded Engineering Reinforcement" : "Renfort de Squad Senior en Immersion Totale",
      price: isEn ? "From 5 500 €" : "Dès 5 500 €",
      period: isEn ? "/ month • monthly flexibility" : "/ mois • flexibilité sans engagement",
      popular: false,
      features: isEn
        ? [
            "Dedicated senior lead engineers (1 to 3 engineers)",
            "Embedded directly into your Slack, GitHub & daily standups",
            "Extreme feature velocity & technical debt elimination",
            "Continuous deployment & live code reviews",
            "5-day initial test trial: cancel anytime without penalty",
            "Monthly adjustable allocation according to your roadmap",
          ]
        : [
            "Squad de 1 à 3 ingénieurs seniors dédiés",
            "Intégration directe dans votre Slack, GitHub et rituels agiles",
            "Vélocité de production maximale & élimination de la dette",
            "Revue de code continue & déploiement continu",
            "Semaine d'essai de 5 jours : résiliation libre sans pénalité",
            "Ajustement mensuel du volume selon vos priorités roadmap",
          ],
      cta: isEn ? "Request Squad Scoping" : "Demander une Squad",
    },
  ];

  return (
    <section id="tarifs" className="relative py-28 bg-[#000000] border-t border-white/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mb-16">
          <div className="studio-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{isEn ? "Transparent Fixed Pricing" : "Engagements & Tarifs Fermes"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            {isEn ? "Firm Deadlines. Zero Hidden Costs." : "Délais Fermes. Zéro Coût Masqué."}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            {isEn
              ? "Every engagement includes our contractual SLA, 30 days of warranty, and 100% intellectual property transfer."
              : "Chaque formule inclut nos critères d'acceptation stricts, 30 jours de garantie corrective intégrale et le transfert 100% de propriété intellectuelle."}
          </p>
        </div>

        {/* Grille des Offres */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl bg-[#0a0a0a] border flex flex-col justify-between p-8 sm:p-10 transition-all ${
                tier.popular
                  ? "border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.06)] bg-[#0d0d0d]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-black text-[10px] font-mono font-bold tracking-widest uppercase">
                  {isEn ? "Most Demanded" : "Formule la Plus Demandée"}
                </div>
              )}

              <div>
                <div className="space-y-2 mb-8">
                  <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed min-h-[36px]">
                    {tier.tagline}
                  </p>
                </div>

                <div className="mb-8 pb-8 border-b border-white/10">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-white">
                    {tier.price}
                  </span>
                  <span className="text-xs font-mono text-[#71717a] block mt-1">
                    {tier.period}
                  </span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-xs text-[#a1a1aa] flex items-start space-x-2.5">
                      <span className="text-[#10b981] font-bold mt-0.5 shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a
                  href="#contact"
                  className={`w-full py-3 px-5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                    tier.popular
                      ? "bg-white text-black hover:bg-[#eaeaea] shadow-md"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
