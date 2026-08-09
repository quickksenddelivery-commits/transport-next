'use client'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'

const TEAM = [
  { name: 'Emeka Okafor', role: 'CEO & Founder', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', bio: '20+ years in global logistics. Former VP at a Big 3 courier.' },
  { name: 'Adeola Bright', role: 'Chief Operations Officer', img: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', bio: 'Built logistics operations across 14 African countries.' },
  { name: 'David Mensah', role: 'CTO', img: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', bio: 'Ex-Amazon logistics tech lead. Obsessed with real-time systems.' },
  { name: 'Sophie Laurent', role: 'Head of Global Partnerships', img: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', bio: 'Built our carrier network to 300+ global partners in 3 years.' },
  { name: 'Kwame Asante', role: 'Head of Customs & Compliance', img: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', bio: 'Licensed customs broker in 40+ countries. Former UNCTAD advisor.' },
  { name: 'Priya Sharma', role: 'VP of Customer Success', img: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', bio: 'Led support teams for 15K+ business clients across 120 countries.' },
]

const TIMELINE = [
  { year: '2016', event: 'Founded', desc: 'Started with 3 vans and a dream to modernise global logistics.' },
  { year: '2018', event: 'First International Route', desc: 'Launched our first international air freight corridor. 200 packages in month one.' },
  { year: '2020', event: 'Tech Platform Launch', desc: 'Built our proprietary tracking and route optimisation system.' },
  { year: '2022', event: '50 Countries Covered', desc: 'Expanded to Europe, Middle East, and Southeast Asia.' },
  { year: '2023', event: '1 Million Packages', desc: 'Hit 1 million successful deliveries. 15,000 business clients.' },
  { year: '2024', event: '120+ Countries', desc: 'Now the largest independently-owned logistics platform in Africa.' },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      <PageMeta title="About Accessiblexpress" description="Accessiblexpress is a global logistics company trusted by 50,000+ businesses across 120+ countries. Shipping worldwide since 2016." />
      {/* Hero */}
      <div className="relative h-[520px] overflow-hidden flex items-center">
        <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop" alt="Team" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,8,64,0.95) 50%, rgba(13,8,64,0.5))' }} />
        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
            Our Story
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5 max-w-2xl" style={{ lineHeight: 1.1 }}>
            We're Rewriting the Rules of Global Logistics
          </h1>
          <p className="text-white/60 text-lg max-w-xl leading-relaxed">
            Built for the world. Accessiblexpress was founded on a simple belief:
            shipping should be fast, transparent, and accessible to every business on earth.
          </p>
        </div>
      </div>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Our Mission</span>
              <h2 className="text-4xl font-black text-slate-800 mt-4 mb-5">
                Logistics Without Limits
              </h2>
              <p className="text-slate-500 text-lg mb-6 leading-relaxed">
                We started Accessiblexpress because we experienced first-hand how difficult and opaque
                shipping could be — especially for businesses in emerging markets.
                Our mission is to give every business, regardless of size or location,
                access to world-class logistics infrastructure.
              </p>
              <p className="text-slate-500 text-lg leading-relaxed">
                Today we serve 15,000+ businesses from solo entrepreneurs to Fortune 500
                companies, delivering to 120+ countries with an industry-leading 99.2%
                on-time delivery rate.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <svg className="w-7 h-7" style={{ color: '#1565C0' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>, title: 'Integrity', desc: 'No hidden fees. No surprises. We say what we mean.' },
                { icon: <svg className="w-7 h-7" style={{ color: '#FF9800' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>, title: 'Speed', desc: 'We optimise every process so you get faster delivery.' },
                { icon: <svg className="w-7 h-7" style={{ color: '#1565C0' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9 4.5-4.03 4.5-9-2.015-9-4.5-9z"/></svg>, title: 'Inclusion', desc: 'Every market deserves enterprise-grade logistics.' },
                { icon: <svg className="w-7 h-7" style={{ color: '#FF9800' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, title: 'Innovation', desc: 'We build the technology others wish existed.' },
              ].map(v => (
                <div key={v.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="mb-3">{v.icon}</div>
                  <h4 className="font-bold text-slate-800 mb-1.5">{v.title}</h4>
                  <p className="text-slate-500 text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '2016', label: 'Founded' },
              { val: '120+', label: 'Countries Covered' },
              { val: '1M+', label: 'Packages Delivered' },
              { val: '400+', label: 'Team Members' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-black text-slate-800 mb-1">{s.val}</p>
                <p className="text-slate-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="section-label">Our Journey</span>
            <h2 className="text-4xl font-black text-slate-800 mt-4">From 3 Vans to 120 Countries</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-slate-900 font-black text-xs shrink-0" style={{ background: '#FF9800' }}>
                    {item.year.slice(2)}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-2" />}
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-sm" style={{ color: '#1565C0' }}>{item.year}</span>
                    <h3 className="font-black text-slate-800">{item.event}</h3>
                  </div>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="section-label">Leadership</span>
            <h2 className="text-4xl font-black text-slate-800 mt-4 mb-4">Meet the Team</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">World-class logistics expertise, combined with a deep passion for technology and African business.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {TEAM.map(member => (
              <div key={member.name} className="card-hover bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-56 overflow-hidden">
                  <img src={member.img} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-800 text-lg">{member.name}</h3>
                  <p className="font-semibold text-sm mb-2" style={{ color: '#1565C0' }}>{member.role}</p>
                  <p className="text-slate-500 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse image */}
      <section className="relative h-80 overflow-hidden flex items-center">
        <img src="https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop" alt="Warehouse" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'rgba(13,8,64,0.7)' }} />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Join 15,000+ Businesses?</h2>
          <p className="text-white/60 mb-8 text-lg">Start shipping in minutes. No contracts, no setup fees.</p>
          <Link to="/contact" className="btn-primary py-4! px-9! text-base!">Get Started Free</Link>
        </div>
      </section>
    </div>
  )
}
