'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import ServiceCard from '../components/ServiceCard'
import ServiceIcon from '../components/ServiceIcon'
import { CATALOGS, CATEGORY_META, type Category } from '../data/serviceCatalog'

export default function ServiceDetailPage({ category, slug }: { category: Category; slug: string }) {
  const router = useRouter()
  const catalog = category ? CATALOGS[category] : undefined
  const item = catalog?.find(s => s.slug === slug)
  const meta = category ? CATEGORY_META[category] : undefined

  useEffect(() => {
    if (!item && meta) router.replace(meta.path)
  }, [item, meta, router])

  if (!item || !catalog || !meta) return null

  const related = catalog.filter(s => s.slug !== slug).slice(0, 3)

  return (
    <div className="pt-20">
      <PageMeta title={item.title} description={item.desc} />

      {/* Hero */}
      <div className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 60%, #1976D2 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <img src={item.img} alt="" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to={meta.path} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">{meta.label}</Link>
            <span>/</span>
            <span style={{ color: 'white' }}>{item.title}</span>
          </div>

          <div className="max-w-2xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#FF9800' }}>
              <ServiceIcon d={item.icon} />
            </div>
            <h1 className="font-black text-white mb-5" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1 }}>
              {item.title}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', lineHeight: 1.7 }}>
              {item.longDesc}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/contact" className="btn-primary py-4! px-8! text-base!">Get a Quote</Link>
              <Link to="/track" className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none' }}>
                Track Shipment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features + image */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">What's Included</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-6">Everything you need, handled</h2>
            <ul className="space-y-4">
              {item.features.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(255,152,0,0.12)', color: '#FF9800' }}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}><path d="M4.5 12.75l6 6 9-13.5"/></svg>
                  </span>
                  <span className="text-slate-600 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ minHeight: 320 }} />
          </div>
        </div>
      </div>

      {/* Related services */}
      {related.length > 0 && (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Other {meta.label}</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Explore the rest of our {meta.label.toLowerCase()} offering.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {related.map(svc => (
                <ServiceCard key={svc.slug} {...svc} icon={<ServiceIcon d={svc.icon} />} btnLabel="Learn More" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1565C0, #0D47A1)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Talk to our team about {item.title.toLowerCase()} and get a transparent quote within 24 hours.
          </p>
          <Link to="/contact" className="btn-primary py-4! px-9! text-base!">Get a Free Quote</Link>
        </div>
      </div>
    </div>
  )
}
