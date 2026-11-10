import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StudioAtmosphere from "@/components/StudioAtmosphere";
import WhyUsSection from "@/components/home/WhyUsSection";
import WorkSection from "@/components/home/WorkSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import MethodSection from "@/components/home/MethodSection";
import PricingSection from "@/components/home/PricingSection";
import FaqSection from "@/components/home/FaqSection";
import ContactSection from "@/components/home/ContactSection";
import { getPortfolioProjects, getFaqItems, type Locale } from "@/lib/keystatic/reader";
import { siteConfig } from "@/lib/site-config";
import { ArrowUpRight } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "Lonside — Custom Web & Digital Product Studio"
    : "Lonside — Studio de Développement Web & Produits Digitaux";

  const description = isEn
    ? "Custom web application and platform engineering in as little as 14 days. Guaranteed fixed scope, zero surprises, and 100% source code ownership on your private GitHub."
    : "Conception et développement d'applications web et plateformes sur-mesure dès 14 jours. Forfait garanti sans mauvaise surprise, et 100% du code à vous sur votre propre GitHub.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}`,
      languages: {
        fr: `${siteConfig.siteUrl}/fr`,
        en: `${siteConfig.siteUrl}/en`,
        "x-default": `${siteConfig.siteUrl}/fr`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.siteUrl}/${locale}`,
      siteName: "Lonside Studio",
      locale: locale === "en" ? "en_US" : "fr_FR",
      type: "website",
      images: [
        {
          url: `${siteConfig.siteUrl}/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.siteUrl}/og?locale=${locale}`],
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fr";
  const isEn = currentLocale === "en";

  const [projects, faqItems] = await Promise.all([
    getPortfolioProjects(currentLocale),
    getFaqItems(currentLocale),
  ]);

  const sameAsProfiles = [
    siteConfig.githubUrl,
    siteConfig.linkedinUrl,
    siteConfig.twitterUrl,
  ].filter(Boolean);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.siteUrl}#organization`,
    name: "Lonside Studio",
    url: `${siteConfig.siteUrl}/${currentLocale}`,
    logo: `${siteConfig.siteUrl}/icon.png`,
    image: `${siteConfig.siteUrl}/og?locale=${currentLocale}`,
    email: siteConfig.contactEmail,
    sameAs: sameAsProfiles,
    description: isEn
      ? "High-velocity custom software & web application engineering studio. Fixed 14 & 30-day sprints, 100% intellectual property transfer on private GitHub."
      : "Studio d'ingénierie logicielle haute vélocité spécialisé dans les sprints fermes de 14 et 30 jours avec 100% de cession de code source sur votre compte GitHub.",
    priceRange: "6900€ - 13900€",
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    openingHours: "Mo-Fr 09:00-19:00",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isEn ? "Engineering Sprints & Subscriptions" : "Sprints d'Ingénierie & Accompagnement",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Sprint Launch",
          description: isEn
            ? "Complete web application production launch in 14 business days"
            : "Lancement d'application web clé-en-main en 14 jours ouvrés",
          price: "6900",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${siteConfig.siteUrl}/${currentLocale}#tarifs`,
        },
        {
          "@type": "Offer",
          name: "Sprint Scale",
          description: isEn
            ? "Multi-role platform and complex workflow engineering in 30 business days"
            : "Plateforme multi-rôles et flux métier avancés livrés en 30 jours ouvrés",
          price: "13900",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${siteConfig.siteUrl}/${currentLocale}#tarifs`,
        },
      ],
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const structuredData = [organizationJsonLd, faqJsonLd];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col bg-white text-black overflow-hidden">
        {/* ── HERO SECTION MONOCHROME HAUTE COUTURE (STYLE WHEELOFWORK) ── */}
        <section className="relative min-h-[85vh] flex items-center justify-center pt-28 sm:pt-36 lg:pt-44 pb-16 sm:pb-24 lg:pb-32 px-5 sm:px-8 lg:px-12 overflow-hidden">
          <StudioAtmosphere />

          <div className="max-w-5xl mx-auto w-full text-center relative z-10 flex flex-col items-center">
            {/* Titre Noble & Précis (Standards Linear / Work & Co) */}
            <h1 className="font-display uppercase text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] tracking-tight leading-[1.04] text-black font-normal max-w-4xl">
              {isEn ? (
                <>
                  Your digital product in production, <br />
                  <span className="text-zinc-500">in as little as 14 days.</span>
                </>
              ) : (
                <>
                  Votre produit digital en production, <br />
                  <span className="text-zinc-500">dès 14 jours.</span>
                </>
              )}
            </h1>

            {/* Accroche Humaine, Chaude et Précise */}
            <p className="mt-5 sm:mt-7 max-w-2xl text-base sm:text-lg text-zinc-600 font-normal leading-relaxed px-2">
              {isEn
                ? "We design and build reliable web applications and platforms for founders who value clarity and momentum."
                : "Nous concevons et développons des applications web et plateformes fiables pour les fondateurs et équipes qui veulent avancer vite."}
            </p>

            {/* Actions Claires & Directes Ergonomiques */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-7 sm:pt-9 w-full max-w-md">
              <a
                href="#contact"
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-black text-white font-mono text-xs uppercase tracking-[0.16em] hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center space-x-2.5 cursor-pointer min-h-[48px] whitespace-nowrap"
              >
                <span>{isEn ? "Discuss your project (15 min)" : "Échanger sur votre projet (15 min)"}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
              <a
                href="#projets"
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-transparent border border-black/[0.12] hover:border-black text-black font-mono text-xs uppercase tracking-[0.16em] hover:bg-zinc-50 transition-all duration-200 flex items-center justify-center cursor-pointer min-h-[48px] whitespace-nowrap"
              >
                <span>{isEn ? "Explore case studies" : "Découvrir nos réalisations"}</span>
              </a>
            </div>

            {/* Ruban de Métriques Haute Précision (Non-cliquable, zéro hover) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-12 sm:pt-16 max-w-4xl w-full text-center">
              {[
                { value: "Dès 14j", label: isEn ? "Guaranteed Sprint" : "Délai Garanti" },
                { value: "Forfait Fixe", label: isEn ? "Zero Budget Creep" : "Zéro Dépassement" },
                { value: "100% à Vous", label: isEn ? "Full Code Ownership" : "Cession Totale GitHub" },
                { value: "30 Jours", label: isEn ? "Warranty Included" : "Garantie Corrective" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="p-4 sm:p-5 rounded-xl border border-black/[0.08] bg-zinc-50/40 flex flex-col justify-center items-center select-none"
                >
                  <div className="font-display uppercase text-xl sm:text-2xl lg:text-3xl text-black tracking-tight font-medium whitespace-nowrap">
                    {value}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-zinc-500 mt-1 uppercase tracking-[0.15em] whitespace-nowrap">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION POURQUOI LONSIDE / ORIGINE (STYLE DESIGNJOY) ── */}
        <WhyUsSection locale={currentLocale} />

        {/* ── PROJETS ── */}
        <WorkSection projects={projects} locale={currentLocale} />

        {/* ── MANIFESTE ── */}
        <ManifestoSection locale={currentLocale} />

        {/* ── MÉTHODE ── */}
        <MethodSection locale={currentLocale} />

        {/* ── TARIFS ── */}
        <PricingSection locale={currentLocale} />

        {/* ── FAQ ── */}
        <FaqSection items={faqItems} locale={currentLocale} />

        {/* ── CONTACT ── */}
        <ContactSection locale={currentLocale} />
      </main>

      <Footer />
    </>
  );
}
