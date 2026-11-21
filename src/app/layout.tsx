import type { ReactNode } from 'react';

// Root layout pass-through : permet aux layouts enfants ([locale], keystatic, not-found)
// de définir leur propre attribut <html lang="..."> directement en SSR/SSG.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
