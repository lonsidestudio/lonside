import { hasAnalyticsConsent } from '@/lib/analytics-consent';

export const DEFAULT_GTM_ID = 'GTM-M5WCHWX3';
export const GTM_SCRIPT_ID = 'lonside-gtm-script';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function getGtmId(): string {
  const configured = (process.env.NEXT_PUBLIC_GTM_ID || DEFAULT_GTM_ID).trim();
  return /^GTM-[A-Z0-9]+$/i.test(configured) ? configured : DEFAULT_GTM_ID;
}

function isAdminPath(pathname: string): boolean {
  return /^\/(?:fr\/|en\/)?keystatic(?:\/|$)/.test(pathname);
}

function ensureGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      // Google Tag Manager & Consent Mode v2 require the native `arguments` object (not a plain Array).
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
  return window.gtag;
}

export function syncGtmConsent(enabled: boolean): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  const allowed = enabled && hasAnalyticsConsent() && !isAdminPath(window.location.pathname);

  if (!allowed) {
    if (initialized && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    return false;
  }

  const gtmId = getGtmId();
  const gtag = ensureGtag();

  if (!initialized) {
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    gtag('js', new Date());
    window.dataLayer?.push({
      'gtm.start': Date.now(),
      event: 'gtm.js',
    });

    if (!document.getElementById(GTM_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = GTM_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      document.head.appendChild(script);
    }

    initialized = true;
    return true;
  }

  gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  return true;
}
