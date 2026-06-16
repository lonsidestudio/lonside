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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight max-w-4xl mx-auto">
            {tHero("headline")} <br />
            <span className="shimmer-text">{tHero("headlineHighlight")}</span>
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {tHero("subheadline")}
          </p>
        </section>

        {/* Interactive Stepper */}
        <AgentTerminal />

        {/* Detailed Static Copy Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="text-center mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
              {t("title")}
            </h2>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-medium">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stepsDetails.map((step, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#0d0d11]/60 border border-white/5 space-y-6 flex flex-col justify-between backdrop-blur-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple font-mono bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-0.5 rounded-full">
                      {step.phase}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 shrink-0">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mt-5 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{step.desc}</p>

                  <ul className="space-y-3">
                    {step.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-300 gap-1.5">
                        <div className="p-0.5 rounded-full bg-brand-purple/15 text-brand-purple shrink-0 mt-0.5">
                          <span className="text-[10px] font-extrabold flex items-center justify-center w-3.5 h-3.5">✓</span>
                        </div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer banner */}
          <div className="mt-20 p-8 rounded-2xl bg-[#0d0d11]/60 border border-white/5 text-center max-w-4xl mx-auto space-y-6 backdrop-blur-sm shadow-2xl">
            <h3 className="text-base sm:text-lg font-bold text-white">{t("ctaTitle")}</h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              {t("ctaSubtitle")}
            </p>
            <div>
              <Link
                href="/tarifs"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-purple hover:bg-brand-purple-hover text-xs font-bold text-white rounded-lg transition-all duration-300 hover:scale-[1.02] space-x-2 border border-brand-purple/10 shadow-lg shadow-purple-500/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
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
