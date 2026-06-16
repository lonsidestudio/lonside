"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import {
  Terminal,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Layout,
  Database,
  Cpu,
} from "lucide-react";

const MOBILE_MENU_ID = "mobile-nav-menu";

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const alternate = locale === "fr" ? "en" : "fr";
  const label = alternate === "fr" ? "Passer en français" : "Switch to English";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname as any, { locale: alternate })}
      className="text-[10px] font-bold font-mono text-slate-400 hover:text-brand-purple border border-white/10 hover:border-brand-purple/30 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
      aria-label={label}
    >
      {alternate.toUpperCase()}
    </button>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname() as string;
  const t = useTranslations("nav");
  const ts = useTranslations("services");
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change (SPA navigation)
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isDropdownOpen]);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // startsWith is more reliable than endsWith for active detection
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = [
    { name: t("methode"), href: "/methode" },
    { name: t("portfolio"), href: "/portfolio" },
    { name: t("tarifs"), href: "/tarifs" },
    { name: t("blog"), href: "/blog" },
    { name: t("aPropos"), href: "/a-propos" },
  ] as const;

  const services = [
    {
      name: ts("items.vitrine.name"),
      href: "/services/site-vitrine",
      desc: ts("items.vitrine.desc"),
      icon: <Layout className="w-4 h-4 text-brand-purple" aria-hidden="true" />,
    },
    {
      name: ts("items.app.name"),
      href: "/services/application-web",
      desc: ts("items.app.desc"),
      icon: <Database className="w-4 h-4 text-brand-purple" aria-hidden="true" />,
    },
    {
      name: ts("items.auto.name"),
      href: "/services/automatisation",
      desc: ts("items.auto.desc"),
      icon: <Cpu className="w-4 h-4 text-brand-purple" aria-hidden="true" />,
    },
    {
      name: ts("items.design.name"),
      href: "/services/design",
      desc: ts("items.design.desc"),
      icon: <Sparkles className="w-4 h-4 text-brand-purple" aria-hidden="true" />,
    },
  ] as const;

  return (
    <>
      {/* ── Main nav bar ── */}
      <nav
        id="navbar"
        aria-label="Navigation principale"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-[#050505]/95 backdrop-blur-md border-b border-white/8 shadow-lg"
            : "py-5 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link
              href="/"
              aria-label="Lonside — Accueil"
              className="flex items-center gap-2 group shrink-0"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 p-[1px] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all duration-300">
                <div className="flex items-center justify-center w-full h-full rounded-lg bg-[#050505] border border-white/5">
                  <Terminal
                    className="w-[18px] h-[18px] text-brand-purple group-hover:text-white transition-colors duration-300"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                lonside<span className="text-brand-purple">.</span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <ul
              className="hidden md:flex items-center gap-0.5 flex-1 justify-center"
              role="menubar"
              aria-label="Menu principal"
            >
              {/* Services dropdown trigger */}
              <li
                ref={dropdownRef}
                className="relative"
                role="none"
              >
                <button
                  type="button"
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                  aria-controls="services-dropdown"
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  onKeyDown={(e) => e.key === "Escape" && setIsDropdownOpen(false)}
                  className={`text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 ${
                    isDropdownOpen || isActive("/services")
                      ? "text-white bg-white/5"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{t("servicesLabel")}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown panel — positioned relative to the <li> */}
                {isDropdownOpen && (
                  <div
                    id="services-dropdown"
                    role="menu"
                    aria-label={t("solutions")}
                    className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[560px] p-5 bg-[#0d0d11]/98 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <p className="text-[10px] font-bold text-slate-500 tracking-widest font-mono uppercase mb-4">
                      {t("solutions")}
                    </p>
                    <ul className="grid grid-cols-2 gap-2" role="none">
                      {services.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            role="menuitem"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 group transition-colors"
                          >
                            <div className="p-1.5 bg-slate-900 border border-white/5 rounded-lg shrink-0 group-hover:border-brand-purple/20 transition-colors">
                              {s.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-brand-purple transition-colors">
                                {s.name}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                                {s.desc}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <Link
                        href="/services"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-purple hover:text-white transition-colors"
                      >
                        {t("allServices") || "Voir tous les services"}
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              {navLinks.map((link) => (
                <li key={link.href} role="none">
                  <Link
                    href={link.href}
                    role="menuitem"
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`text-sm font-semibold transition-all duration-200 py-1.5 px-3 rounded-lg block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 ${
                      isActive(link.href)
                        ? "text-white bg-white/5"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop right: locale switcher + CTA */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <LocaleSwitcher />
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide text-white bg-brand-purple hover:bg-brand-purple-hover rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] group"
              >
                <span>{t("cta")}</span>
                <ArrowRight
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Mobile: locale switcher + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <LocaleSwitcher />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls={MOBILE_MENU_ID}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile overlay (outside <nav> for correct stacking) ── */}
      <div
        aria-hidden="true"
        onClick={closeMobileMenu}
        className={`md:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Mobile drawer (z-[70] > overlay z-[60] > nav z-50) ── */}
      <aside
        id={MOBILE_MENU_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className={`md:hidden fixed inset-y-0 right-0 z-[70] flex flex-col w-[min(420px,100vw)] bg-[#0a0a0e] border-l border-white/8 shadow-2xl transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 shrink-0">
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-label="Lonside — Accueil"
            className="flex items-center gap-2"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 border border-white/5">
              <Terminal className="w-4 h-4 text-brand-purple" aria-hidden="true" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              lonside<span className="text-brand-purple">.</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Fermer le menu"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable nav content */}
        <nav
          aria-label="Menu mobile"
          className="flex-1 overflow-y-auto overscroll-contain py-6 px-5 space-y-7"
        >
          {/* Services group with icons */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-3 px-1">
              {t("solutions")}
            </p>
            <ul className="space-y-0.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive(s.href) ? "page" : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-semibold ${
                      isActive(s.href)
                        ? "bg-white/5 text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 shrink-0">
                      {s.icon}
                    </div>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Main links group */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-3 px-1">
              {t("navigation") || "Navigation"}
            </p>
            <ul className="space-y-0.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                      isActive(link.href)
                        ? "bg-white/5 text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* CTA footer */}
        <div className="px-5 py-4 border-t border-white/5 shrink-0">
          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-hover transition-all duration-200 shadow-lg shadow-purple-500/10"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </>
  );
}
