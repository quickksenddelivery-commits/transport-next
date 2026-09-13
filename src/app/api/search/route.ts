import type { NextRequest } from 'next/server';
import { BLOG_POSTS } from '@/data/blogPosts';
import { CATALOGS, CATEGORY_META, type Category } from '@/data/serviceCatalog';

const PAGES = [
  { path: '/', title: 'Home', desc: 'Freight, parcels, moves, and logistics worldwide.' },
  { path: '/services', title: 'Services', desc: 'Express delivery, warehousing, freight, and customs.' },
  { path: '/freight', title: 'Freight', desc: 'Air, ocean, and road freight forwarding worldwide.' },
  { path: '/movers', title: 'Movers', desc: 'Household, commercial, and international moving.' },
  { path: '/customs', title: 'Customs', desc: 'Licensed customs brokers and trade consulting.' },
  { path: '/about', title: 'About Us', desc: 'Our story, values, and team behind Accessiblexpress.' },
  { path: '/contact', title: 'Contact Us', desc: 'Get a quote, schedule a pickup, or talk to our team.' },
  { path: '/blog', title: 'Blog', desc: 'Shipping guides, freight news, and logistics tips.' },
  { path: '/track', title: 'Track Shipment', desc: 'Real-time tracking on parcels, freight, and moves.' },
  { path: '/help', title: 'Help Center', desc: 'Answers about shipping, pricing, customs, and tracking.' },
  { path: '/sustainability', title: 'Sustainability', desc: 'Greener logistics, carbon-neutral shipping options.' },
  { path: '/press', title: 'Press & Media', desc: 'News, press releases, and brand assets.' },
];

function normalize(s: string) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim();

  if (!q) {
    return Response.json({ query: '', services: [], posts: [], pages: [] });
  }

  const needle = normalize(q);
  const terms = needle.split(/\s+/).filter(Boolean);

  const score = (text: string) => {
    const t = normalize(text);
    let s = 0;
    for (const term of terms) {
      if (t.includes(term)) s += term.length;
    }
    return s;
  };

  const services = (Object.keys(CATALOGS) as Category[])
    .flatMap(category =>
      CATALOGS[category]
        .map(item => ({
          type: 'service' as const,
          title: item.title,
          desc: item.desc,
          url: `${CATEGORY_META[category].path}/${item.slug}`,
          category: category,
          score: score(item.title + ' ' + item.desc),
        }))
        .filter(r => r.score > 0),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const posts = BLOG_POSTS
    .map(post => ({
      type: 'post' as const,
      title: post.title,
      desc: post.excerpt,
      url: `/blog#post-${post.slug}`,
      category: post.category,
      date: post.date,
      score: score(post.title + ' ' + post.excerpt),
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const pages = PAGES
    .map(p => ({
      type: 'page' as const,
      title: p.title,
      desc: p.desc,
      url: p.path,
      score: score(p.title + ' ' + p.desc),
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return Response.json({ query: q, services, posts, pages });
}
