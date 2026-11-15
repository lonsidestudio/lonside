'use client';

import posthog, { type CaptureResult } from 'posthog-js';
import { hasAnalyticsConsent } from './analytics-consent';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const isConfigured = Boolean(token && host);
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

export function syncPostHogConsent(production: boolean): void {
  const wasEnabled = enabled;
  enabled = production && isConfigured;

  if (!enabled || !hasAnalyticsConsent()) {
    if (isConfigured) posthog.opt_out_capturing();
    return;
  }

  const wasOptedOut = posthog.has_opted_out_capturing();
  if (wasOptedOut) posthog.opt_in_capturing({ captureEventName: false });
  if ((!wasEnabled || wasOptedOut) && isPublicPage(window.location.pathname)) {
    posthog.capture('$pageview');
  }
}

export type LeadEvent =
  | 'contact_form_started'
  | 'contact_form_submitted'
  | 'contact_form_failed'
  | 'contact_cta_clicked'
  | 'calendar_cta_clicked'
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
    isInitialized: isConfigured,
    hasConsent: typeof window !== 'undefined' ? hasAnalyticsConsent() : false,
    isOptedOut: isConfigured ? posthog.has_opted_out_capturing() : true,
    host: host ?? '',
    isTokenConfigured: Boolean(token),
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

  if (!isConfigured || !enabled) {
    recordTelemetry(event, properties, 'sdk_unavailable');
    return false;
  }

  try {
    posthog.capture(event, properties);
    recordTelemetry(event, properties, 'captured');
    return true;
  } catch {
    recordTelemetry(event, properties, 'sdk_unavailable');
    return false;
  }
}

// Alias ergonomique pour l'ingénierie et la supervision
export const captureAnalyticsEvent = captureLeadEvent;
