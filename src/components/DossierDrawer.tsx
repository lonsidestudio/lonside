"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import type { LocalizedProject } from "@/lib/keystatic/reader";

interface DossierDrawerProps {
  project: LocalizedProject | null;
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

export default function DossierDrawer({ project, isOpen, onClose, locale = "fr" }: DossierDrawerProps) {
  // Fermer avec Escape et verrouiller le scroll de l'arrière-plan
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const isEn = locale === "en";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Dossier technique ${project.client}`}
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop sombre avec flou */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Panneau latéral coulissant */}
      <div className="relative w-full max-w-2xl h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* En-tête fixe */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0e0e0e]/80 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10b981]" />
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase">
                {project.industry} • {project.deliveryDays} {isEn ? "Days Sprint" : "Jours Ouvrés"}
              </p>
              <h2 className="text-lg font-bold text-white tracking-tight">{project.client}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200 cursor-pointer"
            aria-label={isEn ? "Close drawer" : "Fermer le dossier"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps défilable */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 text-sm">
          {/* Accroche & Note de cadrage */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-white leading-snug">
              {project.headline}
            </h3>
            {project.studioNote && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-[#a1a1aa] text-xs leading-relaxed space-y-1">
                <p className="font-mono text-[10px] uppercase text-white/50 tracking-wider">
                  {isEn ? "Studio Analysis Note" : "Note d'arbitrage Studio"}
                </p>
                <p>{project.studioNote}</p>
              </div>
            )}
          </section>

          {/* Grille de métriques vérifiées */}
          {project.metrics && project.metrics.length > 0 && (
            <section className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa]">
                {isEn ? "Audited Performance & Impact" : "Impact & Métriques Contrôlées"}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#111111] border border-white/5 flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-[#71717a] font-medium">{m.label}</span>
                    <div className="mt-2">
                      <span className="text-xl font-bold font-mono text-white">{m.value}</span>
                      {m.delta && (
                        <span className="block text-[10px] font-mono text-[#10b981] mt-0.5">
                          {m.delta}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Défi vs Résolution */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#111111] border border-white/5 space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-red-400">
                {isEn ? "The Core Challenge" : "Le Défi Initial"}
              </p>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">{project.challenge}</p>
            </div>
            <div className="p-5 rounded-xl bg-[#111111] border border-white/5 space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#10b981]">
                {isEn ? "Lonside Solution" : "La Réponse Lonside"}
              </p>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">{project.solution}</p>
            </div>
          </section>

          {/* Contraintes & Décisions d'ingénierie */}
          {project.constraints && project.constraints.length > 0 && (
            <section className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa]">
                {isEn ? "Engineering Constraints & Decisions" : "Contraintes Métier & Décisions d'Ingénierie"}
              </h4>
              <div className="space-y-3">
                {project.constraints.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{c.title}</span>
                      {c.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#a1a1aa]">
                          {c.badge}
                        </span>
                      )}
                    </div>
                    {c.risk && (
                      <p className="text-[11px] text-[#71717a]">
                        <strong className="text-slate-400">{isEn ? "Risk:" : "Risque :"}</strong> {c.risk}
                      </p>
                    )}
                    {c.resolution && (
                      <p className="text-[11px] text-[#a1a1aa]">
                        <strong className="text-white">{isEn ? "Arbitration:" : "Arbitrage :"}</strong> {c.resolution}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Stack Technique & Services */}
          <section className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa]">
              {isEn ? "Delivered Stack & Services" : "Socle Technique & Services Livrés"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-mono rounded-lg bg-white/5 border border-white/10 text-slate-300"
                >
                  {tech}
                </span>
              ))}
              {project.services.map((svc, idx) => (
                <span
                  key={`svc-${idx}`}
                  className="px-3 py-1 text-xs font-mono rounded-lg bg-white/[0.02] border border-white/5 text-[#71717a]"
                >
                  {svc}
                </span>
              ))}
            </div>
            {project.architectureSummary && (
              <p className="text-xs text-[#71717a] leading-relaxed italic">
                {project.architectureSummary}
              </p>
            )}
          </section>

          {/* Chronologie du Sprint */}
          {project.process && project.process.length > 0 && (
            <section className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa]">
                {isEn ? "Sprint Cadence & Delivery Process" : "Cadence & Déroulement du Sprint"}
              </h4>
              <div className="border-l border-white/10 pl-4 space-y-4">
                {project.process.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white/30 border-2 border-[#0a0a0a]" />
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold text-white">{step.day}</span>
                      <span className="text-[10px] font-mono text-[#71717a]">• {step.actor}</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">{step.action}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Témoignage client */}
          {project.testimonialQuote && (
            <section className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <p className="text-xs italic text-slate-200 leading-relaxed">
                "{project.testimonialQuote}"
              </p>
              <div>
                <p className="text-xs font-bold text-white">{project.testimonialAuthor}</p>
                <p className="text-[10px] text-[#71717a] font-mono">{project.testimonialRole}</p>
              </div>
            </section>
          )}
        </div>

        {/* Pied de page avec CTA */}
        <div className="p-6 border-t border-white/10 bg-[#0e0e0e] flex items-center justify-between gap-4">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-mono text-[#a1a1aa] hover:text-white transition-colors"
            >
              <span>{isEn ? "Live Demo" : "Voir en production"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-[10px] font-mono text-[#71717a]">
              {isEn ? "Proprietary Architecture" : "Architecture Déployée Sous NDA"}
            </span>
          )}

          <a
            href="#contact"
            onClick={onClose}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-[#eaeaea] transition-all cursor-pointer shadow-lg"
          >
            <span>{isEn ? "Book Similar Sprint" : "Lancer un sprint similaire"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

