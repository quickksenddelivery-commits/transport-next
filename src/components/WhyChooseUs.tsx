'use client'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '2-Hour Express Pickup',
    desc: 'Place an order and our courier arrives within 2 hours for urgent domestic shipments.',
    color: 'bg-yellow-400',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Real-Time GPS Tracking',
    desc: 'Monitor your shipment on a live map down to the last mile. Updates every 30 seconds.',
    color: 'bg-red-600',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Full Insurance Coverage',
    desc: 'Every shipment is insured up to $10,000. File a claim online and get paid within 48 hours.',
    color: 'bg-yellow-400',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '24/7 Live Support',
    desc: 'Dedicated support agents available around the clock via live chat, phone, or WhatsApp.',
    color: 'bg-red-600',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
      </svg>
    ),
    title: '120+ Countries',
    desc: 'Seamless international shipping with local expertise, customs clearance, and last-mile coverage.',
    color: 'bg-yellow-400',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Transparent Pricing',
    desc: 'No hidden fees, no surprises. See the full cost breakdown before you confirm any shipment.',
    color: 'bg-red-600',
  },
]

export default function WhyChooseUs() {
  const [ref, inView] = useScrollReveal()

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div ref={ref} className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text — slides in from left */}
          <div className={inView ? 'animate-reveal-left' : 'opacity-0'}>
            <span className="section-label">Why Accessiblexpress</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mt-4 mb-5">
              The Smarter Choice for{' '}
              <span className="gradient-text-shimmer">Global Shipping</span>
            </h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              We're not just a courier — we're your end-to-end logistics partner.
              Built with cutting-edge technology and backed by a global network of partners.
            </p>

            <div
              className={`flex gap-4 ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
              style={inView ? { animationDelay: '0.55s' } : {}}
            >
              <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started Free</Link>
              <Link to="/about" className="flex items-center gap-2 text-slate-700 font-semibold hover:text-blue-700 transition-colors" style={{ textDecoration: 'none' }}>
                <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 hover:scale-110">▶</span>
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Right: Feature grid — slides in from right, staggered */}
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className={`group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm
                  transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-200
                  ${inView ? 'animate-reveal-right' : 'opacity-0'}`}
                style={inView ? { animationDelay: `${0.1 + i * 0.08}s` } : {}}
              >
                <div className={`w-10 h-10 ${feat.color} rounded-xl flex items-center justify-center text-white mb-4
                  transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  {feat.icon}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5">{feat.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
