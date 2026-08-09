'use client'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const POSTS = [
  {
    category: 'Shipping Tips',
    categoryColor: 'bg-red-50 text-[#1565C0]',
    date: 'May 10, 2026',
    title: 'How to Pack Fragile Items for International Shipping',
    excerpt: 'Learn the professional techniques our warehouse experts use to ensure fragile goods arrive intact across continents.',
    readTime: '4 min read',
    img: 'https://images.pexels.com/photos/4246100/pexels-photo-4246100.jpeg?auto=compress&cs=tinysrgb&w=800&h=480&fit=crop',
    imgAlt: 'Person carefully packing items in a box',
    accent: '#1565C0',
  },
  {
    category: 'Industry News',
    categoryColor: 'bg-red-50 text-red-700',
    date: 'May 5, 2026',
    title: 'New EU Customs Rules for 2026: What Shippers Must Know',
    excerpt: "The European Union updated customs regulations take effect June 1st. Here's exactly what changes and how to stay compliant.",
    readTime: '6 min read',
    img: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=800&h=480&fit=crop',
    imgAlt: 'Customs documentation and paperwork',
    accent: '#1565C0',
  },
  {
    category: 'Business Growth',
    categoryColor: 'bg-yellow-50 text-[#1F2937]',
    date: 'Apr 28, 2026',
    title: '10 Ways to Cut Shipping Costs for Your E-commerce Store',
    excerpt: 'From bulk discounts to smart packaging, discover proven strategies that can reduce shipping expenses by up to 35%.',
    readTime: '8 min read',
    img: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800&h=480&fit=crop',
    imgAlt: 'E-commerce packages and shipping boxes',
    accent: '#FF9800',
  },
]

export default function BlogSection() {
  const [ref, inView] = useScrollReveal()

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div ref={ref} className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4 ${inView ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div>
            <span className="section-label">Knowledge Hub</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 mt-4 leading-tight">
              Shipping Insights & News
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-2 font-semibold text-sm whitespace-nowrap hover:gap-3 transition-all duration-200 shrink-0"
            style={{ color: '#1565C0', textDecoration: 'none' }}
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {POSTS.map((post, i) => (
            <article
              key={post.title}
              className={`group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm
                transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-slate-200 cursor-pointer
                ${i === POSTS.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}
                ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
              style={inView ? { animationDelay: `${0.08 + i * 0.12}s` } : {}}
            >
              {/* Thumbnail */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src={post.img}
                  alt={post.imgAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                {/* Category badge on image */}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${post.categoryColor} bg-white/90`}>
                    {post.category}
                  </span>
                </div>
                {/* Read time badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm">
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <p className="text-slate-400 text-xs mb-2">{post.date}</p>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2 sm:mb-3 leading-snug group-hover:text-brand-red transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: post.accent }} />
                    <span className="text-slate-500 text-xs font-medium">Accessiblexpress Editorial</span>
                  </div>
                  <span
                    className="text-xs font-semibold flex items-center gap-1 transition-all duration-200 group-hover:gap-2"
                    style={{ color: post.accent }}
                  >
                    Read More
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className={`mt-8 text-center sm:hidden ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
             style={inView ? { animationDelay: '0.4s' } : {}}>
          <Link to="/blog" className="btn-primary bg-slate-800! hover:bg-slate-700! shadow-none! inline-flex" style={{ textDecoration: 'none' }}>
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
