'use client'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const STEPS = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Create Shipment',
    desc: 'Enter package details, pickup and delivery addresses. Get an instant quote in seconds.',
    color: 'bg-yellow-400',
    glow: 'rgba(255,152,0,0.4)',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Schedule Pickup',
    desc: 'Choose a convenient pickup time. Our courier arrives at your doorstep right on schedule.',
    color: 'bg-yellow-400',
    glow: 'rgba(255,152,0,0.4)',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Live Tracking',
    desc: 'Track your package in real-time via app, SMS, or email. Know exactly where it is, always.',
    color: 'bg-red-600',
    glow: 'rgba(21,101,192,0.35)',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Delivered!',
    desc: 'Package safely delivered with proof of delivery photo, digital signature, and instant notification.',
    color: 'bg-yellow-400',
    glow: 'rgba(255,152,0,0.4)',
  },
]

export default function HowItWorks() {
  const [ref, inView] = useScrollReveal()

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div ref={ref} className="container mx-auto px-6">
        <div className={`text-center mb-16 ${inView ? 'animate-reveal-up' : 'opacity-0'}`}>
          <span className="section-label">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mt-4 mb-4">
            How It Works
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Ship your package in 4 easy steps. From quote to delivery — we handle everything in between.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line — draws in when visible */}
          <div
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 z-0 origin-left"
            style={{
              background: 'linear-gradient(to right, #FF9800, #1565C0)',
              opacity: 0.25,
              transform: inView ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }}
          />
          {/* Animated package traveling along the line */}
          {inView && (
            <div
              className="hidden lg:flex absolute z-10 items-center justify-center w-7 h-7 rounded-full bg-yellow-400 shadow-lg"
              style={{
                top: '6px',
                left: '12.5%',
                animation: 'travelLine 3.2s cubic-bezier(0.4,0,0.6,1) 1.4s forwards',
                boxShadow: '0 0 14px rgba(255,152,0,0.7)',
              }}
            >
              <svg className="w-3.5 h-3.5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}>
                <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
              </svg>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`flex flex-col items-center text-center group ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
                style={inView ? { animationDelay: `${0.2 + i * 0.13}s` } : {}}
              >
                {/* Icon circle with glow */}
                <div
                  className={`relative w-20 h-20 rounded-full ${step.color} flex items-center justify-center text-white mb-5
                    transition-all duration-500 group-hover:scale-110`}
                  style={{ boxShadow: `0 8px 24px ${step.glow}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${step.glow.replace('0.35', '0.65').replace('0.4', '0.7')}` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${step.glow}` }}
                >
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow border-2 border-slate-100 flex items-center justify-center text-xs font-black text-slate-600">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`mt-14 text-center ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
             style={inView ? { animationDelay: '0.75s' } : {}}>
          <Link to="/contact" className="btn-primary py-4! px-10!" style={{ textDecoration: 'none' }}>
            Start Shipping Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
