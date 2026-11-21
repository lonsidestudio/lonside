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
      "img-src 'self' data: blob: https://i.ytimg.com",
      // API calls: self, Vercel vitals/speed-insights and PostHog EU ingestion/config
      "connect-src 'self' vitals.vercel-insights.com https://vercel.com https://vercel-insights.com https://eu.i.posthog.com https://eu-assets.i.posthog.com",
      "frame-src 'self' https://www.youtube-nocookie.com",
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
  // Requis pour le reverse proxy PostHog (/ingest/e/) ; les trailing slashes publics sont normalisés dans src/proxy.ts
  skipTrailingSlashRedirect: true,
  // Reverse proxy PostHog EU pour fiabiliser la collecte face aux bloqueurs tiers
  rewrites: async () => [
    {
      source: '/ingest/static/:path*',
      destination: 'https://eu-assets.i.posthog.com/static/:path*',
    },
    {
      source: '/ingest/:path*',
      destination: 'https://eu.i.posthog.com/:path*',
    },
  ],
  // 301 Permanent Redirects consolidating legacy routes with 0 redirect hops
  redirects: async () => [
    { source: '/services', destination: '/#tarifs', permanent: true },
    { source: '/fr/services', destination: '/#tarifs', permanent: true },
    { source: '/en/services', destination: '/en#tarifs', permanent: true },
    { source: '/services/site-vitrine', destination: '/services/sprint-mvp-14-jours', permanent: true },
    { source: '/services/automatisation', destination: '/services/plateforme-saas-sur-mesure', permanent: true },
    { source: '/services/design', destination: '/services/application-web-nextjs', permanent: true },
    { source: '/services/application-web', destination: '/services/application-web-nextjs', permanent: true },
    { source: '/services/regie', destination: '/services/regie-tech-senior', permanent: true },
    { source: '/fr/services/:path*', destination: '/#tarifs', permanent: true },
    { source: '/methode', destination: '/#methode', permanent: true },
    { source: '/fr/methode', destination: '/#methode', permanent: true },
    { source: '/en/methode', destination: '/en#methode', permanent: true },
    { source: '/fr/estimation', destination: '/estimation', permanent: true },
    { source: '/en/estimation', destination: '/en/estimate', permanent: true },
    { source: '/fr/a-propos', destination: '/a-propos', permanent: true },
    { source: '/en/a-propos', destination: '/en/about', permanent: true },
    { source: '/contact', destination: '/#contact', permanent: true },
    { source: '/fr/contact', destination: '/#contact', permanent: true },
    { source: '/en/contact', destination: '/en#contact', permanent: true },
    { source: '/blog/:path*', destination: '/portfolio', permanent: true },
    { source: '/fr/blog/:path*', destination: '/portfolio', permanent: true },
    { source: '/en/blog/:path*', destination: '/en/portfolio', permanent: true },
  ],
};

export default withNextIntl(nextConfig);
