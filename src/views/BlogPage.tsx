'use client'
import PageMeta from '../components/PageMeta'
import { useState } from 'react'


const POSTS = [
  {
    slug: '1', category: 'Industry News',
    title: '10 Shipping Trends That Will Define Logistics in 2025',
    excerpt: 'From AI-powered route optimisation to green freight initiatives, these are the forces reshaping global supply chains this year.',
    author: 'James Okonkwo', date: 'May 18, 2025', readTime: '6 min read',
    img: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&w=800',
    featured: true,
  },
  {
    slug: '2', category: 'Tips & Guides',
    title: 'How to Prepare Your Shipment for Customs Clearance',
    excerpt: 'A step-by-step guide to getting your documentation right the first time and avoiding costly delays at the border.',
    author: 'Amina Hassan', date: 'May 12, 2025', readTime: '8 min read',
    img: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&w=800',
    featured: false,
  },
  {
    slug: '3', category: 'Company News',
    title: 'Accessiblexpress Expands to 12 New Countries Across Southeast Asia',
    excerpt: "We're thrilled to announce same-day and next-day delivery capabilities in Thailand, Vietnam, Indonesia, and 9 more markets.",
    author: 'Accessiblexpress Team', date: 'May 5, 2025', readTime: '3 min read',
    img: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&w=800',
    featured: false,
  },
  {
    slug: '4', category: 'Tips & Guides',
    title: 'Air vs Ocean Freight: Which Is Right for Your Business?',
    excerpt: 'We break down cost, speed, reliability, and carbon impact so you can make the best decision for every shipment.',
    author: 'David Mensah', date: 'Apr 28, 2025', readTime: '7 min read',
    img: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&w=800',
    featured: false,
  },
  {
    slug: '5', category: 'Industry News',
    title: 'The Rise of On-Demand Freight: What It Means for SMEs',
    excerpt: "Small and medium businesses now have access to enterprise-grade logistics. Here's how on-demand freight is levelling the playing field.",
    author: 'Sarah Adeyemi', date: 'Apr 20, 2025', readTime: '5 min read',
    img: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&w=800',
    featured: false,
  },
  {
    slug: '6', category: 'Company News',
    title: 'Introducing Real-Time SMS Tracking for All Shipments',
    excerpt: 'No app required. Every shipment now sends automatic SMS updates at every milestone, keeping your customers informed end to end.',
    author: 'Accessiblexpress Team', date: 'Apr 10, 2025', readTime: '2 min read',
    img: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&w=800',
    featured: false,
  },
]

const CATEGORIES = ['All', 'Industry News', 'Tips & Guides', 'Company News']

const CATEGORY_COLORS: Record<string, string> = {
  'Industry News': '#1565C0',
  'Tips & Guides': '#FF9800',
  'Company News':  '#1565C0',
}

export default function BlogPage() {
  const [active, setActive] = useState('All')
  const featured = POSTS.find(p => p.featured)!
  const filtered  = POSTS.filter(p => !p.featured && (active === 'All' || p.category === active))

  return (
    <main style={{ paddingTop: 98 }}>
      <PageMeta title="Logistics Blog" description="Industry insights, shipping guides, and company news from the Accessiblexpress team." />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)', padding: '64px 0 48px' }}>
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5" style={{ background: 'rgba(255,152,0,0.12)', border: '1px solid rgba(255,152,0,0.3)', color: '#FF9800' }}>
            Logistics Insights
          </span>
          <h1 className="font-black text-white mb-3" style={{ fontSize: 'clamp(32px,4.5vw,56px)', letterSpacing: '-1px' }}>
            The Accessiblexpress Blog
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
            Industry news, shipping guides, and company updates — everything you need to ship smarter.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-14" style={{ background: '#f8fafc' }}>
        <div className="container mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Featured Article</p>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 grid md:grid-cols-2 hover:shadow-lg transition-shadow">
            <div className="aspect-video md:aspect-auto overflow-hidden">
              <img src={featured.img} alt={featured.title} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-flex text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit" style={{ background: `${CATEGORY_COLORS[featured.category]}18`, color: CATEGORY_COLORS[featured.category] }}>
                {featured.category}
              </span>
              <h2 className="font-black text-slate-900 mb-3 leading-tight" style={{ fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.5px' }}>{featured.title}</h2>
              <p className="text-slate-500 leading-relaxed mb-6 text-sm">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">{featured.author} · {featured.date} · {featured.readTime}</div>
                <span className="flex items-center gap-1 text-sm font-bold opacity-50 cursor-default" style={{ color: '#1565C0' }}>
                  Read More
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All posts */}
      <section className="pb-20" style={{ background: '#f8fafc' }}>
        <div className="container mx-auto px-6">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: active === cat ? '#1565C0' : 'white',
                  color: active === cat ? 'white' : '#64748b',
                  border: active === cat ? '1px solid #1565C0' : '1px solid #e2e8f0',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <article key={post.slug} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="aspect-video overflow-hidden">
                  <img src={post.img} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5">
                  <span className="inline-flex text-xs font-bold px-2.5 py-1 rounded-full mb-3" style={{ background: `${CATEGORY_COLORS[post.category]}18`, color: CATEGORY_COLORS[post.category] }}>
                    {post.category}
                  </span>
                  <h3 className="font-bold text-slate-800 leading-snug mb-2 group-hover:text-[#1565C0] transition-colors">{post.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-50">
                    <span>{post.author}</span>
                    <span>{post.date} · {post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
