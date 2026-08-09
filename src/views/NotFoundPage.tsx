'use client'
import PageMeta from '../components/PageMeta'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <PageMeta title="Page Not Found" description="The page you are looking for doesn't exist. Return home or track your shipment." />
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
          alt=""
          loading="eager"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,8,64,0.97) 0%, rgba(15,36,68,0.93) 50%, rgba(22,49,102,0.88) 100%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      {/* Glow blobs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,152,0,0.12) 0%, transparent 65%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(21,101,192,0.12) 0%, transparent 65%)' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 animate-fadeInUp">
        {/* 404 number */}
        <div className="mb-6">
          <span
            className="font-black leading-none select-none"
            style={{
              fontSize: 'clamp(100px, 20vw, 200px)',
              background: 'linear-gradient(135deg, rgba(255,152,0,0.15) 0%, rgba(21,101,192,0.15) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 60px rgba(255,152,0,0.2))',
            }}
          >
            404
          </span>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255,152,0,0.15)', border: '1px solid rgba(255,152,0,0.3)' }}>
          <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
          Package Not Found
        </h1>
        <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Looks like this shipment went off-route. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-primary w-full sm:w-auto justify-center py-4! px-8!"
            style={{ boxShadow: '0 12px 40px rgba(255,152,0,0.3)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <Link
            to="/track"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(255,255,255,0.2)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Track a Package
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {[
            { label: 'Services', to: '/services' },
            { label: 'About Us', to: '/about' },
            { label: 'Contact', to: '/contact' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
