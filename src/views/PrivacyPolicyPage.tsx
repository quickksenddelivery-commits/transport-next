'use client'
import { Link } from 'react-router-dom'

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-white/50 text-sm">Last updated: 1 May 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose prose-slate max-w-none space-y-10">

            <Block title="1. Introduction">
              Accessiblexpress Ltd ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights under applicable data protection laws including the GDPR and CCPA.
            </Block>

            <Block title="2. Data We Collect">
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li><strong>Account data:</strong> name, email address, phone number, company name.</li>
                <li><strong>Shipment data:</strong> sender and recipient addresses, package details, tracking events.</li>
                <li><strong>Payment data:</strong> billing address and last 4 digits of card (full card numbers are processed by Stripe and never stored on our servers).</li>
                <li><strong>Usage data:</strong> pages visited, browser type, IP address, device identifiers, and referral source.</li>
                <li><strong>Communications:</strong> support tickets, live-chat transcripts, and email correspondence.</li>
              </ul>
            </Block>

            <Block title="3. How We Use Your Data">
              We use your data to: provide and improve our logistics services; process and track shipments; send transactional notifications (booking confirmations, tracking updates, delivery alerts); respond to support queries; detect fraud and ensure platform security; comply with legal and regulatory obligations; and, where you have given consent, send marketing communications.
            </Block>

            <Block title="4. Legal Basis for Processing">
              We process your data under the following legal bases: <strong>contract performance</strong> (to fulfil a shipment you have booked); <strong>legitimate interests</strong> (fraud prevention, service improvement); <strong>legal obligation</strong> (tax records, customs documentation); and <strong>consent</strong> (marketing emails — you can withdraw at any time).
            </Block>

            <Block title="5. Sharing Your Data">
              We share data only as necessary:
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm mt-2">
                <li><strong>Carrier partners</strong> — to execute the shipment (DHL, FedEx, Maersk, etc.).</li>
                <li><strong>Customs authorities</strong> — as required by the destination country.</li>
                <li><strong>Payment processors</strong> — Stripe Inc., under their own privacy policy.</li>
                <li><strong>Cloud infrastructure</strong> — AWS and Google Cloud, under standard contractual clauses.</li>
                <li><strong>Analytics</strong> — aggregated, anonymised data only.</li>
              </ul>
              We never sell your personal data to third parties.
            </Block>

            <Block title="6. Cookies">
              We use essential cookies (required for the platform to function), performance cookies (anonymised analytics), and, with your consent, marketing cookies. See our <Link to="/legal/cookies" className="text-red-600 hover:underline">Cookie Policy</Link> for full details.
            </Block>

            <Block title="7. Data Retention">
              We retain account and shipment records for 7 years to comply with financial regulations. Support communications are retained for 3 years. You may request deletion of non-legally-required data at any time.
            </Block>

            <Block title="8. Your Rights">
              Depending on your jurisdiction, you have the right to: access, correct, or delete your personal data; restrict or object to processing; data portability; and to withdraw consent. To exercise any right, email <a href="mailto:privacy@accessiblexpress.com" className="text-red-600 hover:underline">privacy@accessiblexpress.com</a>. We will respond within 30 days.
            </Block>

            <Block title="9. International Transfers">
              Your data may be transferred to and processed in countries outside your own. Where required, we use Standard Contractual Clauses approved by the European Commission to safeguard such transfers.
            </Block>

            <Block title="10. Security">
              We implement TLS encryption in transit, AES-256 encryption at rest, role-based access controls, and annual third-party security audits. We are ISO 27001 certified.
            </Block>

            <Block title="11. Children's Privacy">
              Our services are not directed at children under 16. We do not knowingly collect data from minors. If you believe a child has provided us with personal data, contact us immediately.
            </Block>

            <Block title="12. Changes to This Policy">
              We may update this policy periodically. Material changes will be notified by email or in-app banner. Continued use of the platform after the effective date constitutes acceptance.
            </Block>

            <Block title="13. Contact">
              Accessiblexpress Ltd · Data Protection Officer<br />
              3800 N Lamar Blvd, Suite 200, Austin, TX 78756, USA<br />
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
