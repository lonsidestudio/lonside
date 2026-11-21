"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface MethodSectionProps {
  locale?: string;
}

export default function MethodSection({ locale }: MethodSectionProps) {
  void locale;
  const t = useTranslations("method");

  const phases = t.raw("phases") as Array<{
    timing: string;
    title: string;
    deliverable: string;
    bullets: string[];
  }>;

  return (
    <section id="methode" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20 overflow-hidden">
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

        {/* 3 Phases Précises (Non-cliquables, zéro hover) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0 w-full">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-8 rounded-xl bg-zinc-50/40 border border-black/[0.1] flex flex-col justify-start min-w-0 w-full overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] pb-3.5">
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
                    {t("deliverableLabel")}
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
