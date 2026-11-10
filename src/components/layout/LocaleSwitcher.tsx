"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

const LANGUAGES = [
  { code: "fr", label: "Français", short: "FR" },
  { code: "en", label: "English", short: "EN" },
] as const;

export default function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

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
      router.replace(pathname as never, { locale: code });
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
        aria-label={`Langue actuelle : ${activeLang.label}. Cliquez pour changer.`}
        className="px-3 py-1.5 rounded-xl border border-black/[0.08] hover:border-black/30 bg-zinc-50/80 hover:bg-zinc-100 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer min-h-[38px] text-xs font-mono font-medium text-black select-none outline-none focus:outline-none focus:ring-0"
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
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(lang.code)}
                className={`w-full px-3.5 py-2 text-left text-xs font-mono flex items-center justify-between transition-colors cursor-pointer outline-none focus:outline-none ${
                  isCurrent
                    ? "font-semibold text-black bg-zinc-50"
                    : "font-normal text-zinc-600 hover:text-black hover:bg-zinc-50/60"
                }`}
              >
                <span>{lang.label}</span>
                {isCurrent && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

