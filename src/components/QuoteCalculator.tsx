'use client'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import Reveal from './Reveal'

const ROUTES = [
  { label: 'Standard (5–7 days)',  days: '5–7',   rate: 1,    key: 'standard'  },
  { label: 'Express (2–3 days)',   days: '2–3',   rate: 1.8,  key: 'express'   },
  { label: 'Overnight (Next day)', days: '1',     rate: 2.8,  key: 'overnight' },
  { label: 'Economy (7–14 days)',  days: '7–14',  rate: 0.65, key: 'economy'   },
]

export default function QuoteCalculator() {
  const [form, setForm] = useState({ from: '', to: '', weight: '', length: '', width: '', height: '', type: '0' })
  const [quote, setQuote] = useState<null | { price: number; options: Array<{ label: string; days: string; rate: number; key?: string }> }>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const calculate = async () => {
    if (!form.from || !form.to || !form.weight) return
    setLoading(true)
    try {
      const result = await api.quote({
        from: form.from,
        to: form.to,
        weight: parseFloat(form.weight) || 1,
        length: parseFloat(form.length) || 10,
        width: parseFloat(form.width) || 10,
        height: parseFloat(form.height) || 10,
        service: ROUTES[parseInt(form.type)]?.key,
      })
      setQuote({ price: result.basePrice, options: result.options })
    } catch {
      // Fallback: local calculation when API is unavailable
      const w = parseFloat(form.weight) || 1
      const vol = ((parseFloat(form.length) || 10) * (parseFloat(form.width) || 10) * (parseFloat(form.height) || 10)) / 5000
      const base = 8 + Math.max(w, vol) * 3.2
      setQuote({ price: base, options: ROUTES })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <Reveal direction="up" className="text-center mb-14">
          <span className="section-label">Instant Quote</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mt-4 mb-4">
            Calculate Shipping Cost
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Get an instant price estimate for your shipment — no account needed.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.15} className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3 p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">From (City / Country)</label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK"
                    value={form.from}
                    onChange={e => set('from', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">To (City / Country)</label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK"
                    value={form.to}
                    onChange={e => set('to', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2.5"
                    value={form.weight}
                    onChange={e => set('weight', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Service Type</label>
                  <select
                    value={form.type}
                    onChange={e => set('type', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  >
                    <option value="0">Standard</option>
                    <option value="1">Express</option>
                    <option value="2">Overnight</option>
                    <option value="3">Economy</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Package Dimensions (cm)</label>
                  <div className="flex gap-3">
                    {['length', 'width', 'height'].map(dim => (
                      <input
                        key={dim}
                        type="number"
                        placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
                        value={form[dim as keyof typeof form]}
                        onChange={e => set(dim, e.target.value)}
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={calculate}
                disabled={loading}
                className="btn-primary w-full justify-center mt-6 py-4! disabled:opacity-60"
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculating…</>
                  : <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Calculate Shipping Cost
                    </>}
              </button>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 relative overflow-hidden p-8 md:p-10 flex flex-col justify-center">
              <img
                src="https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,8,64,0.97) 0%, rgba(22,49,102,0.94) 100%)' }} />
              <div className="relative z-10 flex flex-col flex-1 justify-center">
              {!quote ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white/50 text-sm">Fill in the form and click<br />"Calculate" to see pricing</p>
                </div>
              ) : (
                <div className="animate-fadeInUp">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Your Estimate</p>
                  <p className="text-5xl font-black text-white mb-1">
                    ${(quote.price * (quote.options[parseInt(form.type)]?.rate ?? 1)).toFixed(2)}
                  </p>
                  <p className="text-white/50 text-sm mb-6">Starting price · taxes may apply</p>

                  <div className="space-y-3">
                    {quote.options.map((opt, i) => (
                      <div key={opt.label} className={`rounded-xl p-3.5 border transition-all cursor-pointer ${
                        parseInt(form.type) === i
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`} onClick={() => set('type', String(i))}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-semibold">{opt.label}</p>
                            <p className="text-white/40 text-xs">{opt.days} business days</p>
                          </div>
                          <span className="text-yellow-400 font-bold text-sm">
                            ${(quote.price * opt.rate).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to="/contact" className="btn-primary w-full justify-center mt-5" style={{ textDecoration: 'none' }}>
                    Book This Shipment
                  </Link>
                </div>
              )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
