import PageMeta from '../components/PageMeta'
const RELEASES = [
  {
    date: 'May 15, 2025',
    title: 'Accessiblexpress Raises $40M Series B to Accelerate Global Expansion',
    excerpt: 'The funding round, led by Sequoia Capital, will be used to expand operations into Southeast Asia and deepen AI-powered logistics capabilities.',
  },
  {
    date: 'March 8, 2025',
    title: 'Accessiblexpress Achieves ISO 9001:2015 Certification for Quality Management',
    excerpt: 'The certification underscores our commitment to delivering consistent, high-quality logistics services across all 120+ countries we serve.',
  },
  {
    date: 'January 22, 2025',
    title: 'Accessiblexpress Partners with DHL for Last-Mile Delivery in West Africa',
    excerpt: "The strategic partnership expands our delivery network to over 12 million households across West Africa, Southeast Asia, and Latin America.",
  },
  {
    date: 'November 10, 2024',
    title: 'Accessiblexpress Launches Real-Time Carbon Footprint Tracker for Shipments',
    excerpt: 'Shippers can now view and offset the CO₂ emissions of every shipment directly from their dashboard — a first in the African logistics market.',
  },
  {
    date: 'August 4, 2024',
    title: 'Accessiblexpress Delivers Its 1,000,000th Package',
    excerpt: 'Reaching one million deliveries in under three years, Accessiblexpress celebrates the milestone with a free shipping campaign for SME customers.',
  },
]

const COVERAGE = [
  { outlet: 'TechCrunch',    headline: '"Accessiblexpress is redefining what logistics looks like for emerging markets"' },
  { outlet: 'Forbes Africa', headline: '"The startup digitising freight for a continent on the move"' },
  { outlet: 'Reuters',       headline: '"Series B signals growing investor confidence in African logistics tech"' },
  { outlet: 'Bloomberg',     headline: '"Accessiblexpress\'s real-time tracking is what shippers have been waiting for"' },
]

export default function PressPage() {
  return (
    <main style={{ paddingTop: 98 }}>
      <PageMeta title="Press &amp; Media" description="Latest Accessiblexpress press releases, media assets, and coverage from around the world." />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)', padding: '64px 0 48px' }}>
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5" style={{ background: 'rgba(255,152,0,0.12)', border: '1px solid rgba(255,152,0,0.3)', color: '#FF9800' }}>
            Newsroom
          </span>
          <h1 className="font-black text-white mb-3" style={{ fontSize: 'clamp(32px,4.5vw,56px)', letterSpacing: '-1px' }}>
            Press & Media
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
            Latest news, press releases, and media resources from Accessiblexpress.
          </p>
        </div>
      </section>

      {/* Media contact + kit */}
      <section className="py-12" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-bold text-slate-800 mb-1">Media Enquiries</h2>
            <p className="text-slate-500 text-sm">Contact our communications team for interviews, quotes, and assets.</p>
            <a href="mailto:press@accessiblexpress.com" className="text-sm font-semibold mt-1 inline-block" style={{ color: '#1565C0', textDecoration: 'none' }}>press@accessiblexpress.com</a>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shrink-0 opacity-60 cursor-not-allowed"
            style={{ background: '#1565C0', color: 'white' }}
            disabled
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Media Kit
          </button>
        </div>
      </section>

      {/* Press releases */}
      <section className="py-16" style={{ background: 'white' }}>
        <div className="container mx-auto px-6">
          <h2 className="font-black text-slate-900 mb-8" style={{ fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.5px' }}>Press Releases</h2>
          <div className="space-y-4 max-w-3xl">
            {RELEASES.map(r => (
              <div key={r.title} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:border-slate-200 transition-all group cursor-pointer">
                <p className="text-xs font-semibold text-slate-400 mb-2">{r.date}</p>
                <h3 className="font-bold text-slate-800 mb-2 leading-snug group-hover:text-[#1565C0] transition-colors">{r.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{r.excerpt}</p>
                <span className="flex items-center gap-1 text-sm font-semibold mt-3 opacity-50 cursor-default" style={{ color: '#1565C0' }}>
                  Read Full Release
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media coverage */}
      <section className="py-16" style={{ background: '#f8fafc' }}>
        <div className="container mx-auto px-6">
          <h2 className="font-black text-slate-900 mb-8" style={{ fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.5px' }}>Media Coverage</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            {COVERAGE.map(c => (
              <div key={c.outlet} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{c.outlet}</p>
                <p className="text-slate-700 font-medium leading-snug text-sm italic">"{c.headline.replace(/^"|"$/g, '')}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand assets */}
      <section className="py-16" style={{ background: 'white' }}>
        <div className="container mx-auto px-6">
          <h2 className="font-black text-slate-900 mb-3" style={{ fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.5px' }}>Brand Assets</h2>
          <p className="text-slate-500 mb-8 max-w-lg">Use our official logo, colours, and brand guidelines when writing about Accessiblexpress.</p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
            {['Logo Pack (SVG/PNG)', 'Brand Guidelines PDF', 'Product Screenshots'].map(item => (
              <div key={item} className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl opacity-60 cursor-default">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(21,101,192,0.07)' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </div>
                <span className="text-sm font-semibold text-slate-500">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
