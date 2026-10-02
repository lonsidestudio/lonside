import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <p className="text-6xl font-mono font-bold text-[#7c3aed]">404</p>
        <h1 className="text-xl font-bold">Page introuvable</h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-xs font-semibold text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
