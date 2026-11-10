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
    <section id="faq" className="relative py-28 bg-[#000000] border-t border-white/10 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-2xl mb-16 text-center mx-auto">
          <div className="studio-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{isEn ? "Direct Answers" : "Réponses Directes & Claires"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            {isEn ? "Frequently Asked Questions" : "Questions Fréquentes"}
          </h2>
          <p className="mt-4 text-sm text-[#a1a1aa] leading-relaxed">
            {isEn
              ? "Everything you need to know about our sprints, IP handover, and engineering standards."
              : "Tout ce qu'il faut savoir sur nos engagements, la cession de propriété intellectuelle et nos standards d'ingénierie."}
          </p>
        </div>

        {/* Accordéon interactif */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.slug || idx}
                className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left cursor-pointer hover:bg-white/[0.02] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                    {item.question}
                  </span>
                  <div
                    className={`shrink-0 p-1.5 rounded-full border border-white/10 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-white text-black" : "text-[#71717a]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-white/5">
                    <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
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

