import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter, Geist_Mono, Antonio } from 'next/font/google';
import { ArrowLeft, Terminal } from 'lucide-react';
import './globals.css';

const inter = Inter({ variable: '--font-sans', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' });
const antonio = Antonio({ variable: '--font-display', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Page introuvable — Lonside Studio',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.variable} ${geistMono.variable} ${antonio.variable} font-sans bg-[#ffffff] text-[#000000] antialiased min-h-screen flex flex-col`}>
        <div className="relative min-h-screen bg-white text-black flex items-center justify-center overflow-hidden p-6">
          <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-md w-full">
            <div className="p-4 rounded-xl border border-black/[0.08] bg-zinc-50 text-black">
              <Terminal className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="font-display uppercase text-7xl sm:text-8xl text-black font-normal tracking-tight select-none">
                404
              </p>
              <h1 className="font-display uppercase text-xl sm:text-2xl font-normal text-black tracking-tight">
                Page introuvable / Page not found
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-xs mx-auto">
                Cette route n&apos;existe pas / This route does not exist.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-xs font-mono uppercase tracking-[0.14em] text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-none min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l&apos;accueil / Back to home</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
