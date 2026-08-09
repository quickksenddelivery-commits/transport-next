'use client'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function CTABanner() {
  const [ref, inView] = useScrollReveal(0.2)

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #E68900 40%, #1565C0 100%)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(100,10,0,0.2)' }} />

      {/* Animated background orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 60% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      {/* Text-legibility scrim — the orange stretch of the gradient is too
          light for white text to clear WCAG AA on its own (~2.3:1) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 95% 90% at 50% 45%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.32) 60%, rgba(0,0,0,0.1) 90%, transparent 100%)' }}
      />

      <div ref={ref} className="container mx-auto px-6 relative z-10 text-center">
        {/* Icon */}
        <div
          className={`w-20 h-20 bg-white/15 border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-float
            ${inView ? 'animate-reveal-scale' : 'opacity-0'}`}
          style={inView ? { animationDelay: '0s' } : {}}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
          </svg>
        </div>

        <h2
          className={`text-4xl md:text-6xl font-black text-white mb-5 leading-tight ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
          style={inView ? { animationDelay: '0.1s' } : {}}
        >
          Ready to Ship Your First Package?
        </h2>
        <p
          className={`text-white/90 text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
          style={inView ? { animationDelay: '0.2s' } : {}}
        >
          Join 15,000+ businesses that trust Accessiblexpress for fast, reliable, and insured shipping to 120+ countries.
        </p>

        <div
          className={`flex flex-wrap items-center justify-center gap-4 mb-12 ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
          style={inView ? { animationDelay: '0.3s' } : {}}
        >
          <Link to="/contact" className="bg-white font-black px-10 py-5 rounded-xl text-base flex items-center gap-2
            transition-all duration-200 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-yellow-50 active:scale-95"
            style={{ color: '#1565C0', textDecoration: 'none' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/>
            </svg>
            Start Shipping Free
          </Link>
          <Link to="/contact" className="btn-outline-white py-5! px-10! border-white/50!" style={{ textDecoration: 'none' }}>
            Talk to Sales
          </Link>
        </div>

        {/* Trust signals */}
        <div
          className={`flex flex-wrap items-center justify-center gap-6 text-white/85 text-sm ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
          style={inView ? { animationDelay: '0.42s' } : {}}
        >
          {['No credit card required', 'First shipment 20% off', '24/7 support included', 'Cancel anytime'].map(t => (
            <div key={t} className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
