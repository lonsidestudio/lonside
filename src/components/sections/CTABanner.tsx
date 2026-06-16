"use client";

import { Link } from "@/lib/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";

interface CTABannerProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTABanner({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTABannerProps) {
  const { ref, inView } = useInView(0.15);

  return (
    <div
      ref={ref}
      className="mt-20 p-8 rounded-2xl bg-[#0d0d11] border border-white/5 text-center max-w-4xl mx-auto space-y-6 cursor-default"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">{description}</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href={primaryHref}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-purple hover:bg-brand-purple-hover text-xs font-bold text-white rounded-lg hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 transition-all duration-200"
        >
          <span>{primaryLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white/10 hover:border-brand-purple/30 hover:text-white text-xs font-bold text-slate-300 rounded-lg transition-all duration-200"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
