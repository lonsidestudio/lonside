import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getTranslations } from 'next-intl/server';
import { reader } from '@/lib/keystatic/reader';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.privacy' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PolitiqueConfidentialitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legalData' });

  // Read from Keystatic singleton and fallback to messages if not found
  const entry = await reader.singletons.politiqueConfidentialite.read();
  
  const title = entry
    ? (locale === 'en' ? (entry.titleEn || entry.titleFr) : entry.titleFr)
    : (t.raw('privacy') as { title: string }).title;

  const rawSections = entry
    ? (locale === 'en' ? entry.sectionsEn : entry.sectionsFr)
    : (t.raw('privacy') as { sections: Array<{ title: string; content: string }> }).sections;

  const sections = (rawSections || []) as Array<{ title: string; content: string }>;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white text-black pt-32 pb-24 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-10 relative z-10">
          <div>
            <h1 className="text-3xl font-light text-black mb-2">{title}</h1>
            <p className="text-xs text-zinc-500 font-mono">{t('lastUpdateLabel')}</p>
          </div>
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-lg font-medium text-black">{section.title}</h2>
              <div 
                className="text-sm text-zinc-600 leading-relaxed space-y-1"
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
