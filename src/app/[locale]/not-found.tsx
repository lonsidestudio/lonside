import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white text-black flex items-center justify-center overflow-hidden p-6">
      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-md w-full">

        {/* Icon */}
        <div className="p-4 rounded-xl border border-black/[0.08] bg-zinc-50 text-black">
          <Terminal className="w-8 h-8" />
        </div>

        {/* 404 */}
        <div className="space-y-2">
          <p className="font-display uppercase text-7xl sm:text-8xl text-black font-normal tracking-tight select-none">
            404
          </p>
          <h1 className="font-display uppercase text-xl sm:text-2xl font-normal text-black tracking-tight">
            Page introuvable
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xs mx-auto">
            Cette route n&apos;existe pas dans notre architecture.
          </p>
        </div>

        {/* Terminal block */}
        <div className="w-full rounded-xl p-4 text-left border border-black/[0.08] bg-zinc-50/70 font-mono text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="ml-2 text-zinc-400 text-[10px] uppercase tracking-wider">status // error</span>
          </div>
          <p className="text-zinc-700">
            <span className="text-black font-bold">$ </span>
            <span className="font-semibold text-black">GET</span>
            <span className="text-zinc-500"> /requested-route</span>
          </p>
          <p className="text-zinc-500">
            <span>→ 404 Not Found (Segment inexistant)</span>
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-xs font-mono uppercase tracking-[0.14em] text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-none min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l&apos;accueil</span>
        </Link>

      </div>
    </div>
  );
}
