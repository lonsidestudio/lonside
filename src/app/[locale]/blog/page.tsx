import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { reader } from '@/lib/keystatic/reader';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.blog' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  ia: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  web: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  design: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  seo: 'text-green-400 bg-green-500/10 border-green-500/20',
};

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const rawPosts = await reader.collections.blog.all();

  const posts = rawPosts.map(({ slug, entry }) => ({
    slug,
    title: locale === 'en' ? (entry.titleEn || entry.titleFr) : entry.titleFr,
    excerpt: locale === 'en' ? (entry.excerptEn || entry.excerptFr) : entry.excerptFr,
    category: entry.category,
    publishedAt: entry.publishedAt ?? '',
    readingTime: entry.readingTime ?? 5,
    featured: entry.featured,
    tags: entry.tags,
    author: { name: entry.authorName, role: entry.authorRole },
  }));

  const featured = posts.find((p) => p.featured);
  const others = posts.filter((p) => !p.featured);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#050505] text-[#fafafa] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 mb-20">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-radial-purple opacity-20 pointer-events-none -z-10" />
          <SectionHeader
            badge={<Badge icon={<BookOpen className="w-3.5 h-3.5" />}>{t('badge')}</Badge>}
            headline={t('headline')}
            headlineHighlight={t('headlineHighlight')}
            subheadline={t('subheadline')}
          />
        </section>

        {featured && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <Link href={{ pathname: '/blog/[slug]', params: { slug: featured.slug } }} className="block group">
              <div className="p-8 rounded-2xl bg-[#0d0d11]/60 border border-white/5 hover:border-brand-purple/20 transition-all duration-300 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${CATEGORY_COLORS[featured.category]}`}>
                        {t(`categories.${featured.category as 'ia' | 'web' | 'design' | 'seo'}`)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {featured.readingTime} {t('minRead')}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-brand-purple transition-colors duration-300 leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-400">{featured.author.name}</span>
                      <span>·</span>
                      <span>{featured.publishedAt}</span>
                    </div>
                  </div>
                  <div className="md:shrink-0 flex items-center text-xs font-bold text-brand-purple group-hover:text-brand-purple-hover transition-colors duration-300 self-end md:self-start">
                    <span>{t('readMore')}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {others.map((post) => (
              <Link key={post.slug} href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }} className="block group">
                <div className="h-full flex flex-col justify-between space-y-4 p-6 rounded-2xl bg-[#0d0d11]/60 border border-white/5 hover:border-brand-purple/20 transition-all duration-300 hover:bg-[#0d0d11]/90 hover:shadow-[0_10px_25px_-10px_rgba(124,58,237,0.12)] backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${CATEGORY_COLORS[post.category]}`}>
                        {t(`categories.${post.category as 'ia' | 'web' | 'design' | 'seo'}`)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readingTime} {t('minRead')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-brand-purple transition-colors duration-300 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[10px] text-slate-500">{post.publishedAt}</span>
                    <span className="text-xs font-bold text-brand-purple flex items-center gap-1">
                      <span>{t('readMore')}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
