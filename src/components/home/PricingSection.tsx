"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

interface PricingSectionProps {
  locale?: string;
}

export default function PricingSection({ locale }: PricingSectionProps) {
  void locale;
  const t = useTranslations("pricing");

  const tiers = t.raw("tiers") as Array<{
    name: string;
    tagline: string;
    price: string;
    period: string;
    popular: boolean;
    features: string[];
    cta: string;
  }>;

  return (
    <section id="tarifs" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20 overflow-hidden">
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

        {/* Grille des Offres Haute Précision (rounded-xl) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-w-0 w-full pt-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl bg-white border flex flex-col justify-between p-5 sm:p-8 min-w-0 w-full ${
                tier.popular
                  ? "border-black/60 bg-zinc-50/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
                  : "border-black/[0.08]"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-6 z-10 px-3 py-1 rounded-xl bg-black text-white text-[9px] font-mono font-medium uppercase tracking-[0.16em] whitespace-nowrap shadow-xs">
                  {t("recommended")}
                </div>
              )}

              <div>
                <div className="space-y-1.5 mb-6">
                  <h3 className="font-display uppercase text-lg sm:text-xl md:text-2xl text-black tracking-tight font-medium">{tier.name}</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed min-h-[36px]">
                    {tier.tagline}
                  </p>
                </div>

                <div className="mb-6 pb-5 border-b border-black/[0.06]">
                  <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-black tracking-tight whitespace-nowrap">
                    {tier.price}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mt-1.5 whitespace-nowrap">
                    {tier.period}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-xs sm:text-sm text-zinc-700 font-normal flex items-start space-x-2 leading-relaxed">
                      <span className="text-black font-mono text-xs mt-0.5 shrink-0">/</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a
                  href="#contact"
                  className={`w-full py-3.5 px-6 rounded-xl text-xs font-mono uppercase tracking-[0.14em] flex items-center justify-center space-x-2 transition-all duration-200 min-h-[46px] whitespace-nowrap cursor-pointer ${
                    tier.popular
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "bg-zinc-100 text-black hover:bg-zinc-200"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
