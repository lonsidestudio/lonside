import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { reader } from '@/lib/keystatic/reader';
import { locales } from '@/lib/i18n/config';

export async function generateStaticParams() {
  const slugs = await reader.collections.blog.list();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const entry = await reader.collections.blog.read(slug);
  if (!entry) return {};

  const seoTitle = locale === 'en'
    ? (entry.seoTitleEn || entry.titleEn || entry.titleFr)
    : (entry.seoTitleFr || entry.titleFr);

  const seoDescription = locale === 'en'
    ? (entry.seoDescriptionEn || entry.excerptEn || entry.excerptFr)
    : (entry.seoDescriptionFr || entry.excerptFr);

  return {
    title: seoTitle,
    description: seoDescription,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const entry = await reader.collections.blog.read(slug);
  if (!entry) return notFound();

  const t = await getTranslations({ locale, namespace: 'blogData' });

  const post = {
    slug,
    title: locale === 'en' ? (entry.titleEn || entry.titleFr) : entry.titleFr,
    excerpt: locale === 'en' ? (entry.excerptEn || entry.excerptFr) : entry.excerptFr,
    publishedAt: entry.publishedAt ?? '',
    readingTime: entry.readingTime ?? 5,
    author: { name: entry.authorName, role: entry.authorRole },
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/blog" className="inline-flex items-center text-xs text-slate-400 hover:text-brand-purple mb-8 gap-1.5 transition-colors duration-300 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> {t('btnBack')}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-12 pb-8 border-b border-white/5">
            <span className="font-semibold text-slate-300">{post.author.name}</span>
            <span>·</span>
            <span>{post.publishedAt}</span>
            <span>·</span>
            <span className="font-mono text-[10px] bg-slate-900 border border-white/5 px-2.5 py-0.5 rounded text-slate-400">{post.readingTime} {t('readingTimeSuffix')}</span>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">{post.excerpt}</p>
          <p className="text-xs text-slate-500 mt-12 italic border-l-2 border-brand-purple/40 pl-4">{t('comingSoon')}</p>
        </article>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            author: { '@type': 'Person', name: post.author.name },
            publisher: {
              '@type': 'Organization',
              name: 'Lonside',
              logo: { '@type': 'ImageObject', url: 'https://lonside.ai/logo.png' },
            },
          }),
        }}
      />
    </>
  );
}
