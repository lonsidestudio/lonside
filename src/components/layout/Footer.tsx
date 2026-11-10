"use client";

import { useLocale } from "next-intl";
import { Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const locale = useLocale();
  const isEn = locale === "en";

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000000] border-t border-white/10 pt-16 pb-12 text-[#a1a1aa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Marque & Positionnement */}
          <div className="space-y-4 md:col-span-2">
            <span className="text-xl font-black tracking-[0.25em] text-white uppercase">
              LONSIDE
            </span>
            <p className="text-xs text-[#71717a] max-w-sm leading-relaxed">
              {isEn
                ? "High-Velocity Digital Engineering Studio. Fixed-scope 14 & 30-day sprints, 100% intellectual property transfer, zero technical debt."
                : "Studio d'Ingénierie Digitale Haute Vélocité. Sprints fermes de 14 et 30 jours, 100% de cession de propriété intellectuelle, zéro dette technique."}
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-[11px] font-mono text-white tracking-wider uppercase">
                {isEn ? "Open for Q2/Q3 Sprints" : "Disponibilité Sprints T2/T3"}
              </span>
            </div>
          </div>

          {/* Navigation Rapide */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-white">
              {isEn ? "Navigation" : "Navigation"}
            </p>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a href="#projets" className="hover:text-white transition-colors">
                  {isEn ? "• Case Studies" : "• Études de cas"}
                </a>
              </li>
              <li>
                <a href="#methode" className="hover:text-white transition-colors">
                  {isEn ? "• Studio Method" : "• Méthode Studio"}
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-white transition-colors">
                  {isEn ? "• Sprint Packages" : "• Formules Sprints"}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  {isEn ? "• Direct F.A.Q." : "• F.A.Q. Directe"}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  {isEn ? "• Direct Scoping" : "• Cadrage Direct"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-white">
              {isEn ? "Direct Access" : "Accès Direct"}
            </p>
            <p className="text-xs font-mono text-white">contact@lonside.ai</p>
            <p className="text-xs text-[#71717a] leading-relaxed">
              {isEn
                ? "Senior lead architect response under 24 hours."
                : "Réponse directe par un lead architecte sous 24h ouvrées."}
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[#71717a]">
              <a
                href="https://github.com/KevinTSAGUE"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-white/20 transition-all"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-white/20 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.66.72-1.66 1.66s.71 1.66 1.66 1.66 1.66-.72 1.66-1.66-.71-1.66-1.66-1.66z" />
                </svg>
              </a>
              <a
                href="mailto:contact@lonside.ai"
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-white/20 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Pied de page légal */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#71717a]">
          <p>© {currentYear} LONSIDE STUDIO. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={`/${locale}/legal/mentions-legales`} className="hover:text-white transition-colors">
              Mentions Légales
            </a>
            <span>/</span>
            <a href={`/${locale}/legal/politique-confidentialite`} className="hover:text-white transition-colors">
              Confidentialité
            </a>
            <span>/</span>
            <a href={`/${locale}/legal/cgv`} className="hover:text-white transition-colors">
              CGV
            </a>
            <span>/</span>
            <a href={`/${locale}/legal/cookies`} className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
