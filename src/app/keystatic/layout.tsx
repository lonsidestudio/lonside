import type { Metadata } from 'next';
import KeystaticApp from './keystatic';

export const metadata: Metadata = {
  title: 'Keystatic CMS — Lonside Studio',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout() {
  return (
    <html lang="fr">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
