import React from "react";
import { Link } from "@/lib/i18n/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Users, ArrowRight, Zap, CheckCircle2, ShieldCheck, Clock,
  Cpu, Code2, Lock, TerminalSquare, Sparkles, Scale, Layers
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.regie" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RegieServicePage() {
  const t = useTranslations("servicesData.subpages.regie");
  const tRegie = useTranslations("tarifs.regie");
  const deliverables = t.raw("deliverables") as string[];


  const screeningPillars = tRegie.raw("screening.pillars") as {
    step: string;
    title: string;
    desc: string;
  }[];

  const securityItems = tRegie.raw("securityGuarantee.items") as {
    title: string;
    desc: string;
  }[];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* ── 1. Hero Section ── */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 mb-14">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] glow-radial-purple opacity-20 pointer-events-none -z-10" />

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-semibold tracking-wide">
            <Users className="w-3.5 h-3.5" />
            <span>{t("badge")}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto text-white">
            {t("title")} <br />
            <span className="shimmer-text">{t("titleHighlight")}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {t("subtitle")}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              "Top 3% des Talents",
              "Opérationnel sous 48h",
              "Zero Data Retention (ZDR)",
              "Essai 5 jours sans risque",
              "100% Propriété Git immédiate"
            ].map((pill, pIdx) => (
              <span
                key={pIdx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{pill}</span>
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-3">
            <Link
              href={"/estimation?mode=regie" as never}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-xs font-semibold text-white rounded-lg transition-all duration-200 space-x-2 border border-brand-purple/20 shadow-lg shadow-purple-500/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] cursor-pointer"
            >
              <span>{t("cta")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={"/contact?mode=regie" as never}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-[#0d0d11] hover:bg-[#15151c] text-xs font-semibold text-slate-200 hover:text-white rounded-lg transition-all duration-200 border border-white/10 hover:border-brand-purple/40 cursor-pointer"
            >
              <span>Réserver un échange technique 15 min</span>
            </Link>
          </div>
        </section>

        {/* ── 2. Pillars Section ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-[#0d0d11]/80 backdrop-blur-sm border border-white/8 space-y-3">
              <div className="p-2.5 w-fit rounded-xl bg-slate-900 border border-white/10 text-brand-purple">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">{t("pillars.0.title")}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                {t("pillars.0.desc")}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0d0d11]/80 backdrop-blur-sm border border-white/8 space-y-3">
              <div className="p-2.5 w-fit rounded-xl bg-slate-900 border border-white/10 text-brand-purple">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">{t("pillars.1.title")}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                {t("pillars.1.desc")}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0d0d11]/80 backdrop-blur-sm border border-white/8 space-y-3">
              <div className="p-2.5 w-fit rounded-xl bg-slate-900 border border-white/10 text-brand-purple">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">{t("pillars.2.title")}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                {t("pillars.2.desc")}
              </p>
            </div>
          </div>
        </section>


        {/* ── 3. The Top 3% Screening Filter ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-purple font-bold block">
              {tRegie("screening.badge")}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {tRegie("screening.title")}
            </h2>
            <p className="text-xs text-slate-400">
              {tRegie("screening.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {screeningPillars.map((p) => (
              <div
                key={p.step}
                className="p-5 rounded-xl bg-[#0d0d11]/70 border border-white/8 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="w-7 h-7 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-mono font-bold text-xs flex items-center justify-center mb-2.5">
                    {p.step}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5">{p.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Enterprise Security & Zero Data Retention Protocol ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0a14] border border-purple-500/30 shadow-[0_0_40px_rgba(124,58,237,0.1)] space-y-6">
            <div className="max-w-xl space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-[10px] font-mono font-bold">
                <Lock className="w-3 h-3" />
                <span>{tRegie("securityGuarantee.badge")}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {tRegie("securityGuarantee.title")}
              </h3>
              <p className="text-xs text-slate-400">
                {tRegie("securityGuarantee.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#050508] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Deliverables & Included Standards ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#0d0d11]/80 backdrop-blur-sm border border-white/8 rounded-2xl p-6 sm:p-8 shadow-2xl mb-16">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 border-b border-white/5 pb-3 tracking-tight">
            {t("deliverablesTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deliverables.map((item, i) => (
              <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Final Banner ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl border border-brand-purple/40 bg-gradient-to-r from-[#0b0a1a] via-[#120f26] to-[#0b0a1a] shadow-[0_0_50px_rgba(124,58,237,0.15)] flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold mb-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Démarrage garanti sous 48h</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                Prêt à accélérer la cadence de vos releases ?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Accédez à notre simulateur interactif pour composer votre squad, estimer votre enveloppe budgétaire et réserver votre période d&apos;essai de 5 jours sans risque.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href={"/estimation?mode=regie" as never}
                className="w-full sm:w-auto py-2.5 px-5 rounded-lg text-xs font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-purple-500/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Accéder au simulateur d&apos;investissement</span>
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
