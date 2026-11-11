"use client";

import React from "react";

interface MethodSectionProps {
  locale?: string;
}

export default function MethodSection({ locale = "fr" }: MethodSectionProps) {
  const isEn = locale === "en";

  const phases = [
    {
      timing: isEn ? "Days 1 — 3" : "Jours 1 — 3",
      title: isEn ? "Scoping & Interactive Wireframes" : "Cadrage & Maquettes Interactives",
      deliverable: isEn ? "Validated Prototype & Architecture" : "Prototype Interactif & Socle Validés",
      bullets: isEn
        ? [
            "Clear definition of your core user journeys",
            "Interactive high-fidelity clickable prototype",
            "Data architecture and authentication boundaries",
            "Firm scope lock-in with guaranteed delivery date",
          ]
        : [
            "Définition précise des parcours utilisateurs essentiels",
            "Prototype interactif haute fidélité testable sur mobile",
            "Modélisation claire de la base de données et des accès",
            "Validation conjointe du périmètre et date de fin scellée",
          ],
    },
    {
      timing: isEn ? "Days 4 — 11" : "Jours 4 — 11",
      title: isEn ? "Active Engineering & Craft" : "Le Développement Actif",
      deliverable: isEn ? "Live Staging Preview Environment" : "Environnement de Test Accessible en Direct",
      bullets: isEn
        ? [
            "Clean frontend and robust business workflows",
            "Stripe payment setup and external API connections",
            "Automated test suites ensuring zero regressions",
            "Continuous live link to test features as they are built",
          ]
        : [
            "Développement soigné de l'interface et de la logique métier",
            "Intégration fluide de Stripe et de vos outils externes",
            "Batterie de tests automatisés pour éviter toute régression",
            "Lien de prévisualisation actif pour tester au fil de l'eau",
          ],
    },
    {
      timing: isEn ? "Days 12 — 14" : "Jours 12 — 14",
      title: isEn ? "Launch, Handover & Support" : "Mise en Ligne, Prise en Main & Suivi",
      deliverable: isEn ? "Live Production + 30-Day Peace of Mind" : "Plateforme en Ligne + 30 Jours d'Assistance",
      bullets: isEn
        ? [
            "Speed, accessibility, and security sanity checks",
            "Complete source code transfer to your private GitHub",
            "Personalized Loom video walkthrough of your codebase",
            "30-day warranty: we remain by your side post-launch",
          ]
        : [
            "Vérifications complètes de fluidité, sécurité et responsive",
            "Transfert intégral du code source sur votre propre GitHub",
            "Visite guidée personnalisée en vidéo (Loom) de l'architecture",
            "Garantie 30 jours : nous restons à vos côtés après la mise en ligne",
          ],
    },
  ];

  return (
    <section id="methode" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {/* En-tête Aéré & Noble */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{isEn ? "HOW WE WORK" : "NOTRE FAÇON DE FAIRE"}</span>
          </div>
          <h2 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-[1.08] font-normal">
            {isEn ? (
              <>From first conversation, <br /><span className="text-zinc-500">to live production.</span></>
            ) : (
              <>Du premier échange, <br /><span className="text-zinc-500">à la mise en ligne.</span></>
            )}
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            {isEn
              ? "No obscurity or sudden surprises. Every phase has a clear purpose, and you see your application come to life day after day."
              : "Pas de jargon obscur ni de mauvaise surprise. Chaque étape a un objectif limpide, et vous suivez l'avancement de votre produit en direct."}
          </p>
        </div>

        {/* 3 Phases Précises (Non-cliquables, zéro hover) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0 w-full">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-8 rounded-xl bg-zinc-50/40 border border-black/[0.08] flex flex-col justify-between space-y-6 min-w-0 w-full overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] font-mono px-3 py-1 rounded-xl bg-black text-white uppercase tracking-wider font-medium whitespace-nowrap shrink-0">
                    {phase.timing}
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl text-zinc-400 font-medium whitespace-nowrap">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-display uppercase text-lg sm:text-xl md:text-2xl text-black tracking-tight leading-snug font-medium">
                  {phase.title}
                </h3>

                <div className="p-3.5 rounded-lg bg-white border border-black/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block whitespace-nowrap">
                    {isEn ? "WHAT YOU RECEIVE" : "CE QUE VOUS RECEVEZ"}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-black block">
                    {phase.deliverable}
                  </span>
                </div>

                <ul className="space-y-2 pt-1">
                  {phase.bullets.map((b, i) => (
                    <li key={i} className="text-xs sm:text-sm text-zinc-600 font-normal flex items-start space-x-2 leading-relaxed">
                      <span className="text-black font-mono text-xs mt-0.5 shrink-0">/</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
