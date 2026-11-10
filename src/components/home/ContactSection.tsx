"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Mail, Calendar, Loader2 } from "lucide-react";

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
          subject: "Demande de cadrage d'ingénierie (One-Page Studio)",
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
    <section id="contact" className="relative py-28 bg-[#000000] border-t border-white/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Colonne Gauche : Pitch & Cadrage Direct */}
          <div className="space-y-8">
            <div>
              <div className="studio-pill mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>{isEn ? "Direct Access • Q2/Q3 Slots" : "Accès Direct • Créneaux T2/T3 Ouverts"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
                {isEn ? "Your Next Leap Begins Here." : "Votre Prochain Saut Technologique Commence Ici."}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
                {isEn
                  ? "Book a 15-minute scoping call directly with a lead architect, or submit your project constraints for a fixed proposal under 24 hours."
                  : "Planifiez un échange de 15 minutes sans intermédiaire avec un lead architecte, ou soumettez vos contraintes pour recevoir une proposition ferme sous 24h ouvrées."}
              </p>
            </div>

            {/* Direct Booking Card */}
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-4">
              <div className="flex items-center space-x-3 text-white">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{isEn ? "Book a 15-Min Scoping Call" : "Réserver un Cadrage Technique (15 min)"}</h3>
                  <p className="text-xs text-[#71717a] font-mono">{isEn ? "Direct with Kevin T. (Lead Architect)" : "Direct avec Kevin T. (Lead Architecte)"}</p>
                </div>
              </div>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                {isEn
                  ? "We evaluate technical feasibility, establish clear boundaries, and calculate your exact fixed sprint cost."
                  : "Nous vérifions la faisabilité technique, validons le périmètre et fixons ensemble le forfait exact de votre sprint."}
              </p>
              <a
                href="https://cal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-mono text-white underline hover:text-slate-300 transition-colors"
              >
                <span>{isEn ? "Open calendar schedule →" : "Accéder aux disponibilités de l'agenda →"}</span>
              </a>
            </div>

            {/* Garanties immédiates */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2.5 text-xs text-[#a1a1aa]">
                <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>{isEn ? "Zero automated spam • Strict NDA confidentiality" : "Zéro relance automatisée • Confidentialité stricte sous NDA"}</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-[#a1a1aa]">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>{isEn ? "Firm quote with immutable delivery deadline" : "Proposition chiffrée avec date de livraison ferme garantie"}</span>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Formulaire Commando */}
          <div className="rounded-2xl bg-[#0a0a0a] border border-white/10 p-8 sm:p-10">
            {status === "success" ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {isEn ? "Brief Received Successfully." : "Dossier Reçu avec Succès."}
                </h3>
                <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto leading-relaxed">
                  {isEn
                    ? "Our lead architect is already reviewing your requirements. Expect a detailed answer under 24 business hours."
                    : "Votre demande est en cours d'analyse technique. Un lead architecte vous répondra sous 24h ouvrées."}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-xs font-mono text-white underline"
                >
                  {isEn ? "Send another message" : "Envoyer un autre message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-white">
                    {isEn ? "Full Name or Organization *" : "Nom ou Entreprise *"}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isEn ? "e.g. Sarah Connor / Cyberdyne Systems" : "ex: Sarah Connor / Cyberdyne"}
                    className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-white/10 text-white placeholder:text-[#52525b] text-xs focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-white">
                    {isEn ? "Corporate Email Address *" : "Adresse Email Professionnelle *"}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-white/10 text-white placeholder:text-[#52525b] text-xs focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-mono uppercase tracking-wider text-white">
                    {isEn ? "Project Constraints & Desired Delivery *" : "Description du Besoin & Délais Visés *"}
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
                        : "Décrivez brièvement le produit à développer, vos technologies actuelles et votre échéance cible (ex: Sprint Launch 14j)..."
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-white/10 text-white placeholder:text-[#52525b] text-xs focus:outline-none focus:border-white/40 transition-colors resize-none"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 px-6 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#eaeaea] transition-all cursor-pointer disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEn ? "Transmitting..." : "Transmission en cours..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isEn ? "Submit Project for Scoping" : "Transmettre mon Projet pour Cadrage"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#71717a] text-center">
                  {isEn
                    ? "Direct engineering review under 24 hours. No sales spam."
                    : "Revue technique sous 24h ouvrées. Zéro spam commercial."}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

