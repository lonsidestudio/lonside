import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-[#0d0d11] border border-white/5">
            <Terminal className="w-8 h-8 text-brand-purple" />
          </div>
        </div>
        <div>
          <div className="text-6xl font-mono font-bold text-brand-purple mb-2">404</div>
          <h1 className="text-xl font-bold text-white mb-2">Page introuvable</h1>
          <p className="text-sm text-slate-400">Cette route n'existe pas dans notre architecture.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple hover:bg-brand-purple-hover text-sm font-bold text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
