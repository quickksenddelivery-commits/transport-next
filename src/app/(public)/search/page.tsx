'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import PageMeta from '../../../components/PageMeta'
import Reveal from '../../../components/Reveal'

type Result =
  | { type: 'service'; title: string; desc: string; url: string; category: string; score: number }
  | { type: 'post'; title: string; desc: string; url: string; category: string; date: string; score: number }
  | { type: 'page'; title: string; desc: string; url: string; score: number }

export default function SearchPage() {
  const sp = useSearchParams()
  const [q, setQ] = useState(() => (sp.get('q') || ''))
  const [results, setResults] = useState<Result[] | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const spq = sp.get('q') || ''
    if (spq.trim()) {
      inputRef.current?.focus()
    }
  }, [sp])

  useEffect(() => {
    const trimmed = q.trim()
    if (!trimmed) return
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        const data = await res.json()
        setResults([...(data.services || []), ...(data.posts || []), ...(data.pages || [])])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  const label = (r: Result) => (r.type === 'page' ? 'Page' : r.type === 'post' ? 'Article' : 'Service')
  const color = (r: Result) => (r.type === 'page' ? '#64748b' : r.type === 'post' ? '#1565C0' : '#FF9800')

  return (
    <>
      <PageMeta title="Search" description="Search services, blog articles, and pages on Accessiblexpress." />

      <main className="pt-24 min-h-screen" style={{ background: '#f0f4f8' }}>
        <div className="container mx-auto px-6">
          <Reveal direction="up" className="text-center mb-12">
            <span className="section-label">Find Anything</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mt-4 mb-4">
              Search Accessiblexpress
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Look up services, shipping guides, company news, and support pages — all in one place.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.1} className="max-w-2xl mx-auto mb-14">
            <form
              onSubmit={e => { e.preventDefault(); setQ(q) }}
              className="relative flex items-center"
            >
              <svg
                className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-slate-400"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              >
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search services, articles, pages…"
                aria-label="Search"
                className="w-full pl-16 pr-6 py-5 rounded-2xl border border-slate-200 bg-white text-lg shadow-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </form>
          </Reveal>

          {loading && (
            <div className="text-center py-12 text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-yellow-400 rounded-full animate-spin mx-auto mb-3" />
              Searching…
            </div>
          )}

          {!loading && results && results.length === 0 && (
            <Reveal className="text-center py-16">
              <p className="text-slate-500 text-lg">No results for &ldquo;{q}&rdquo;.</p>
              <p className="text-slate-400 text-sm mt-2">Try a different term or contact us for help.</p>
            </Reveal>
          )}

          {!loading && results && results.length > 0 && (
            <Reveal className="max-w-3xl mx-auto pb-24">
              <p className="text-slate-500 text-sm mb-6">
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
              </p>
              <div className="space-y-3">
                {results.map((r: Result, i: number) => (
                  <Link
                    key={`${r.type}-${i}`}
                    href={r.url}
                    className="block bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-yellow-200 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 mt-1"
                        style={{ background: `${color(r)}15`, color: color(r) }}
                      >
                        {label(r)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 group-hover:text-yellow-600 transition-colors">
                          {r.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{r.desc}</p>
                        {(r.type === 'post' || r.type === 'service') && r.category && (
                          <p className="text-slate-400 text-xs mt-2 uppercase tracking-wide">{r.category}</p>
                        )}
                        {r.type === 'post' && r.date && (
                          <p className="text-slate-400 text-xs mt-1">{r.date}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-slate-300 shrink-0 mt-2 group-hover:text-yellow-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {!q.trim() && (
            <Reveal className="max-w-3xl mx-auto pb-24">
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center">
                <p className="text-slate-700 font-bold mb-3 text-lg">Popular searches</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['freight', 'customs clearance', 'moving services', 'tracking', 'quote', 'shipping times'].map(term => (
                    <button
                      key={term}
                      onClick={() => setQ(term)}
                      className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-600 hover:bg-yellow-50 hover:border-yellow-200 hover:text-slate-800 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </main>
    </>
  )
}
