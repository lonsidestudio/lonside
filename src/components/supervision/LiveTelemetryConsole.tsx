'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCw, ExternalLink, Terminal, ShieldAlert, CheckCircle2 } from 'lucide-react';
import {
  captureLeadEvent,
  getPostHogStatus,
  getTelemetryLogs,
  type TelemetryLogEntry,
} from '@/lib/posthog';

interface LiveTelemetryConsoleProps {
  isEn?: boolean;
}

export default function LiveTelemetryConsole({ isEn = false }: LiveTelemetryConsoleProps) {
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

    if (success) {
      setTestResult(isEn ? 'Event dispatched successfully to PostHog!' : 'Événement expédié avec succès à PostHog !');
    } else {
      setTestResult(
        isEn
          ? 'Event blocked or queued (check consent or token)'
          : 'Événement bloqué ou mis en attente (vérifier consentement ou token)'
      );
    }

    refreshData();
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <section className="space-y-4 pt-4 border-t border-black/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-400">
            {isEn ? 'Live PostHog Telemetry Bench' : 'Banc de Test & Télémétrie PostHog en Direct'}
          </h2>
          <p className="text-xs text-zinc-600 mt-1">
            {isEn
              ? 'Verify that user interactions and business events are properly streamed to PostHog.'
              : "Vérifiez que les interactions utilisateurs et événements métiers sont fidèlement transmis à PostHog."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/[0.08] bg-white hover:bg-zinc-100 text-xs font-mono text-zinc-700 transition-colors cursor-pointer min-h-[40px]"
            title={isEn ? 'Refresh' : 'Actualiser'}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Refresh' : 'Actualiser'}</span>
          </button>

          <button
            type="button"
            onClick={handleEmitTestEvent}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer min-h-[40px] shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isEn ? 'Emit Test Event' : 'Émettre un Événement'}</span>
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-3 rounded-xl bg-zinc-50 border border-black/10 flex items-center gap-2 text-xs font-mono text-black">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Diagnostics Client */}
      {status && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              {isEn ? 'PostHog Client' : 'Client PostHog'}
            </span>
            <span className="text-xs font-mono font-medium text-black">
              {status.isInitialized ? (isEn ? 'ACTIVE' : 'ACTIF') : (isEn ? 'STANDBY' : 'EN ATTENTE')}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              {isEn ? 'Cookie Consent' : 'Consentement'}
            </span>
            <span className="text-xs font-mono font-medium text-black">
              {status.hasConsent ? (isEn ? 'GRANTED' : 'ACCORDÉ') : (isEn ? 'NOT GIVEN' : 'NON ACCORDÉ')}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              {isEn ? 'Target Host' : 'Hôte Cible'}
            </span>
            <span className="text-xs font-mono font-medium text-black truncate block">
              {status.host}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              {isEn ? 'Token Detected' : 'Clé Détectée'}
            </span>
            <span className="text-xs font-mono font-medium text-black">
              {!status.isTokenConfigured
                ? isEn
                  ? 'MISSING'
                  : 'ABSENTE'
                : status.tokenFormatValid
                ? isEn
                  ? 'VALID (phc_)'
                  : 'VALIDE (phc_)'
                : isEn
                ? 'INVALID (phs_/phx_)'
                : 'INVALIDE (phs_/phx_)'}
            </span>
          </div>
        </div>
      )}

      {/* Console de Télémétrie en Direct */}
      <div className="rounded-xl border border-black/[0.08] bg-zinc-950 text-zinc-100 p-5 space-y-3 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span className="uppercase text-[11px] tracking-wider">
              {isEn ? 'Session Telemetry Stream' : 'Flux Télémétrique de Session'}
            </span>
          </div>

          <a
            href="https://eu.posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-[11px]"
          >
            <span>{isEn ? 'Open PostHog Cloud' : 'Ouvrir PostHog Cloud'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 space-y-1">
            <p>{isEn ? 'No telemetry events recorded in current browser session yet.' : "Aucun événement télémétrique enregistré pour le moment dans cette session."}</p>
            <p className="text-[11px] text-zinc-600">
              {isEn ? 'Click "Emit Test Event" or interact with the site to see real-time triggers.' : 'Cliquez sur "Émettre un Événement" ou naviguez sur le site pour voir les déclenchements.'}
            </p>
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
