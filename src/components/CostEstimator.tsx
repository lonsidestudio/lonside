"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "@/hooks/useInView";
import { Calculator, Check, Cpu, Calendar, Send, Terminal } from "lucide-react";

interface ServiceBrick {
  id: string;
  name: string;
  category: string;
  price: number;
  days: number;
  agents: string[];
  acceleration: string;
  desc: string;
}

export default function CostEstimator() {
  const t = useTranslations("estimator");
  const tTerminal = useTranslations("terminal");

  const [selectedBricks, setSelectedBricks] = useState<string[]>(["landing"]);
  const [formData, setFormData] = useState({ name: "", email: "", brief: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* ── InView ── */
  const { ref: titleRef, inView: titleInView } = useInView(0.1);
  const { ref: bricksRef, inView: bricksInView } = useInView(0.06);
  const { ref: hudRef, inView: hudInView } = useInView(0.06);

  /* ── Agent name i18n ── */
  const translateAgentName = (name: string): string => {
    const map: Record<string, string> = {
      "Agent Cadrage": tTerminal("agents.0.name"),
      "Scoping Agent": tTerminal("agents.0.name"),
      "Agent Design": tTerminal("agents.1.name"),
      "Design Agent": tTerminal("agents.1.name"),
      "Agent Créatif": tTerminal("agents.1.name"),
      "Creative Agent": tTerminal("agents.1.name"),
      "Agent Code": tTerminal("agents.2.name"),
      "Code Agent": tTerminal("agents.2.name"),
      "Agent de Structure": tTerminal("agents.2.name"),
      "Structure Agent": tTerminal("agents.2.name"),
      "Agent Fiabilité": tTerminal("agents.3.name"),
      "Reliability Agent": tTerminal("agents.3.name"),
      "Agent d'Optimisation": tTerminal("agents.3.name"),
      "Optimization Agent": tTerminal("agents.3.name"),
    };
    return map[name] ?? name;
  };

  /* ── Bricks data ── */
  const rawBricks = t.raw("bricks") as { id: string; name: string; category: string; desc: string }[];
  const brickMeta: Record<string, { price: number; days: number; agents: string[]; acceleration: string }> = {
    logo:    { price: 1500, days: 3,  agents: ["Creative Agent"],                            acceleration: "x4.5" },
    landing: { price: 2500, days: 5,  agents: ["Optimization Agent", "Structure Agent"],      acceleration: "x3.0" },
    saas:    { price: 5400, days: 12, agents: ["Structure Agent", "Reliability Agent"],        acceleration: "x4.0" },
    agent:   { price: 3500, days: 7,  agents: ["Optimization Agent", "Reliability Agent"],    acceleration: "x3.5" },
    api:     { price: 1800, days: 4,  agents: ["Structure Agent"],                            acceleration: "x3.0" },
  };

  const bricks: ServiceBrick[] = rawBricks.map((b) => ({
    ...b,
    ...brickMeta[b.id] ?? { price: 0, days: 0, agents: [], acceleration: "" },
  }));

  const handleToggleBrick = (id: string) => {
    setSelectedBricks((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((b) => b !== id) : prev
        : [...prev, id]
    );
  };

  /* ── Derived values ── */
  const activeBricks   = bricks.filter((b) => selectedBricks.includes(b.id));
  const rawPrice       = activeBricks.reduce((acc, b) => acc + b.price, 0);
  const totalDays      = activeBricks.reduce((acc, b) => acc + b.days, 0);
  const isBundle       = selectedBricks.length >= 3;
  const totalPrice     = isBundle ? Math.round(rawPrice * 0.9) : rawPrice;
  const allocatedAgents = Array.from(new Set(activeBricks.flatMap((b) => b.agents)));

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", brief: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="estimator" className="relative py-24 bg-[#050505] border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-radial-purple opacity-20 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div
          ref={titleRef}
          className="text-center mb-16"
          style={{
            opacity: titleInView ? 1 : 0,
            transition: "opacity 0.55s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-semibold tracking-wide mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
            {t("title")}
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-medium">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Brick selector ── */}
          <div ref={bricksRef} className="lg:col-span-2 space-y-3">
            <span
              className="text-xs font-bold tracking-wide text-slate-400 block mb-4"
              style={{
                opacity: bricksInView ? 1 : 0,
                transition: "opacity 0.45s ease",
              }}
            >
              {t("step1")}
            </span>

            {bricks.map((brick, i) => {
              const isSelected = selectedBricks.includes(brick.id);
              return (
                <div
                  key={brick.id}
                  onClick={() => handleToggleBrick(brick.id)}
                  style={{
                    opacity: bricksInView ? 1 : 0,
                    transition: "opacity 0.5s ease, border-color 0.2s, background-color 0.2s, box-shadow 0.2s",
                    transitionDelay: `${i * 70}ms`,
                  }}
                  className={`p-5 rounded-xl border cursor-pointer flex items-start justify-between group ${
                    isSelected
                      ? "bg-brand-purple/10 border-brand-purple shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                      : "bg-[#0d0d11] border-white/8 hover:border-brand-purple/30 hover:bg-brand-purple/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                      isSelected ? "bg-brand-purple border-brand-purple text-white" : "border-white/15 bg-slate-950"
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-200 text-sm">{brick.name}</span>
                        <span className="text-[10px] font-mono bg-slate-900 border border-white/5 text-slate-500 px-2 py-0.5 rounded">
                          {brick.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{brick.desc}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2 sm:ml-4">
                    <div className="text-sm font-bold text-brand-purple font-mono">{brick.price.toLocaleString("fr-FR")} €</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{brick.days} {t("daysLabel")}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── HUD + Form ── */}
          <div
            ref={hudRef}
            className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start"
            style={{
              opacity: hudInView ? 1 : 0,
              transition: "opacity 0.6s ease",
              transitionDelay: "150ms",
            }}
          >
            {/* Scoping HUD */}
            <div className="p-6 rounded-2xl border border-white/8 bg-[#0d0d11] shadow-xl">
              <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
                <Terminal className="w-4 h-4 text-brand-purple" />
                <span className="text-xs font-bold tracking-wide text-slate-300 font-mono">
                  {t("scopingReport")}
                </span>
              </div>

              <div className="space-y-4">
                {/* Price */}
                <div>
                  <span className="text-[10px] font-bold tracking-wide text-slate-400 block mb-1">
                    {t("estimatedBudget")}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400 font-medium">À partir de</span>
                    <span
                      key={totalPrice}
                      className="text-3xl font-bold text-white font-mono animate-in fade-in duration-200"
                    >
                      {totalPrice.toLocaleString("fr-FR")} €
                    </span>
                    {isBundle && (
                      <span className="text-xs text-slate-500 font-mono line-through animate-in fade-in duration-300">
                        {rawPrice.toLocaleString("fr-FR")} €
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1">
                    * Estimation indicative soumise à confirmation lors de notre session de cadrage offerte (15 min).
                  </span>
                  {/* Bundle discount badge */}
                  <div
                    style={{
                      opacity: isBundle ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      height: isBundle ? "auto" : 0,
                      overflow: "hidden",
                    }}
                  >
                    <span className="text-[10px] text-emerald-400 font-medium block mt-1">
                      {t("discountApplied")}
                    </span>
                  </div>
                </div>

                {/* Delivery */}
                <div className="flex items-center justify-between py-2.5 border-y border-white/5">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                    {t("deliveryTime")}
                  </span>
                  <span
                    key={totalDays}
                    className="text-sm font-bold text-slate-100 font-mono animate-in fade-in duration-200"
                  >
                    {totalDays} {t("daysLabel").split(" ")[0]}
                  </span>
                </div>

                {/* Agents */}
                <div>
                  <span className="text-[10px] font-bold tracking-wide text-slate-500 block mb-2">
                    {t("allocatedAgents")}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {allocatedAgents.map((agent) => (
                      <span
                        key={agent}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-purple/10 text-purple-200 border border-brand-purple/20 flex items-center gap-1"
                      >
                        <Cpu className="w-3 h-3 text-brand-purple" />
                        {translateAgentName(agent)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form / Success */}
            <div className="p-6 rounded-2xl border border-white/8 bg-[#0d0d11]">
              {submitSuccess ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center pb-4 border-b border-white/5">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
                      <Check className="w-5 h-5 animate-bounce" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{t("successTitle")}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {t("successDesc").replace("{email}", formData.email || "votre adresse")}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                      {t("phasesTitle")}
                    </span>
                    {[
                      { title: t("phase1Title"), desc: t("phase1Desc") },
                      { title: t("phase2Title"), desc: t("phase2Desc") },
                      { title: t("phase3Title"), desc: t("phase3Desc") },
                    ].map(({ title, desc }, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs bg-[#050505]/40 p-3 rounded-lg border border-white/5">
                        <span className="w-5 h-5 rounded bg-brand-purple/20 text-brand-purple font-bold flex items-center justify-center text-[10px] shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <strong className="text-slate-200 block">{title}</strong>
                          <span className="text-slate-400 text-[10px]">{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://calendly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md shadow-purple-500/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all duration-200"
                  >
                    {t("ctaMeeting")}
                  </a>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold tracking-wide text-slate-400 block mb-4">
                    {t("step2")}
                  </span>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { key: "name",  label: t("labelName"),  type: "text",  placeholder: t("placeholderName"),  required: true  },
                      { key: "email", label: t("labelEmail"), type: "email", placeholder: t("placeholderEmail"), required: true  },
                    ].map(({ key, label, type, placeholder, required }) => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">{label}</label>
                        <input
                          type={type}
                          required={required}
                          value={formData[key as keyof typeof formData]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full bg-[#050505] border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus-visible:border-brand-purple focus-visible:ring-1 focus-visible:ring-brand-purple/30 transition-[border-color,box-shadow] duration-200 placeholder:text-slate-500"
                          placeholder={placeholder}
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">{t("labelBrief")}</label>
                      <textarea
                        value={formData.brief}
                        onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                        rows={3}
                        className="w-full bg-[#050505] border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus-visible:border-brand-purple focus-visible:ring-1 focus-visible:ring-brand-purple/30 transition-[border-color,box-shadow] duration-200 placeholder:text-slate-500 resize-none"
                        placeholder={t("placeholderBrief")}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md hover:shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>{t("btnSubmitting")}</span>
                      ) : (
                        <>
                          <span>{t("btnSubmit")}</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
