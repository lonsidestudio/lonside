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
      // API calls: self, Sentry, Vercel vitals and PostHog EU ingestion/config
      "connect-src 'self' *.sentry.io vitals.vercel-insights.com https://eu.i.posthog.com https://eu-assets.i.posthog.com",
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
};

export default withNextIntl(nextConfig);
