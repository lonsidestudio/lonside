"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const isEn = locale === "en";
  const isHome = pathname === "/";

  const getSectionHref = (id: string) => {
    const hash = id.startsWith("#") ? id.slice(1) : id;
    if (isHome) {
      return `#${hash}`;
    }
    return locale === "en" ? `/en#${hash}` : `/#${hash}`;
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.pushState(null, "", window.location.pathname);
      }
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cycle de vie animé pour l'ouverture et fermeture du menu mobile
  useEffect(() => {
    if (isMobileOpen) {
      setMounted(true);
      const frame1 = requestAnimationFrame(() => {
        const frame2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(frame2);
      });
      return () => cancelAnimationFrame(frame1);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMobileOpen]);

  // Verrouillage du scroll et gestion de la touche Échap
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted]);

  const navLinks = [
    { label: isEn ? "Work" : "Projets", id: "projets" },
    { label: isEn ? "Method" : "Méthode", id: "methode" },
    { label: isEn ? "Pricing" : "Tarifs", id: "tarifs" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-black/[0.08] py-3 sm:py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            : "bg-transparent border-b border-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo Minimaliste Haute Couture */}
          <Link
            href="/"
            onClick={handleLogoClick}
            aria-label="Lonside Studio"
            className="flex items-center group py-2 cursor-pointer"
          >
            <span className="font-display text-lg sm:text-xl tracking-[0.24em] text-black uppercase group-hover:text-zinc-600 transition-colors">
              LONSIDE
            </span>
          </Link>

          {/* Navigation Centrale Épurée Desktop */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={getSectionHref(link.id)}
                className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500 hover:text-black transition-colors duration-150 py-2 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            <LocaleSwitcher />
            <a
              href={getSectionHref("contact")}
              className="inline-flex items-center px-6 py-2.5 rounded-xl bg-black text-white text-xs font-mono uppercase tracking-[0.16em] hover:bg-zinc-800 transition-all cursor-pointer min-h-[40px] whitespace-nowrap"
            >
              <span>{isEn ? "Start a project" : "Démarrer un projet"}</span>
            </a>
          </div>

          {/* Navigation Mobile Actions */}
          <div className="flex md:hidden items-center space-x-1">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-zinc-800 hover:text-black transition-colors cursor-pointer"
              aria-label={isMobileOpen ? (isEn ? "Close menu" : "Fermer le menu") : (isEn ? "Open menu" : "Ouvrir le menu")}
              aria-expanded={isMobileOpen}
            >
              <div className="relative w-5 h-3.5 flex flex-col justify-between" aria-hidden="true">
                <span
                  className={`block h-[1.5px] w-full bg-black rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                    isMobileOpen ? "rotate-45 translate-y-[6px]" : ""
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full bg-black rounded-full transition-all duration-200 ease-out ${
                    isMobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full bg-black rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                    isMobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Rideau Mobile Aéré Fond Blanc avec animation d'ouverture et fermeture */}
      {mounted && (
        <div
          className={`fixed inset-0 z-40 bg-white flex flex-col justify-between p-6 sm:p-8 pt-24 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <nav
            className={`flex flex-col space-y-5 pt-4 transition-all duration-300 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400 mb-1">
              {isEn ? "NAVIGATION" : "NAVIGATION"}
            </div>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={getSectionHref(link.id)}
                onClick={() => setIsMobileOpen(false)}
                className="font-display uppercase text-2xl sm:text-3xl text-black hover:text-zinc-600 transition-colors tracking-tight whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className={`pt-6 border-t border-black/[0.08] space-y-4 transition-all duration-300 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href={getSectionHref("contact")}
              onClick={() => setIsMobileOpen(false)}
              className="w-full flex items-center justify-center py-4 rounded-xl bg-black text-white font-mono text-xs uppercase tracking-[0.18em] min-h-[48px] whitespace-nowrap hover:bg-zinc-800 transition-colors"
            >
              <span>{isEn ? "Start a project (15 min)" : "Démarrer un projet (15 min)"}</span>
            </a>
            <p className="text-center text-[11px] font-mono text-zinc-400">
              © {new Date().getFullYear()} LONSIDE STUDIO
            </p>
          </div>
        </div>
      )}
    </>
  );
}
