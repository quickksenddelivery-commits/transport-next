'use client'
import PageMeta from '../components/PageMeta'
import { Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard'
import type { ServiceCardData } from '../components/ServiceCard'

const SERVICES: ServiceCardData[] = [
  {
    id: 'import',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>,
    title: 'Import Clearance',
    desc: 'Our licensed customs brokers manage the full import clearance process — classification, duty calculation, entry filing, and release — so your goods clear without delays or penalties.',
    img: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    to: '/customs/import-clearance',
    featured: false,
  },
  {
    id: 'export',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>,
    title: 'Export Clearance',
    desc: 'We prepare all export declarations, obtain necessary permits, and ensure your shipment departs without regulatory issues — with electronic filing at all ports.',
    img: 'https://images.pexels.com/photos/4483942/pexels-photo-4483942.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    to: '/customs/export-clearance',
    featured: true,
  },
  {
    id: 'consulting',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>,
    title: 'Trade Consulting',
    desc: 'Our trade compliance consultants help you understand regulations, optimise duty payments, and avoid costly errors — with FTA analysis and staff training.',
    img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    to: '/customs/trade-consulting',
    featured: false,
  },
  {
    id: 'importer-rep',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>,
    title: "Importer's Representative",
    desc: 'We act as your official importer of record in markets requiring a local representative — assuming full compliance responsibility in 50+ countries.',
    img: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    to: '/customs/importer-representative',
    featured: true,
  },
]

const PROCESS = [
  { title: 'Document Review', desc: 'We review your commercial invoice, packing list, and all shipping documents for accuracy and compliance.' },
  { title: 'Classification', desc: 'Our brokers assign the correct HS tariff code to ensure the right duty rate and avoid misclassification penalties.' },
  { title: 'Entry Filing', desc: 'We file the customs entry electronically with the relevant authority and manage any queries from customs officers.' },
  { title: 'Duty Payment', desc: 'We calculate and process all applicable duties, taxes, and fees on your behalf — no surprises at the border.' },
  { title: 'Release & Delivery', desc: 'Once cleared, we coordinate delivery from the port or airport directly to your facility or warehouse.' },
]

export default function CustomsPage() {
  return (
    <div className="pt-20">
      <PageMeta title="Customs Clearance &amp; Trade Services" description="Licensed customs brokers for import/export clearance, IOR services, and trade consulting in 120+ countries." />
      {/* Hero */}
      <div className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 60%, #1976D2 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <img src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop" alt="" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
            Customs & Trade Compliance
          </span>
          <h1 className="font-black text-white mb-5" style={{ fontSize: 'clamp(36px, 6vw, 62px)', lineHeight: 1.1 }}>
            Clear Customs<br />
            <span style={{ color: '#FF9800' }}>Without the Headache</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '580px', margin: '0 auto 36px' }}>
            Licensed customs brokers handling import & export clearance, trade consulting, and full compliance management in 50+ countries.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary py-4! px-8! text-base!">Speak to a Broker</Link>
            <Link to="/contact" className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none' }}>
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Key credentials */}
      <div style={{ background: '#FF9800' }}>
        <div className="container mx-auto px-6 py-5 flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-800">
          {['🏛️ Licensed Customs Brokers', '⚡ 24-Hour Clearance Guarantee', '🌍 50+ Countries', '📋 Full Documentation Support', '🔒 100% Compliance Rate'].map(item => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Customs Services</h2>
            <p className="text-slate-500 max-w-xl mx-auto">From single shipment clearance to ongoing trade compliance — we cover every aspect of customs management.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {SERVICES.map(svc => (
              <div id={svc.id} key={svc.id}>
                <ServiceCard {...svc} btnLabel="Get Started" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clearance process */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Our Clearance Process</h2>
            <p className="text-slate-500 max-w-xl mx-auto">A proven 5-step process that gets your goods out of customs and into your hands quickly and compliantly.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-slate-100" style={{ margin: '0 10%' }} />
            <div className="grid md:grid-cols-5 gap-6">
              {PROCESS.map((step, i) => (
                <div key={step.title} className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl relative z-10" style={{ background: i === 0 ? 'linear-gradient(135deg,#1565C0,#0D47A1)' : i === PROCESS.length - 1 ? 'linear-gradient(135deg,#FF9800,#1565C0)' : 'white', color: i === 0 || i === PROCESS.length - 1 ? 'white' : '#64748b', border: '2px solid #e2e8f0' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 text-sm">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1565C0, #0D47A1)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Clear Customs Faster?</h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>Talk to one of our licensed customs brokers today. We'll review your requirements and give you a clearance strategy within 24 hours.</p>
          <Link to="/contact" className="btn-primary py-4! px-9! text-base!">Talk to a Broker</Link>
        </div>
      </div>
    </div>
  )
}
