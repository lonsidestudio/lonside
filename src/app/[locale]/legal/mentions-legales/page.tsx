import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.mentionsLegales' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function MentionsLegalesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legalData' });
  const mentions = t.raw('mentions') as { title: string; sections: Array<{ title: string; content: string }> };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{mentions.title}</h1>
            <p className="text-xs text-slate-500">{t('lastUpdateLabel')}</p>
          </div>
          {mentions.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-base font-bold text-slate-200">{section.title}</h2>
              <div 
                className="text-xs text-slate-400 leading-relaxed space-y-1"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
