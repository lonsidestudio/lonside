import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FrustrationGrid from "@/components/FrustrationGrid";
import FAQ from "@/components/FAQ";
import { ArrowRight, Cpu, Sparkles, Database, HelpCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Home() {
  const t = useTranslations("home");

  const exploreCards = [
    {
      icon: <Sparkles className="w-5 h-5 text-brand-purple" />,
      titleKey: "explore.cards.services.title",
      descKey: "explore.cards.services.desc",
      ctaKey: "explore.cards.services.cta",
      href: "/services",
    },
    {
      icon: <Cpu className="w-5 h-5 text-brand-purple" />,
      titleKey: "explore.cards.methode.title",
      descKey: "explore.cards.methode.desc",
      ctaKey: "explore.cards.methode.cta",
      href: "/methode",
    },
    {
      icon: <Database className="w-5 h-5 text-brand-purple" />,
      titleKey: "explore.cards.portfolio.title",
      descKey: "explore.cards.portfolio.desc",
      ctaKey: "explore.cards.portfolio.cta",
      href: "/portfolio",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-brand-purple" />,
      titleKey: "explore.cards.faq.title",
      descKey: "explore.cards.faq.desc",
      ctaKey: "explore.cards.faq.cta",
      href: "#faq",
    },
  ] as const;

  return (
    <>
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-16 bg-[#050505] overflow-hidden">
          {/* Subtle mesh background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] glow-radial-purple opacity-20 pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-bold tracking-wide animate-float">
                <Cpu className="w-3.5 h-3.5 text-brand-purple" />
                <span>{t("badge")}</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
                {t("headline")} <br />
                <span className="shimmer-text">{t("headlineHighlight")}</span>
              </h1>

              {/* Sub-headline */}
              <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#8f94a6] font-normal leading-relaxed">
                {t("subheadline")}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto text-center px-8 py-3.5 bg-brand-purple hover:bg-brand-purple-hover text-sm font-bold text-white rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer border border-brand-purple/10 shadow-lg shadow-purple-500/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                >
                  <span>{t("ctaPrimary")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/portfolio"
                  className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#0d0d11] hover:bg-[#121216] border border-white/10 hover:border-brand-purple/30 text-sm font-bold text-slate-200 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>{t("ctaSecondary")}</span>
                </Link>
              </div>

              {/* Stats HUD */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-3xl mx-auto text-center">
                {[
                  { value: "x3.2", label: t("stats.velocity"), color: "from-brand-purple to-purple-400" },
                  { value: "100%", label: t("stats.ownership"), color: "from-emerald-400 to-teal-500" },
                  { value: ">92%", label: t("stats.tests"), color: "from-blue-400 to-indigo-500" },
                  { value: "0.0", label: t("stats.lockin"), color: "from-pink-400 to-rose-500" },
                ].map(({ value, label, color }) => (
                  <div key={label} className="p-5 rounded-2xl border border-white/5 bg-[#0d0d11]/40 backdrop-blur-md cursor-default">
                    <div className={`text-xl md:text-2xl font-extrabold font-mono bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1.5 leading-normal">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Explore Cards */}
        <section className="relative py-24 bg-[#050505] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
                {t("explore.title")}
              </h2>
              <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-medium">
                {t("explore.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {exploreCards.map(({ icon, titleKey, descKey, ctaKey, href }) => {
                const isAnchor = href.startsWith("#");
                const className = "group relative p-8 rounded-2xl bg-[#0d0d11]/60 border border-white/5 hover:border-brand-purple/30 hover:bg-[#0d0d11]/90 transition-all duration-500 backdrop-blur-sm flex flex-col justify-between";
                const content = (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                    <div>
                      <div className="p-3.5 w-fit rounded-xl bg-slate-900/80 border border-white/5 mb-6 group-hover:scale-110 group-hover:border-brand-purple/20 transition-all duration-300">
                        {icon}
                      </div>
                      <h3 className="text-base font-bold text-slate-100 mb-2 group-hover:text-brand-purple transition-colors duration-300">
                        {t(titleKey)}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-8">
                        {t(descKey)}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-xs font-bold text-brand-purple">
                      <span>{t(ctaKey)}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </>
                );

                if (isAnchor) {
                  return (
                    <a key={href} href={href} className={className}>
                      {content}
                    </a>
                  );
                }

                return (
                  <Link key={href} href={href as any} className={className}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Guarantees Matrix Section */}
        <FrustrationGrid />

        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Lonside",
            "url": "https://lonside.ai",
            "logo": "https://lonside.ai/logo.png",
            "image": "https://lonside.ai/og-image.png",
            "description": t("subheadline"),
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "FR"
            },
            "sameAs": [
              "https://twitter.com/lonside_ai"
            ]
          })
        }}
      />
    </>
  );
}
