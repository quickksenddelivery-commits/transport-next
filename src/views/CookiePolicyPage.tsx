export default function CookiePolicyPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Cookie Policy</h1>
          <p className="text-white/50 text-sm">Last updated: 1 May 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-10">

            <Block title="1. What Are Cookies?">
              Cookies are small text files placed on your device when you visit a website. They allow the site to remember your preferences, keep you logged in, and understand how you interact with our platform. Similar technologies include web beacons, pixel tags, and local storage.
            </Block>

            <Block title="2. Cookies We Use">
              <div className="space-y-4 mt-2">
                <CookieCategory
                  name="Essential Cookies"
                  required
                  examples={['Session token', 'CSRF protection', 'Load balancer affinity']}
                  purpose="Required for the platform to function. Without these, core features like login, checkout, and tracking will not work."
                />
                <CookieCategory
                  name="Performance Cookies"
                  examples={['Google Analytics (_ga, _gid)', 'Hotjar session recording']}
                  purpose="Help us understand how visitors use our site so we can improve performance and usability. All data is anonymised."
                />
                <CookieCategory
                  name="Functional Cookies"
                  examples={['Language preference', 'Currency setting', 'Recently tracked shipments']}
                  purpose="Remember your preferences so you don't have to re-enter them each visit."
                />
                <CookieCategory
                  name="Marketing Cookies"
                  examples={['Google Ads (_gcl_au)', 'Meta Pixel (fbp)', 'LinkedIn Insight Tag']}
                  purpose="Used to show you relevant ads on other platforms. Only set with your consent."
                />
              </div>
            </Block>

            <Block title="3. Managing Cookies">
              You can control cookies in the following ways:
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mt-2">
                <li><strong>Cookie banner:</strong> Use our consent banner on first visit to accept or reject non-essential cookies.</li>
                <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies via Settings → Privacy.</li>
                <li><strong>Opt-out tools:</strong> Google Analytics opt-out: <a href="https://tools.google.com/dlpage/gaoptout" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a></li>
              </ul>
              Note: blocking essential cookies will prevent the platform from functioning correctly.
            </Block>

            <Block title="4. Third-Party Cookies">
              Some cookies are set by third-party services embedded in our platform (e.g. embedded maps, payment widgets). These are governed by the respective third party's cookie policies, over which we have no control.
            </Block>

            <Block title="5. Cookie Retention">
              Session cookies expire when you close your browser. Persistent cookies expire as follows: performance cookies up to 2 years; functional cookies up to 1 year; marketing cookies up to 90 days.
            </Block>

            <Block title="6. Changes to This Policy">
              We may update this Cookie Policy when we add new features or change our technology stack. We will notify you via the cookie consent banner if material changes affect your preferences.
            </Block>

            <Block title="7. Contact">
              For questions about our use of cookies:<br />
              <a href="mailto:privacy@accessiblexpress.com" className="text-red-600 hover:underline">privacy@accessiblexpress.com</a>
            </Block>

          </div>
        </div>
      </section>
    </main>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">{title}</h2>
      <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function CookieCategory({ name, required = false, examples, purpose }: {
  name: string
  required?: boolean
  examples: string[]
  purpose: string
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-slate-800 text-sm">{name}</span>
        {required
          ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">Always On</span>
          : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Requires Consent</span>}
      </div>
      <p className="text-slate-500 text-xs mb-2">{purpose}</p>
      <p className="text-slate-400 text-xs">Examples: {examples.join(' · ')}</p>
    </div>
  )
}
