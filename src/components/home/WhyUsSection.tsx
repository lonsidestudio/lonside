import React from "react";

interface WhyUsSectionProps {
  locale?: string;
}

export default function WhyUsSection({ locale = "fr" }: WhyUsSectionProps) {
  const isEn = locale === "en";

  return (
    <section
      id="pourquoi"
      className="relative py-16 sm:py-24 lg:py-28 bg-[#fafafc] border-b border-black/[0.06] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* ── 1. CARTOUCHE D'ORIGINE & D'ARTISANAT (STYLE DESIGNJOY) ── */}
        <div className="rounded-2xl sm:rounded-3xl border border-black/[0.08] bg-white p-7 sm:p-10 lg:p-12 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)]">
          <p className="text-zinc-600 text-sm sm:text-base lg:text-lg leading-relaxed text-center font-normal max-w-3xl mx-auto">
            {isEn ? (
              <>
                <strong className="font-medium text-black">Lonside</strong> was founded with a singular conviction: to empower ambitious founders and teams to launch world-class digital products with extreme momentum. At Lonside, we don&apos;t hire account managers, sales middlemen, or outsource work. Instead, each platform is architected and engineered directly by a seasoned <strong className="font-medium text-black">Lead Architect</strong>, dedicated to delivering uncompromised quality to a <strong className="font-medium text-black">strictly limited roster of clients at a time</strong>.
              </>
            ) : (
              <>
                <strong className="font-medium text-black">Lonside</strong> a été créé avec une conviction simple : permettre aux fondateurs et aux équipes ambitieuses de déployer des produits digitaux de premier plan à la vitesse de la pensée. Chez Lonside, nous n&apos;employons aucun intermédiaire, aucun commercial et nous ne sous-traitons aucun travail. Chaque plateforme est conçue, architecturée et développée directement par un <strong className="font-medium text-black">Lead Architect chevronné</strong>, dédié à un <strong className="font-medium text-black">nombre strictement limité de clients à la fois</strong>.
              </>
            )}
          </p>
        </div>

        {/* ── 2. BLOC D'IMPACT ÉDITORIAL & SOUS-TITRE ── */}
        <div className="mt-14 sm:mt-20 lg:mt-24 text-center max-w-3xl mx-auto">
          {/* Label Monospace */}
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{isEn ? "WHY LONSIDE" : "NOTRE ENGAGEMENT"}</span>
          </div>

          {/* Grand Titre avec Touche Éditoriale Italique */}
          <h2 className="font-display uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-black leading-[1.08] font-normal">
            {isEn ? (
              <>
                It&apos;s{" "}
                <span className="font-serif lowercase italic text-zinc-800 tracking-normal font-normal">
                  &ldquo;you&apos;ll never go back&rdquo;
                </span>{" "}
                better
              </>
            ) : (
              <>
                Un modèle tellement plus direct que{" "}
                <span className="font-serif lowercase italic text-zinc-800 tracking-normal font-normal">
                  &ldquo;vous ne reviendrez jamais en arrière&rdquo;
                </span>
              </>
            )}
          </h2>

          {/* Sous-texte Explicatif Épuré */}
          <p className="mt-5 sm:mt-7 text-sm sm:text-base lg:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? "Lonside delivers unmatched engineering velocity and absolute certainty: locked-scope sprints deployed in as little as 14 days, with 100% source code ownership on your private GitHub, built so fast and cleanly you won't want to build anywhere else."
              : "Lonside offre une vélocité sans précédent et une certitude totale : des sprints d'ingénierie au forfait scellé livrés dès 14 jours, avec 100% du code source cédé sur votre propre compte GitHub, exécutés si rapidement et proprement que vous ne voudrez plus concevoir de produit autrement."}
          </p>
        </div>
      </div>
    </section>
  );
}
