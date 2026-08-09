export default function ShippingPolicyPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Shipping Policy</h1>
          <p className="text-white/50 text-sm">Last updated: 1 May 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-10">

            <Block title="1. Service Options">
              We offer the following shipping services:
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left p-3 font-semibold text-slate-700 border border-slate-200">Service</th>
                      <th className="text-left p-3 font-semibold text-slate-700 border border-slate-200">Transit Time</th>
                      <th className="text-left p-3 font-semibold text-slate-700 border border-slate-200">Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    {[
                      ['Express', 'Same-day / Next-day', 'Domestic + select international'],
                      ['Standard', '3–5 business days', 'Domestic'],
                      ['International Standard', '5–10 business days', '120+ countries'],
                      ['Air Freight', '2–4 business days', 'Worldwide'],
                      ['Sea Freight', '15–45 days', 'Major ports worldwide'],
                      ['Economy', '7–14 business days', 'Select international routes'],
                    ].map(([svc, time, coverage]) => (
                      <tr key={svc} className="border-b border-slate-100">
                        <td className="p-3 border border-slate-200 font-medium">{svc}</td>
                        <td className="p-3 border border-slate-200">{time}</td>
                        <td className="p-3 border border-slate-200">{coverage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              Transit times are estimates and begin from the point of pickup, not order placement. They exclude weekends and public holidays unless expressly stated.
            </Block>

            <Block title="2. Pickup and Drop-off">
              <strong>Scheduled Pickup:</strong> Available for most domestic and international shipments. Our courier will arrive within the selected time window. If no one is available at pickup, we will attempt once more before the booking is cancelled.<br /><br />
              <strong>Drop-off:</strong> You may drop off parcels at any Accessiblexpress partner location. Find your nearest drop-off point in the app or on our website.
            </Block>

            <Block title="3. Weight and Size Limits">
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mt-1">
                <li><strong>Express / Standard:</strong> Max 70 kg per parcel; max 120 × 60 × 60 cm</li>
                <li><strong>Air Freight:</strong> Max 1,000 kg per consignment (heavier cargo on request)</li>
                <li><strong>Sea Freight:</strong> No practical limit — LCL and FCL available</li>
                <li><strong>Volumetric weight:</strong> Charged at the greater of actual or volumetric weight (L × W × H cm ÷ 5,000)</li>
              </ul>
              Oversized parcels may incur additional handling fees.
            </Block>

            <Block title="4. Packaging Requirements">
              Senders are responsible for adequate packaging. We recommend:
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mt-2">
                <li>Double-wall corrugated cardboard boxes for parcels over 5 kg</li>
                <li>Bubble wrap or foam padding for fragile items (min. 5 cm on all sides)</li>
                <li>Waterproof inner lining for international shipments</li>
                <li>Clear labelling on all sides with sender and recipient details</li>
                <li>Removal or covering of old shipping labels</li>
              </ul>
              Claims for damage caused by inadequate packaging may be denied.
            </Block>

            <Block title="5. Tracking">
              All shipments include free real-time tracking. You will receive a tracking number at booking confirmation. Track at <strong>accessiblexpress.com/track</strong> or via SMS/email updates. Tracking events are typically updated within 30 minutes of a scan.
            </Block>

            <Block title="6. Delivery Attempts">
              For parcels requiring a signature, we will make up to <strong>3 delivery attempts</strong>. After the third failed attempt, the parcel will be held at a local depot for 7 days before being returned to sender at your cost. Safe-place and neighbour delivery instructions can be added at checkout.
            </Block>

            <Block title="7. Address Accuracy">
              You are responsible for providing a complete and accurate delivery address including postcode/ZIP, floor/apartment number, and any access instructions. Charges for address corrections or redelivery due to incorrect addresses are borne by the sender.
            </Block>

            <Block title="8. International Shipments">
              All international shipments require accurate customs declarations. Duties and taxes are determined by the destination country's customs authority and are the responsibility of the recipient unless you have selected a Delivered Duty Paid (DDP) service. Customs clearance may extend transit times. Accessiblexpress is not liable for delays caused by customs holds.
            </Block>

            <Block title="9. Delays and Force Majeure">
              We are not liable for delays caused by adverse weather, natural disasters, industrial action, government restrictions, air traffic control decisions, or any other event outside our reasonable control. We will communicate known delays as soon as possible.
            </Block>

            <Block title="10. Returns">
              Return shipments can be booked through your account dashboard or by contacting support. Return shipping costs are at the sender's expense unless the item was mis-shipped or damaged in transit through our fault.
            </Block>

            <Block title="11. Contact">
              For shipping enquiries:<br />
              <a href="mailto:support@accessiblexpress.com" className="text-red-600 hover:underline">support@accessiblexpress.com</a> · +1 (512) 678-5033
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
