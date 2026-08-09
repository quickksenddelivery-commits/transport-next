'use client'
import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Reveal from './Reveal'

const REVIEWS = [
  {
    name: 'Sarah Johnson',
    role: 'E-commerce Director, ShopNova',
    initials: 'SJ',
    color: 'bg-yellow-400',
    rating: 5,
    text: 'Accessiblexpress transformed our fulfillment. Delivery times dropped by 40% and our customers notice. The real-time tracking feature alone saved us hundreds of support tickets per month.',
  },
  {
    name: 'Marcus Oduya',
    role: 'CEO, Oduya Import/Export',
    initials: 'MO',
    color: 'bg-red-600',
    rating: 5,
    text: 'We ship containers to Europe monthly. Accessiblexpress handles customs, documentation, and last-mile delivery. The account manager is responsive within minutes. Absolutely professional.',
  },
  {
    name: 'Priya Natarajan',
    role: 'Operations Lead, MedDevice Global',
    initials: 'PN',
    color: 'bg-yellow-400',
    rating: 5,
    text: 'Medical equipment needs special handling and zero delays. Accessiblexpress understands that. They have never once missed a deadline in 2 years of working together. Remarkable reliability.',
  },
  {
    name: 'James Whitfield',
    role: 'Founder, Craft & Co. UK',
    initials: 'JW',
    color: 'bg-red-600',
    rating: 5,
    text: 'The shipping calculator is incredibly accurate — no billing surprises. And when a parcel was delayed once, support proactively called me before I even knew there was an issue.',
  },
  {
    name: 'Aisha Kamara',
    role: 'Supply Chain Manager, AfriTech',
    initials: 'AK',
    color: 'bg-yellow-400',
    rating: 5,
    text: "As a business shipping across 30 African countries, we needed a partner that understood local logistics. Accessiblexpress does. Their last-mile coverage in tier-2 cities is impressive.",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [ref, inView] = useScrollReveal()

  const navigate = (dir: 1 | -1) => {
    setCurrent(c => (c + dir + REVIEWS.length) % REVIEWS.length)
    setAnimKey(k => k + 1)
  }

  const visible = [
    REVIEWS[current % REVIEWS.length],
    REVIEWS[(current + 1) % REVIEWS.length],
    REVIEWS[(current + 2) % REVIEWS.length],
  ]

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div ref={ref} className="container mx-auto px-6">
        <div className={`text-center mb-14 ${inView ? 'animate-reveal-up' : 'opacity-0'}`}>
          <span className="section-label">Customer Stories</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mt-4 mb-4">
            Loved by Thousands of Shippers
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Don't take our word for it. See what our clients say about working with Accessiblexpress.
          </p>
        </div>

        {/* Stars summary */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          {[
            { label: 'Google Reviews', rating: '4.9', count: '2,100+' },
            { label: 'Trustpilot', rating: '4.8', count: '5,400+' },
            { label: 'App Store', rating: '4.9', count: '800+' },
          ].map((platform, i) => (
            <div
              key={platform.label}
              className={`flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100
                transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                ${inView ? 'animate-reveal-scale' : 'opacity-0'}`}
              style={inView ? { animationDelay: `${0.1 + i * 0.1}s` } : {}}
            >
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{platform.label} · {platform.count} reviews</p>
              </div>
              <span className="text-2xl font-black text-slate-800">{platform.rating}</span>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {visible.map((rev, i) => (
            <Reveal key={`${rev.name}-${animKey}-${i}`} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'} delay={0.05 + i * 0.1}>
            <div
              className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100
                transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-yellow-100 h-full"
            >
              <div className="flex gap-1 mb-4">
                {Array(rev.rating).fill(0).map((_, s) => (
                  <svg key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{rev.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${rev.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {rev.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{rev.name}</p>
                  <p className="text-slate-400 text-xs">{rev.role}</p>
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setAnimKey(k => k + 1) }}
              className={`rounded-full transition-all duration-300 ${i === current % REVIEWS.length ? 'w-6 h-2.5 bg-yellow-400' : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'}`}
            />
          ))}
          <button
            onClick={() => navigate(1)}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
