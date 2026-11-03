'use client';

import { useSyncExternalStore } from 'react';
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';
import { hasAnalyticsConsent, subscribeToConsent } from '@/lib/analytics-consent';

function beforeSend(event: BeforeSendEvent) {
  // Re-check persisted consent for every event, including after withdrawal.
  if (!hasAnalyticsConsent()) return null;
  const url = new URL(event.url);
  if (/^\/(?:fr\/|en\/)?keystatic(?:\/|$)/.test(url.pathname)) return null;
  // Do not send query parameters or fragments from contact/campaign URLs.
  url.search = '';
  url.hash = '';
  return { ...event, url: url.toString() };
}

export default function ConsentAnalytics({ enabled }: { enabled: boolean }) {
  const consent = useSyncExternalStore(subscribeToConsent, hasAnalyticsConsent, () => false);
  if (!enabled || !consent) return null;
  return <Analytics beforeSend={beforeSend} />;
}
