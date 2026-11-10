import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

const securityHeaders = [
  // Prevent DNS prefetching from leaking info
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer policy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Limit browser features
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // HSTS — force HTTPS (only in prod)
  ...(!isDev
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline for styles; unsafe-eval only in dev
      `script-src 'self' 'unsafe-inline' https://eu-assets.i.posthog.com${isDev ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      // next/font self-hosts fonts — no external font CDN needed
      "font-src 'self'",
      "img-src 'self' data: blob:",
      // API calls: self, Vercel vitals and PostHog EU ingestion/config
      "connect-src 'self' vitals.vercel-insights.com https://eu.i.posthog.com https://eu-assets.i.posthog.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]
      .join('; '),
  },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
  // Enforce strict mode for React
  reactStrictMode: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // 301 Permanent Redirects consolidating 59 old routes to high-converting root anchors
  redirects: async () => [
    { source: '/services/:path*', destination: '/fr#tarifs', permanent: true },
    { source: '/:locale(fr|en)/services/:path*', destination: '/:locale#tarifs', permanent: true },
    { source: '/methode', destination: '/fr#methode', permanent: true },
    { source: '/:locale(fr|en)/methode', destination: '/:locale#methode', permanent: true },
    { source: '/estimation', destination: '/fr#tarifs', permanent: true },
    { source: '/:locale(fr|en)/estimation', destination: '/:locale#tarifs', permanent: true },
    { source: '/a-propos', destination: '/fr#manifeste', permanent: true },
    { source: '/:locale(fr|en)/a-propos', destination: '/:locale#manifeste', permanent: true },
    { source: '/portfolio/:path*', destination: '/fr#projets', permanent: true },
    { source: '/:locale(fr|en)/portfolio/:path*', destination: '/:locale#projets', permanent: true },
    { source: '/contact', destination: '/fr#contact', permanent: true },
    { source: '/:locale(fr|en)/contact', destination: '/:locale#contact', permanent: true },
    { source: '/blog/:path*', destination: '/fr#projets', permanent: true },
    { source: '/:locale(fr|en)/blog/:path*', destination: '/:locale#projets', permanent: true },
  ],
};

export default withNextIntl(nextConfig);
