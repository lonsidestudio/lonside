"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CostEstimator from "@/components/CostEstimator";
import { Badge } from "@/components/ui/Badge";
import { useInView } from "@/hooks/useInView";
import {
  DollarSign, ShieldCheck, Zap, Sparkles, Check, ArrowRight,
  Palette, TrendingUp, Wrench, Bot, Cpu, SlidersHorizontal
} from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

/* ─── Fade-slide helper ─────────────────────────────────────────────────── */
function revealStyle(inView: boolean, delay = 0, dy = 18): React.CSSProperties {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : `translateY(${dy}px)`,
    transition: `opacity 0.55s ease, transform 0.55s ease`,
    transitionDelay: `${delay}ms`,
  };
}

export default function TarifsClient() {
  const t = useTranslations("tarifs");
  const tData = useTranslations("pricingData");

  /* ── State ── */
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  /* ── InView refs ── */
  const { ref: guaranteesRef, inView: guaranteesInView } = useInView(0.1);
  const { ref: step1Ref, inView: step1InView } = useInView(0.08);
  const { ref: step2Ref, inView: step2InView } = useInView(0.08);
  const { ref: estimatorRef, inView: estimatorInView } = useInView(0.08);

  /* ── Pricing data ── */
  const rawTiers = tData.raw("tiers") as {
    id: string; name: string; description: string; features: string[]; cta: string;
  }[];

  const tiersMeta: Record<string, { price: number; period: "project" | "month"; highlighted: boolean }> = {
    starter:    { price: 1500, period: "project", highlighted: false },
    pro:        { price: 4500, period: "project", highlighted: true  },
    enterprise: { price: 9500, period: "project", highlighted: false },
  };

  const PRICING_TIERS = rawTiers.map((tier) => ({
    ...tier,
    ...tiersMeta[tier.id],
  }));

  const rawAddons = tData.raw("addons") as { id: string; name: string; unit: string }[];

  const addonsMeta: Record<string, { price: number }> = {
    design:       { price: 800  },
    seo:          { price: 600  },
    automation:   { price: 1200 },
    maintenance:  { price: 350  },
    "ai-agent":   { price: 2000 },
  };

  const PRICING_ADDONS = rawAddons.map((a) => ({ ...a, price: addonsMeta[a.id]?.price ?? 0 }));

  type AddonMeta = { icon: React.ReactNode; idleClass: string; iconBg: string; activeClass: string };
  const ADDON_META: Record<string, AddonMeta> = {
    design:     { icon: <Palette    className="w-4 h-4 text-pink-400"    />, idleClass: "hover:border-pink-500/40    hover:bg-pink-500/5",    iconBg: "bg-pink-500/10    border-pink-500/20",    activeClass: "border-pink-500/60    shadow-[0_0_20px_rgba(244,63,94,0.15)]    bg-[#0d0d11]" },
    seo:        { icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, idleClass: "hover:border-emerald-500/40 hover:bg-emerald-500/5", iconBg: "bg-emerald-500/10 border-emerald-500/20", activeClass: "border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]  bg-[#0d0d11]" },
    automation: { icon: <Cpu        className="w-4 h-4 text-blue-400"    />, idleClass: "hover:border-blue-500/40   hover:bg-blue-500/5",    iconBg: "bg-blue-500/10    border-blue-500/20",    activeClass: "border-blue-500/60    shadow-[0_0_20px_rgba(59,130,246,0.15)]   bg-[#0d0d11]" },
    maintenance:{ icon: <Wrench     className="w-4 h-4 text-amber-400"   />, idleClass: "hover:border-amber-500/40  hover:bg-amber-500/5",   iconBg: "bg-amber-500/10   border-amber-500/20",   activeClass: "border-amber-500/60   shadow-[0_0_20px_rgba(245,158,11,0.15)]   bg-[#0d0d11]" },
    "ai-agent": { icon: <Bot        className="w-4 h-4 text-brand-purple"/>, idleClass: "hover:border-brand-purple/40 hover:bg-brand-purple/5",iconBg: "bg-brand-purple/10 border-brand-purple/20", activeClass: "border-brand-purple/60 shadow-[0_0_20px_rgba(124,58,237,0.15)] bg-[#0d0d11]" },
  };

  const handleToggleAddon = (id: string) =>
    setSelectedAddons((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const selectedTierData  = PRICING_TIERS.find((t) => t.id === selectedTier);
  const totalAddonsPrice  = PRICING_ADDONS.filter((a) => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const totalPrice        = (selectedTierData?.price ?? 0) + totalAddonsPrice;
  const hasSelection      = selectedTier !== null || selectedAddons.length > 0;

  const qp = new URLSearchParams();
  if (selectedTier && selectedTier !== "enterprise") qp.set("plan", selectedTier);
  if (selectedAddons.length > 0) qp.set("addons", selectedAddons.join(","));
  const contactUrl = `/contact?${qp.toString()}`;

  const guarantees = [
    { icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, bg: "bg-emerald-500/10 border-emerald-500/20", title: t("guarantees.fixed.title"), desc: t("guarantees.fixed.desc") },
    { icon: <Zap         className="w-4 h-4 text-brand-purple" />, bg: "bg-purple-500/10  border-purple-500/20",  title: t("guarantees.speed.title"), desc: t("guarantees.speed.desc") },
    { icon: <Sparkles    className="w-4 h-4 text-blue-400"     />, bg: "bg-blue-500/10   border-blue-500/20",    title: t("guarantees.ip.title"),    desc: t("guarantees.ip.desc")    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 mb-12">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-radial-purple opacity-20 pointer-events-none -z-10" />
          <Badge icon={<DollarSign className="w-3.5 h-3.5" />}>{t("badge")}</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight max-w-4xl mx-auto">
            {t("headline")} <br />
            <span className="shimmer-text">{t("headlineHighlight")}</span>
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {t("subheadline")}
          </p>
        </section>

        {/* ── Guarantees ──────────────────────────────────────────────────── */}
        <section
          ref={guaranteesRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {guarantees.map(({ icon, bg, title, desc }, i) => (
                <div key={title} className="p-px" style={revealStyle(guaranteesInView, i * 80)}>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-slate-900/20">
                    <div className={`p-2 rounded-lg border shrink-0 ${bg}`} aria-hidden="true">{icon}</div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100 mb-0.5">{title}</h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </section>

        {/* ── Step 1 — Choose a tier ──────────────────────────────────────── */}
        <section ref={step1Ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">

          {/* Step label */}
          <div className="flex items-center gap-2.5 mb-8" style={revealStyle(step1InView, 0)}>
            <span className="w-6 h-6 rounded-full bg-brand-purple text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-sm font-bold text-white">Choisissez votre forfait</span>
            <span className="text-xs text-slate-500 hidden sm:inline">— Cliquez pour sélectionner</span>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-6 pt-3">
            {PRICING_TIERS.map((tier, i) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div key={tier.id} className="p-px" style={revealStyle(step1InView, 80 + i * 100, 22)}>
                <div
                  onClick={() => setSelectedTier(isSelected ? null : tier.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedTier(isSelected ? null : tier.id);
                    }
                  }}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  className={`group relative p-5 sm:p-6 md:p-8 rounded-2xl border flex flex-col cursor-pointer transition-all duration-500 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] select-none ${
                    isSelected
                      ? "bg-[#0b0a1a]/80 border-brand-purple"
                      : tier.highlighted
                      ? "bg-[#0b0a1a]/60 border-brand-purple/40 hover:border-brand-purple/70 hover:bg-[#0b0a1a]/80"
                      : "bg-[#0d0d11]/80 border-white/5 hover:border-brand-purple/25 hover:bg-[#0d0d11]/95"
                  }`}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 p-1 rounded-full bg-brand-purple text-white animate-in zoom-in duration-200" aria-hidden="true">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Popular pill */}
                  {tier.highlighted && (
                    <>
                      {!isSelected && <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 to-transparent rounded-2xl pointer-events-none -z-10" />}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-purple text-white shadow-md tracking-wider">
                          {t("highlighted").toUpperCase()}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="mb-5">
                    <h3 className="text-base font-bold text-white mb-1">{tier.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] text-slate-400 font-semibold self-end mb-1">{t("from")}</span>
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                        {tier.price.toLocaleString("fr-FR")}
                      </span>
                      <span className="text-lg font-bold text-slate-400">€</span>
                      <span className="text-[10px] text-slate-400 font-medium self-end mb-1">
                        {tier.period === "project" ? t("perProject") : t("perMonth")}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start text-xs text-slate-300 gap-2.5">
                        <div className="p-0.5 rounded-full bg-brand-purple/15 text-brand-purple shrink-0 mt-0.5" aria-hidden="true">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`w-full flex items-center justify-center py-3 rounded-lg text-xs font-bold transition-all duration-500 gap-2 pointer-events-none ${
                      isSelected
                        ? "bg-brand-purple text-white"
                        : tier.highlighted
                        ? "bg-brand-purple/20 border border-brand-purple/40 text-white group-hover:bg-brand-purple/25"
                        : "border border-white/10 text-slate-300 bg-slate-900/20 group-hover:border-white/20 group-hover:text-slate-200"
                    }`}
                    aria-hidden="true"
                  >
                    <span>{isSelected ? "Forfait sélectionné" : tier.cta}</span>
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Step 2 — Add-ons ─────────────────────────────────────────────── */}
        <section ref={step2Ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 border-t border-white/5 pt-14">

          {/* Step label */}
          <div className="flex items-center gap-2.5 mb-8" style={revealStyle(step2InView, 0)}>
            <span
              className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors duration-400"
              style={{ background: selectedTier ? "rgb(124,58,237)" : "rgba(255,255,255,0.1)" }}
            >2</span>
            <span className="text-sm font-bold text-white">{t("addons.title")}</span>
            <span className="text-xs text-slate-500 hidden sm:inline">— {t("addons.subtitle")}</span>
          </div>

          {/* Addon cards — clickable, hover is intentional */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {PRICING_ADDONS.map((addon, i) => {
              const isSelected = selectedAddons.includes(addon.id);
              const meta = ADDON_META[addon.id] ?? {
                icon: <Sparkles className="w-4 h-4 text-purple-400" />,
                idleClass: "hover:border-brand-purple/20 hover:bg-purple-500/5",
                iconBg: "bg-purple-500/10 border-purple-500/20",
                activeClass: "border-brand-purple/60 shadow-[0_0_20px_rgba(124,58,237,0.15)] bg-brand-purple/5",
              };
              return (
                <div key={addon.id} className="p-px" style={revealStyle(step2InView, 60 + i * 60, 14)}>
                  <div
                    onClick={() => handleToggleAddon(addon.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggleAddon(addon.id);
                      }
                    }}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    className={`p-5 rounded-2xl bg-[#0d0d11]/80 border cursor-pointer relative transition-all duration-500 flex flex-col items-center justify-between text-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] select-none ${
                      isSelected ? meta.activeClass : `border-white/5 ${meta.idleClass}`
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 p-0.5 rounded-full bg-brand-purple text-white shadow-md animate-in zoom-in duration-150" aria-hidden="true">
                        <Check className="w-3 h-3" />
                      </div>
                    )}

                    <div className={`p-2.5 rounded-xl border ${meta.iconBg} mb-3`} aria-hidden="true">
                      {meta.icon}
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-xs font-semibold text-slate-300 mb-1 transition-colors duration-500 group-hover:text-slate-100">
                        {addon.name}
                      </div>
                      <div className="text-sm font-bold text-white font-mono mt-1">
                        +{addon.price.toLocaleString("fr-FR")}€
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">/ {addon.unit}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Live summary bar ─────────────────────────────────────────────── */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
          style={{
            opacity: hasSelection ? 1 : 0,
            transform: hasSelection ? "translateY(0) scale(1)" : "translateY(10px) scale(0.99)",
            pointerEvents: hasSelection ? "auto" : "none",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <div className="rounded-2xl border border-brand-purple/40 bg-[#0b0a1a]/90 backdrop-blur-sm p-5 shadow-[0_0_40px_rgba(124,58,237,0.1)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              {/* Breakdown chips */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="text-slate-500 font-medium">Votre sélection :</span>
                {selectedTierData && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-purple/20 border border-brand-purple/40 text-white font-semibold animate-in fade-in zoom-in-95 duration-200">
                    {selectedTierData.name}
                    <span className="text-purple-300 font-mono">{selectedTierData.price.toLocaleString("fr-FR")}€</span>
                  </span>
                )}
                {selectedAddons.length > 0 && (
                  <>
                    {selectedTierData && <span className="text-slate-700">+</span>}
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 animate-in fade-in zoom-in-95 duration-200">
                      {selectedAddons.length} option{selectedAddons.length > 1 ? "s" : ""}
                      <span className="font-mono text-slate-400">+{totalAddonsPrice.toLocaleString("fr-FR")}€</span>
                    </span>
                  </>
                )}
              </div>

              {/* Total + CTA */}
              <div className="flex items-center gap-3 w-full sm:w-auto sm:shrink-0">
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 mb-0.5">Total estimé</div>
                  <div
                    key={totalPrice}
                    className="text-2xl font-extrabold text-white font-mono tracking-tight animate-in fade-in zoom-in-95 duration-200"
                  >
                    {totalPrice > 0 ? `${totalPrice.toLocaleString("fr-FR")}€` : "Sur devis"}
                  </div>
                </div>
                <Link
                  href={contactUrl as any}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg hover:shadow-[0_0_28px_rgba(124,58,237,0.45)] active:scale-95 transition-all duration-200 whitespace-nowrap"
                >
                  Démarrer mon projet
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Custom estimator ─────────────────────────────────────────────── */}
        <div ref={estimatorRef}>
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2"
            style={revealStyle(estimatorInView, 0)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
                <SlidersHorizontal className="w-4 h-4 text-brand-purple" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Besoin d&apos;un devis sur-mesure ?</p>
                <p className="text-[10px] text-slate-400">Combinez les briques fonctionnelles ci-dessous pour estimer un projet personnalisé.</p>
              </div>
            </div>
          </div>
          <CostEstimator />
        </div>
      </main>

      <Footer />
    </>
  );
}
