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
      // API calls: self, Vercel vitals/speed-insights and PostHog EU ingestion/config
      "connect-src 'self' vitals.vercel-insights.com https://vercel.com https://vercel-insights.com https://eu.i.posthog.com https://eu-assets.i.posthog.com",
      "worker-src 'self' blob: data:",
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
  // 301 Permanent Redirects consolidating legacy routes to high-converting root anchors with 0 redirect hops
  redirects: async () => [
    { source: '/services/:path*', destination: '/#tarifs', permanent: true },
    { source: '/fr/services/:path*', destination: '/#tarifs', permanent: true },
    { source: '/en/services/:path*', destination: '/en#tarifs', permanent: true },
    { source: '/methode', destination: '/#methode', permanent: true },
    { source: '/fr/methode', destination: '/#methode', permanent: true },
    { source: '/en/methode', destination: '/en#methode', permanent: true },
    { source: '/estimation', destination: '/#tarifs', permanent: true },
    { source: '/fr/estimation', destination: '/#tarifs', permanent: true },
    { source: '/en/estimation', destination: '/en#tarifs', permanent: true },
    { source: '/a-propos', destination: '/#manifeste', permanent: true },
    { source: '/fr/a-propos', destination: '/#manifeste', permanent: true },
    { source: '/en/a-propos', destination: '/en#manifeste', permanent: true },
    { source: '/portfolio/:path*', destination: '/#projets', permanent: true },
    { source: '/fr/portfolio/:path*', destination: '/#projets', permanent: true },
    { source: '/en/portfolio/:path*', destination: '/en#projets', permanent: true },
    { source: '/contact', destination: '/#contact', permanent: true },
    { source: '/fr/contact', destination: '/#contact', permanent: true },
    { source: '/en/contact', destination: '/en#contact', permanent: true },
    { source: '/blog/:path*', destination: '/#projets', permanent: true },
    { source: '/fr/blog/:path*', destination: '/#projets', permanent: true },
    { source: '/en/blog/:path*', destination: '/en#projets', permanent: true },
  ],
};

export default withNextIntl(nextConfig);
