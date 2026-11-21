'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  isEn: boolean;
}

/**
 * Lecteur façade YouTube (youtube-nocookie.com) :
 * 0 octet de scripts YouTube chargé au rendu initial (zéro impact LCP/CWV),
 * l'iframe n'est montée qu'après un clic explicite du visiteur.
 */
export default function YouTubeFacade({ videoId, title, isEn }: YouTubeFacadeProps) {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-black/[0.1] bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={isEn ? `Play video: ${title}` : `Lancer la vidéo : ${title}`}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-black/[0.1] bg-zinc-950 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`}
        alt={title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.01] transition-all duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-5 sm:p-8">
        <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-xl bg-black/70 border border-white/15 text-[10px] font-mono uppercase tracking-[0.18em] text-white">
          {isEn ? 'YouTube Product Walkthrough' : 'Démo Produit YouTube'}
        </span>
        <div className="flex items-end justify-between gap-4">
          <p className="font-display uppercase text-lg sm:text-2xl text-white tracking-tight max-w-xl">
            {title}
          </p>
          <span className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </span>
        </div>
      </div>
    </button>
  );
}
