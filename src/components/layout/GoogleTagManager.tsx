'use client';

import { useEffect } from 'react';
import { subscribeToConsent } from '@/lib/analytics-consent';
import { syncGtmConsent } from '@/lib/gtm';

export default function GoogleTagManager({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const update = () => {
      syncGtmConsent(enabled);
    };
    update();
    const unsubscribe = subscribeToConsent(update);
    return () => {
      unsubscribe();
      syncGtmConsent(false);
    };
  }, [enabled]);

  return null;
}
