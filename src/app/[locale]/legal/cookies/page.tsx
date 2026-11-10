import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getTranslations } from 'next-intl/server';
import { reader } from '@/lib/keystatic/reader';
import CookiePreferenceButton from './CookiePreferenceButton';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.cookies' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legalData' });

  // Read from Keystatic singleton and fallback to messages if not found
  const entry = await reader.singletons.cookies.read();
  
  const title = entry
    ? (locale === 'en' ? (entry.titleEn || entry.titleFr) : entry.titleFr)
    : (t.raw('cookies') as { title: string }).title;

  const buttonLabel = entry
    ? (locale === 'en' ? entry.buttonLabelEn : entry.buttonLabelFr)
    : (t.raw('cookies') as { buttonLabel: string }).buttonLabel;

  const rawSections = entry
    ? (locale === 'en' ? entry.sectionsEn : entry.sectionsFr)
    : (t.raw('cookies') as { sections: Array<{ title: string; content: string }> }).sections;

  const sections = (rawSections || []) as Array<{ title: string; content: string }>;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white text-black pt-28 sm:pt-36 pb-20 sm:pb-24 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-10 relative z-10">
          <div>
            <h1 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl text-black font-normal tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-xs text-zinc-400 font-mono tracking-wide">{t('lastUpdateLabel')}</p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-zinc-50/70 border border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-black">Préférences de consentement</p>
              <p className="text-xs text-zinc-500 mt-0.5">Vous pouvez mettre à jour vos choix à tout moment.</p>
            </div>
            <CookiePreferenceButton label={buttonLabel || 'Modifier mes préférences'} />
          </div>

          {sections.map((section, idx) => (
            <section key={idx} className="space-y-3 pt-2">
              <h2 className="font-display uppercase text-lg sm:text-xl text-black font-normal tracking-tight">
                {section.title}
              </h2>
              <div 
                className="text-sm text-zinc-600 leading-relaxed space-y-2"
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
