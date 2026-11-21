"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { captureLeadEvent } from "@/lib/posthog";

const LANGUAGES = [
  { code: "fr", label: "Français", short: "FR" },
  { code: "en", label: "English", short: "EN" },
] as const;

export default function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("localeSwitcher");
  const pathname = usePathname();
  const params = useParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];
  const slug = typeof params?.slug === "string" ? params.slug : undefined;
  const linkHref = (
    pathname === "/portfolio/[slug]" && slug
      ? { pathname: "/portfolio/[slug]" as const, params: { slug } }
      : pathname
  ) as Parameters<typeof Link>[0]["href"];

  // Fermeture au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: "fr" | "en") => {
    if (code !== locale) {
      captureLeadEvent("locale_switched", { from: locale, to: code });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bouton déclencheur avec courbure rounded-xl et chevron */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t("ariaLabel", { language: activeLang.label })}
        className="px-3 py-1.5 rounded-xl border border-black/[0.08] hover:border-black/30 bg-zinc-50/80 hover:bg-zinc-100 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer min-h-[44px] text-xs font-mono font-medium text-black select-none outline-none focus:outline-none focus:ring-0"
      >
        <span className="font-semibold tracking-wide">{activeLang.short}</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-zinc-600 shrink-0 transition-transform" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-600 shrink-0 transition-transform" />
        )}
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 w-36 rounded-xl bg-white border border-black/[0.08] shadow-[0_12px_36px_-6px_rgba(0,0,0,0.14)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
        >
          {LANGUAGES.map((lang) => {
            const isCurrent = lang.code === locale;
            return (
              <Link
                key={lang.code}
                href={linkHref}
                locale={lang.code}
                role="menuitem"
                onClick={() => handleSelect(lang.code)}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-mono flex items-center justify-between transition-colors cursor-pointer outline-none focus:outline-none min-h-[44px] ${
                  isCurrent
                    ? "font-semibold text-black bg-zinc-50"
                    : "font-normal text-zinc-600 hover:text-black hover:bg-zinc-50/60"
                }`}
              >
                <span>{lang.label}</span>
                {isCurrent && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

