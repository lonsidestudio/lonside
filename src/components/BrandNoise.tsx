import React from 'react';

/**
 * BrandNoise
 * Grain argentique tactile haute-couture adapté au canvas blanc immaculé (mix-blend-multiply).
 * Apporte la vibration de la matière photographique sans jamais altérer la lisibilité.
 */
export default function BrandNoise() {
  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none fixed inset-0 z-50 opacity-[0.03] select-none"
      style={{
        contain: 'strict',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
