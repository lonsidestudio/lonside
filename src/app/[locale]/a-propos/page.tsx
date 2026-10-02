import React from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Users, Code2, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.aPropos' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

const TECH_STACK = [
  'Next.js 16', 'React 19', 'TypeScript', 'TailwindCSS v4',
  'Supabase', 'Prisma', 'Stripe', 'N8N', 'Figma', 'Claude AI', 'Vercel',
];

export default function AProposPage() {
  const t = useTranslations('aPropos');

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* Hero */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 mb-20">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-radial-purple opacity-20 pointer-events-none -z-10" />
          <SectionHeader
            badge={<Badge icon={<Users className="w-3.5 h-3.5" />}>{t('badge')}</Badge>}
            headline={t('headline')}
            headlineHighlight={t('headlineHighlight')}
            subheadline={t('subheadline')}
          />
        </section>

        {/* Mission */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">{t('mission.title')}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{t('mission.content')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Code2 className="w-5 h-5 text-brand-purple" />, label: t('features.expert') },
                { icon: <Zap className="w-5 h-5 text-emerald-400" />, label: t('features.augmented') },
                { icon: <ShieldCheck className="w-5 h-5 text-blue-400" />, label: t('features.lockin') },
                { icon: <TrendingUp className="w-5 h-5 text-pink-400" />, label: t('features.roi') },
              ].map((item) => (
                <div key={item.label} className="flex items-center space-x-3 p-4 rounded-xl border border-white/5 bg-[#0d0d11]/60 backdrop-blur-sm">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 border-t border-white/5 pt-20">
          <h2 className="text-xl font-bold text-white mb-12 text-center">{t('values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-5 h-5 text-brand-purple" />,
                title: t('values.transparency.title'),
                desc: t('values.transparency.desc'),
              },
              {
                icon: <Code2 className="w-5 h-5 text-emerald-400" />,
                title: t('values.craft.title'),
                desc: t('values.craft.desc'),
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
                title: t('values.impact.title'),
                desc: t('values.impact.desc'),
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-[#0d0d11]/60 border border-white/5 backdrop-blur-sm">
                <div className="p-3 w-fit rounded-xl bg-slate-900 border border-white/5 mb-5">{icon}</div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-20 mb-20">
          <h2 className="text-xl font-bold text-white mb-8 text-center">{t('techStack.title')}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-lg bg-[#0d0d11]/80 border border-white/5 text-xs font-mono text-slate-300">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-[#0d0d11]/60 border border-white/5 text-center space-y-6 backdrop-blur-sm shadow-2xl">
            <h3 className="text-base sm:text-lg font-bold text-white">{t("ctaTitle")}</h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              {t("ctaSubtitle")}
            </p>
            <div className="pt-2">
              <Link
                href="/estimation"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-xs font-semibold text-white rounded-lg transition-all duration-200 space-x-2 border border-brand-purple/10 shadow-md shadow-purple-500/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
              >
                <span>{t("ctaBtn")}</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
