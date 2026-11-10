"use client";

import React from "react";
import { GitCommit, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

interface MethodSectionProps {
  locale?: string;
}

export default function MethodSection({ locale = "fr" }: MethodSectionProps) {
  const isEn = locale === "en";

  const phases = [
    {
      timing: isEn ? "Days 1 — 3" : "Jours 1 — 3",
      title: isEn ? "Scalpel Scoping & System Architecture" : "Cadrage Scalpel & Architecture Système",
      deliverable: isEn ? "Technical Specification & Validated UI Prototype" : "Spécification Technique & Maquette Validée",
      bullets: isEn
        ? [
            "Data model design (PostgreSQL / Supabase schemas)",
            "System boundary definitions and API contracts",
            "Figma high-fidelity responsive prototype",
            "Signed acceptance criteria checklist",
          ]
        : [
            "Conception du schéma de données relationnel et migrations",
            "Définition stricte des contrats d'API et flux d'authentification",
            "Maquette haute-fidélité validée sur Desktop et Mobile",
            "Checklist de critères d'acceptation irrévocable",
          ],
    },
    {
      timing: isEn ? "Days 4 — 11" : "Jours 4 — 11",
      title: isEn ? "High-Velocity Engineering Sprint" : "Sprint Intensif d'Ingénierie Pure",
      deliverable: isEn ? "Fully Functional Software on Staging Environment" : "Logiciel Fonctionnel sur Environnement Staging",
      bullets: isEn
        ? [
            "Next.js 16 App Router & strict TypeScript implementation",
            "Backend pipelines, third-party APIs & webhooks",
            "Automated test suites (unit + integration coverage > 80%)",
            "Continuous branch preview deployments",
          ]
        : [
            "Implémentation Next.js 16 et typage TypeScript strict à zéro compromis",
            "Intégration des APIs tierces, paiements Stripe et webhooks fiables",
            "Couverture de tests automatisés (unitaires & intégration > 80%)",
            "Déploiements continus de prévisualisation à chaque commit",
          ],
    },
    {
      timing: isEn ? "Days 12 — 14" : "Jours 12 — 14",
      title: isEn ? "Joint Acceptance, Security Audit & Handover" : "Recette Conjointe, Audit & Handover Pack",
      deliverable: isEn ? "Production Launch + 30-Day Guarantee Activated" : "Mise en Production + Garantie Corrective 30 Jours",
      bullets: isEn
        ? [
            "Performance and SEO audit (Lighthouse scores > 95/100)",
            "Complete source code transfer to your private Git repo",
            "Comprehensive Loom video walkthrough and handover docs",
            "30-day bug-fix SLA warranty automatically begins",
          ]
        : [
            "Audit de sécurité et de performances (Lighthouse 100/100)",
            "Transfert définitif de la propriété du code sur votre GitHub",
            "Pack de livraison documenté et visite guidée vidéo (Loom)",
            "Activation immédiate de la garantie corrective 30 jours sans frais",
          ],
    },
  ];

  return (
    <section id="methode" className="relative py-28 bg-[#000000] border-t border-white/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mb-16">
          <div className="studio-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{isEn ? "The 14-Day Delivery Protocol" : "Le Protocole de Livraison 14 Jours"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            {isEn ? "Clockwork Precision. Zero Deviation." : "Une Précision d'Horlogerie Suisse."}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            {isEn
              ? "Each sprint runs on an immutable schedule. No delays, no scope creep, and zero unexpected surprises."
              : "Chaque sprint suit une séquence immuable et documentée. Zéro dérive de périmètre, zéro mauvaise surprise."}
          </p>
        </div>

        {/* Timeline des 3 Phases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white/10 text-white">
                    {phase.timing}
                  </span>
                  <span className="text-xs font-mono text-[#71717a]">Phase {idx + 1}</span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {phase.title}
                </h3>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase block">
                    {isEn ? "Key Deliverable" : "Livrable Clé"}
                  </span>
                  <span className="text-xs font-medium text-slate-200">
                    {phase.deliverable}
                  </span>
                </div>

                <ul className="space-y-2.5 pt-2">
                  {phase.bullets.map((b, i) => (
                    <li key={i} className="text-xs text-[#a1a1aa] flex items-start space-x-2">
                      <span className="text-[#10b981] font-bold mt-0.5">•</span>
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
