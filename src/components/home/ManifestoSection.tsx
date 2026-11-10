"use client";

import React from "react";

interface ManifestoSectionProps {
  locale?: string;
}

export default function ManifestoSection({ locale = "fr" }: ManifestoSectionProps) {
  const isEn = locale === "en";

  const commitments = [
    {
      num: "01",
      title: isEn ? "A promise kept on deadlines and budget" : "La parole tenue sur les délais et le prix",
      subtitle: isEn ? "Fixed scope • Zero hidden fees" : "Forfait ferme • Zéro surcoût surprise",
      desc: isEn
        ? "Before writing a single line of code, we align together on what truly moves the needle for your business. Once defined, our commitment is absolute: the price does not move by a cent, and the launch date is set in stone. You always know exactly where you are heading."
        : "Avant de poser la première ligne de code, nous cadrons ensemble ce qui compte réellement pour votre entreprise. Une fois le périmètre validé, notre engagement est total : le prix ne bouge pas d'un centime, et la date de livraison est scellée. Vous savez exactement où vous allez.",
    },
    {
      num: "02",
      title: isEn ? "Code that belongs 100% to you, from day one" : "Un code 100% à vous, sans aucune captivité",
      subtitle: isEn ? "Your GitHub • Full intellectual property" : "Votre compte GitHub • Cession totale",
      desc: isEn
        ? "Every commit, database schema, and design component lives directly on your private repository. You are never trapped by proprietary templates or forced subscriptions. You stay completely free to scale with us or hand over to your own team whenever you wish."
        : "Chaque ligne de code, chaque schéma de base de données et chaque composant d'interface sont poussés directement sur votre propre compte GitHub. Vous n'êtes jamais captif d'un outil propriétaire ni d'un abonnement forcé. Vous restez libre de grandir avec nous ou en totale autonomie.",
    },
    {
      num: "03",
      title: isEn ? "Crafted with care, built for real customers" : "Le soin de l'artisan, prêt pour la vraie vie",
      subtitle: isEn ? "Automated tests • 30-day warranty" : "Tests rigoureux • Garantie 30 jours",
      desc: isEn
        ? "We genuinely care about the quality of what we build. Your application is not a fragile prototype: it arrives thoroughly tested, documented, secured, and ready to accept real payments and users. If anything requires fine-tuning, our 30-day warranty has your back."
        : "Nous aimons sincèrement ce que nous fabriquons. Votre application n'est pas une maquette bancale : elle arrive testée, fluide, documentée, prête à accueillir de vrais utilisateurs et à encaisser des paiements. Et si le moindre ajustement est nécessaire, notre garantie 30 jours prend le relais sans frais.",
    },
  ];

  return (
    <section id="manifeste" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* En-tête Chaleureux & Noble */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{isEn ? "THE STUDIO PHILOSOPHY" : "NOTRE VISION D'ATELIER"}</span>
          </div>
          <h2 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-[1.08] font-normal">
            {isEn ? (
              <>Building software, <br /><span className="text-zinc-500">grounded in trust.</span></>
            ) : (
              <>Créer du logiciel, <br /><span className="text-zinc-500">dans la confiance.</span></>
            )}
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            {isEn
              ? "Developing a great product should be exciting and clear, not an anxious tunnel of vague estimates and slipping schedules. We built Lonside around three simple, uncompromising commitments."
              : "Lancer un nouveau produit demande du courage et de l'énergie. Travailler avec nous doit être une expérience stimulante et limpide, pas un tunnel anxiogène de devis flous et de retards répétés. Nous avons fondé Lonside sur trois engagements simples."}
          </p>
        </div>

        {/* 3 Engagements Précis (Non-cliquables, zéro hover) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {commitments.map((item) => (
            <div
              key={item.num}
              className="p-6 sm:p-8 rounded-xl bg-zinc-50/40 border border-black/[0.08] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5 gap-2">
                  <span className="font-mono text-2xl sm:text-3xl text-zinc-400 font-medium whitespace-nowrap">
                    {item.num}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                    {item.subtitle}
                  </span>
                </div>

                <h3 className="font-display uppercase text-lg sm:text-xl md:text-2xl text-black tracking-tight leading-snug font-medium">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
