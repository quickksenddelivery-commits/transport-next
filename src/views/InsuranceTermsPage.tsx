export default function InsuranceTermsPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Insurance Terms</h1>
          <p className="text-white/50 text-sm">Last updated: 1 May 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-10">

            {/* Coverage summary cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Standard Cover', amount: 'Up to $500', desc: 'Included free with every shipment', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Enhanced Cover', amount: 'Up to $5,000', desc: 'Available at checkout for a small fee', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Premium Cover', amount: 'Up to $10,000', desc: 'For high-value and fragile goods', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
              ].map(tier => (
                <div key={tier.label} className={`rounded-xl p-4 border ${tier.color}`}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1">{tier.label}</p>
                  <p className="text-2xl font-black mb-1">{tier.amount}</p>
                  <p className="text-xs opacity-80">{tier.desc}</p>
                </div>
              ))}
            </div>

            <Block title="1. Overview">
              Every shipment sent through Accessiblexpress is automatically covered against loss and physical damage up to USD $500 at no extra cost. This coverage is underwritten by Lloyd's of London syndicate partners and administered by Accessiblexpress Ltd. You may purchase enhanced or premium coverage at checkout.
            </Block>

            <Block title="2. What Is Covered">
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mt-1">
                <li>Physical loss of the entire shipment while in our custody</li>
                <li>Physical damage to the contents caused by mishandling, collision, or crushing during transit</li>
                <li>Theft while in our possession or that of our contracted carrier partners</li>
                <li>Water damage resulting from carrier handling (not weather events)</li>
              </ul>
            </Block>

            <Block title="3. What Is Not Covered">
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mt-1">
                <li>Damage caused by inadequate or inappropriate packaging by the sender</li>
                <li>Inherent vice, deterioration, or perishable goods</li>
                <li>Delay, even if the shipment is ultimately lost</li>
                <li>Consequential losses (e.g. lost business, missed deadlines)</li>
                <li>Items in the prohibited list (see Terms of Service §4)</li>
                <li>Cash, jewellery, precious stones, art, or antiques unless declared and premium cover selected</li>
                <li>Electronic devices with pre-existing damage</li>
                <li>Loss or damage occurring after delivery is confirmed (signature or photo)</li>
                <li>Acts of war, terrorism, or government seizure</li>
              </ul>
            </Block>

            <Block title="4. Declared Value">
              You must declare the accurate commercial or replacement value of your shipment at booking. Underdeclaring value to reduce shipping costs will void your coverage. In the event of a claim, we may request proof of value (purchase receipts, invoices, or professional valuations).
            </Block>

            <Block title="5. How to File a Claim">
              <ol className="list-decimal pl-5 space-y-2 text-slate-600 text-sm mt-1">
                <li><strong>Report within 14 days</strong> of the expected or actual delivery date (7 days for visible damage).</li>
                <li>Log in to your account and go to <em>My Shipments → File a Claim</em>.</li>
                <li>Upload supporting evidence: photos of damage, original packaging, proof of value.</li>
                <li>Our claims team will acknowledge within 2 business days and aim to resolve within 10 business days.</li>
                <li>Approved payments are issued within 48 hours of resolution via your original payment method or bank transfer.</li>
              </ol>
            </Block>

            <Block title="6. Claims Evidence Requirements">
              To maximise the chance of a successful claim, retain:
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mt-2">
                <li>The original packaging (do not discard until the claim is resolved)</li>
                <li>Photographs of the damage and packaging from multiple angles</li>
                <li>Original purchase receipt or invoice for the damaged/lost items</li>
                <li>Tracking information showing the shipment was in our custody at time of loss/damage</li>
              </ul>
            </Block>

            <Block title="7. Subrogation">
              Where we pay a claim, Accessiblexpress Ltd acquires all rights of subrogation against responsible third parties. You agree to cooperate with any recovery action and to not settle independently with third parties once a claim has been approved.
            </Block>

            <Block title="8. Fraud">
              Submitting a fraudulent claim — including misrepresenting the value or condition of goods — will result in immediate account termination, forfeiture of all pending shipments, and may result in criminal prosecution.
            </Block>

            <Block title="9. Limitation of Liability">
              Our total liability for any single shipment, regardless of coverage tier purchased, shall not exceed USD $10,000. This limitation applies even if we have been advised of the possibility of greater loss.
            </Block>

            <Block title="10. Contact the Claims Team">
              Accessiblexpress Ltd · Claims Department<br />
              3800 N Lamar Blvd, Suite 200, Austin, TX 78756, USA<br />
              <a href="mailto:claims@accessiblexpress.com" className="text-red-600 hover:underline">claims@accessiblexpress.com</a> · +1 (512) 678-5044
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
