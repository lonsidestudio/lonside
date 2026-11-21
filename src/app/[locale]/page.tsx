import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "metadata" });

  const title = t("defaultTitle");
  const description = t("description");

  // In Next.js with next-intl localePrefix: 'as-needed':
  // French (defaultLocale) is served at /
  // English is served at /en
  const canonicalUrl = locale === "en" ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteConfig.siteUrl}/`,
        en: `${siteConfig.siteUrl}/en`,
        "x-default": `${siteConfig.siteUrl}/`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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

  const [tHero, tMeta, tPricing, projects, faqItems] = await Promise.all([
    getTranslations({ locale: currentLocale, namespace: "hero" }),
    getTranslations({ locale: currentLocale, namespace: "metadata" }),
    getTranslations({ locale: currentLocale, namespace: "pricing" }),
    getPortfolioProjects(currentLocale),
    getFaqItems(currentLocale),
  ]);

  const sameAsProfiles = [
    siteConfig.githubUrl,
    siteConfig.linkedinUrl,
    siteConfig.twitterUrl,
    siteConfig.youtubeUrl,
  ].filter(Boolean);

  const pricingTiers = tPricing.raw("tiers") as Array<{ name: string; tagline: string }>;
  const canonicalUrl = currentLocale === "en" ? `${siteConfig.siteUrl}/en` : `${siteConfig.siteUrl}/`;

  // Schema.org WebSite : Clé pour l'identification de l'entité et du nom de marque dans les SERP (Google Site Names)
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    url: `${siteConfig.siteUrl}/`,
    name: "Lonside",
    alternateName: ["Lonside Studio", "lonside"],
    description: tMeta("description"),
    inLanguage: ["fr-FR", "en-US"],
    publisher: {
      "@id": `${siteConfig.siteUrl}/#organization`,
    },
  };

  // Schema.org Organization & ProfessionalService : Identité de marque désambiguïsée
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: "Lonside",
    legalName: siteConfig.legal.tradeName,
    alternateName: ["Lonside Studio", "Lonside Corp.", "lonside"],
    identifier: {
      "@type": "PropertyValue",
      propertyID: "SIRET",
      value: siteConfig.legal.siretCompact,
    },
    founder: {
      "@type": "Person",
      name: siteConfig.legal.founderName,
      jobTitle: "Founder & Lead Architect",
      url: `${siteConfig.siteUrl}/a-propos`,
    },
    url: `${siteConfig.siteUrl}/`,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.siteUrl}/icon-192.png`,
      width: 192,
      height: 192,
    },
    image: `${siteConfig.siteUrl}/og?locale=${currentLocale}`,
    email: siteConfig.contactEmail,
    sameAs: sameAsProfiles,
    description: tMeta("description"),
    priceRange: "6900€ - 13900€",
    areaServed: ["FR", "EU", "US"],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.legal.streetAddress,
      postalCode: siteConfig.legal.postalCode,
      addressLocality: siteConfig.legal.addressLocality,
      addressRegion: siteConfig.legal.addressRegion,
      addressCountry: siteConfig.legal.addressCountry,
    },
    knowsAbout: [
      "Software Engineering",
      "Web Application Development",
      "Next.js Architecture",
      "SaaS MVP Sprints",
      "Full-Stack TypeScript",
      "Cloud & Data Platforms",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contactEmail,
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: tPricing("label"),
      itemListElement: [
        {
          "@type": "Offer",
          name: pricingTiers[0]?.name || "Sprint Launch",
          description: pricingTiers[0]?.tagline || "",
          price: "6900",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${canonicalUrl}#tarifs`,
        },
        {
          "@type": "Offer",
          name: pricingTiers[1]?.name || "Sprint Scale",
          description: pricingTiers[1]?.tagline || "",
          price: "13900",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${canonicalUrl}#tarifs`,
        },
      ],
    },
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: tMeta("defaultTitle"),
    description: tMeta("description"),
    isPartOf: {
      "@id": `${siteConfig.siteUrl}/#website`,
    },
    about: {
      "@id": `${siteConfig.siteUrl}/#organization`,
    },
    inLanguage: currentLocale === "en" ? "en-US" : "fr-FR",
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

  const structuredData = [websiteJsonLd, organizationJsonLd, webPageJsonLd, faqJsonLd];

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
              {tHero("titleLine")} <br />
              <span className="text-zinc-500">{tHero("titleHighlight")}</span>
            </h1>

            {/* Accroche Humaine, Chaude et Précise */}
            <p className="mt-5 sm:mt-7 max-w-2xl text-base sm:text-lg text-zinc-600 font-normal leading-relaxed px-2">
              {tHero("subtitle")}
            </p>

            {/* Actions Claires & Directes Ergonomiques */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-7 sm:pt-9 w-full max-w-md">
              <a
                href="#contact"
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-black text-white font-mono text-xs uppercase tracking-[0.16em] hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center space-x-2.5 cursor-pointer min-h-[48px] whitespace-nowrap"
              >
                <span>{tHero("ctaDiscuss")}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
              <a
                href="#projets"
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-transparent border border-black/[0.12] hover:border-black text-black font-mono text-xs uppercase tracking-[0.16em] hover:bg-zinc-50 transition-all duration-200 flex items-center justify-center cursor-pointer min-h-[48px] whitespace-nowrap"
              >
                <span>{tHero("ctaExplore")}</span>
              </a>
            </div>

            {/* Ruban de Métriques Haute Précision (Non-cliquable, zéro hover) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-12 sm:pt-16 max-w-4xl w-full text-center">
              {[
                { value: tHero("metrics.sprintDelay"), label: tHero("metrics.sprintDelayLabel") },
                { value: tHero("metrics.fixedPrice"), label: tHero("metrics.fixedPriceLabel") },
                { value: tHero("metrics.codeOwnership"), label: tHero("metrics.codeOwnershipLabel") },
                { value: tHero("metrics.warranty"), label: tHero("metrics.warrantyLabel") },
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
