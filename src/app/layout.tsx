import type { ReactNode } from 'react';
import { Inter, Geist_Mono, Antonio } from 'next/font/google';
import ConsentAnalytics from '@/components/layout/ConsentAnalytics';
import PostHogAnalytics from '@/components/layout/PostHogAnalytics';
import BrandNoise from '@/components/BrandNoise';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const antonio = Antonio({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className="h-full scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${geistMono.variable} ${antonio.variable} font-sans bg-[#ffffff] text-[#000000] antialiased min-h-screen flex flex-col selection:bg-black selection:text-white`}
      >
        <BrandNoise />
        {children}
        <ConsentAnalytics enabled={process.env.VERCEL_ENV === 'production'} />
        <PostHogAnalytics enabled={process.env.VERCEL_ENV === 'production'} />
      </body>
    </html>
  );
}
