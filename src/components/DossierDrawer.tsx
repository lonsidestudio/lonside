"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, ExternalLink, ArrowUpRight } from "lucide-react";
import type { LocalizedProject } from "@/lib/keystatic/reader";
import { captureLeadEvent } from "@/lib/posthog";

interface DossierDrawerProps {
  project: LocalizedProject | null;
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

export default function DossierDrawer({ project, isOpen, onClose }: DossierDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeProject, setActiveProject] = useState<LocalizedProject | null>(project);
  const t = useTranslations("dossier");

  useEffect(() => {
    if (isOpen && project) {
      setActiveProject(project);
      setMounted(true);
      captureLeadEvent("dossier_opened", {
        client: project.client,
        slug: project.slug,
        industry: project.industry,
      });
      // Double rAF garantit le montage initial hors-écran avant d'animer l'entrée
      const frame1 = requestAnimationFrame(() => {
        const frame2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(frame2);
      });
      return () => cancelAnimationFrame(frame1);
    } else if (!isOpen) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 350); // Synchronisé avec la durée de transition
      return () => clearTimeout(timer);
    }
  }, [isOpen, project]);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, onClose]);

  if (!mounted || !activeProject) return null;

  const handleExternalVisit = (placement: "header" | "footer") => {
    captureLeadEvent("dossier_external_clicked", {
      project_slug: activeProject.slug,
      placement,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Dossier ${activeProject.client}`}
      className="fixed inset-0 z-50 flex justify-end overflow-hidden"
    >
      {/* Arrière-plan sombre avec fondu progressif */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-out cursor-pointer ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panneau latéral : SANS radius gauche (arête droite nette), glissement dynamique */}
      <div
        className={`relative w-full max-w-full sm:max-w-lg md:max-w-xl h-full bg-white rounded-none border-l border-black/[0.12] flex flex-col z-10 overflow-hidden shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header Haute Précision Studio : Deux Niveaux Parfaitement Hiérarchisés */}
        <div className="border-b border-black/[0.08] bg-white shrink-0">
          {/* Niveau 1 : Barre d'Utilité & Actions */}
          <div className="px-5 sm:px-7 py-3 sm:py-3.5 border-b border-black/[0.05] bg-zinc-50/70 flex items-center justify-between gap-3">
            <span className="text-[10px] sm:text-[11px] font-mono font-medium text-black px-2.5 py-1 rounded-md bg-white border border-black/[0.08] shadow-2xs whitespace-nowrap uppercase">
              {activeProject.deliveryDays} {t("days")}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  onClick={() => handleExternalVisit("header")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-colors min-h-[32px] sm:min-h-[34px] shadow-xs cursor-pointer whitespace-nowrap"
                  title={t("visitLiveSite")}
                >
                  <span>{t("liveSite")}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 sm:w-8.5 sm:h-8.5 min-h-[36px] min-w-[36px] rounded-xl border border-black/[0.08] bg-white hover:bg-zinc-100 text-zinc-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                aria-label={t("close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Niveau 2 : Titre & Industrie (Zéro Texte Tronqué, 100% Lisible) */}
          <div className="px-5 sm:px-7 py-4 sm:py-5 space-y-1.5">
            <p className="text-xs sm:text-[13px] font-mono text-zinc-500 uppercase tracking-wider leading-relaxed">
              {activeProject.industry}
            </p>
            <h2 className="font-display uppercase text-3xl sm:text-4xl text-black tracking-tight leading-none">
              {activeProject.client}
            </h2>
          </div>
        </div>

        {/* Content Aéré */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-6 text-sm">
          {/* Titre & Résumé */}
          <section className="space-y-2.5">
            <h3 className="text-lg sm:text-xl md:text-2xl font-light text-black leading-snug">
              {activeProject.headline}
            </h3>
            {activeProject.studioNote && (
              <p className="text-xs text-zinc-600 font-normal leading-relaxed border-l-2 border-black pl-3 py-1 bg-zinc-50 rounded-r-md">
                {activeProject.studioNote}
              </p>
            )}
          </section>

          {/* Metrics Chiffrées Concrètes (rounded-lg) */}
          {activeProject.metrics && activeProject.metrics.length > 0 && (
            <section className="space-y-2.5">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                {t("keyResults")}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                {activeProject.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-zinc-50/60 border border-black/[0.06] flex flex-col justify-between"
                  >
                    <span className="text-[10px] sm:text-[11px] text-zinc-500 font-mono">{m.label}</span>
                    <div className="mt-1.5">
                      <span className="text-base sm:text-xl font-mono font-medium text-black">{m.value}</span>
                      {m.delta && (
                        <span className="block text-[10px] font-mono text-zinc-600 mt-0.5">
                          {m.delta}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Défi & Réalisation Concrète (rounded-lg) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-3.5 sm:p-4 rounded-lg bg-zinc-50/60 border border-black/[0.04] space-y-1.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                {t("contextNeed")}
              </p>
              <p className="text-xs sm:text-sm text-zinc-700 font-normal leading-relaxed">{activeProject.challenge}</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-lg bg-zinc-50/60 border border-black/[0.04] space-y-1.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-black font-semibold">
                {t("whatWeDelivered")}
              </p>
              <p className="text-xs sm:text-sm text-zinc-900 font-normal leading-relaxed">{activeProject.solution}</p>
            </div>
          </section>

          {/* Témoignage Client Authentique (rounded-lg) */}
          {(activeProject.testimonialQuote || activeProject.clientFeedback) && (
            <section className="p-4 sm:p-5 rounded-lg bg-zinc-50/60 border border-black/[0.06] space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                <span>{t("clientFeedback")}</span>
              </div>
              <p className="text-xs sm:text-sm italic text-zinc-800 leading-relaxed font-normal">
                &ldquo;{activeProject.testimonialQuote || activeProject.clientFeedback}&rdquo;
              </p>
              {activeProject.testimonialAuthor && (
                <div className="pt-2 border-t border-black/[0.06]">
                  <p className="text-xs font-semibold text-black">{activeProject.testimonialAuthor}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{activeProject.testimonialRole}</p>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Footer avec boutons arrondis (rounded-xl) */}
        <div className="p-4 sm:p-5 border-t border-black/[0.06] bg-zinc-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          {activeProject.liveUrl ? (
            <a
              href={activeProject.liveUrl}
              onClick={() => handleExternalVisit("footer")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border border-black/[0.12] hover:border-black text-xs font-mono text-black transition-colors font-medium min-h-[44px] whitespace-nowrap"
            >
              <span className="whitespace-nowrap">{t("visitClientSite")}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          ) : (
            <span className="text-[10px] font-mono text-zinc-500 text-center sm:text-left py-1 whitespace-nowrap">
              {t("privatePlatform")}
            </span>
          )}

          <a
            href="#contact"
            onClick={onClose}
            className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-black text-white font-medium text-xs hover:bg-zinc-800 transition-all cursor-pointer min-h-[44px] whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{t("discussSimilar")}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
