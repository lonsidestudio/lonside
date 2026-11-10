"use client";

import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, Layers } from "lucide-react";
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
    <section id="projets" className="relative py-28 bg-[#000000] border-t border-white/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="max-w-3xl mb-16">
          <div className="studio-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{isEn ? "Selected Case Studies" : "Dossiers Techniques & Études de Cas"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            {isEn ? "Engineered for Extreme Velocity." : "Conçus pour l'Extrême Vélocité."}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            {isEn
              ? "Discover how we turn high-stakes product architectures into revenue-generating, production-ready systems in 14 to 30 days."
              : "Découvrez comment nous transformons des architectures critiques en systèmes opérationnels prêts à encaisser en 14 à 30 jours ouvrés."}
          </p>
        </div>

        {/* Grille des Projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <article
              key={project.slug}
              onClick={() => handleOpenDossier(project)}
              className="group relative rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/25 p-7 sm:p-9 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              <div>
                {/* Meta ligne */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-[11px] font-mono tracking-widest text-[#a1a1aa] uppercase">
                      {project.industry}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white font-semibold">
                    {project.deliveryDays} {isEn ? "Days Sprint" : "Jours"}
                  </span>
                </div>

                {/* Nom du Client & Accroche */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-between group-hover:text-slate-200 transition-colors">
                    <span>{project.client}</span>
                    <ArrowUpRight className="w-5 h-5 text-[#71717a] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed line-clamp-3">
                    {project.headline}
                  </p>
                </div>

                {/* Métrique Clé */}
                {project.metrics && project.metrics[0] && (
                  <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-baseline justify-between">
                    <span className="text-xs text-[#71717a] font-mono">
                      {project.metrics[0].label}
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl sm:text-2xl font-black font-mono text-white">
                        {project.metrics[0].value}
                      </span>
                      {project.metrics[0].delta && (
                        <span className="text-xs font-mono text-[#10b981]">
                          {project.metrics[0].delta}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Stack & Bouton Dossier */}
              <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#a1a1aa]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 text-[#71717a]">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-white group-hover:underline flex items-center space-x-1">
                  <span>{isEn ? "Open Case Study" : "Ouvrir le dossier"}</span>
                  <span>→</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Drawer interactif */}
      <DossierDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={handleCloseDossier}
        locale={locale}
      />
    </section>
  );
}

