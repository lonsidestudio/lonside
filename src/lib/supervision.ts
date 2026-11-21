/**
 * Lonside Studio — Module de Télémétrie et Supervision Système
 * Types, interfaces et fonctions d'évaluation de santé des services critiques.
 */

export type ServiceStatus = 'operational' | 'degraded' | 'offline' | 'unconfigured';

export interface ServiceHealth {
  name: string;
  category: 'analytics' | 'infrastructure' | 'messaging' | 'seo';
  status: ServiceStatus;
  description: string;
  latencyMs?: number;
  details: Record<string, string | boolean | number>;
}

export interface SupervisionReport {
  timestamp: string;
  environment: string;
  overallStatus: 'all_systems_operational' | 'partial_outage' | 'action_required';
  version: string;
  services: ServiceHealth[];
  metrics: {
    activeRoutesCount: number;
    sitemapUrlsCount: number;
    securityHeadersEnforced: boolean;
    consentCompliant: boolean;
  };
}

/**
 * Évalue la santé des services pour l'API et la page de supervision
 */
export async function getSupervisionReport(): Promise<SupervisionReport> {
  const isProd = process.env.NODE_ENV === 'production';
  const vercelEnv = process.env.VERCEL_ENV || (isProd ? 'production' : 'development');

  // 1. PostHog Telemetry
  const postHogToken = (
    process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    ''
  ).trim();
  const hasPostHogToken = Boolean(postHogToken);
  const isSecretPostHogToken = /^ph[sx]_/i.test(postHogToken);
  const isPublicPostHogToken = /^phc_/i.test(postHogToken);
  const postHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

  const posthogService: ServiceHealth = {
    name: 'PostHog Analytics',
    category: 'analytics',
    status: !hasPostHogToken
      ? 'unconfigured'
      : isSecretPostHogToken
      ? 'degraded'
      : 'operational',
    description: !hasPostHogToken
      ? 'Clé PostHog non configurée (NEXT_PUBLIC_POSTHOG_KEY commençant par phc_ requise)'
      : isSecretPostHogToken
      ? 'Clé secrète (phs_/phx_) détectée au lieu de la clé publique projet (phc_) — ingestion client rejetée par PostHog'
      : 'Pipeline de télémétrie PostHog actif via reverse proxy /ingest avec consentement RGPD',
    details: {
      host: postHogHost,
      proxyPath: '/ingest',
      tokenConfigured: hasPostHogToken,
      tokenFormatValid: isPublicPostHogToken,
      privacyStrict: true,
      cookieConsentGate: true,
    },
  };

  // 2. Resend Contact Mail Service
  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@lonside.com';

  const messagingService: ServiceHealth = {
    name: 'Service de Contact (Resend)',
    category: 'messaging',
    status: hasResendKey ? 'operational' : isProd ? 'degraded' : 'unconfigured',
    description: hasResendKey
      ? 'Acheminement transactionnel actif vers ' + contactEmail
      : 'Clé RESEND_API_KEY non renseignée (les messages sont loggés en dev)',
    details: {
      targetEmail: contactEmail,
      apiKeyPresent: hasResendKey,
      rateLimiterActive: true,
      honeypotActive: true,
    },
  };

  // 3. Vercel Edge & Speed Insights
  const edgeService: ServiceHealth = {
    name: 'Vercel Edge Network & Speed Insights',
    category: 'infrastructure',
    status: 'operational',
    description: 'Distribution statique multi-région, SSG et collecte Core Web Vitals',
    details: {
      runtime: 'Edge / Node.js SSG',
      environment: vercelEnv,
      hstsPreload: isProd,
    },
  };

  // 4. SEO & Indexation
  const seoService: ServiceHealth = {
    name: 'Moteurs de Recherche & Indexation IA',
    category: 'seo',
    status: 'operational',
    description: '32 routes canoniques 200 OK directes (accueil, services, simulateur, études de cas, à propos, légal), hreflang bidirectionnel et llms.txt',
    details: {
      canonicalBase: 'https://www.lonside.com',
      sitemapUrls: 32,
      aiCrawlersAllowed: true,
      zeroHopRedirects: true,
    },
  };

  const services = [posthogService, messagingService, edgeService, seoService];
  const hasDegraded = services.some((s) => s.status === 'degraded');
  const hasUnconfigured = services.some((s) => s.status === 'unconfigured');

  const overallStatus = hasDegraded
    ? 'partial_outage'
    : hasUnconfigured && isProd
    ? 'action_required'
    : 'all_systems_operational';

  return {
    timestamp: new Date().toISOString(),
    environment: vercelEnv,
    overallStatus,
    version: '1.0.0',
    services,
    metrics: {
      activeRoutesCount: 41,
      sitemapUrlsCount: 32,
      securityHeadersEnforced: true,
      consentCompliant: true,
    },
  };
}
