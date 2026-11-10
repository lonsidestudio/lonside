"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { LocalizedProject } from "@/lib/keystatic/reader";
import DossierDrawer from "@/components/DossierDrawer";

interface WorkSectionProps {
  projects: LocalizedProject[];
  locale?: string;
}

export default function WorkSection({ projects, locale = "fr" }: WorkSectionProps) {
  const [selectedProject, setSelectedProject] = useState<LocalizedProject | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isEn = locale === "en";

  const handleOpenDossier = (proj: LocalizedProject) => {
    setSelectedProject(proj);
    setIsDrawerOpen(true);
  };

  const handleCloseDossier = () => {
    setIsDrawerOpen(false);
  };

  return (
    <section id="projets" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* En-tête Aéré & Noble */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{isEn ? "SELECTED WORK" : "RÉALISATIONS CHOISIES"}</span>
          </div>
          <h2 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-[1.08] font-normal">
            {isEn ? (
              <>Thoughtful products, <br /><span className="text-zinc-500">built to launch and grow.</span></>
            ) : (
              <>Des produits bien conçus, <br /><span className="text-zinc-500">faits pour durer.</span></>
            )}
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            {isEn
              ? "A selection of web applications and platforms we built alongside their founders. From the first wireframe to live production, every project solves a genuine challenge with clarity and care."
              : "Voici quelques applications et plateformes que nous avons façonnées aux côtés de leurs fondateurs. De la première maquette jusqu'au lancement officiel, chaque projet résout un vrai besoin métier avec soin et clarté."}
          </p>
        </div>

        {/* Grille de Cartes Épurées & Architecturales (rounded-xl) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {projects.map((project, index) => (
            <article
              key={project.slug}
              role="button"
              tabIndex={0}
              onClick={() => handleOpenDossier(project)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenDossier(project);
                }
              }}
              className="group relative rounded-xl bg-zinc-50/40 hover:bg-white border border-black/[0.08] hover:border-black/40 p-6 sm:p-8 transition-all duration-200 flex flex-col justify-between cursor-pointer space-y-6 min-h-[260px] focus:outline-none focus:ring-1 focus:ring-black"
            >
              {/* Ligne d'en-tête discrète */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider truncate">
                  0{index + 1} {"//"} {project.industry}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono px-3 py-1 rounded-xl bg-white border border-black/[0.08] text-black font-medium whitespace-nowrap shrink-0">
                  {project.deliveryDays} {isEn ? "DAYS" : "JOURS"}
                </span>
              </div>

              {/* Titre & Descriptif Succinct */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display uppercase text-xl sm:text-2xl md:text-3xl text-black tracking-tight group-hover:text-zinc-600 transition-colors font-medium">
                    {project.client}
                  </h3>
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
                  {project.headline}
                </p>
              </div>

              {/* Pied de Carte Épuré */}
              <div className="pt-4 sm:pt-5 border-t border-black/[0.06] flex items-center justify-between text-xs font-mono gap-4">
                {project.metrics && project.metrics[0] ? (
                  <span className="text-black font-medium whitespace-nowrap">
                    {project.metrics[0].delta || project.metrics[0].value} {project.metrics[0].label}
                  </span>
                ) : (
                  <span className="text-zinc-400 uppercase whitespace-nowrap">
                    {isEn ? "Live in production" : "En production"}
                  </span>
                )}
                <span className="text-black underline underline-offset-4 font-medium group-hover:text-zinc-600 transition-colors whitespace-nowrap shrink-0">
                  {isEn ? "Project details →" : "Détails du projet →"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Tiroir Dossier Sans Couture */}
      <DossierDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={handleCloseDossier}
        locale={locale}
      />
    </section>
  );
}
