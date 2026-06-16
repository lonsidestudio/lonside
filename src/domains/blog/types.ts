export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'ia' | 'web' | 'design' | 'seo';
  author: { name: string; role: string };
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  tags: string[];
}
