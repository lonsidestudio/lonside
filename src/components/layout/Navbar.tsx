"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const alternate = locale === "fr" ? "en" : "fr";
  const label = alternate === "fr" ? "Passer en français" : "Switch to English";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname as never, { locale: alternate })}
      className="text-[11px] font-mono font-medium text-[#a1a1aa] hover:text-white border border-white/10 hover:border-white/25 px-2.5 py-1 rounded transition-colors cursor-pointer"
      aria-label={label}
    >
      {alternate.toUpperCase()}
    </button>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const locale = useLocale();
  const isEn = locale === "en";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: isEn ? "Work" : "Projets", href: "#projets" },
    { label: isEn ? "Method" : "Méthode", href: "#methode" },
    { label: isEn ? "Pricing" : "Tarifs", href: "#tarifs" },
    { label: isEn ? "F.A.Q." : "F.A.Q.", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-black/85 backdrop-blur-md border-b border-white/10"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Studio */}
          <a
            href="/"
            aria-label="Lonside Studio"
            className="flex items-center space-x-3 group"
          >
            <span className="text-base sm:text-lg font-black tracking-[0.25em] text-white uppercase group-hover:text-slate-300 transition-colors">
              LONSIDE
            </span>
            <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider text-[#a1a1aa] uppercase">
                {isEn ? "Studio Active" : "Studio Disponible"}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions : Locale & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <LocaleSwitcher />
            <a
              href="#contact"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer shadow-sm"
            >
              <span>{isEn ? "Launch Sprint" : "Lancer un sprint"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <LocaleSwitcher />
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-black/95 backdrop-blur-xl px-6 py-6 space-y-5 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-sm font-mono uppercase tracking-widest text-slate-300 hover:text-white py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10">
            <a
              href="#contact"
              onClick={() => setIsMobileOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider"
            >
              <span>{isEn ? "Launch Sprint" : "Lancer un sprint"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
