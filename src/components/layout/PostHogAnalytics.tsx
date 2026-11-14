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
      const rawHref = link.getAttribute('href');
      if (!rawHref) return;

      const isContactLink =
        rawHref === '#contact' ||
        rawHref === '/#contact' ||
        rawHref === '/en#contact' ||
        /^\/(?:fr\/|en\/)?contact\/?$/.test(rawHref);

      if (isContactLink) {
        captureLeadEvent('contact_cta_clicked', { channel: 'contact_anchor' });
        return;
      }

      try {
        const url = new URL(rawHref, window.location.href);
        const channel = url.protocol === 'mailto:' ? 'email'
          : (url.hostname === 'calendly.com' || url.hostname.includes('calendar')) ? 'appointment'
          : null;
        if (channel) captureLeadEvent('contact_cta_clicked', { channel });
      } catch {
        // Ignorer les URLs non parseables
      }
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
