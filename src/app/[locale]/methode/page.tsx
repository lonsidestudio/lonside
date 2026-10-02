import Navbar from "@/components/layout/Navbar";
import AgentTerminal from "@/components/AgentTerminal";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Cpu, Sparkles, Database, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.methode' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

const ICONS = [Cpu, Sparkles, Database, ShieldCheck];

export default function MethodePage() {
  const tHero = useTranslations("methode");
  const t = useTranslations("methodeData");
  const stepsRaw = t.raw("steps") as Array<{ phase: string; title: string; desc: string; bullets: string[] }>;

  const stepsDetails = stepsRaw.map((step, idx) => {
    const IconComponent = ICONS[idx] || Cpu;
    return {
      ...step,
      icon: <IconComponent className="w-5 h-5 text-brand-purple" />
    };
  });

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 mb-12">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-radial-purple opacity-20 pointer-events-none -z-10" />
          <Badge icon={<Sparkles className="w-3.5 h-3.5" />}>{tHero("badge")}</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight max-w-3xl mx-auto">
            {tHero("headline")}{" "}
            <span className="shimmer-text">{tHero("headlineHighlight")}</span>
          </h1>
          <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {tHero("subheadline")}
          </p>
        </section>

        {/* Interactive Stepper */}
        <AgentTerminal />

        {/* Detailed Static Copy Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="text-center mb-14">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
              {t("title")}
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-400 font-normal">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stepsDetails.map((step, idx) => (
              <div key={idx} className="p-7 rounded-2xl bg-[#0d0d11]/60 border border-white/5 space-y-5 flex flex-col backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple font-mono">
                      {step.phase}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-1.5">{step.title}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 shrink-0">
                    {step.icon}
                  </div>
                </div>

                {/* Desc */}
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>

                {/* Bullets */}
                <div className="pt-4 border-t border-white/5 space-y-2.5">
                  {step.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer banner */}
          <div className="mt-16 p-8 rounded-2xl bg-[#0d0d11]/60 border border-white/5 text-center max-w-3xl mx-auto space-y-4 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-bold text-white">{t("ctaTitle")}</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {t("ctaSubtitle")}
            </p>
            <div className="pt-1">
              <Link
                href="/estimation"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-xs font-semibold text-white rounded-lg transition-all duration-200 space-x-2 border border-brand-purple/10 shadow-md shadow-purple-500/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
              >
                <span>{t("ctaBtn")}</span>
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
