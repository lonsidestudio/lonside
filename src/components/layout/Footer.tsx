"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const pathname = usePathname();
  const isHome = pathname === "/";

  const getSectionHref = (id: string) => {
    return isHome ? `#${id}` : (locale === "en" ? `/en#${id}` : `/#${id}`);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-black/[0.08] pt-16 pb-12 text-zinc-600">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  if (window.location.hash) {
                    window.history.pushState(null, "", window.location.pathname);
                  }
                }
              }}
              className="text-base font-semibold tracking-[0.25em] text-black uppercase block hover:text-zinc-600 transition-colors cursor-pointer"
            >
              LONSIDE
            </Link>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm leading-relaxed font-normal">
              {t("tagline")}
            </p>
            <p className="text-[11px] font-mono text-zinc-500">
              {t("headquartersLine", {
                locality: siteConfig.legal.addressLocality,
                postalCode: siteConfig.legal.postalCode,
                siret: siteConfig.legal.siret,
              })}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-black font-semibold">
              {t("navigation")}
            </p>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <Link href="/portfolio" className="hover:text-black transition-colors py-1 inline-block">
                  {t("projects")}
                </Link>
              </li>
              <li>
                <Link href="/methode" className="hover:text-black transition-colors py-1 inline-block">
                  {t("method")}
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-black transition-colors py-1 inline-block">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/estimation" className="hover:text-black transition-colors py-1 inline-block">
                  {t("estimator")}
                </Link>
              </li>
              <li>
                <a href={getSectionHref("tarifs")} className="hover:text-black transition-colors py-1 inline-block">
                  {t("pricing")}
                </a>
              </li>
              <li>
                <a href={getSectionHref("faq")} className="hover:text-black transition-colors py-1 inline-block">
                  {t("faq")}
                </a>
              </li>
              <li>
                <a href={getSectionHref("contact")} className="hover:text-black transition-colors py-1 inline-block">
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Expertises SEO */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-black font-semibold">
              {t("capabilities")}
            </p>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <Link href="/services/sprint-mvp-14-jours" className="hover:text-black transition-colors py-1 inline-block">
                  {t("mvpSprint")}
                </Link>
              </li>
              <li>
                <Link href="/services/application-web-nextjs" className="hover:text-black transition-colors py-1 inline-block">
                  {t("nextjsApps")}
                </Link>
              </li>
              <li>
                <Link href="/services/plateforme-saas-sur-mesure" className="hover:text-black transition-colors py-1 inline-block">
                  {t("saasPlatforms")}
                </Link>
              </li>
              <li>
                <Link href="/services/regie-tech-senior" className="hover:text-black transition-colors py-1 inline-block">
                  {t("seniorSquad")}
                </Link>
              </li>
              <li>
                <Link href="/services/boutique-shopify-sur-mesure" className="hover:text-black transition-colors py-1 inline-block">
                  {t("shopifyStores")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct contact */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-black font-semibold">
              {t("directAccess")}
            </p>
            <p className="text-xs font-mono text-black font-semibold">{siteConfig.contactEmail}</p>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              {t("responseDelay")}
            </p>
            <div className="pt-1 flex items-center space-x-3 text-zinc-500">
              {siteConfig.githubUrl && (
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors p-1"
                  aria-label={t("socialAria.github")}
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              )}
              {siteConfig.linkedinUrl && (
                <a
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors p-1"
                  aria-label={t("socialAria.linkedin")}
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                </a>
              )}
              {siteConfig.twitterUrl && (
                <a
                  href={siteConfig.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors p-1"
                  aria-label={t("socialAria.twitter")}
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {siteConfig.youtubeUrl && (
                <a
                  href={siteConfig.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors p-1"
                  aria-label={t("socialAria.youtube")}
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="hover:text-black transition-colors p-1"
                aria-label={t("socialAria.email")}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal bottom */}
        <div className="border-t border-black/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <p>© {currentYear} LONSIDE STUDIO.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/legal/mentions-legales" className="hover:text-black transition-colors py-2 min-h-[44px] inline-flex items-center whitespace-nowrap">
              {t("legalNotice")}
            </Link>
            <Link href="/legal/politique-confidentialite" className="hover:text-black transition-colors py-2 min-h-[44px] inline-flex items-center whitespace-nowrap">
              {t("privacyPolicy")}
            </Link>
            <Link href="/legal/cgv" className="hover:text-black transition-colors py-2 min-h-[44px] inline-flex items-center whitespace-nowrap">
              {t("termsOfService")}
            </Link>
            <Link href="/legal/cookies" className="hover:text-black transition-colors py-2 min-h-[44px] inline-flex items-center whitespace-nowrap">
              {t("cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
