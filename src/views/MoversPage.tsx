'use client'
import PageMeta from '../components/PageMeta'
import { Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard'
import type { ServiceCardData } from '../components/ServiceCard'

const SERVICES: ServiceCardData[] = [
  {
    id: 'household',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>,
    title: 'Household Relocation',
    desc: 'From studio apartments to large family homes — we pack, load, transport, and unpack your belongings with the care they deserve, including specialty items like pianos and antiques.',
    img: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    to: '/movers/household-goods',
    featured: false,
  },
  {
    id: 'commercial',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>,
    title: 'Commercial & Office Moving',
    desc: 'Our commercial moving team executes office and business relocations outside business hours to minimise disruption. From desks to server rooms — with a dedicated project coordinator.',
    img: 'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    to: '/movers/commercial-goods',
    featured: true,
  },
  {
    id: 'international',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>,
    title: 'International Relocation',
    desc: 'We manage the entire international move — pre-move surveys, customs clearance, export/import documentation, door-to-door worldwide delivery, and settling-in support.',
    img: 'https://images.pexels.com/photos/5025521/pexels-photo-5025521.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    to: '/movers/international-moving',
    featured: false,
  },
  {
    id: 'storage',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>,
    title: 'Storage & Packing',
    desc: 'Secure, climate-controlled storage available short or long-term with 24/7 CCTV. Professional packing materials, fragile item wrapping, and easy access to your items anytime.',
    img: 'https://images.pexels.com/photos/4246019/pexels-photo-4246019.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    to: '/movers/storage-packing',
    featured: true,
  },
]

const STEPS = [
  { num: '01', title: 'Book a Survey', desc: 'Request a free home or office survey. Our team will assess your move and give you a detailed, no-obligation quote.' },
  { num: '02', title: 'Plan Your Move', desc: 'We create a custom moving plan — timeline, crew size, packing strategy, and route — tailored to your needs.' },
  { num: '03', title: 'Pack & Load', desc: 'Our trained crew arrives on moving day, carefully packs everything, and loads it onto our secure vehicles.' },
  { num: '04', title: 'Delivery & Setup', desc: 'We deliver your items to the new location and can unpack and reassemble furniture so you\'re ready immediately.' },
]

export default function MoversPage() {
  return (
    <div className="pt-20">
      <PageMeta title="Household &amp; Commercial Moving Services" description="Professional moving for homes, offices, and international relocations. Free survey, full insurance, flexible scheduling." />
      {/* Hero */}
      <div className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 60%, #1976D2 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <img src="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop" alt="" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute top-10 left-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(21,101,192,0.25), transparent 70%)' }} />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
            Moving Services
          </span>
          <h1 className="font-black text-white mb-5" style={{ fontSize: 'clamp(36px, 6vw, 62px)', lineHeight: 1.1 }}>
            We Move What<br />
            <span style={{ color: '#FF9800' }}>Matters Most to You</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '580px', margin: '0 auto 36px' }}>
            Household, commercial, and international relocation — handled with care, precision, and zero stress from your end.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary py-4! px-8! text-base!">Book a Free Survey</Link>
            <Link to="/contact" className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none' }}>
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-5 flex flex-wrap justify-center gap-8 text-sm text-slate-500">
          {['✅ Fully insured moves', '🔒 Secure storage', '📦 Professional packing', '🌍 International relocation', '📞 Dedicated coordinator'].map(item => (
            <span key={item} className="font-medium">{item}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-800 mb-4">How Your Move Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">A simple, transparent process designed around you — from first contact to final placement.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-slate-200 z-0" style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 2rem)' }} />
                )}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative z-10 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl" style={{ background: 'linear-gradient(135deg,#FF9800,#1565C0)', color: 'white' }}>
                    {step.num}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Moving Services</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Whatever your moving need, we have a solution tailored to fit.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {SERVICES.map(svc => (
              <div id={svc.id} key={svc.id}>
                <ServiceCard {...svc} btnLabel="Book This Service" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg,#0D47A1,#1565C0)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Plan Your Move?</h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>Book a free, no-obligation home or office survey today and we'll give you a transparent quote within 24 hours.</p>
          <Link to="/contact" className="btn-primary py-4! px-9! text-base!">Book Free Survey</Link>
        </div>
      </div>
    </div>
  )
}
