"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = t.raw("items") as { q: string; a: string }[];

  const { ref: headerRef, inView: headerInView } = useInView(0.15);
  const { ref: itemsRef, inView: itemsInView } = useInView(0.05);

  return (
    <section id="faq" className="relative py-24 bg-[#050505] border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-radial-purple opacity-20 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-14"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-semibold tracking-wide mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
            {t("title")}
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-medium">
            {t("subtitle")}
          </p>
        </div>

        {/* Accordion items */}
        <div ref={itemsRef} className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-[#0d0d11]/60 backdrop-blur-sm overflow-hidden"
                style={{
                  opacity: itemsInView ? 1 : 0,
                  transform: itemsInView ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  transitionDelay: `${idx * 55}ms`,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-purple/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs md:text-sm font-semibold text-slate-300 group-hover:text-white transition-colors duration-200">
                    {item.q}
                  </span>
                  <div
                    className={`shrink-0 p-1 rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-brand-purple/20 text-brand-purple rotate-180"
                        : "bg-white/5 text-slate-500 group-hover:text-slate-300 group-hover:bg-white/8"
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Smooth height animation via grid-rows */}
                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-white/5 px-5 pb-5 pt-4">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
