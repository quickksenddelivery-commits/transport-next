export default function TermsOfServicePage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Terms of Service</h1>
          <p className="text-white/50 text-sm">Last updated: 1 May 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-10">

            <Block title="1. Acceptance of Terms">
              By accessing or using any Accessiblexpress service — including our website, mobile application, API, and logistics services — you agree to be bound by these Terms of Service and all policies incorporated by reference. If you do not agree, you must not use our services.
            </Block>

            <Block title="2. Services">
              Accessiblexpress provides domestic and international parcel delivery, freight forwarding, warehousing, customs brokerage, and related logistics services. All services are subject to availability and our operational policies. We reserve the right to modify or discontinue any service with reasonable notice.
            </Block>

            <Block title="3. Account Registration">
              You must provide accurate, complete, and current information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorised access at <a href="mailto:security@accessiblexpress.com" className="text-red-600 hover:underline">security@accessiblexpress.com</a>.
            </Block>

            <Block title="4. Prohibited Items">
              You must not ship the following through our network:
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mt-2">
                <li>Illegal substances, narcotics, or controlled drugs</li>
                <li>Weapons, firearms, ammunition, or explosives</li>
                <li>Counterfeit, pirated, or stolen goods</li>
                <li>Hazardous materials not declared and packaged per IATA/ADR regulations</li>
                <li>Live animals (without prior written approval and required permits)</li>
                <li>Human remains or body parts</li>
                <li>Cash, negotiable instruments, or bearer bonds</li>
                <li>Any item prohibited by the origin or destination country</li>
              </ul>
              Shipments containing prohibited items will be seized and destroyed without compensation. You may face legal prosecution.
            </Block>

            <Block title="5. Pricing and Payment">
              Quoted prices are based on declared weight, dimensions, and service type. Final charges may include fuel surcharges, remote-area fees, customs duties, and taxes. Payment is due at booking unless you hold an approved credit account. All prices are in USD unless stated otherwise.
            </Block>

            <Block title="6. Liability and Claims">
              Our liability for loss or damage is limited to the lesser of the shipment's declared value or USD $500 per shipment under our standard coverage. Higher coverage is available at checkout. Claims must be submitted within 14 days of delivery (or expected delivery for lost shipments). We are not liable for: delays caused by customs, weather, or force majeure; indirect or consequential losses; or improper packaging by the sender.
            </Block>

            <Block title="7. Packaging">
              You are responsible for ensuring shipments are adequately packaged to withstand normal transport conditions. We reserve the right to refuse or repackage shipments at your cost if packaging is deemed insufficient.
            </Block>

            <Block title="8. Customs and Compliance">
              You warrant that all customs declarations are accurate and complete. You are solely responsible for duties, taxes, and fines arising from incorrect or incomplete declarations. Accessiblexpress acts as agent only — we are not the importer of record.
            </Block>

            <Block title="9. Intellectual Property">
              All content, trademarks, logos, and software on our platform are owned by Accessiblexpress Ltd or our licensors. You may not reproduce, distribute, or create derivative works without written permission.
            </Block>

            <Block title="10. Termination">
              We may suspend or terminate your account immediately if you breach these terms, engage in fraudulent activity, or pose a risk to our network. You may close your account at any time via account settings.
            </Block>

            <Block title="11. Governing Law">
              These terms are governed by the laws of the State of Texas, USA, without regard to conflict-of-law principles. Disputes will be resolved by binding arbitration in Austin, Texas, except where prohibited by local law.
            </Block>

            <Block title="12. Changes to Terms">
              We may revise these terms at any time. We will notify registered users of material changes by email at least 14 days before they take effect. Continued use constitutes acceptance.
            </Block>

            <Block title="13. Contact">
              Accessiblexpress Ltd · Legal Department<br />
              3800 N Lamar Blvd, Suite 200, Austin, TX 78756, USA<br />
              <a href="mailto:legal@accessiblexpress.com" className="text-red-600 hover:underline">legal@accessiblexpress.com</a>
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
