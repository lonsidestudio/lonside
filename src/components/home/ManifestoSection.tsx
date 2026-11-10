"use client";

import React from "react";
import { ShieldCheck, Cpu, Terminal, ArrowRight, XCircle, CheckCircle } from "lucide-react";

interface ManifestoSectionProps {
  locale?: string;
}

export default function ManifestoSection({ locale = "fr" }: ManifestoSectionProps) {
  const isEn = locale === "en";

  const comparison = [
    {
      agency: isEn ? "Hourly / daily billing (TJM) that rewards slowness" : "Facturation au TJM qui récompense la lenteur et les dépassements",
      lonside: isEn ? "Fixed-price, guaranteed delivery deadlines (14d or 30d)" : "Forfait ferme, date de livraison garantie (14j ou 30j ouvrés)",
    },
    {
      agency: isEn ? "Junior developers handed off after scoping by seniors" : "Stagiaires et juniors non supervisés affectés en coulisses",
      lonside: isEn ? "100% senior lead engineers with top-tier architecture experience" : "100% d'ingénieurs seniors rompus aux architectures critiques",
    },
    {
      agency: isEn ? "Proprietary CMS locks, ongoing monthly agency fees" : "Dette technique masquée, CMS propriétaire et rentes captif",
      lonside: isEn ? "100% intellectual property transfer to your private Git repo" : "Cession intégrale 100% de la propriété intellectuelle sur votre Git",
    },
    {
      agency: isEn ? "Opaque progress, delayed updates, 6-month timelines" : "Manque de visibilité, tunnels de 6 mois sans démo concrète",
      lonside: isEn ? "Daily commits, preview branch deploys, joint sprint reviews" : "Commits quotidiens, environnements de prévisualisation continus",
    },
  ];

  const pillars = [
    {
      num: "01",
      title: isEn ? "Vectorized & Modern Architecture" : "Architecture Vectorisée & Next.js 16",
      desc: isEn
        ? "Next.js 16 (App Router, Turbopack, React Server Components), PostgreSQL / Supabase, vectorized Python. Zero unnecessary abstractions."
        : "Next.js 16 (App Router, Turbopack, React Server Components), PostgreSQL / Supabase et Python vectorisé. Zéro surcouche inutile.",
    },
    {
      num: "02",
      title: isEn ? "Bank-Grade Security & Zero Data Retention" : "Sécurité Bancaire & Zero Data Retention",
      desc: isEn
        ? "Enterprise AI configurations with strict Zero Data Retention policies. End-to-end secret encryption, strict RBAC, OWASP compliance."
        : "Accélérateurs IA d'entreprise certifiés Zero Data Retention (ZDR). Chiffrement strict des secrets, rôles RBAC étanches et conformité OWASP.",
    },
    {
      num: "03",
      title: isEn ? "Absolute IP Ownership" : "Cession Totale de Propriété Intellectuelle",
      desc: isEn
        ? "From the very first commit, all repositories, schemas, and assets are transferred to your organization. Complete freedom, zero vendor lock-in."
        : "Dès le premier commit, la totalité du code source, des migrations et des actifs vous appartient. Zéro redevance, liberté totale.",
    },
  ];

  return (
    <section id="manifeste" className="relative py-28 bg-[#000000] border-t border-white/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mb-16">
          <div className="studio-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{isEn ? "The Anti-Agency Manifesto" : "Le Manifeste Anti-Agence"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            {isEn ? "The Old Agency Model Is Broken." : "Le Modèle des Agences Classiques Est Mort."}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            {isEn
              ? "We rebuilt software engineering services from first principles: no hourly fluff, no bloated meetings, just relentless execution."
              : "Nous avons repensé l'ingénierie logicielle depuis les premiers principes : fini les devis gonflés, les réunions sans fin et les dépassements chroniques."}
          </p>
        </div>

        {/* Tableau Comparatif Brutaliste */}
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/10">
            <div className="p-6 bg-red-950/20 border-b md:border-b-0 md:border-r border-white/10 flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-red-200">
                {isEn ? "Traditional Digital Agencies" : "L'Agence Digitale Traditionnelle"}
              </h3>
            </div>
            <div className="p-6 bg-emerald-950/20 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-200">
                {isEn ? "Lonside High-Velocity Studio" : "Le Studio Commando Lonside"}
              </h3>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {comparison.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 text-xs sm:text-sm">
                <div className="p-6 text-[#71717a] md:border-r border-white/5 flex items-start space-x-3">
                  <span className="text-red-400 font-mono mt-0.5">✕</span>
                  <span>{item.agency}</span>
                </div>
                <div className="p-6 text-white font-medium bg-white/[0.01] flex items-start space-x-3">
                  <span className="text-[#10b981] font-mono mt-0.5">✓</span>
                  <span>{item.lonside}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Piliers d'Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-4 hover:border-white/20 transition-colors"
            >
              <span className="text-3xl font-mono font-black text-white/30">{pillar.num}</span>
              <h4 className="text-lg font-bold text-white tracking-tight">{pillar.title}</h4>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

