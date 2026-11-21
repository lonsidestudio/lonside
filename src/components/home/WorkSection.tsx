"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import type { LocalizedProject } from "@/lib/keystatic/reader";
import DossierDrawer from "@/components/DossierDrawer";

interface WorkSectionProps {
  projects: LocalizedProject[];
  locale?: string;
}

export default function WorkSection({ projects, locale = "fr" }: WorkSectionProps) {
  const [selectedProject, setSelectedProject] = useState<LocalizedProject | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const t = useTranslations("work");

  const handleOpenDossier = (proj: LocalizedProject) => {
    setSelectedProject(proj);
    setIsDrawerOpen(true);
  };

  const handleCloseDossier = () => {
    setIsDrawerOpen(false);
  };

  return (
    <section id="projets" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {/* En-tête Aéré & Noble */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{t("label")}</span>
          </div>
          <h2 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-[1.08] font-normal">
            {t("title")} <br />
            <span className="text-zinc-500">{t("titleHighlight")}</span>
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Grille de Cartes Épurées & Architecturales (rounded-xl) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0 w-full">
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
              className="group relative rounded-xl bg-zinc-50/40 hover:bg-white border border-black/[0.1] hover:border-black/50 p-5 sm:p-8 transition-all duration-200 flex flex-col justify-start gap-5 sm:gap-6 cursor-pointer min-h-[250px] sm:min-h-[260px] focus:outline-none focus:ring-1 focus:ring-black min-w-0 w-full max-w-full overflow-hidden"
            >
              {/* Ligne d'en-tête discrète */}
              <div className="flex items-center justify-between gap-3 sm:gap-4 border-b border-black/[0.06] pb-3.5 min-w-0 w-full">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider truncate min-w-0">
                  0{index + 1} {"//"} {project.industry}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono px-2.5 sm:px-3 py-1 rounded-xl bg-white border border-black/[0.08] text-black font-medium whitespace-nowrap shrink-0 uppercase">
                  {project.deliveryDays} {t("days")}
                </span>
              </div>

              {/* Titre & Descriptif Succinct */}
              <div className="space-y-2.5 min-w-0 w-full">
                <div className="flex items-start justify-between gap-3 min-w-0 w-full">
                  <h3 className="font-display uppercase text-xl sm:text-2xl md:text-3xl text-black tracking-tight leading-[1.12] group-hover:text-zinc-600 transition-colors font-medium truncate min-w-0">
                    {project.client}
                  </h3>
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {project.headline}
                </p>
              </div>

              {/* Pied de Carte Épuré */}
              <div className="mt-auto pt-4 sm:pt-5 border-t border-black/[0.06] flex items-center justify-between text-xs font-mono gap-3 min-w-0 w-full">
                {project.metrics && project.metrics[0] ? (
                  <div className="flex items-center gap-1.5 min-w-0 truncate text-xs">
                    <span className="text-black font-semibold whitespace-nowrap shrink-0">
                      {project.metrics[0].value || project.metrics[0].delta}
                    </span>
                    <span className="text-zinc-500 truncate min-w-0">
                      {project.metrics[0].label}
                    </span>
                  </div>
                ) : (
                  <span className="text-zinc-400 uppercase truncate min-w-0">
                    {t("liveInProduction")}
                  </span>
                )}
                <Link
                  href={{ pathname: "/portfolio/[slug]", params: { slug: project.slug } }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-black underline underline-offset-4 font-medium hover:text-zinc-600 transition-colors whitespace-nowrap shrink-0 text-xs ml-auto py-1"
                >
                  <span className="hidden sm:inline">{t("projectDetails")}</span>
                  <span className="sm:hidden">{t("details")}</span>
                </Link>
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
