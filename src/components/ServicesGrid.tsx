"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Layout, Database, Terminal, ArrowUpRight, Check, Users, ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useInView } from "@/hooks/useInView";

const ICONS = [
  <Sparkles key="sparkles" className="w-6 h-6 text-brand-purple" />,
  <Layout   key="layout"   className="w-6 h-6 text-brand-purple" />,
  <Database key="database" className="w-6 h-6 text-brand-purple" />,
  <Terminal key="terminal" className="w-6 h-6 text-brand-purple" />,
];

const SERVICE_LINKS = [
  "/services/design",
  "/services/site-vitrine",
  "/services/application-web",
  "/services/automatisation",
] as const;

interface Bullet {
  label: string;
  details: string;
  type: "human" | "agent";
}

interface ServiceItem {
  title: string;
  tag: string;
  description: string;
  aiBoost: string;
  agentName: string;
  bullets: Bullet[];
}

export default function ServicesGrid() {
  const t = useTranslations("servicesGrid");
  const items = t.raw("items") as ServiceItem[];

  const { ref: gridRef, inView: gridInView } = useInView(0.05);

  return (
    <section id="services" className="relative py-12 bg-[#050505] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-radial-purple opacity-30 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((service, index) => (
            <Link
              key={index}
              href={SERVICE_LINKS[index] || "/services"}
              className="group relative p-6 md:p-8 rounded-2xl bg-[#0d0d11] border border-white/8 hover:border-brand-purple/30 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 flex flex-col justify-between overflow-hidden cursor-pointer"
              style={{
                opacity: gridInView ? 1 : 0,
                transition: "opacity 0.65s ease, border-color 0.5s, box-shadow 0.5s",
                transitionDelay: `${index * 110}ms`,
              }}
            >
              {/* Hover radial glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
                style={{ background: "radial-gradient(circle at 10% 10%, rgba(124,58,237,0.06) 0%, transparent 60%)" }}
              />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 shadow-inner transition-[border-color,box-shadow] duration-300 group-hover:border-brand-purple/20 group-hover:shadow-[0_0_12px_rgba(124,58,237,0.1)]">
                    {ICONS[index]}
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-slate-900 border border-white/5 text-slate-400">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-slate-100 mb-3 flex items-center group-hover:text-brand-purple transition-colors duration-300">
                  <span>{service.title}</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-brand-purple" />
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3 mb-8">
                  {service.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-center text-xs">
                      <div className="mr-2.5 shrink-0">
                        {bullet.type === "human" ? (
                          <span className="inline-flex items-center justify-center min-w-8 h-5 px-1.5 rounded-full bg-purple-900/30 border border-brand-purple/20 text-brand-purple font-bold text-[10px] font-mono">
                            {t("humanLabel")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center min-w-8 h-5 px-1.5 rounded-full bg-purple-950 border border-brand-purple/40 text-slate-200 font-bold text-[10px] font-mono">
                            {t("agentLabel")}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-slate-200">{bullet.label} : </strong>
                        <span className="text-slate-400">{bullet.details}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs bg-slate-950/40 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-6 md:p-8">
                <div>
                  <span className="text-[10px] font-bold tracking-wide bg-slate-900 border border-white/5 text-brand-purple px-2.5 py-0.5 rounded">
                    {t("aiBoostPrefix")} ({service.agentName})
                  </span>
                  <span className="text-slate-300 text-[11px] leading-relaxed">
                    {service.aiBoost}
                  </span>
                </div>
                <div className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-brand-purple border border-brand-purple/20 group-hover:bg-brand-purple/20 transition-colors duration-300" aria-hidden="true">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Banner Régie & Staff Augmentation */}
        <div className="mt-8">
          <Link
            href="/services/regie"
            className="group relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#0d0d14] via-[#120f24] to-[#0d0d14] border border-brand-purple/30 hover:border-brand-purple/60 shadow-[0_0_35px_rgba(124,58,237,0.12)] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer overflow-hidden"
          >
            <div className="flex items-start md:items-center gap-4">
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-brand-purple shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                    NOUVEAU • RENFORT DÉDIÉ
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Opérationnel sous 48h</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                  Régie Dédiée & Développeurs Seniors IA (Staff Augmentation)
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl font-normal">
                  Embarquez un ingénieur senior d&apos;élite immédiatement opérationnel dans votre squad. Vélocité x3, zéro dette, essai 5 jours sans risque et 100% propriété sur votre Git.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-white bg-brand-purple group-hover:bg-brand-purple-hover px-4 py-2.5 rounded-lg shadow-md transition-colors">
              <span>Découvrir la Régie</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
