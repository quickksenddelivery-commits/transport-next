'use client'
import PageMeta from '../components/PageMeta'
import { useState } from 'react'
import { api } from '../lib/api'

const OFFICES = [
  {
    city: 'Austin, TX (HQ)',
    address: '3800 N Lamar Blvd, Suite 200, Austin, TX 78756, USA',
    phone: '+1 (512) 678-5033',
    email: 'hello@accessiblexpress.com',
    img: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  },
  {
    city: 'London, UK',
    address: '47 Canary Wharf, London, E14 5AB, United Kingdom',
    phone: '+44 20 7946 0512',
    email: 'london@accessiblexpress.com',
    img: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  },
  {
    city: 'Dubai, UAE',
    address: 'Jebel Ali Free Zone, Building 3, Dubai, UAE',
    phone: '+971 4 425 8800',
    email: 'dubai@accessiblexpress.com',
    img: 'https://images.pexels.com/photos/823696/pexels-photo-823696.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  },
]

const PinSVG = () => <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
const PhoneSVG = () => <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M2.25 6.338c0 .768.107 1.51.303 2.21 1.14 4.075 4.833 7.77 8.908 8.907.7.196 1.443.303 2.21.303 2.074 0 4.012-.594 5.644-1.625M2.25 6.338C2.25 4.517 3.663 3 5.406 3h1.125c.337 0 .662.088.948.254L9.374 4.46a1.125 1.125 0 01.414 1.512L8.73 7.67a.75.75 0 00-.05.544l.052.213c.398 1.625 1.455 3.178 2.73 4.504 1.325 1.275 2.879 2.332 4.504 2.73l.213.052a.75.75 0 00.544-.05l1.696-1.057a1.125 1.125 0 011.512.414l1.207 1.9c.167.287.255.61.255.949v1.125c0 1.742-1.516 3.156-3.338 3.156"/></svg>
const MailSVG = () => <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>

type FormState = 'idle' | 'sending' | 'sent'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: 'General Inquiry', message: '' })
  const [state, setState] = useState<FormState>('idle')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending')
    try {
      await api.contact({
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        subject: form.subject,
        message: form.message,
      })
      setState('sent')
    } catch {
      setState('idle')
      alert('Failed to send message. Please try again or email us directly.')
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <PageMeta title="Contact Us" description="Reach our logistics team for shipping quotes, support, and enquiries. We respond within 4 hours on business days." />
      {/* Header */}
      <div className="relative py-20 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Get in Touch</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>
            Whether you need a quote, have a question, or want to explore enterprise options — we're here.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left: Channels */}
          <div className="space-y-5">
            {[
              { icon: <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>, title: 'Live Chat', desc: 'Chat with a support agent right now. Available 24/7.', action: 'Start Chat →', color: 'bg-blue-50 border-blue-100' },
              { icon: <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M2.25 6.338c0 .768.107 1.51.303 2.21 1.14 4.075 4.833 7.77 8.908 8.907.7.196 1.443.303 2.21.303 2.074 0 4.012-.594 5.644-1.625M2.25 6.338C2.25 4.517 3.663 3 5.406 3h1.125c.337 0 .662.088.948.254L9.374 4.46a1.125 1.125 0 01.414 1.512L8.73 7.67a.75.75 0 00-.05.544l.052.213c.398 1.625 1.455 3.178 2.73 4.504 1.325 1.275 2.879 2.332 4.504 2.73l.213.052a.75.75 0 00.544-.05l1.696-1.057a1.125 1.125 0 011.512.414l1.207 1.9c.167.287.255.61.255.949v1.125c0 1.742-1.516 3.156-3.338 3.156"/></svg>, title: 'Call Us', desc: '+1 (512) 678-5033', action: 'Available 24/7', color: 'bg-green-50 border-green-100' },
              { icon: <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>, title: 'Email Support', desc: 'hello@accessiblexpress.com', action: '< 4 hour response', color: 'bg-yellow-50 border-yellow-100' },
              { icon: <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/></svg>, title: 'Enterprise Sales', desc: 'For volume deals, API access, and custom logistics.', action: 'sales@accessiblexpress.com', color: 'bg-purple-50 border-purple-100' },
              { icon: <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>, title: 'WhatsApp', desc: 'Quick questions? Message us on WhatsApp.', action: '+1 (512) 678-5033', color: 'bg-emerald-50 border-emerald-100' },
            ].map(ch => (
              <div key={ch.title} className={`rounded-2xl border p-5 ${ch.color}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">{ch.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{ch.title}</h4>
                    <p className="text-slate-500 text-xs mt-0.5 mb-2">{ch.desc}</p>
                    <p className="text-blue-700 text-xs font-semibold">{ch.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
              {state === 'sent' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><svg className="w-9 h-9 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                  <h2 className="text-2xl font-black text-slate-800 mb-3">Message Sent!</h2>
                  <p className="text-slate-500 mb-6">We'll get back to you within 4 hours during business hours.</p>
                  <button onClick={() => { setForm({ name:'', email:'', company:'', subject:'General Inquiry', message:'' }); setState('idle') }} className="btn-primary">Send Another Message</button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Send us a Message</h2>
                  <p className="text-slate-500 text-sm mb-7">We respond to every message within 4 hours on business days.</p>
                  <form onSubmit={submit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Full Name *</label>
                        <input required type="text" value={form.name} onChange={e => set('name', e.target.value)}
                          placeholder="John Smith"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Email Address *</label>
                        <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                          placeholder="john@company.com"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Company</label>
                        <input type="text" value={form.company} onChange={e => set('company', e.target.value)}
                          placeholder="Your company name"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Subject</label>
                        <select value={form.subject} onChange={e => set('subject', e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all bg-white">
                          <option>General Inquiry</option>
                          <option>Get a Shipping Quote</option>
                          <option>Track a Shipment</option>
                          <option>Enterprise / Sales</option>
                          <option>Claim / Complaint</option>
                          <option>API Integration</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Message *</label>
                      <textarea required rows={5} value={form.message} onChange={e => set('message', e.target.value)}
                        placeholder="Tell us how we can help..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={state === 'sending'} className="btn-primary w-full justify-center py-4!">
                      {state === 'sending'
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation: 'spin 1s linear infinite' }} /> Sending…</>
                        : <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            Send Message
                          </>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Offices */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-black text-slate-800 mb-8">Our Offices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {OFFICES.map(office => (
              <div key={office.city} className="card-hover bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-44 overflow-hidden">
                  <img src={office.img} alt={office.city} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="font-bold text-slate-800">{office.city}</h3>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <p className="flex items-start gap-1.5"><PinSVG />{office.address}</p>
                    <p className="flex items-center gap-1.5"><PhoneSVG />{office.phone}</p>
                    <p className="flex items-center gap-1.5"><MailSVG />{office.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
