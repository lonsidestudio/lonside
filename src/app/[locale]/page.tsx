import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroAmbientCanvas from "@/components/HeroAmbientCanvas";
import TickerMarquee from "@/components/TickerMarquee";
import WorkSection from "@/components/home/WorkSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import MethodSection from "@/components/home/MethodSection";
import PricingSection from "@/components/home/PricingSection";
import FaqSection from "@/components/home/FaqSection";
import ContactSection from "@/components/home/ContactSection";
import { getPortfolioProjects, getFaqItems, type Locale } from "@/lib/keystatic/reader";
import { ArrowRight, Terminal } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "Lonside — High-Velocity Digital Engineering Studio | 14-Day Sprints"
    : "Lonside — Studio d'Ingénierie Digitale Haute Vélocité | Sprints 14 Jours";

  const description = isEn
    ? "High-Velocity Digital Engineering Studio. Fixed-price 14 & 30-day sprints, 100% intellectual property transfer on your private GitHub, zero technical debt. Next.js 16, TypeScript, Supabase, Python."
    : "Studio d'Ingénierie Digitale Haute Vélocité. Sprints fermes de 14 et 30 jours, cession de propriété intellectuelle 100% sur votre GitHub privé, zéro dette technique. Next.js 16, TypeScript, Supabase, Python.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://lonside.ai/${locale}`,
      languages: {
        fr: "https://lonside.ai/fr",
        en: "https://lonside.ai/en",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://lonside.ai/${locale}`,
      siteName: "Lonside Studio",
      locale: locale === "en" ? "en_US" : "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fr";
  const isEn = currentLocale === "en";

  // Récupération concurrente des données fraîches via Keystatic Reader
  const [projects, faqItems] = await Promise.all([
    getPortfolioProjects(currentLocale),
    getFaqItems(currentLocale),
  ]);

  // Schéma structuré JSON-LD Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Lonside Studio",
    url: "https://lonside.ai",
    logo: "https://lonside.ai/icon.png",
    description:
      "Studio d'ingénierie logicielle haute vélocité spécialisé dans les sprints fermes de 14 et 30 jours avec 100% de cession de propriété intellectuelle.",
    priceRange: "6900€ - 13900€",
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    openingHours: "Mo-Fr 09:00-19:00",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col bg-[#000000] text-[#ffffff] overflow-hidden">
        {/* ── BLOC 1 : HERO SECTION MONOCHROME ── */}
        <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Toile cinétique d'ambiance 60fps */}
          <HeroAmbientCanvas />

          <div className="max-w-5xl mx-auto w-full text-center relative z-10 space-y-8">
            {/* Pilule de Statut Studio */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>
                {isEn ? "Studio Active • 14 & 30-Day Engineering Sprints" : "Studio Actif • Sprints d'Ingénierie 14 & 30 Jours"}
              </span>
            </div>

            {/* Titre Maître Condensé & Sculpté */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[0.95]">
              {isEn ? (
                <>
                  ELITE SOFTWARE. <br />
                  <span className="shimmer-platinum">SHIPPED IN 14 DAYS.</span> <br />
                  100% CODE OWNERSHIP.
                </>
              ) : (
                <>
                  VOS LOGICIELS D'ÉLITE. <br />
                  <span className="shimmer-platinum">LIVRÉS EN 14 JOURS.</span> <br />
                  CODE 100% CÉDÉ.
                </>
              )}
            </h1>

            {/* Accroche Percutante */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#a1a1aa] leading-relaxed font-normal">
              {isEn
                ? "We replace slow, daily-billed agencies with fixed-scope, high-velocity engineering sprints. Zero technical debt, zero vendor lock-in, battle-tested modern architecture."
                : "Nous remplaçons les agences lentes à facturation horaire par des sprints d'ingénierie fermes et prévisibles. Zéro dette technique, zéro abonnement captif, architecture industrielle irréprochable."}
            </p>

            {/* CTAs Stratégiques */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <a
                href="#contact"
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#eaeaea] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <span>{isEn ? "Book 15-Min Scoping Call" : "Réserver un Cadrage Technique (15 min)"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#projets"
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{isEn ? "Explore Case Studies" : "Consulter les Dossiers Techniques"}</span>
              </a>
            </div>

            {/* HUD des Métriques Clés */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto text-center">
              {[
                { value: "x3.2", label: isEn ? "Delivery Velocity" : "Vélocité de Livraison", note: isEn ? "vs agency average" : "vs agences classiques" },
                { value: "100%", label: isEn ? "IP Ownership" : "Propriété Intellectuelle", note: isEn ? "exclusive Git transfer" : "dès le premier commit" },
                { value: ">85%", label: isEn ? "Automated Tests" : "Couverture de Tests", note: isEn ? "unit & integration" : "garantie anti-régression" },
                { value: "0 €", label: isEn ? "Agency Lock-in" : "Frais Cachés / Rente", note: isEn ? "zero ongoing monthly tax" : "zéro abonnement captif" },
              ].map(({ value, label, note }) => (
                <div
                  key={label}
                  className="p-5 rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md"
                >
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white">{value}</div>
                  <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">{label}</div>
                  <div className="text-[10px] font-mono text-[#71717a] mt-0.5">{note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BANDEAU DÉFILANT INFINI ── */}
        <TickerMarquee />

        {/* ── BLOC 2 : DOSSIERS TECHNIQUES (#projets) ── */}
        <WorkSection projects={projects} locale={currentLocale} />

        {/* ── BLOC 3 : LE MANIFESTE ANTI-AGENCE (#manifeste) ── */}
        <ManifestoSection locale={currentLocale} />

        {/* ── BLOC 4 : LA MÉTHODE SPRINT 14J (#methode) ── */}
        <MethodSection locale={currentLocale} />

        {/* ── BLOC 5 : FORMULES D'INVESTISSEMENT (#tarifs) ── */}
        <PricingSection locale={currentLocale} />

        {/* ── BLOC 6 : F.A.Q. TRANCHÉE (#faq) ── */}
        <FaqSection items={faqItems} locale={currentLocale} />

        {/* ── BLOC 7 : TERMINAL DE CONTACT & CADRAGE (#contact) ── */}
        <ContactSection locale={currentLocale} />
      </main>

      <Footer />
    </>
  );
}
