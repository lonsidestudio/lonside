'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Play, RotateCw, ExternalLink, Terminal, CheckCircle2 } from 'lucide-react';
import {
  captureLeadEvent,
  getPostHogStatus,
  getTelemetryLogs,
  type TelemetryLogEntry,
} from '@/lib/posthog';

export default function LiveTelemetryConsole() {
  const t = useTranslations('status.console');
  const [logs, setLogs] = useState<readonly TelemetryLogEntry[]>([]);
  const [status, setStatus] = useState<ReturnType<typeof getPostHogStatus> | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const refreshData = () => {
    setStatus(getPostHogStatus());
    setLogs([...getTelemetryLogs()]);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEmitTestEvent = () => {
    const success = captureLeadEvent('supervision_health_checked', {
      source: 'live_telemetry_console',
      timestamp: new Date().toISOString(),
    });

    setTestResult(success ? t('dispatchSuccess') : t('dispatchBlocked'));
    refreshData();
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <section className="space-y-4 pt-4 border-t border-black/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-400">
            {t('heading')}
          </h2>
          <p className="text-xs text-zinc-600 mt-1">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/[0.08] bg-white hover:bg-zinc-100 text-xs font-mono text-zinc-700 transition-colors cursor-pointer min-h-[44px]"
            title={t('refresh')}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t('refresh')}</span>
          </button>

          <button
            type="button"
            onClick={handleEmitTestEvent}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer min-h-[44px] shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{t('emitTest')}</span>
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-3 rounded-xl bg-zinc-50 border border-black/10 flex items-center gap-2 text-xs font-mono text-black">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {status && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              {t('clientLabel')}
            </span>
            <span className="text-xs font-mono font-medium text-black">
              {status.isInitialized ? t('clientActive') : t('clientStandby')}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              {t('consentLabel')}
            </span>
            <span className="text-xs font-mono font-medium text-black">
              {status.hasConsent ? t('consentGranted') : t('consentDenied')}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              {t('hostLabel')}
            </span>
            <span className="text-xs font-mono font-medium text-black truncate block">
              {status.host}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              {t('tokenLabel')}
            </span>
            <span className="text-xs font-mono font-medium text-black">
              {!status.isTokenConfigured
                ? t('tokenMissing')
                : status.tokenFormatValid
                ? t('tokenValid')
                : t('tokenInvalid')}
            </span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-black/[0.08] bg-zinc-950 text-zinc-100 p-5 space-y-3 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span className="uppercase text-[11px] tracking-wider">
              {t('streamTitle')}
            </span>
          </div>

          <a
            href="https://eu.posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-[11px]"
          >
            <span>{t('openCloud')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 space-y-1">
            <p>{t('emptyTitle')}</p>
            <p className="text-[11px] text-zinc-600">{t('emptyHint')}</p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {logs.map((log) => {
              const isCaptured = log.status === 'captured';
              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isCaptured ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className="font-semibold text-white text-xs">{log.event}</span>
                    <span className="text-[10px] text-zinc-400 truncate">
                      {JSON.stringify(log.properties)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-[10px] text-zinc-400">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] uppercase ${
                        isCaptured ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
