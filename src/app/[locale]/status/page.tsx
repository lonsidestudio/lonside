import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Activity, ShieldCheck, Cpu, Database, Radio } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { getSupervisionReport } from '@/lib/supervision';
import LiveTelemetryConsole from '@/components/supervision/LiveTelemetryConsole';

interface StatusPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: StatusPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'status' });
  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, report] = await Promise.all([
    getTranslations({ locale, namespace: 'status' }),
    getSupervisionReport(),
  ]);

  const isAllGood = report.overallStatus === 'all_systems_operational';

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-black selection:text-white">
      <header className="border-b border-black/[0.08] bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 hover:text-black transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('backToStudio')}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-black font-medium">
              {t('liveBadge')}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16 w-full space-y-12">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span>{t('eyebrow')}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] pb-8">
            <div>
              <h1 className="font-display uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight text-black font-normal">
                {t('titlePrefix')}{' '}
                <span className={isAllGood ? 'text-black' : 'text-amber-600'}>
                  {isAllGood ? t('statusOperational') : t('statusAttention')}
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-mono text-zinc-500 mt-2">
                {t('environmentLabel')} {report.environment.toUpperCase()} ·{' '}
                {t('snapshotLabel')} {new Date(report.timestamp).toLocaleTimeString()}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-black/[0.08] bg-zinc-50 flex items-center gap-3 self-start sm:self-auto">
              <Activity className="w-5 h-5 text-black" />
              <div className="text-left font-mono">
                <p className="text-[10px] text-zinc-500 uppercase">{t('globalStateLabel')}</p>
                <p className="text-xs font-semibold text-black uppercase">
                  {isAllGood ? t('globalHealthy') : t('globalActionNeeded')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-400">
            {t('coreServicesHeading')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.services.map((service) => {
              const isOp = service.status === 'operational';
              return (
                <div
                  key={service.name}
                  className="p-5 sm:p-6 rounded-xl border border-black/[0.08] bg-white hover:border-black/30 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {service.category === 'analytics' && <Radio className="w-4 h-4 text-black" />}
                      {service.category === 'messaging' && <ShieldCheck className="w-4 h-4 text-black" />}
                      {service.category === 'infrastructure' && <Cpu className="w-4 h-4 text-black" />}
                      {service.category === 'seo' && <Database className="w-4 h-4 text-black" />}
                      <h3 className="font-display uppercase text-base sm:text-lg text-black tracking-tight font-medium">
                        {service.name}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md border uppercase font-medium ${
                        isOp
                          ? 'bg-zinc-50 border-black/10 text-black'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {service.description}
                  </p>

                  <div className="pt-2 border-t border-black/[0.05] grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-500">
                    {Object.entries(service.details).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-zinc-400 block text-[10px]">{key}</span>
                        <span className="text-black font-medium">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <LiveTelemetryConsole />
      </main>

      <footer className="border-t border-black/[0.08] bg-zinc-50/50 py-6">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <span>{t('footerLeft')}</span>
          <span>{t('footerRight', { version: report.version })}</span>
        </div>
      </footer>
    </div>
  );
}
