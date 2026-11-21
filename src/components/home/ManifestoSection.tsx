"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface ManifestoSectionProps {
  locale?: string;
}

export default function ManifestoSection({ locale }: ManifestoSectionProps) {
  void locale;
  const t = useTranslations("manifesto");

  const commitments = t.raw("commitments") as Array<{
    num: string;
    title: string;
    subtitle: string;
    desc: string;
  }>;

  return (
    <section id="manifeste" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {/* En-tête Chaleureux & Noble */}
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

        {/* 3 Engagements Précis (Non-cliquables, zéro hover) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0 w-full">
          {commitments.map((item) => (
            <div
              key={item.num}
              className="p-5 sm:p-8 rounded-xl bg-zinc-50/40 border border-black/[0.1] flex flex-col justify-start min-w-0 w-full overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5 gap-2">
                  <span className="font-mono text-2xl sm:text-3xl text-zinc-400 font-medium whitespace-nowrap">
                    {item.num}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                    {item.subtitle}
                  </span>
                </div>

                <h3 className="font-display uppercase text-lg sm:text-xl md:text-2xl text-black tracking-tight leading-snug font-medium">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
