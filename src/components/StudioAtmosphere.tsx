'use client';

import React, { useEffect, useState } from "react";

/**
 * StudioAtmosphere
 * Fond architectural vivant (style WheelOfWork) :
 * - Vidéo cinématique monochrome chargée uniquement sur desktop après hydratation
 *   (0 octet téléchargé sur mobile et zéro impact sur le LCP / Core Web Vitals)
 * - Grille géométrique suisse ultra-fine (hairline grid)
 * - Repères de cadrage d'ingénierie (+)
 */
export default function StudioAtmosphere() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDesktop || prefersReducedMotion) return;

    const timer = window.setTimeout(() => setShouldLoadVideo(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
      {/* Vidéo Cinématique Monochrome en Arrière-Plan (Desktop uniquement, post-LCP) */}
      {shouldLoadVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-[0.06] mix-blend-multiply filter contrast-125 grayscale select-none"
        >
          <source src="/videos/hero-ambient.mp4" type="video/mp4" />
        </video>
      )}

      {/* Onde zénithale douce */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_70%)] animate-pulse-slow" />

      {/* Trame géométrique d'atelier suisse (hairline grid) */}
      <div className="absolute inset-0 hairline-grid opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_65%,transparent_100%)]" />

      {/* Repères d'ingénierie d'atelier (+) aux extrémités */}
      <div className="hidden lg:block absolute top-28 left-8 text-black/25 font-mono text-xs select-none">
        +
      </div>
      <div className="hidden lg:block absolute top-28 right-8 text-black/25 font-mono text-xs select-none">
        +
      </div>
      <div className="hidden lg:block absolute top-[50%] left-8 text-black/20 font-mono text-xs select-none">
        +
      </div>
      <div className="hidden lg:block absolute top-[50%] right-8 text-black/20 font-mono text-xs select-none">
        +
      </div>

      {/* Vignetage de transition douce vers le fond blanc */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
    </div>
  );
}
