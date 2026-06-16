"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, X, Zap, ShieldCheck, Unlock, FileCode2 } from "lucide-react";
import { useInView } from "@/hooks/useInView";

interface ComparisonCard {
  frustrationTitle: string;
  frustrationDesc: string;
  solutionTitle: string;
  solutionDesc: string;
  metric: string;
}

function FrustrationCard({
  card,
  idx,
  oldMethod,
  oldMethodStatus,
  newMethod,
}: {
  card: ComparisonCard;
  idx: number;
  oldMethod: string;
  oldMethodStatus: string;
  newMethod: string;
}) {
  const { ref, inView } = useInView(0.12);
  const enterDelay = idx * 130;

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden border border-white/6 cursor-default"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
        transitionDelay: `${enterDelay}ms`,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">

        {/* ── Frustration column ── */}
        <div className="relative p-6 overflow-hidden bg-[#0d0508]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.05),transparent_65%)] pointer-events-none" />

          <div className="relative flex flex-col h-full gap-5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 shrink-0" aria-hidden="true">
                <X className="w-2.5 h-2.5 text-red-400" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.14em] text-red-400 uppercase">
                {oldMethod}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-300 mb-2 leading-snug">
                {card.frustrationTitle}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {card.frustrationDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-red-500/8 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-40" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500/60" />
              </span>
              <span className="text-[10px] text-red-400 font-mono font-semibold tracking-wide">
                {oldMethodStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ── Solution column ── */}
        <div className="relative p-6 overflow-hidden bg-[#06070f]">
          {/* Ambient glow that blooms in after card enters */}
          <div
            className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-brand-purple/8 blur-3xl pointer-events-none"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 1.1s ease",
              transitionDelay: `${enterDelay + 380}ms`,
            }}
          />

          <div className="relative flex flex-col h-full gap-5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-purple/12 border border-brand-purple/22 shrink-0" aria-hidden="true">
                <Zap className="w-2.5 h-2.5 text-brand-purple" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.14em] text-brand-purple uppercase">
                {newMethod}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                {card.solutionTitle}
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {card.solutionDesc}
              </p>
            </div>

            {/* Metric — slides in from left with cascaded delay */}
            <div
              className="pt-4 border-t border-brand-purple/12 flex items-center gap-2"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-10px)",
                transition: "opacity 0.55s ease, transform 0.55s ease",
                transitionDelay: `${enterDelay + 300}ms`,
              }}
            >
              <Zap className="w-3 h-3 text-brand-purple shrink-0" aria-hidden="true" />
              <span className="text-[10px] text-brand-purple font-bold font-mono">
                {card.metric}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function FrustrationGrid() {
  const t = useTranslations("frustration");
  const cards = t.raw("cards") as ComparisonCard[];

  const { ref: headerRef, inView: headerInView } = useInView(0.2);
  const { ref: footerRef, inView: footerInView } = useInView(0.15);

  const footerItems = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-purple" />,
      title: t("satisfaction.title"),
      desc: t("satisfaction.desc"),
    },
    {
      icon: <FileCode2 className="w-5 h-5 text-brand-purple" />,
      title: t("ip.title"),
      desc: t("ip.desc"),
    },
    {
      icon: <Unlock className="w-5 h-5 text-brand-purple" />,
      title: t("lockin.title"),
      desc: t("lockin.desc"),
    },
  ];

  return (
    <section id="garanties" className="relative py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/8 border border-red-500/18 text-red-300 text-xs font-semibold tracking-wide mb-5">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
            {t("title")}
            <span className="shimmer-text">{t("titleHighlight")}</span>
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-400 font-medium">
            {t("subtitle")}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {cards.map((card, idx) => (
            <FrustrationCard
              key={idx}
              card={card}
              idx={idx}
              oldMethod={t("oldMethod")}
              oldMethodStatus={t("oldMethodStatus")}
              newMethod={t("newMethod")}
            />
          ))}
        </div>

        {/* Footer guarantee badges */}
        <div
          ref={footerRef}
          className="mt-14 p-8 rounded-2xl bg-[#0a0a10] border border-white/6 grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{
            opacity: footerInView ? 1 : 0,
            transform: footerInView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            transitionDelay: "200ms",
          }}
        >
          {footerItems.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="flex items-center gap-3.5 cursor-default"
              style={{
                opacity: footerInView ? 1 : 0,
                transition: "opacity 0.5s ease",
                transitionDelay: `${300 + i * 100}ms`,
              }}
            >
              {/* Icon with subtle pulse ring */}
              <div className="relative shrink-0">
                <span className="absolute inset-0 rounded-full bg-brand-purple/15 animate-ping" style={{ animationDuration: "2.5s" }} />
                <div className="relative p-2.5 rounded-full bg-brand-purple/10 border border-brand-purple/20">
                  {icon}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-0.5">{title}</div>
                <div className="text-xs text-slate-400">{desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
