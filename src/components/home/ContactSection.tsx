"use client";

import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Calendar, Loader2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

interface ContactSectionProps {
  locale?: string;
}

export default function ContactSection({ locale = "fr" }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", _trap: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isEn = locale === "en";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: "Demande de cadrage d'ingénierie (Studio Lonside)",
          _trap: formData._trap,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Une erreur est survenue.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", _trap: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Erreur de transmission.");
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-24 lg:py-28 bg-white border-t border-black/[0.06] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Colonne Gauche : Pitch Chaleureux & Noble */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>{isEn ? "GET IN TOUCH" : "PARLONS DE VOTRE PROJET"}</span>
              </div>
              <h2 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-black leading-[1.08] font-normal">
                {isEn ? (
                  <>Let&apos;s build, <br /><span className="text-zinc-500">together.</span></>
                ) : (
                  <>Donnons vie, <br /><span className="text-zinc-500">à votre produit.</span></>
                )}
              </h2>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
                {isEn
                  ? "Whether you already have a detailed specification or just an early concept you'd like honest feedback on, we are always glad to connect and share clear, straightforward advice."
                  : "Que vous ayez déjà un cahier des charges précis ou simplement une idée sur laquelle vous souhaitez des retours d'expérience sincères, nous prenons le temps d'échanger avec vous simplement et sans jargon."}
              </p>
            </div>

            {/* Direct Booking Card (rounded-xl) */}
            <div className="p-5 sm:p-7 rounded-xl bg-zinc-50/50 border border-black/[0.08] space-y-3.5">
              <div className="flex items-center space-x-3 text-black">
                <div className="p-2 rounded-lg bg-white border border-black/[0.08]">
                  <Calendar className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="font-display uppercase text-base sm:text-lg md:text-xl text-black tracking-tight font-medium">{isEn ? "15-Min Scoping Call" : "Échange de Cadrage (15 min)"}</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">{isEn ? "Direct with Kevin T. (Founder & Lead Architect)" : "Direct avec Kevin T. (Fondateur & Lead Architecte)"}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                {isEn
                  ? "We evaluate technical feasibility, provide honest architecture feedback, and calculate your exact fixed timeline and cost."
                  : "Nous regardons ensemble la faisabilité de votre projet, nous vous conseillons sur les choix techniques et nous vous donnons un avis transparent sur le délai et le budget nécessaires."}
              </p>
              <a
                href={siteConfig.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-black underline underline-offset-4 hover:text-zinc-600 transition-colors pt-0.5 font-medium whitespace-nowrap"
              >
                <span>{isEn ? "Choose a time on the calendar →" : "Choisir un créneau sur l'agenda →"}</span>
              </a>
            </div>

            {/* Garanties immédiates */}
            <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-zinc-600 font-normal">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>{isEn ? "Direct conversation • Zero sales pressure" : "Échange direct et sans pression commerciale"}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="text-black font-mono">/</span>
                <span>{isEn ? "Actionable technical advice from the first call" : "Conseils techniques actionnables dès le premier échange"}</span>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Formulaire Épuré (rounded-xl) */}
          <div className="rounded-xl bg-white border border-black/[0.08] p-6 sm:p-8 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
            {status === "success" ? (
              <div className="py-10 text-center space-y-3.5">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-black/[0.1] text-black flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-display uppercase tracking-tight text-black font-medium">
                  {isEn ? "Brief Received." : "Demande Bien Reçue."}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed font-normal">
                  {isEn
                    ? "Our lead architect is already reviewing your requirements. Expect an answer under 24 business hours."
                    : "Votre demande est en cours d'analyse technique. Un lead architecte vous répondra sous 24h ouvrées."}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-3 text-xs font-mono text-black underline underline-offset-4 cursor-pointer"
                >
                  {isEn ? "Send another message" : "Envoyer un autre message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot anti-bot */}
                <input
                  type="text"
                  name="_trap"
                  value={formData._trap}
                  onChange={(e) => setFormData({ ...formData, _trap: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="space-y-1">
                  <label htmlFor="name" className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider block">
                    {isEn ? "Name or Organization *" : "Nom ou Entreprise *"}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isEn ? "e.g. Sarah Connor / Cyberdyne Systems" : "ex: Sarah Connor / Cyberdyne"}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50/50 border border-black/[0.08] text-black placeholder:text-zinc-400 text-base sm:text-sm focus:outline-none focus:border-black/60 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider block">
                    {isEn ? "Corporate Email *" : "Email Professionnel *"}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50/50 border border-black/[0.08] text-black placeholder:text-zinc-400 text-base sm:text-sm focus:outline-none focus:border-black/60 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider block">
                    {isEn ? "Project Context & Target Window *" : "Description du Projet & Échéance Cible *"}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      isEn
                        ? "Briefly describe what you need to build, your current stack, and target launch window (e.g., Sprint Launch in 14 days)..."
                        : "Décrivez brièvement le produit à développer, vos technologies et votre échéance cible (ex: Sprint Launch 14j)..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50/50 border border-black/[0.08] text-black placeholder:text-zinc-400 text-base sm:text-sm focus:outline-none focus:border-black/60 transition-colors resize-none"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 px-6 rounded-xl bg-black text-white font-mono text-xs uppercase tracking-[0.14em] flex items-center justify-center space-x-2 hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50 min-h-[46px] whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span className="whitespace-nowrap">{isEn ? "Sending..." : "Envoi en cours..."}</span>
                    </>
                  ) : (
                    <>
                      <span className="whitespace-nowrap">{isEn ? "Send inquiry" : "Transmettre ma demande"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
