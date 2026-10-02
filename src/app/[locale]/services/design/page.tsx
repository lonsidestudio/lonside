import React from "react";
import { Link } from "@/lib/i18n/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles, Palette, CheckCircle2, Eye, Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.design' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function DesignPage() {
  const t = useTranslations("servicesData.subpages.design");
  const deliverables = t.raw("deliverables") as string[];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 mb-20">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-radial-purple opacity-20 pointer-events-none -z-10" />

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("badge")}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-normal max-w-4xl mx-auto">
            {t("title")} <br />
            <span className="shimmer-text">{t("titleHighlight")}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {t("subtitle")}
          </p>

          <div className="pt-3">
            <Link
              href="/estimation"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-xs font-semibold text-white rounded-lg transition-all duration-200 space-x-2 border border-brand-purple/10 shadow-md shadow-purple-500/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
            >
              <span>{t("cta")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#0d0d11]/60 backdrop-blur-sm border border-white/5 space-y-4">
              <div className="p-3 w-fit rounded-xl bg-slate-900 border border-white/5 ">
                <Palette className="w-5 h-5 text-brand-purple" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 ">{t("pillars.0.title")}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t("pillars.0.desc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0d11]/60 backdrop-blur-sm border border-white/5 space-y-4">
              <div className="p-3 w-fit rounded-xl bg-slate-900 border border-white/5 ">
                <Compass className="w-5 h-5 text-brand-purple" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 ">{t("pillars.1.title")}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t("pillars.1.desc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0d11]/60 backdrop-blur-sm border border-white/5 space-y-4">
              <div className="p-3 w-fit rounded-xl bg-slate-900 border border-white/5 ">
                <Eye className="w-5 h-5 text-brand-purple" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 ">{t("pillars.2.title")}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t("pillars.2.desc")}
              </p>
            </div>
          </div>
        </section>

        {/* Deliverables Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#0d0d11]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl ">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">
            {t("deliverablesTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deliverables.map((item, i) => (
              <div key={i} className="flex items-start space-x-3 text-xs md:text-sm text-slate-300">
                <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
