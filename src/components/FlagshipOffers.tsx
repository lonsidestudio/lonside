"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useInView } from "@/hooks/useInView";
import {
  Rocket,
  RefreshCw,
  Clock,
  ArrowRight,
  Check,
  Sparkles,
  Terminal,
  SlidersHorizontal,
  Zap,
  X,
  Users,
} from "lucide-react";

export default function FlagshipOffers() {
  const t = useTranslations("flagship");
  const [activeTab, setActiveTab] = useState<"mvp" | "switch" | "regie">("mvp");
  const [trafficVolume, setTrafficVolume] = useState<number>(3000);

  const { ref: headerRef, inView: headerInView } = useInView(0.1);
  const { ref: cardsRef, inView: cardsInView } = useInView(0.08);
  const { ref: hudRef, inView: hudInView } = useInView(0.08);

  const mvpDeliverables = t.raw("mvpCard.deliverables") as string[];
  const switchDeliverables = t.raw("switchCard.deliverables") as string[];
  const regieDeliverables = t.raw("regieCard.deliverables") as string[];

  const getRoiData = (
    field:
      | "tradCost"
      | "tradTimeline"
      | "tradRecurring"
      | "tradOwnership"
      | "lonsideCost"
      | "lonsideTimeline"
      | "lonsideRecurring"
      | "lonsideOwnership"
      | "moneySavedValue"
      | "timeSavedValue"
      | "conversionBoostValue"
  ) => {
    if (activeTab === "mvp") return t(`roi.mvpData.${field}` as any);
    if (activeTab === "switch") return t(`roi.switchData.${field}` as any);
    return t(`roi.regieData.${field}` as any);
  };

  // Calcul dynamique des conversions sauvées grâce au chargement instantané (< 0.5s)
  const estimatedConversionLoss = Math.round(trafficVolume * 0.028);

  return (
    <section id="offres-phares" className="relative py-24 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Background ambient mesh grid & glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] glow-radial-purple opacity-20 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="text-center mb-16 space-y-4"
          style={{
            opacity: headerInView ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-semibold tracking-wide mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            <span>{t("badge")}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
            {t("headline")}{" "}
            <span className="shimmer-text">{t("headlineHighlight")}</span>
          </h2>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            {t("subheadline")}
          </p>
        </div>

        {/* ── 1. The 3 Flagship Offer Cards ─────────────────────────────── */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          style={{
            opacity: cardsInView ? 1 : 0,
            transition: "opacity 0.65s ease",
          }}
        >
          {/* Card 1: Le Sprint MVP 14 Jours */}
          <div className="group relative p-6 sm:p-8 rounded-2xl bg-[#0d0d11] border border-white/8 hover:border-brand-purple/40 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 flex flex-col justify-between overflow-hidden cursor-default shadow-xl">
            {/* Subtle internal glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
              style={{ background: "radial-gradient(circle at 10% 10%, rgba(124,58,237,0.08) 0%, transparent 60%)" }}
            />

            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide bg-slate-900 border border-white/5 text-slate-400">
                  {t("mvpCard.tag")}
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-[10px] font-mono font-bold">
                  <Clock className="w-3 h-3 text-brand-purple" />
                  <span>{t("mvpCard.delay")}</span>
                </div>
              </div>

              {/* Title & icon */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 shadow-inner transition-[border-color,box-shadow] duration-300 group-hover:border-brand-purple/25 group-hover:shadow-[0_0_12px_rgba(124,58,237,0.12)]">
                  <Rocket className="w-5 h-5 text-brand-purple" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-brand-purple transition-colors duration-300">
                  {t("mvpCard.title")}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                {t("mvpCard.desc")}
              </p>

              {/* Price / Investment Box */}
              <div className="p-4 rounded-xl bg-[#050505] border border-white/5 mb-6 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                    {t("mvpCard.investmentLabel")}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                      {t("mvpCard.investmentRange")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    {t("mvpCard.investmentSub")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold block">
                    100% Cession code
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Zéro royalties
                  </span>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-2.5 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                  Livrables inclus
                </span>
                {mvpDeliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <div className="p-0.5 rounded-full bg-brand-purple/15 text-brand-purple shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/15 flex items-center gap-2 text-[11px] text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                <span>Cadrage technique 15 min offert.</span>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <Link
                href={{ pathname: "/estimation", query: { type: "saas", scale: "mvp" } }}
                className="w-full py-2.5 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-purple-500/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-200 cursor-pointer"
              >
                <span>{t("mvpCard.cta")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="text-center pt-1">
                <Link
                  href={{ pathname: "/contact", query: { source: "sprint-mvp" } }}
                  className="text-[11px] text-slate-400 hover:text-brand-purple transition-colors font-medium inline-flex items-center gap-1"
                >
                  <span>{t("mvpCard.ctaScoping")}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Le Switch WordPress ➔ Next.js */}
          <div className="group relative p-6 sm:p-8 rounded-2xl bg-[#0d0d11] border border-white/8 hover:border-brand-purple/40 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 flex flex-col justify-between overflow-hidden cursor-default shadow-xl">
            {/* Subtle internal glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
              style={{ background: "radial-gradient(circle at 10% 10%, rgba(124,58,237,0.08) 0%, transparent 60%)" }}
            />

            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide bg-slate-900 border border-white/5 text-slate-400">
                  {t("switchCard.tag")}
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-[10px] font-mono font-bold">
                  <Clock className="w-3 h-3 text-brand-purple" />
                  <span>{t("switchCard.delay")}</span>
                </div>
              </div>

              {/* Title & icon */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 shadow-inner transition-[border-color,box-shadow] duration-300 group-hover:border-brand-purple/25 group-hover:shadow-[0_0_12px_rgba(124,58,237,0.12)]">
                  <RefreshCw className="w-5 h-5 text-brand-purple" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-brand-purple transition-colors duration-300">
                  {t("switchCard.title")}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                {t("switchCard.desc")}
              </p>

              {/* Price / Investment Box */}
              <div className="p-4 rounded-xl bg-[#050505] border border-white/5 mb-6 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                    {t("switchCard.investmentLabel")}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                      {t("switchCard.investmentRange")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    {t("switchCard.investmentSub")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold block">
                    0€ de plugins
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    SEO 100/100 garanti
                  </span>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-2.5 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                  Bénéfices inclus
                </span>
                {switchDeliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <div className="p-0.5 rounded-full bg-brand-purple/15 text-brand-purple shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/15 flex items-center gap-2 text-[11px] text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                <span>Audit de faisabilité & SEO offert.</span>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <Link
                href={{ pathname: "/estimation", query: { type: "refonte", scale: "mvp" } }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0d0d11] hover:bg-[#121216] border border-white/10 hover:border-brand-purple/30 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md"
              >
                <span>{t("switchCard.cta")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="text-center pt-1">
                <Link
                  href={{ pathname: "/contact", query: { source: "switch-wordpress" } }}
                  className="text-[11px] text-slate-400 hover:text-brand-purple transition-colors font-medium inline-flex items-center gap-1"
                >
                  <span>{t("switchCard.ctaScoping")}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Régie Dédiée & Squad IA */}
          <div className="group relative p-6 sm:p-8 rounded-2xl bg-[#0d0d11] border border-white/8 hover:border-brand-purple/40 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 flex flex-col justify-between overflow-hidden cursor-default shadow-xl">
            {/* Subtle internal glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
              style={{ background: "radial-gradient(circle at 10% 10%, rgba(124,58,237,0.08) 0%, transparent 60%)" }}
            />

            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide bg-slate-900 border border-white/5 text-slate-400">
                  {t("regieCard.tag")}
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-[10px] font-mono font-bold">
                  <Clock className="w-3 h-3 text-brand-purple" />
                  <span>{t("regieCard.delay")}</span>
                </div>
              </div>

              {/* Title & icon */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 shadow-inner transition-[border-color,box-shadow] duration-300 group-hover:border-brand-purple/25 group-hover:shadow-[0_0_12px_rgba(124,58,237,0.12)]">
                  <Users className="w-5 h-5 text-brand-purple" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-brand-purple transition-colors duration-300">
                  {t("regieCard.title")}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                {t("regieCard.desc")}
              </p>

              {/* Price / Investment Box */}
              <div className="p-4 rounded-xl bg-[#050505] border border-white/5 mb-6 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                    {t("regieCard.investmentLabel")}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                      {t("regieCard.investmentRange")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    {t("regieCard.investmentSub")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold block">
                    Top 3% Talents
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Essai 5j sans risque
                  </span>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-2.5 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                  Standards inclus
                </span>
                {regieDeliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <div className="p-0.5 rounded-full bg-brand-purple/15 text-brand-purple shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/15 flex items-center gap-2 text-[11px] text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                <span>Échange technique 15 min offert.</span>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <Link
                href={{ pathname: "/estimation", query: { mode: "regie" } }}
                className="w-full py-2.5 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-purple-500/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-200 cursor-pointer"
              >
                <span>{t("regieCard.cta")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="text-center pt-1">
                <Link
                  href="/services/regie"
                  className="text-[11px] text-slate-400 hover:text-brand-purple transition-colors font-medium inline-flex items-center gap-1"
                >
                  <span>{t("regieCard.ctaScoping")}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. The Interactive ROI Simulator (Scoping Telemetry HUD) ─────── */}
        <div
          ref={hudRef}
          className="p-6 sm:p-8 md:p-10 rounded-2xl border border-white/8 bg-[#0d0d11] shadow-2xl"
          style={{
            opacity: hudInView ? 1 : 0,
            transition: "opacity 0.65s ease",
          }}
        >
          {/* Header & Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-4 h-4 text-brand-purple" />
                <span className="text-xs font-bold tracking-wide text-slate-300 font-mono">
                  {t("roi.badge")}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {t("roi.title")}
              </h3>
              <p className="text-xs text-slate-400">
                {t("roi.subtitle")}
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex flex-wrap p-1 rounded-xl bg-slate-950 border border-white/8 self-start md:self-auto shrink-0 gap-1">
              <button
                onClick={() => setActiveTab("mvp")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "mvp"
                    ? "bg-brand-purple text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t("roi.tabMvp")}
              </button>
              <button
                onClick={() => setActiveTab("switch")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "switch"
                    ? "bg-brand-purple text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t("roi.tabSwitch")}
              </button>
              <button
                onClick={() => setActiveTab("regie")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "regie"
                    ? "bg-brand-purple text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t("roi.tabRegie")}
              </button>
            </div>
          </div>

          {/* Matrix Columns (Style FrustrationGrid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            {/* Traditional Column */}
            <div className="p-5 rounded-xl bg-[#0d0508] border border-red-500/10 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-red-500/10">
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 shrink-0">
                  <X className="w-2.5 h-2.5 text-red-400" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.14em] text-red-400 uppercase font-mono">
                  {t("roi.labels.traditional")}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{t("roi.labels.cost")}</span>
                  <span className="font-mono font-bold text-slate-200 text-right">
                    {getRoiData("tradCost")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{t("roi.labels.timeline")}</span>
                  <span className="font-mono font-bold text-red-400 text-right">
                    {getRoiData("tradTimeline")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{t("roi.labels.recurring")}</span>
                  <span className="font-mono text-slate-300 text-right">
                    {getRoiData("tradRecurring")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">{t("roi.labels.ownership")}</span>
                  <span className="font-mono text-slate-400 text-right">
                    {getRoiData("tradOwnership")}
                  </span>
                </div>
              </div>
            </div>

            {/* Lonside Column */}
            <div className="p-5 rounded-xl bg-[#080714] border border-brand-purple/30 space-y-4 shadow-[0_0_25px_rgba(124,58,237,0.08)]">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-purple/20">
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-brand-purple/15 border border-brand-purple/30 shrink-0">
                  <Zap className="w-2.5 h-2.5 text-brand-purple" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.14em] text-brand-purple uppercase font-mono">
                  {t("roi.labels.lonside")}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{t("roi.labels.cost")}</span>
                  <span className="font-mono font-extrabold text-white text-sm text-right">
                    {getRoiData("lonsideCost")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{t("roi.labels.timeline")}</span>
                  <span className="font-mono font-bold text-emerald-400 text-right">
                    {getRoiData("lonsideTimeline")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{t("roi.labels.recurring")}</span>
                  <span className="font-mono font-semibold text-emerald-400 text-right">
                    {getRoiData("lonsideRecurring")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">{t("roi.labels.ownership")}</span>
                  <span className="font-mono font-semibold text-white text-right">
                    {getRoiData("lonsideOwnership")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Gains Summary HUD */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="text-center sm:text-left mb-5">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider block">
                {t("roi.labels.savingsTitle")}
              </span>
              <span className="text-[11px] text-slate-400">
                {t("roi.labels.savingsSubtitle")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl border border-white/5 bg-[#0d0d11]/60">
                <div className="text-xl md:text-2xl font-extrabold font-mono bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  {getRoiData("moneySavedValue")}
                </div>
                <div className="text-[10px] font-bold text-slate-400 mt-1.5 font-mono">
                  {t("roi.labels.moneySaved")}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-[#0d0d11]/60">
                <div className="text-xl md:text-2xl font-extrabold font-mono bg-gradient-to-r from-brand-purple to-purple-400 bg-clip-text text-transparent">
                  {getRoiData("timeSavedValue")}
                </div>
                <div className="text-[10px] font-bold text-slate-400 mt-1.5 font-mono">
                  {t("roi.labels.timeSaved")}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-[#0d0d11]/60">
                <div className="text-xl md:text-2xl font-extrabold font-mono bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  {getRoiData("conversionBoostValue")}
                </div>
                <div className="text-[10px] font-bold text-slate-400 mt-1.5 font-mono">
                  {t("roi.labels.conversionBoost")}
                </div>
              </div>
            </div>

            {/* Interactive Traffic & Speed Slider (pour le switch) */}
            {activeTab === "switch" && (
              <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-brand-purple" />
                    <span className="font-semibold">Simulez le gain de conversion selon votre trafic :</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-purple">
                    {trafficVolume.toLocaleString("fr-FR")} visiteurs / mois
                  </span>
                </div>

                <input
                  type="range"
                  min={500}
                  max={25000}
                  step={500}
                  value={trafficVolume}
                  onChange={(e) => setTrafficVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono bg-[#050505] p-3 rounded-lg border border-white/5">
                  <span>Prospects supplémentaires retenus (<span className="text-brand-purple font-bold">&lt; 0.5s</span>) :</span>
                  <span className="text-brand-purple font-bold font-mono text-xs sm:text-sm">
                    ~{estimatedConversionLoss} prospects / mois
                  </span>
                </div>
              </div>
            )}

            {/* Direct Bridge to Simulator */}
            <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-xs font-bold text-white">
                  Besoin d&apos;un chiffrage sur-mesure ?
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Configurez vos modules dans notre simulateur en temps réel.
                </div>
              </div>
              <Link
                href="/estimation"
                className="px-4 py-2 rounded-lg bg-brand-purple/15 hover:bg-brand-purple/25 border border-brand-purple/30 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all duration-200 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                <span>{t("roi.ctaSimulate")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
