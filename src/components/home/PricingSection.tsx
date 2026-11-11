"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface PricingSectionProps {
  locale?: string;
}

export default function PricingSection({ locale = "fr" }: PricingSectionProps) {
  const isEn = locale === "en";

  const tiers = [
    {
      name: "Sprint Launch",
      tagline: isEn ? "Your first production version, ready for paying users" : "Votre première version en ligne, prête pour vos premiers clients",
      price: "6 900 €",
      period: isEn ? "fixed package • 14 business days" : "forfait ferme • 14 jours ouvrés",
      popular: false,
      features: isEn
        ? [
            "Fast, responsive, and intuitive web application",
            "Secure user accounts and authentication",
            "Stripe payment integration ready to charge customers",
            "Connections with your essential tools and APIs",
            "100% source code ownership on your private GitHub",
            "30-day post-launch warranty with dedicated support",
          ]
        : [
            "Application web fluide, rapide et responsive sur mobile",
            "Comptes utilisateurs et authentification sécurisée",
            "Paiements Stripe configurés (abonnements ou achats uniques)",
            "Connexion avec vos outils métiers et services essentiels",
            "Code 100% à vous sur votre propre compte GitHub",
            "30 jours d'assistance et garantie corrective inclus",
          ],
      cta: isEn ? "Choose 14-day sprint" : "Choisir le sprint 14j",
    },
    {
      name: "Sprint Scale",
      tagline: isEn ? "For multi-role platforms and advanced business workflows" : "Pour les plateformes multi-rôles et flux métier avancés",
      price: "13 900 €",
      period: isEn ? "fixed package • 30 business days" : "forfait ferme • 30 jours ouvrés",
      popular: true,
      features: isEn
        ? [
            "Everything in Sprint Launch, plus:",
            "Multi-role user portals (e.g. buyer, vendor, admin)",
            "Automated data workflows and intelligent calculations",
            "Real-time event processing and notifications",
            "Comprehensive test coverage ensuring total stability",
            "Personalized Loom video walkthrough and architecture docs",
          ]
        : [
            "Tout le contenu du Sprint Launch, augmenté de :",
            "Espaces multi-rôles (ex: acheteur, vendeur, administrateur)",
            "Calculs automatisés et traitement intelligent des données",
            "Notifications en temps réel et flux d'automatisation",
            "Tests rigoureux pour garantir une stabilité irréprochable",
            "Visite guidée en vidéo (Loom) et documentation complète",
          ],
      cta: isEn ? "Choose 30-day sprint" : "Choisir le sprint 30j",
    },
    {
      name: isEn ? "Embedded Squad" : "Régie d'Immersion",
      tagline: isEn ? "A senior engineer embedded directly alongside your team" : "Un ingénieur senior intégré directement à vos côtés",
      price: isEn ? "From 5 500 €" : "Dès 5 500 €",
      period: isEn ? "/ month • monthly flexibility" : "/ mois • flexibilité sans engagement",
      popular: false,
      features: isEn
        ? [
            "Dedicated senior engineer (1 to 3 engineers)",
            "Direct collaboration in your Slack and daily routines",
            "Rapid feature releases and continuous improvements",
            "5-day initial trial: cancel anytime without penalty",
            "Adjust your allocation each month as your roadmap evolves",
          ]
        : [
            "Ingénieur senior dédié (1 à 3 profils selon vos besoins)",
            "Collaboration directe dans votre Slack et vos rituels",
            "Sortie rapide de nouvelles fonctionnalités au quotidien",
            "Semaine d'essai de 5 jours pour tester la collaboration",
            "Ajustement libre du volume chaque mois selon vos priorités",
          ],
      cta: isEn ? "Discuss squad setup" : "Échanger sur une squad",
    },
  ];

  return (
    <section id="tarifs" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {/* En-tête Aéré & Noble */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{isEn ? "TRANSPARENT PRICING" : "FORFAITS TRANSPARENTS"}</span>
          </div>
          <h2 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-[1.08] font-normal">
            {isEn ? (
              <>Fixed packages, <br /><span className="text-zinc-500">zero surprises.</span></>
            ) : (
              <>Des forfaits simples, <br /><span className="text-zinc-500">zéro mauvaise surprise.</span></>
            )}
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            {isEn
              ? "Every engagement includes our firm timeline, 30 days of post-launch assistance, and 100% intellectual property ownership."
              : "Chaque formule comprend le cadrage complet, le développement soigné, la cession du code sur votre compte et un mois d'assistance sereine."}
          </p>
        </div>

        {/* Grille des Offres Haute Précision (rounded-xl) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch min-w-0 w-full">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl bg-white border flex flex-col justify-between p-5 sm:p-8 min-w-0 w-full overflow-hidden ${
                tier.popular
                  ? "border-black/60 bg-zinc-50/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
                  : "border-black/[0.08]"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-xl bg-black text-white text-[9px] font-mono font-medium uppercase tracking-[0.16em] whitespace-nowrap">
                  {isEn ? "RECOMMENDED" : "RECOMMANDÉ"}
                </div>
              )}

              <div>
                <div className="space-y-1.5 mb-6">
                  <h3 className="font-display uppercase text-lg sm:text-xl md:text-2xl text-black tracking-tight font-medium">{tier.name}</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed min-h-[36px]">
                    {tier.tagline}
                  </p>
                </div>

                <div className="mb-6 pb-5 border-b border-black/[0.06]">
                  <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-black tracking-tight whitespace-nowrap">
                    {tier.price}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mt-1.5 whitespace-nowrap">
                    {tier.period}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-xs sm:text-sm text-zinc-700 font-normal flex items-start space-x-2 leading-relaxed">
                      <span className="text-black font-mono text-xs mt-0.5 shrink-0">/</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a
                  href="#contact"
                  className={`w-full py-3.5 px-6 rounded-xl text-xs font-mono uppercase tracking-[0.14em] flex items-center justify-center space-x-2 transition-all duration-200 min-h-[46px] whitespace-nowrap cursor-pointer ${
                    tier.popular
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "bg-zinc-100 text-black hover:bg-zinc-200 border border-black/[0.08]"
                  }`}
                >
                  <span className="whitespace-nowrap">{tier.cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
