"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import {
  Calculator, ShieldCheck, Zap, Sparkles, Check, ArrowRight,
  Palette, TrendingUp, Cpu, Clock, Users, Code2, Compass,
  Workflow, CheckCircle2, ChevronDown, ChevronUp, Layers,
  Gauge, TerminalSquare, Lock, Plus, Minus, Server,
  Database, Shield, Rocket, CheckSquare, RefreshCw
} from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

/* ── Base Math Configuration for Estimator ── */
interface TypologyConfig {
  id: string;
  icon: React.ReactNode;
  minPrice: number;
  maxPrice: number;
  minDays: number;
  maxDays: number;
  acceleration: string;
}

const TYPOLOGIES: Record<string, TypologyConfig> = {
  saas: {
    id: "saas",
    icon: <Database className="w-5 h-5 text-brand-purple" />,
    minPrice: 5500,
    maxPrice: 8500,
    minDays: 10,
    maxDays: 15,
    acceleration: "x3.0",
  },
  vitrine: {
    id: "vitrine",
    icon: <Layers className="w-5 h-5 text-pink-400" />,
    minPrice: 3200,
    maxPrice: 5200,
    minDays: 5,
    maxDays: 8,
    acceleration: "x3.0",
  },
  refonte: {
    id: "refonte",
    icon: <RefreshCw className="w-5 h-5 text-emerald-400" />,
    minPrice: 4500,
    maxPrice: 7000,
    minDays: 7,
    maxDays: 12,
    acceleration: "x3.0",
  },
  automation: {
    id: "automation",
    icon: <Cpu className="w-5 h-5 text-blue-400" />,
    minPrice: 3000,
    maxPrice: 5000,
    minDays: 5,
    maxDays: 9,
    acceleration: "x4.0",
  },
};

interface ScaleConfig {
  id: string;
  priceMultiplier: number;
  daysMultiplier: number;
}

const SCALES: Record<string, ScaleConfig> = {
  mvp: { id: "mvp", priceMultiplier: 1.0, daysMultiplier: 1.0 },
  scaleup: { id: "scaleup", priceMultiplier: 1.45, daysMultiplier: 1.4 },
  enterprise: { id: "enterprise", priceMultiplier: 2.1, daysMultiplier: 1.9 },
};

interface ModuleConfig {
  id: string;
  icon: React.ReactNode;
  minAdd: number;
  maxAdd: number;
  daysAdd: number;
}

const MODULES: Record<string, ModuleConfig> = {
  stripe: {
    id: "stripe",
    icon: <Zap className="w-4 h-4 text-amber-400" />,
    minAdd: 1200,
    maxAdd: 1800,
    daysAdd: 2,
  },
  rbac: {
    id: "rbac",
    icon: <Lock className="w-4 h-4 text-emerald-400" />,
    minAdd: 900,
    maxAdd: 1400,
    daysAdd: 2,
  },
  design: {
    id: "design",
    icon: <Palette className="w-4 h-4 text-pink-400" />,
    minAdd: 1200,
    maxAdd: 1800,
    daysAdd: 3,
  },
  seo: {
    id: "seo",
    icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    minAdd: 750,
    maxAdd: 1200,
    daysAdd: 1,
  },
  ai: {
    id: "ai",
    icon: <Sparkles className="w-4 h-4 text-brand-purple" />,
    minAdd: 1500,
    maxAdd: 2400,
    daysAdd: 3,
  },
  testing: {
    id: "testing",
    icon: <ShieldCheck className="w-4 h-4 text-blue-400" />,
    minAdd: 850,
    maxAdd: 1400,
    daysAdd: 2,
  },
};

