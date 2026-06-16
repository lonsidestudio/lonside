"use client";

import React, { useState, useEffect } from "react";
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

    if (plan || addonsStr) {
      // Find translated names
      const rawTiers = tPricing.raw("tiers") as { id: string; name: string }[];
      const rawAddons = tPricing.raw("addons") as { id: string; name: string }[];

      const planName = rawTiers.find((p) => p.id === plan)?.name || (plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "");
      
      const selectedAddons = addonsStr
        ? addonsStr.split(",").map((id) => rawAddons.find((a) => a.id === id)?.name || id)
        : [];

      let subject = "";
      let message = "";

      if (locale === "fr") {
        subject = plan ? `Demande de projet - Plan ${planName}` : "Demande de devis et options";
        message = "Bonjour,\n\nJe souhaite obtenir un devis pour un projet avec les caractéristiques suivantes :\n";
        if (plan) {
          message += `- Formule : Plan ${planName}\n`;
        }
        if (selectedAddons.length > 0) {
          message += `- Options complémentaires : ${selectedAddons.join(", ")}\n`;
        }
        message += "\nMerci de me recontacter pour en discuter.";
      } else {
        subject = plan ? `Project Inquiry - ${planName} Plan` : "Project Inquiry with Add-ons";
        message = "Hello,\n\nI would like to get a quote for a project with the following details:\n";
        if (plan) {
          message += `- Plan: ${planName} Plan\n`;
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

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "", _trap: "" });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch {
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
            <div className="lg:col-span-3 p-8 rounded-2xl bg-[#0d0d11]/60 border border-white/5 backdrop-blur-md shadow-2xl hover:border-brand-purple/20 transition-all duration-500 relative">
              {submitSuccess ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="text-base font-bold text-white">{t("form.successTitle")}</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">{t("form.successDesc")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full flex items-center justify-center py-3.5 px-6 rounded-lg text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer border border-brand-purple/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
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
