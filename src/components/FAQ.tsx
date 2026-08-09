'use client'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const QUESTIONS = [
  {
    q: 'How do I track my shipment?',
    a: 'Enter your tracking number in the search bar at the top of the page, or visit the Tracking page. You\'ll get real-time updates including the current location, estimated delivery time, and full transit history. You can also subscribe to SMS or email notifications.',
  },
  {
    q: 'What are the delivery time frames?',
    a: 'Delivery times depend on the service selected: Express (same-day or next-day), Standard (3–5 business days for domestic, 5–10 days for international), Economy (7–14 days). Air freight international is typically 2–4 days. Exact timelines are shown when you calculate a quote.',
  },
  {
    q: 'Is my package insured?',
    a: 'Yes. Every shipment is automatically insured up to $500 at no extra cost. You can purchase additional coverage up to $10,000 during checkout. Claims are processed online and paid within 48 hours of approval.',
  },
  {
    q: 'What items are restricted or prohibited?',
    a: 'Prohibited items include: illegal substances, weapons, flammable liquids (in some cases), perishables without proper packaging, and counterfeit goods. Restricted items (like lithium batteries and fragile electronics) require special labelling. Visit our Restricted Items page for the full list.',
  },
  {
    q: 'Can I change or cancel a shipment after booking?',
    a: 'Yes, you can modify or cancel a shipment up to 30 minutes after placing the order at no charge. After pickup, changes may incur a rebooking fee. Contact our 24/7 support team for urgent modifications.',
  },
  {
    q: 'Do you offer API integration for e-commerce stores?',
    a: 'Absolutely. We provide REST APIs with full documentation, Shopify and WooCommerce plugins, webhooks for shipment events, and a sandbox environment for testing. Your developer can integrate in under a day. See our API Docs.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, bank transfers, and mobile money in supported countries. Enterprise clients can apply for Net-30 or Net-60 invoicing terms.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const [ref, inView] = useScrollReveal()

  return (
    <section className="py-24 bg-slate-50">
      <div ref={ref} className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className={`lg:sticky lg:top-28 ${inView ? 'animate-reveal-left' : 'opacity-0'}`}>
            <span className="section-label">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mt-4 mb-5">
              Questions & Answers
            </h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Got questions? We've got answers. Can't find what you're looking for?
              Our support team is available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Live Chat
              </Link>
              <a href="tel:+15126785033" className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white hover:shadow-md transition-all" style={{ textDecoration: 'none' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Call Us
              </a>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-3">
            {QUESTIONS.map((item, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
                  ${open === i ? 'border-yellow-200 shadow-md' : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'}
                  ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
                style={inView ? { animationDelay: `${0.1 + i * 0.07}s` } : {}}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className={`font-semibold text-sm md:text-base transition-colors ${open === i ? 'text-brand-red' : 'text-slate-800'}`}>
                    {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${open === i ? 'rotate-45' : 'bg-slate-100 text-slate-600'}`}
                    style={open === i ? { background: '#FF9800', color: '#1F2937' } : {}}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-yellow-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
