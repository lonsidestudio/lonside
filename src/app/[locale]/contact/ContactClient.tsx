"use client";

import React, { useState, useEffect, useRef } from "react";
import { captureLeadEvent } from "@/lib/posthog";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Calendar, Clock, Send, Check, AlertCircle } from "lucide-react";

export default function ContactClient() {
  const t = useTranslations("contact");
  const tPricing = useTranslations("pricingData");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@lonside.ai";

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", _trap: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const plan = searchParams.get("plan");
    const addonsStr = searchParams.get("addons");
    const source = searchParams.get("source");
    const mode = searchParams.get("mode");
    const role = searchParams.get("role");

    if (plan || addonsStr || source || mode === "regie") {
      // Find translated names
      const rawTiers = tPricing.raw("tiers") as { id: string; name: string }[];
      const rawAddons = tPricing.raw("addons") as { id: string; name: string }[];

      const planName = rawTiers.find((p) => p.id === plan)?.name || (plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "");
      
      const selectedAddons = addonsStr
        ? addonsStr.split(",").map((id) => rawAddons.find((a) => a.id === id)?.name || id)
        : [];

      let subject = "";
      let message = "";

      const squadParam = searchParams.get("squad");

      if (mode === "regie") {
        if (squadParam) {
          if (locale === "fr") {
            subject = "Configuration Squad Augmentée Sur-Mesure";
            message = `Bonjour,\n\nJ'ai configuré la composition de squad suivante sur votre simulateur :\n- Détail de la squad : ${squadParam}\n\nContexte de notre projet et objectifs de livraison :\n- Stack technique actuelle :\n- Date de démarrage souhaitée :\n- Objectifs du premier sprint :\n`;
          } else {
            subject = "Custom Augmented Squad Configuration";
            message = `Hello,\n\nI have configured the following squad setup via your simulator:\n- Squad composition: ${squadParam}\n\nProject context and delivery goals:\n- Current tech stack:\n- Target start date:\n- Key sprint goals:\n`;
          }
        } else if (role === "fullstack") {
          if (locale === "fr") {
            subject = "Renfort Régie - Senior Fullstack Engineer Augmenté (IA Boosted)";
            message = "Bonjour,\n\nJe souhaite échanger sur la mise à disposition d'un Senior Fullstack Engineer IA-Augmenté pour accélérer notre roadmap de développement.\n\nStack technique & contexte de notre équipe :\n- Stack actuelle :\n- Objectifs du sprint :\n- Durée envisagée :\n";
          } else {
            subject = "Staff Augmentation - Senior AI-Augmented Fullstack Engineer";
            message = "Hello,\n\nI would like to discuss embedding a Senior AI-Augmented Fullstack Engineer to accelerate our product roadmap.\n\nOur current tech stack & team context:\n- Current stack:\n- Sprint goals:\n- Target duration:\n";
          }
        } else if (role === "frontend") {
          if (locale === "fr") {
            subject = "Renfort Régie - Senior Frontend & Design Engineer";
            message = "Bonjour,\n\nJe souhaite intégrer un Senior Frontend & Design Engineer pour concevoir des interfaces ultra-fluides, optimiser nos Core Web Vitals et structurer notre Design System.\n\nContexte & objectifs :\n- Framework / Stack (React / Next.js) :\n- Maquettes Figma prêtes (Oui / Non) :\n- Volume estimé :\n";
          } else {
            subject = "Staff Augmentation - Senior Frontend & Design Engineer";
            message = "Hello,\n\nI would like to onboard a Senior Frontend & Design Engineer to build high-performance interfaces, optimize Core Web Vitals, and build our Design System.\n\nContext & goals:\n- Framework / Stack (React / Next.js):\n- Figma mockups ready (Yes / No):\n- Estimated cadence:\n";
          }
        } else if (role === "backend") {
          if (locale === "fr") {
            subject = "Renfort Régie - Senior Backend & Cloud Architect";
            message = "Bonjour,\n\nJe recherche un Senior Backend & Cloud Architect pour refondre notre architecture de données, optimiser nos requêtes et sécuriser nos APIs critiques.\n\nContexte technique :\n- Base de données & Langages (PostgreSQL, Python, Node) :\n- Enjeux clés (Performance, Sécurité, Scaling) :\n- Durée souhaitée :\n";
          } else {
            subject = "Staff Augmentation - Senior Backend & Cloud Architect";
            message = "Hello,\n\nI am looking for a Senior Backend & Cloud Architect to optimize our relational data model, eliminate query bottlenecks, and harden API security.\n\nTechnical context:\n- Database & Languages (PostgreSQL, Python, Node):\n- Key challenges (Performance, Security, Scaling):\n- Target duration:\n";
          }
        } else if (role === "cto") {
          if (locale === "fr") {
            subject = "Accompagnement - Fractional CTO & Tech Lead d'Impact";
            message = "Bonjour,\n\nNous recherchons un Fractional CTO / Tech Lead expérimenté pour structurer notre architecture technique, auditer notre stack et accompagner nos choix stratégiques.\n\nContexte & enjeux clés :\n- Phase de l'entreprise (Amorçage, PME, Scaleup) :\n- Défis techniques prioritaires :\n- Rythme souhaité (1-2 jours / semaine) :\n";
          } else {
            subject = "Advisory - Fractional CTO & High-Impact Tech Lead";
            message = "Hello,\n\nWe are looking for an experienced Fractional CTO / Tech Lead to guide our architecture, audit our stack, and lead strategic technical decisions.\n\nContext & key challenges:\n- Company stage (Seed, SMB, Scaleup):\n- Priority challenges:\n- Desired cadence (1-2 days / week):\n";
          }
        } else if (role === "automation") {
          if (locale === "fr") {
            subject = "Mission Commando - Architecte Automatisation Métier & Agents IA";
            message = "Bonjour,\n\nJe souhaite déployer des pipelines d'automatisation et des agents IA sur-mesure pour supprimer nos tâches manuelles et connecter nos flux de données.\n\nProcessus métiers ciblés :\n- Outils à connecter (CRM, Stripe, ERP, N8N) :\n- Volume / Tâches répétitives actuelles :\n";
          } else {
            subject = "Commando Sprint - Business Automation & AI Agent Architect";
            message = "Hello,\n\nI would like to deploy custom automation workflows and AI agents to eliminate manual bottlenecks and connect our business data streams.\n\nTarget processes:\n- Tools to connect (CRM, Stripe, ERP, N8N):\n- Current manual volume / bottlenecks:\n";
          }
        } else {
          if (locale === "fr") {
            subject = "Demande d'information - Régie Développeur IA Augmenté";
            message = "Bonjour,\n\nJe souhaite échanger sur vos offres de régie et renfort d'équipe en ingénieurs augmentés par IA.\n\nNotre besoin :\n";
          } else {
            subject = "Inquiry - AI-Augmented Staff Augmentation";
            message = "Hello,\n\nI would like to learn more about your AI-augmented staff augmentation services.\n\nOur team's need:\n";
          }
        }
      } else if (source === "estimation" || source === "estimation_banner") {
        const estimateType = searchParams.get("type");
        const estimateScale = searchParams.get("scale");
        const estimateModules = searchParams.get("modules");
        const estimateRange = searchParams.get("range");
        const estimateDays = searchParams.get("days");

        const typeLabels: Record<string, string> = {
          saas: locale === "fr" ? "Application Web & SaaS" : "Custom Web App & SaaS",
          vitrine: locale === "fr" ? "Site Vitrine & Expérience de Marque" : "Flagship Website & Brand Experience",
          refonte: locale === "fr" ? "Migration & Modernisation Next.js" : "Next.js Migration & Modernization",
          automation: locale === "fr" ? "Pipeline d'Automatisation & Agents IA" : "Automation Pipeline & AI Agents",
        };
        const typeName = typeLabels[estimateType || ""] || (estimateType || (locale === "fr" ? "Projet Web & IA" : "Web & AI Project"));
        const rangeText = estimateRange ? `${estimateRange.replace("-", " € – ")} €` : "";
        const daysText = estimateDays ? `${estimateDays.replace("-", " à ")} jours ouvrés` : "";

        if (locale === "fr") {
          subject = `Cadrage Technique 15 min - ${typeName} ${rangeText ? `(${rangeText})` : ""}`.trim();
          message = `Bonjour,\n\nJ'ai simulé mon projet sur votre configurateur d'investissement :\n- Typologie : ${typeName}\n- Échelle visée : ${estimateScale || "Standard"}\n- Modules requis : ${estimateModules || "Standard"}\n- Enveloppe indicative : ${rangeText || "À affiner"}\n- Délai moyen estimé : ${daysText || "À affiner"}\n\nContexte de notre projet et objectifs :\n- Présentation en quelques lignes :\n- Date idéale de lancement :\n`;
        } else {
          subject = `15-Min Technical Scoping - ${typeName} ${rangeText ? `(${rangeText})` : ""}`.trim();
          message = `Hello,\n\nI have configured my project on your investment estimator:\n- Typology: ${typeName}\n- Scope & scale: ${estimateScale || "Standard"}\n- Required modules: ${estimateModules || "Standard"}\n- Estimated range: ${rangeText || "To be defined"}\n- Estimated timeline: ${daysText || "To be defined"}\n\nOur project context & goals:\n- Brief overview:\n- Target launch date:\n`;
        }
      } else if (source === "sprint-mvp") {
        if (locale === "fr") {
          subject = "Cadrage Technique - Sprint MVP 14 Jours (Livraison accélérée)";
          message = "Bonjour,\n\nJe souhaite démarrer un cadrage pour un Sprint MVP 14 Jours afin de lancer mon application web / SaaS (Next.js + Supabase + Stripe).\n\nVoici un aperçu de mon produit et de mes objectifs :\n";
        } else {
          subject = "Technical Scoping - 14-Day MVP Sprint (Accelerated Delivery)";
          message = "Hello,\n\nI would like to schedule a scoping session for a 14-Day MVP Sprint to build my web application / SaaS (Next.js + Supabase + Stripe).\n\nHere is an overview of my product and target timeline:\n";
        }
      } else if (source === "switch-wordpress") {
        if (locale === "fr") {
          subject = "Cadrage Technique - Switch WordPress vers Next.js (Délai garanti 5 jours)";
          message = "Bonjour,\n\nJe souhaite migrer mon site web actuel vers la stack Next.js haute performance pour éliminer les plugins lents et passer au standard < 0.5s.\n\nAdresse de mon site actuel :\n";
        } else {
          subject = "Technical Scoping - WordPress to Next.js Switch (5-Day Guaranteed)";
          message = "Hello,\n\nI want to migrate my current website to high-performance Next.js to eliminate sluggish plugins and get < 0.5s speed.\n\nCurrent website URL:\n";
        }
      } else if (locale === "fr") {
        subject = plan ? `Demande de projet - Plan ${planName}` : "Demande de devis et options";
        message = "Bonjour,\n\nJe souhaite obtenir une estimation détaillée pour un projet avec les caractéristiques suivantes :\n";
        if (plan) {
          message += `- Formule indicative : Plan ${planName}\n`;
        }
        if (selectedAddons.length > 0) {
          message += `- Options complémentaires : ${selectedAddons.join(", ")}\n`;
        }
        message += "\nMerci de me recontacter pour en discuter.";
      } else {
        subject = plan ? `Project Inquiry - ${planName} Plan` : "Project Inquiry with Add-ons";
        message = "Hello,\n\nI would like to get a detailed quote for a project with the following details:\n";
        if (plan) {
          message += `- Target plan: ${planName} Plan\n`;
        }
        if (selectedAddons.length > 0) {
          message += `- Add-ons: ${selectedAddons.join(", ")}\n`;
        }
        message += "\nPlease contact me to discuss this further.";
      }

      setFormData((prev) => ({
        ...prev,
        subject,
        message,
      }));
    }
  }, [searchParams, locale, tPricing]);

  const [submitError, setSubmitError] = useState(false);
  const formStarted = useRef(false);

  const handleFormStart = () => {
    if (!formStarted.current) {
      formStarted.current = captureLeadEvent('contact_form_started');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });

      if (!res.ok) throw new Error("Send failed");
      const result = await res.json();
      if (result.delivered === true) captureLeadEvent('contact_form_submitted');

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "", _trap: "" });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch {
      captureLeadEvent('contact_form_failed');
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-bold tracking-wide">
              <Mail className="w-3.5 h-3.5" />
              <span>{t("badge")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight">
              {t("headline")} <span className="shimmer-text">{t("headlineHighlight")}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t("subheadline")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Contact Info Column */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-bold text-white mb-6">{t("channels.title")}</h2>

              <div className="p-6 rounded-2xl bg-[#0d0d11]/60 border border-white/5 backdrop-blur-md shadow-2xl space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 shrink-0" aria-hidden="true">
                    <Mail className="w-5 h-5 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300">{t("channels.email.title")}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t("channels.email.desc")}</p>
                    <a href={`mailto:${contactEmail}`} className="text-xs font-bold text-brand-purple hover:underline mt-1.5 block">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 pt-6 border-t border-white/5">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 shrink-0" aria-hidden="true">
                    <Calendar className="w-5 h-5 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300">{t("channels.call.title")}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t("channels.call.desc")}</p>
                    <a
                      href="https://calendly.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-purple hover:underline mt-1.5 block"
                    >
                      {t("channels.call.cta")}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 pt-6 border-t border-white/5">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 shrink-0" aria-hidden="true">
                    <Clock className="w-5 h-5 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300">{t("channels.response.title")}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t("channels.response.desc")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-3 p-8 rounded-2xl bg-[#0d0d11]/60 border border-white/5 backdrop-blur-md shadow-2xl relative">
              {submitSuccess ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="text-base font-bold text-white">{t("form.successTitle")}</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">{t("form.successDesc")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} onChange={handleFormStart} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {t("form.name")}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#050505]/60 hover:bg-[#050505]/95 border border-white/5 rounded-lg px-4 py-3 text-xs text-slate-200 focus:outline-none focus-visible:border-brand-purple focus-visible:ring-1 focus-visible:ring-brand-purple/30 transition-all placeholder:text-slate-500"
                        placeholder={t("form.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {t("form.email")}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#050505]/60 hover:bg-[#050505]/95 border border-white/5 rounded-lg px-4 py-3 text-xs text-slate-200 focus:outline-none focus-visible:border-brand-purple focus-visible:ring-1 focus-visible:ring-brand-purple/30 transition-all placeholder:text-slate-500"
                        placeholder={t("form.emailPlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {t("form.subject")}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#050505]/60 hover:bg-[#050505]/95 border border-white/5 rounded-lg px-4 py-3 text-xs text-slate-200 focus:outline-none focus-visible:border-brand-purple focus-visible:ring-1 focus-visible:ring-brand-purple/30 transition-all placeholder:text-slate-500"
                      placeholder={t("form.subjectPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {t("form.message")}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#050505]/60 hover:bg-[#050505]/95 border border-white/5 rounded-lg px-4 py-3 text-xs text-slate-200 focus:outline-none focus-visible:border-brand-purple focus-visible:ring-1 focus-visible:ring-brand-purple/30 transition-all placeholder:text-slate-500 resize-none"
                      placeholder={t("form.messagePlaceholder")}
                    />
                  </div>

                  {submitError && (
                    <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{t("form.errorDesc")}</span>
                    </div>
                  )}

                  {/* Honeypot — hidden from humans, filled by bots */}
                  <input
                    type="text"
                    name="_trap"
                    value={formData._trap}
                    onChange={(e) => setFormData({ ...formData, _trap: e.target.value })}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-2.5 px-5 rounded-lg text-xs font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer border border-brand-purple/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
                  >
                    {isSubmitting ? (
                      <span>{t("form.sending")}</span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>{t("form.submit")}</span>
                        <Send className="w-3.5 h-3.5 animate-pulse" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

