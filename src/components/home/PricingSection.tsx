"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { captureLeadEvent } from "@/lib/posthog";

const TIER_SERVICE_PATHS = [
  "/services/sprint-mvp-14-jours",
  "/services/plateforme-saas-sur-mesure",
  "/services/regie-tech-senior",
] as const;

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

  const enterpriseHighlights = t.raw("enterprise.highlights") as string[];

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
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              className={`relative rounded-xl bg-white border flex flex-col justify-start p-5 sm:p-8 min-w-0 w-full ${
                tier.popular
                  ? "border-black/60 bg-zinc-50/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
                  : "border-black/[0.1]"
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
                  <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed sm:min-h-[44px]">
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

              <div className="mt-auto space-y-2">
                <a
                  href="#contact"
                  onClick={() => {
                    captureLeadEvent("pricing_tier_selected", {
                      tier: tier.name,
                      price: tier.price,
                    });
                  }}
                  className={`w-full py-3.5 px-6 rounded-xl text-xs font-mono uppercase tracking-[0.14em] flex items-center justify-center space-x-2 transition-all duration-200 min-h-[46px] whitespace-nowrap cursor-pointer ${
                    tier.popular
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "bg-zinc-100 text-black hover:bg-zinc-200"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
                {TIER_SERVICE_PATHS[idx] && (
                  <Link
                    href={TIER_SERVICE_PATHS[idx]}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
                  >
                    <span>{t("tierDetailLink")}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bandeau 3+1 : Programme Sur-Mesure, Grands Comptes & Appels d'Offres */}
        <div className="mt-6 rounded-xl border border-black/[0.12] bg-zinc-50/40 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              <span>{t("enterprise.eyebrow")}</span>
            </div>
            <h3 className="font-display uppercase text-xl sm:text-2xl text-black tracking-tight leading-snug font-medium">
              {t("enterprise.title")}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              {t("enterprise.description")}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {enterpriseHighlights.map((item) => (
                <span
                  key={item}
                  className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-black/[0.08] text-zinc-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <a
            href="#contact"
            onClick={() => {
              captureLeadEvent("pricing_tier_selected", {
                tier: t("enterprise.title"),
                price: "custom_quote",
              });
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-black/[0.2] hover:border-black bg-white hover:bg-black text-black hover:text-white font-mono text-xs uppercase tracking-[0.14em] transition-all duration-200 min-h-[48px] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{t("enterprise.cta")}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-6 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-6">
            <Link
              href="/services/application-web-nextjs"
              className="text-zinc-600 hover:text-black underline underline-offset-4 transition-colors py-2 min-h-[44px] inline-flex items-center"
            >
              {t("nextjsLink")}
            </Link>
            <Link
              href="/services/boutique-shopify-sur-mesure"
              className="text-zinc-600 hover:text-black underline underline-offset-4 transition-colors py-2 min-h-[44px] inline-flex items-center"
            >
              {t("shopifyLink")}
            </Link>
          </div>
          <Link
            href="/estimation"
            className="text-black hover:text-zinc-600 underline underline-offset-4 font-medium transition-colors py-2 min-h-[44px] inline-flex items-center whitespace-nowrap shrink-0"
          >
            {t("estimatorLink")}
          </Link>
        </div>
      </div>
    </section>
  );
}
