import React from "react";
import Navbar from "@/components/layout/Navbar";
import ServicesGrid from "@/components/ServicesGrid";
import Footer from "@/components/layout/Footer";
import { ShieldAlert, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.services' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

interface ComparisonRow {
  feature: string;
  standard: string;
  lonside: string;
  impact: string;
}

export default function ServicesPage() {
  const t = useTranslations("servicesData");
  const tHeader = useTranslations("services");
  const comparisonRows = t.raw("comparison") as ComparisonRow[];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* Header Hero */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 mb-12">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-radial-purple opacity-20 pointer-events-none -z-10" />

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-bold tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            <span>{tHeader("badge")}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-normal max-w-4xl mx-auto">
            {tHeader("headline")} <br />
            <span className="shimmer-text">{tHeader("headlineHighlight")}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {tHeader("subheadline")}
          </p>
        </section>

        {/* Services Grid Component */}
        <ServicesGrid />

        {/* Comparison Section (Market Standard vs Lonside Standard) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 border-t border-white/5 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
              {t("title")}
            </h2>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-medium">
              {t("subtitle")}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0d0d11]/60 backdrop-blur-md shadow-2xl">
            <table className="min-w-full divide-y divide-white/5 text-left text-xs md:text-sm">
              <thead className="bg-[#0f0f13]/90">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold text-slate-300">{t("tableHeaderCriteria")}</th>
                  <th scope="col" className="px-6 py-4 font-bold text-slate-400">{t("tableHeaderStandard")}</th>
                  <th scope="col" className="px-6 py-4 font-bold text-brand-purple">{t("tableHeaderLonside")}</th>
                  <th scope="col" className="px-6 py-4 font-bold text-emerald-400 hidden md:table-cell">{t("tableHeaderImpact")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-900/10">
                {comparisonRows.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 font-bold text-slate-200">{item.feature}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-0.5 rounded-full bg-red-500/10 text-red-400 shrink-0">
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </div>
                        <span>{item.standard}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-200 font-medium">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-0.5 rounded-full bg-brand-purple/15 text-brand-purple shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-white font-bold">{item.lonside}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold hidden md:table-cell">
                      {item.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scoping CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/tarifs"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-purple hover:bg-brand-purple-hover text-sm font-bold text-white rounded-lg transition-all duration-300 hover:scale-[1.02] space-x-2 border border-brand-purple/10 shadow-lg shadow-purple-500/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
            >
              <span>{t("ctaText")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
