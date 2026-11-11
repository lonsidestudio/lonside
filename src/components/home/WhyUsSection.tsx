import React from "react";
import { getTranslations } from "next-intl/server";

interface WhyUsSectionProps {
  locale?: string;
}

export default async function WhyUsSection({ locale = "fr" }: WhyUsSectionProps) {
  const t = await getTranslations({ locale, namespace: "whyUs" });

  return (
    <section
      id="engagement"
      className="relative py-16 sm:py-24 lg:py-28 bg-[#fafafc] border-b border-black/[0.06] overflow-hidden scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {/* ── 1. CARTOUCHE D'ORIGINE & D'ARTISANAT (STYLE DESIGNJOY) ── */}
        <div className="rounded-2xl sm:rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)] min-w-0 w-full overflow-hidden">
          <p className="text-zinc-600 text-sm sm:text-base lg:text-lg leading-relaxed text-center font-normal max-w-3xl mx-auto">
            {t("cartouche")}
          </p>
        </div>

        {/* ── 2. BLOC D'IMPACT ÉDITORIAL & SOUS-TITRE ── */}
        <div className="mt-14 sm:mt-20 lg:mt-24 text-center max-w-3xl mx-auto">
          {/* Label Monospace */}
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{t("label")}</span>
          </div>

          {/* Grand Titre avec Touche Éditoriale Italique */}
          <h2 className="font-display uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-black leading-[1.08] font-normal">
            {t("titlePrefix")}{" "}
            <span className="font-serif lowercase italic text-zinc-800 tracking-normal font-normal">
              {t("titleQuote")}
            </span>
          </h2>

          {/* Sous-texte Explicatif Épuré */}
          <p className="mt-5 sm:mt-7 text-sm sm:text-base lg:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
