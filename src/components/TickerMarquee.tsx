"use client";

import React from "react";

interface TickerMarqueeProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  "STUDIO D'INGÉNIERIE HAUTE VÉLOCITÉ",
  "SPRINTS FERMES 14 & 30 JOURS",
  "100% CESSION PROPRIÉTÉ INTELLECTUELLE",
  "STACK NEXT.JS 16 & TYPESCRIPT STRICT",
  "ZERO DETTE TECHNIQUE",
  "RÉGIE IMMERSION SQUAD",
  "ARCHITECTURE VECTORISÉE & SUPABASE",
  "SLA & GARANTIE CORRECTIVE 30 JOURS",
];

export default function TickerMarquee({ items = DEFAULT_ITEMS }: TickerMarqueeProps) {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden border-y border-white/10 bg-[#000000] py-3.5 select-none"
    >
      <div className="flex w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
        {repeated.map((text, idx) => (
          <div key={idx} className="flex items-center space-x-6 mx-4">
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#a1a1aa] uppercase whitespace-nowrap hover:text-white transition-colors duration-200">
              {text}
            </span>
            <span className="text-white/20 text-xs font-mono">•</span>
          </div>
        ))}
      </div>
      {/* Gradients latéraux d'atténuation */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#000000] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#000000] to-transparent" />
    </div>
  );
}