export default function EstimationClient({
  initialMode = "projects",
}: {
  initialMode?: "projects" | "regie";
}) {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const typeParam = searchParams.get("type");
  const scaleParam = searchParams.get("scale");

  const t = useTranslations("estimationPage");
  const tRegie = useTranslations("tarifs.regie");

  /* ── Mode State (Projects vs Squad/Régie) ── */
  const [activeMode, setActiveMode] = useState<"projects" | "regie">(
    modeParam === "regie" ? "regie" : modeParam === "projects" ? "projects" : initialMode
  );

  useEffect(() => {
    if (modeParam === "regie") {
      setActiveMode("regie");
    } else if (modeParam === "projects" || modeParam === "forfait") {
      setActiveMode("projects");
    }
    if (typeParam && TYPOLOGIES[typeParam]) {
      setSelectedType(typeParam);
    }
    if (scaleParam && SCALES[scaleParam]) {
      setSelectedScale(scaleParam);
    }
  }, [modeParam, typeParam, scaleParam]);

  /* ── Project Estimator State ── */
  const [selectedType, setSelectedType] = useState<string>(
    typeParam && TYPOLOGIES[typeParam] ? typeParam : "saas"
  );
  const [selectedScale, setSelectedScale] = useState<string>(
    scaleParam && SCALES[scaleParam] ? scaleParam : "scaleup"
  );
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "stripe",
    "rbac",
    "design",
  ]);

  /* ── FAQ Open State ── */
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  /* ── Squad Builder State (Régie Mode) ── */
  const [simMode, setSimMode] = useState<"single" | "squad">("squad");
  const [calcRole, setCalcRole] = useState<string>("fullstack");
  const [calcDays, setCalcDays] = useState<number>(10);
  const [squadDays, setSquadDays] = useState<Record<string, number>>({
    fullstack: 10,
    frontend: 0,
    backend: 0,
    cto: 4,
    automation: 0,
  });

  const handleToggleModule = (modId: string) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  /* ── Project Math Calculation ── */
  const calculatedEstimate = useMemo(() => {
    const typeCfg = TYPOLOGIES[selectedType] ?? TYPOLOGIES.saas;
    const scaleCfg = SCALES[selectedScale] ?? SCALES.scaleup;

    const baseMin = typeCfg.minPrice * scaleCfg.priceMultiplier;
    const baseMax = typeCfg.maxPrice * scaleCfg.priceMultiplier;
    const baseDaysMin = Math.round(typeCfg.minDays * scaleCfg.daysMultiplier);
    const baseDaysMax = Math.round(typeCfg.maxDays * scaleCfg.daysMultiplier);

    const modulesMin = selectedModules.reduce(
      (sum, mId) => sum + (MODULES[mId]?.minAdd ?? 0),
      0
    );
    const modulesMax = selectedModules.reduce(
      (sum, mId) => sum + (MODULES[mId]?.maxAdd ?? 0),
      0
    );
    const modulesDays = selectedModules.reduce(
      (sum, mId) => sum + (MODULES[mId]?.daysAdd ?? 0),
      0
    );

    const roundedMin = Math.round((baseMin + modulesMin) / 100) * 100;
    const roundedMax = Math.round((baseMax + modulesMax) / 100) * 100;
    const daysMin = baseDaysMin + Math.floor(modulesDays * 0.7);
    const daysMax = baseDaysMax + modulesDays;

    return {
      minPrice: roundedMin,
      maxPrice: roundedMax,
      daysMin,
      daysMax,
      acceleration: typeCfg.acceleration,
    };
  }, [selectedType, selectedScale, selectedModules]);

  /* ── Contact Pre-filled URL Generator ── */
  const contactParams = new URLSearchParams({
    source: "estimation",
    mode: activeMode,
    type: selectedType,
    scale: selectedScale,
    modules: selectedModules.join(","),
    range: `${calculatedEstimate.minPrice}-${calculatedEstimate.maxPrice}`,
    days: `${calculatedEstimate.daysMin}-${calculatedEstimate.daysMax}`,
  });
  const scopingContactUrl = `/contact?${contactParams.toString()}`;

  /* ── Squad Builder Math (Régie Mode) ── */
  type RegieRole = {
    id: string;
    tag: string;
    title: string;
    experience: string;
    skills: string;
    desc: string;
    dailyRateNumber: number;
  };
  const regieRoles = (tRegie.raw("roles") as RegieRole[]) ?? [];

  const selectedRoleData = regieRoles.find((r) => r.id === calcRole) ?? regieRoles[0];
  const activeDailyRate = selectedRoleData?.dailyRateNumber ?? 650;
  const singleMonthlyMin = Math.round(calcDays * activeDailyRate * 0.95);
  const singleMonthlyMax = Math.round(calcDays * activeDailyRate * 1.08);

  const totalSquadDays = Object.entries(squadDays).reduce((sum, [, days]) => sum + days, 0);
  const totalSquadBase = Object.entries(squadDays).reduce((sum, [roleId, days]) => {
    const roleObj = regieRoles.find((r) => r.id === roleId);
    const rate = roleObj?.dailyRateNumber ?? 650;
    return sum + days * rate;
  }, 0);
  const squadMonthlyMin = Math.round(totalSquadBase * 0.95);
  const squadMonthlyMax = Math.round(totalSquadBase * 1.05);

  const squadEquivalentDevs = Math.max(1, (totalSquadDays / 20) * 2.8).toFixed(1);

  const handleUpdateSquadDay = (roleId: string, delta: number) => {
    setSquadDays((prev) => {
      const current = prev[roleId] ?? 0;
      const next = Math.max(0, Math.min(20, current + delta));
      return { ...prev, [roleId]: next };
    });
  };

  const squadUrlSummary = Object.entries(squadDays)
    .filter(([, days]) => days > 0)
    .map(([roleId, days]) => `${roleId}:${days}j`)
    .join(",");

  const regieContactUrl = `/contact?mode=regie&source=squad_simulator&squad=${encodeURIComponent(
    squadUrlSummary || "custom"
  )}`;

  /* ── Content items from translation ── */
  type TypologyItem = { id: string; name: string; tag: string; desc: string };
  const typologyItems = (t.raw("projects.step1.types") as TypologyItem[]) ?? [];

  type ScaleItem = { id: string; name: string; tag: string; desc: string };
  const scaleItems = (t.raw("projects.step2.scales") as ScaleItem[]) ?? [];

  type ModuleItem = { id: string; name: string; desc: string };
  const moduleItems = (t.raw("projects.step3.modules") as ModuleItem[]) ?? [];

  type GuaranteeItem = string;
  const guaranteesList = (t.raw("projects.summary.guarantees") as GuaranteeItem[]) ?? [];

  type WhyRangeCard = { title: string; desc: string };
  const whyRangeCards = (t.raw("whyRanges.cards") as WhyRangeCard[]) ?? [];

  type FaqItem = { q: string; a: string };
  const faqList = (t.raw("faq.items") as FaqItem[]) ?? [];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        {/* Subtle high-tech grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-12">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] glow-radial-purple opacity-20 pointer-events-none -z-10" />
          
          <Badge icon={<Calculator className="w-3.5 h-3.5" />}>
            {t("badge")}
          </Badge>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white">
            {t("headline")} <br />
            <span className="shimmer-text">{t("headlineHighlight")}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {t("subheadline")}
          </p>
        </section>

        {/* ── 2. Mode Switcher (Projet Clé en main vs Renfort Régie) ────────── */}
        <section className="max-w-lg mx-auto px-4 mb-14">
          <div className="p-1.5 rounded-2xl bg-[#0c0b16]/90 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveMode("projects")}
              className={`group flex-1 py-2.5 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap select-none ${
                activeMode === "projects"
                  ? "bg-brand-purple text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] border border-purple-400/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <Rocket
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  activeMode === "projects"
                    ? "text-white"
                    : "text-slate-400 group-hover:scale-110 group-hover:text-purple-300"
                }`}
              />
              <span className="whitespace-nowrap">{t("modeSwitcher.projects")}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("regie")}
              className={`group flex-1 py-2.5 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap select-none ${
                activeMode === "regie"
                  ? "bg-brand-purple text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] border border-purple-400/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <Users
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  activeMode === "regie"
                    ? "text-white"
                    : "text-slate-400 group-hover:scale-110 group-hover:text-purple-300"
                }`}
              />
              <span className="whitespace-nowrap">{t("modeSwitcher.regie")}</span>
            </button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            MODE A : PROJET CLÉ EN MAIN & MVP (SIMULATEUR MULTI-ÉTAPES GUIDÉ)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeMode === "projects" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Main Interactive Grid : Steps on Left (2 cols), Live HUD on Right (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: The 3 Selection Steps (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-10">
                
                {/* ── STEP 1 : Typology ── */}
                <div className="space-y-4 p-5 sm:p-6 rounded-2xl bg-[#0d0d12]/90 border border-white/8 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-mono font-bold flex items-center justify-center">
                        1
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {t("projects.step1.title")}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {t("projects.step1.badge")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-normal">
                    {t("projects.step1.subtitle")}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {typologyItems.map((item) => {
                      const isSelected = selectedType === item.id;
                      const icon = TYPOLOGIES[item.id]?.icon ?? <Code2 className="w-4 h-4 text-brand-purple" />;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedType(item.id)}
                          className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                            isSelected
                              ? "bg-purple-950/25 border-brand-purple shadow-[0_0_25px_rgba(124,58,237,0.2)]"
                              : "bg-[#09090d] border-white/5 hover:border-white/20 hover:bg-[#0e0e14]"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="p-2 rounded-lg bg-slate-900 border border-white/10">
                                {icon}
                              </div>
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300 whitespace-nowrap">
                                {item.tag}
                              </span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold">
                            <span className={isSelected ? "text-brand-purple" : "text-slate-500"}>
                              {isSelected ? "● Sélectionné" : "○ Choisir ce socle"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── STEP 2 : Scale / Scope ── */}
                <div className="space-y-4 p-5 sm:p-6 rounded-2xl bg-[#0d0d12]/90 border border-white/8 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-mono font-bold flex items-center justify-center">
                        2
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {t("projects.step2.title")}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {t("projects.step2.badge")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-normal">
                    {t("projects.step2.subtitle")}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {scaleItems.map((scale) => {
                      const isSelected = selectedScale === scale.id;
                      return (
                        <button
                          key={scale.id}
                          type="button"
                          onClick={() => setSelectedScale(scale.id)}
                          className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2.5 ${
                            isSelected
                              ? "bg-purple-950/25 border-brand-purple shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                              : "bg-[#09090d] border-white/5 hover:border-white/20 hover:bg-[#0e0e14]"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-emerald-400 font-semibold block whitespace-nowrap">
                              {scale.tag}
                            </span>
                            <h4 className="text-xs font-bold text-white leading-tight">
                              {scale.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                              {scale.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/5 text-[10px] font-mono font-semibold">
                            <span className={isSelected ? "text-brand-purple" : "text-slate-500"}>
                              {isSelected ? "● Sélectionné" : "○ Sélectionner"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── STEP 3 : Modules & Technical Requirements ── */}
                <div className="space-y-4 p-5 sm:p-6 rounded-2xl bg-[#0d0d12]/90 border border-white/8 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-mono font-bold flex items-center justify-center">
                        3
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {t("projects.step3.title")}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {t("projects.step3.badge")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-normal">
                    {t("projects.step3.subtitle")}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {moduleItems.map((mod) => {
                      const isChecked = selectedModules.includes(mod.id);
                      const modCfg = MODULES[mod.id];
                      return (
                        <div
                          key={mod.id}
                          onClick={() => handleToggleModule(mod.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                            isChecked
                              ? "bg-purple-950/20 border-brand-purple/60 shadow-sm"
                              : "bg-[#09090d] border-white/5 hover:border-white/15"
                          }`}
                        >
                          <div className="pt-0.5 shrink-0">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                isChecked
                                  ? "bg-brand-purple border-brand-purple text-white"
                                  : "border-slate-700 bg-slate-900"
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {modCfg?.icon}
                              <h4 className="text-xs font-bold text-white">
                                {mod.name}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                              {mod.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Dynamic Live HUD & Scoping Summary (5 cols on lg, sticky) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
                <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#0f0e1c] via-[#0d0d14] to-[#07070b] border border-brand-purple/40 shadow-[0_0_50px_rgba(124,58,237,0.18)] space-y-6 backdrop-blur-xl">
                  
                  {/* Header */}
                  <div className="border-b border-white/10 pb-4 space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-[10px] font-mono font-bold whitespace-nowrap">
                      <Sparkles className="w-3 h-3" />
                      <span>{t("projects.summary.badge")}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {t("projects.summary.title")}
                    </h3>
                  </div>

                  {/* Primary Metrics */}
                  <div className="space-y-4">
                    
                    {/* Budget Range Box */}
                    <div className="p-4 rounded-xl bg-[#050508] border border-white/8 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                        {t("projects.summary.budgetRangeTitle")}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                          {calculatedEstimate.minPrice.toLocaleString()} € – {calculatedEstimate.maxPrice.toLocaleString()} €
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">
                        {t("projects.summary.budgetSubtitle")}
                      </p>
                    </div>

                    {/* Timeline & Velocity Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#050508] border border-white/8 space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
                          {t("projects.summary.deliveryTitle")}
                        </span>
                        <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-400 block">
                          {calculatedEstimate.daysMin} à {calculatedEstimate.daysMax} j. ouvrés
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          {t("projects.summary.deliverySubtitle")}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#050508] border border-white/8 space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
                          {t("projects.summary.velocityTitle")}
                        </span>
                        <span className="text-base sm:text-lg font-extrabold font-mono text-purple-300 block">
                          Vélocité {calculatedEstimate.acceleration}
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          {t("projects.summary.velocitySubtitle")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Included Standards Checkmarks */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                      {t("projects.summary.guaranteesTitle")}
                    </span>
                    <div className="space-y-1.5">
                      {guaranteesList.map((g, gIdx) => (
                        <div key={gIdx} className="flex items-start gap-2 text-[11px] text-slate-300 font-normal">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2.5 pt-2">
                    <Link
                      href={scopingContactUrl as never}
                      className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-purple-500/25 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t("projects.summary.ctaScoping")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                      {t("projects.summary.ctaScopingSubtitle")}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* ── Section : Pourquoi des Fourchettes Réalistes ? ── */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0a0a0f] border border-white/8 space-y-6">
              <div className="text-center space-y-1.5 max-w-xl mx-auto">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-purple font-bold block">
                  {t("whyRanges.badge")}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t("whyRanges.title")}
                </h3>
                <p className="text-xs text-slate-400">
                  {t("whyRanges.subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {whyRangeCards.map((card, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-5 rounded-xl bg-[#060609] border border-white/5 space-y-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-mono font-bold text-xs flex items-center justify-center mb-2">
                      0{cIdx + 1}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{card.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            MODE B : RENFORT D'ÉQUIPE & RÉGIE AUGMENTÉE (SIMULATEUR SQUAD)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeMode === "regie" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Squad Builder Card */}
            <div className="p-5 sm:p-7 rounded-2xl border border-brand-purple/40 bg-[#0d0d11] shadow-[0_0_50px_rgba(124,58,237,0.12)] space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-[10px] font-mono font-bold mb-1.5 whitespace-nowrap">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>Simulateur & Team Builder</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Configurez votre dispositif de renfort
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                    Estimez votre enveloppe budgétaire mensuelle et comparez le débit de production équivalent sans TJM rigide.
                  </p>
                </div>

                {/* Sub-mode selector */}
                <div className="flex items-center bg-[#050508] p-1 rounded-xl border border-white/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSimMode("squad")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      simMode === "squad"
                        ? "bg-brand-purple text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Squad Sur-Mesure
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMode("single")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      simMode === "single"
                        ? "bg-brand-purple text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Profil Unique
                  </button>
                </div>
              </div>

              {/* Multi-role Squad Builder */}
              {simMode === "squad" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {regieRoles.map((role) => {
                      const days = squadDays[role.id] ?? 0;
                      return (
                        <div
                          key={role.id}
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            days > 0
                              ? "bg-purple-950/20 border-brand-purple/50 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                              : "bg-[#08080c] border-white/5 opacity-70"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-purple-300 whitespace-nowrap">
                                {role.tag}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-white mt-1">
                                {role.title.replace(" Augmenté", "").replace(" d'Impact", "")}
                              </h4>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                              {role.experience}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 leading-relaxed font-normal mb-3 line-clamp-2">
                            {role.desc}
                          </p>

                          {/* Stepper */}
                          <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Jours / mois :</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateSquadDay(role.id, -2)}
                                disabled={days <= 0}
                                className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center font-mono font-bold text-xs text-white">
                                {days}j
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateSquadDay(role.id, 2)}
                                disabled={days >= 20}
                                className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Bar */}
                  <div className="p-5 rounded-xl bg-gradient-to-r from-[#0b0a1a] via-[#110e26] to-[#0b0a1a] border border-brand-purple/40 flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Volume total</span>
                        <span className="text-xl font-bold font-mono text-white">{totalSquadDays} jours / mois</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Débit équivalent</span>
                        <span className="text-xl font-bold font-mono text-purple-300">~{squadEquivalentDevs} devs plein temps</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Enveloppe mensuelle estimée</span>
                        <span className="text-xl font-bold font-mono text-emerald-400">
                          {totalSquadDays > 0 ? `${squadMonthlyMin.toLocaleString()} € – ${squadMonthlyMax.toLocaleString()} €` : "0 €"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={regieContactUrl as never}
                      className="w-full md:w-auto py-2.5 px-5 rounded-lg text-xs font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
                    >
                      <span>Planifier le cadrage de cette squad</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Single Role Simulator */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-slate-300 block mb-2">Sélectionnez le profil :</span>
                        <div className="flex flex-wrap gap-2">
                          {regieRoles.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setCalcRole(r.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                calcRole === r.id
                                  ? "bg-brand-purple text-white border border-purple-400/40 shadow-sm"
                                  : "bg-slate-900/60 text-slate-400 border border-white/5 hover:text-white"
                              }`}
                            >
                              {r.title.replace(" Augmenté", "").replace(" d'Impact", "")}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-300">Cadence mensuelle :</span>
                          <span className="text-xs font-mono font-bold text-brand-purple bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded whitespace-nowrap">
                            {calcDays} jours / mois
                          </span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={20}
                          step={5}
                          value={calcDays}
                          onChange={(e) => setCalcDays(Number(e.target.value))}
                          className="w-full accent-brand-purple cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#050508] border border-white/8 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Enveloppe indicative mensuelle
                        </span>
                        <span className="text-2xl font-bold font-mono text-emerald-400">
                          {singleMonthlyMin.toLocaleString()} € – {singleMonthlyMax.toLocaleString()} €
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-normal">
                        Profil senior immédiatement opérationnel sous 48h, outillage agentique inclus, cession Git 100% et période d&apos;essai 5 jours sans risque.
                      </p>
                      <Link
                        href={`/contact?mode=regie&role=${calcRole}&days=${calcDays}` as never}
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-brand-purple hover:bg-brand-purple-hover text-white flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Cadrer cette intervention</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Standards & Screening reminders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#09090d] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="whitespace-nowrap">Top 3% des Talents</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                  Ingénieurs seniors certifiés, rigoureusement audités par des épreuves de live coding.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#09090d] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Lock className="w-4 h-4 text-brand-purple" />
                  <span className="whitespace-nowrap">Zero Data Retention</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                  Clés d&apos;entreprise isolées : aucun code ni donnée n&apos;est utilisé pour entraîner des modèles.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#09090d] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="whitespace-nowrap">Essai 5 jours sans risque</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                  Interrompez sans pénalité si la cadence ne convient pas sur les 5 premiers jours.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ── 3. F.A.Q. Accordion ─────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-8">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-purple font-bold block">
              F.A.Q. Cadrage
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {t("faq.title")}
            </h3>
            <p className="text-xs text-slate-400">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="space-y-3">
            {faqList.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border overflow-hidden ${
                    isOpen ? "bg-[#0d0d14] border-brand-purple/40" : "bg-[#0a0a0e] border-white/5"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {item.q}
                    </span>
                    <div className="p-1 rounded bg-white/5 text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-[11px] sm:text-xs text-slate-400 leading-relaxed border-t border-white/5 font-normal">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. Final Banner ─────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="p-6 sm:p-8 rounded-2xl border border-brand-purple/40 bg-gradient-to-r from-[#0b0a1a] via-[#120f26] to-[#0b0a1a] shadow-[0_0_50px_rgba(124,58,237,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold mb-1 whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3" />
                <span>Devis fixe sous 24h</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                Prêt à valider votre cadrage technique ?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl font-normal">
                15 minutes d&apos;échange avec un lead architecte : analyse de faisabilité, choix de stack et devis ferme sous 24h.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href={"/contact?source=estimation_banner" as never}
                className="w-full sm:w-auto py-2.5 px-5 rounded-lg text-xs font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-purple-500/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Planifier mon échange 15 min</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
