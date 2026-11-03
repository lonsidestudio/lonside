'use client';

import { useEffect } from 'react';
import { subscribeToConsent } from '@/lib/analytics-consent';
import { syncPostHogConsent, captureLeadEvent } from '@/lib/posthog';

export default function PostHogAnalytics({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const update = () => { void syncPostHogConsent(enabled); };
    update();
    const unsubscribe = subscribeToConsent(update);
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link) return;
      const url = new URL(link.getAttribute('href')!, window.location.href);
      const channel = url.protocol === 'mailto:' ? 'email'
        : url.hostname === 'calendly.com' ? 'appointment'
        : url.origin === window.location.origin && /^\/(?:fr\/|en\/)?contact\/?$/.test(url.pathname) ? 'contact'
        : null;
      if (channel) captureLeadEvent('contact_cta_clicked', { channel });
    };
    document.addEventListener('click', onClick);
    return () => {
      unsubscribe();
      document.removeEventListener('click', onClick);
      void syncPostHogConsent(false);
    };
  }, [enabled]);
  return null;
}
