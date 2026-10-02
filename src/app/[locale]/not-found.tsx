import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#fafafa] flex items-center justify-center overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 glow-radial-purple" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-10 max-w-lg px-6">

        {/* Floating icon */}
        <div className="animate-float">
          <div className="p-5 rounded-2xl glass-panel shadow-[0_0_40px_rgba(124,58,237,0.2)]">
            <Terminal className="w-10 h-10 text-brand-purple" />
          </div>
        </div>

        {/* 404 */}
        <div className="space-y-3">
          <p className="text-[7rem] leading-none font-mono font-bold shimmer-text select-none">
            404
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Page introuvable
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Cette route n'existe pas dans notre architecture.
          </p>
        </div>

        {/* Terminal block */}
        <div className="w-full glass-panel rounded-xl p-4 text-left border border-white/5 font-mono text-xs space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-slate-500 text-[10px]">terminal</span>
          </div>
          <p>
            <span className="text-brand-purple">$ </span>
            <span className="text-slate-300">GET</span>
            <span className="text-slate-400"> /this/page</span>
          </p>
          <p>
            <span className="text-red-400">✗ </span>
            <span className="text-slate-400">Error: 404 Not Found</span>
          </p>
          <p className="text-slate-600">
            {'  '}→ Route does not match any known segment
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-xs font-semibold text-white rounded-lg transition-all duration-200 shadow-[0_0_18px_rgba(124,58,237,0.3)] hover:shadow-[0_0_24px_rgba(124,58,237,0.5)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à l&apos;accueil
        </Link>

      </div>
    </div>
  );
}
