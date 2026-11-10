"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LocalizedFaqItem } from "@/lib/keystatic/reader";

interface FaqSectionProps {
  items: LocalizedFaqItem[];
  locale?: string;
}

export default function FaqSection({ items, locale = "fr" }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isEn = locale === "en";

  return (
    <section id="faq" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* En-tête Aéré & Noble */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{isEn ? "DIRECT ANSWERS" : "RÉPONSES SANS DÉTOUR"}</span>
          </div>
          <h2 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-[1.08] font-normal">
            {isEn ? (
              <>Frequently asked <br /><span className="text-zinc-500">questions.</span></>
            ) : (
              <>Questions <br /><span className="text-zinc-500">fréquentes.</span></>
            )}
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            {isEn
              ? "Everything you need to know about our sprint cadence, IP handover, and engineering guarantees."
              : "Tout ce qu'il faut savoir sur nos engagements, la cession de propriété intellectuelle et nos standards de livraison."}
          </p>
        </div>

        {/* Accordéon Haute Précision (rounded-xl) */}
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.slug || idx}
                className="rounded-xl border border-black/[0.08] bg-zinc-50/30 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer hover:bg-zinc-50/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black min-h-[52px]"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400 block whitespace-nowrap">
                      0{idx + 1} {"//"} {item.category.toUpperCase()}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg font-medium text-black tracking-tight block">
                      {item.question}
                    </span>
                  </div>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full border border-black/[0.12] flex items-center justify-center transition-all duration-200 ${
                      isOpen ? "rotate-180 bg-black text-white border-black" : "text-black"
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-black/[0.04]">
                    <p className="text-sm text-zinc-600 font-normal leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
