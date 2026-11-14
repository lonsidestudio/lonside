'use client';

import type { PostHog, CaptureResult } from 'posthog-js';
import { hasAnalyticsConsent } from './analytics-consent';

let client: PostHog | undefined;
let loading: Promise<void> | undefined;
let enabled = false;

export function isPublicPage(path: string) {
  return !/^\/(?:fr\/|en\/)?keystatic(?:\/|$)/.test(path);
}

// URL parameters can contain prefilled contact details. Never send them.
export function sanitizeProperties(value: unknown, key = ''): unknown {
  if (Array.isArray(value)) return value.map(item => sanitizeProperties(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sanitizeProperties(v, k)]));
  }
  if (typeof value === 'string' && /url|referrer|href/i.test(key)) {
    try {
      const url = new URL(value);
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch { return ''; }
  }
  return value;
}

export function beforeSend(event: CaptureResult | null): CaptureResult | null {
  if (!event || !enabled || !hasAnalyticsConsent() || !isPublicPage(window.location.pathname)) return null;
  return { ...event, properties: sanitizeProperties(event.properties) as CaptureResult['properties'] };
}

export async function syncPostHogConsent(production: boolean): Promise<void> {
  enabled = production;
  if (!production || !hasAnalyticsConsent()) {
    client?.opt_out_capturing();
    return;
  }
  if (client) {
    if (client.has_opted_out_capturing()) {
      client.opt_in_capturing({ captureEventName: false });
      if (isPublicPage(window.location.pathname)) client.capture('$pageview');
    }
    return;
  }
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';
  if (!token || !host) return;
  if (!loading) {
    loading = import('posthog-js').then(({ default: posthog }) => {
      if (!enabled || !hasAnalyticsConsent()) return;
      client = posthog.init(token, {
        api_host: host,
        defaults: '2026-08-30',
        capture_pageview: 'history_change',
        capture_pageleave: true,
        autocapture: false,
        person_profiles: 'never',
        persistence: 'localStorage',
        save_campaign_params: false,
        disable_session_recording: true,
        capture_heatmaps: false,
        disable_surveys: true,
        capture_exceptions: false,
        before_send: beforeSend,
      });
      // The site's preference is authoritative, including after a previous opt-out.
      if (client?.has_opted_out_capturing()) {
        client.opt_in_capturing({ captureEventName: false });
        if (isPublicPage(window.location.pathname)) client.capture('$pageview');
      }
    }).catch(() => {
      // Analytics must never prevent a visitor from navigating or contacting us.
    }).finally(() => { loading = undefined; });
  }
  await loading;
}

export type LeadEvent =
  | 'contact_form_started'
  | 'contact_form_submitted'
  | 'contact_form_failed'
  | 'contact_cta_clicked'
  | 'dossier_opened'
  | 'dossier_external_clicked'
  | 'pricing_tier_selected'
  | 'locale_switched'
  | 'supervision_health_checked';

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  event: LeadEvent;
  properties: Record<string, string>;
  status: 'captured' | 'blocked_no_consent' | 'blocked_not_public' | 'sdk_unavailable';
}

const MAX_LOGS = 50;
const telemetryLogs: TelemetryLogEntry[] = [];

function recordTelemetry(
  event: LeadEvent,
  properties: Record<string, string>,
  status: TelemetryLogEntry['status']
) {
  const entry: TelemetryLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    event,
    properties,
    status,
  };
  telemetryLogs.unshift(entry);
  if (telemetryLogs.length > MAX_LOGS) {
    telemetryLogs.pop();
  }
}

export function getTelemetryLogs(): readonly TelemetryLogEntry[] {
  return telemetryLogs;
}

export function getPostHogStatus(): {
  isInitialized: boolean;
  hasConsent: boolean;
  isOptedOut: boolean;
  host: string;
  isTokenConfigured: boolean;
  activeEventsCount: number;
} {
  return {
    isInitialized: Boolean(client),
    hasConsent: typeof window !== 'undefined' ? hasAnalyticsConsent() : false,
    isOptedOut: client ? client.has_opted_out_capturing() : true,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    isTokenConfigured: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN),
    activeEventsCount: telemetryLogs.length,
  };
}

export function captureLeadEvent(event: LeadEvent, properties: Record<string, string> = {}): boolean {
  if (typeof window === 'undefined') return false;

  if (!isPublicPage(window.location.pathname)) {
    recordTelemetry(event, properties, 'blocked_not_public');
    return false;
  }

  if (!hasAnalyticsConsent()) {
    recordTelemetry(event, properties, 'blocked_no_consent');
    return false;
  }

  if (!client || !enabled) {
    recordTelemetry(event, properties, 'sdk_unavailable');
    return false;
  }

  try {
    client.capture(event, properties);
    recordTelemetry(event, properties, 'captured');
    return true;
  } catch {
    recordTelemetry(event, properties, 'sdk_unavailable');
    return false;
  }
}

// Alias ergonomique pour l'ingénierie et la supervision
export const captureAnalyticsEvent = captureLeadEvent;
