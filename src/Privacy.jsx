import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 font-sans text-white">
      <header className="border-b border-indigo-500/20 bg-[rgba(6,4,18,0.76)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 text-white/95 no-underline">
            <LogoMark size={36} />
            <span className="font-semibold tracking-widest text-base">ListMate</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-indigo-300 transition">← Back to home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: June 2025</p>

        <div className="space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Who we are</h2>
            <p>ListMate ("we", "us", "our") operates listmate.co.uk. This policy explains how we collect, use, and protect your personal data in accordance with the UK GDPR and the Data Protection Act 2018. For questions, contact us at <a href="mailto:privacy@listmate.co.uk" className="text-indigo-300 hover:text-white transition">privacy@listmate.co.uk</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Data we collect</h2>
            <p className="mb-3">We collect only what we need to provide the Service:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-white">Account data</strong> — your email address and hashed password when you register.</li>
              <li><strong className="text-white">Item data you submit</strong> — item names, descriptions, images, and details you enter to generate listings. Images are processed in memory and not stored long-term.</li>
              <li><strong className="text-white">Generated listings</strong> — AI-produced output is saved to your listing history so you can export it.</li>
              <li><strong className="text-white">Usage data</strong> — how many listings you have generated this month, for quota enforcement.</li>
              <li><strong className="text-white">Payment data</strong> — your subscription plan and Stripe customer ID. We never store card numbers; Stripe handles payment processing.</li>
              <li><strong className="text-white">Technical data</strong> — IP address, browser type, and server logs for security and debugging purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How we use your data</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>To provide, operate, and improve the Service.</li>
              <li>To enforce your plan quota and manage subscriptions.</li>
              <li>To send transactional emails (account confirmation, password reset, billing receipts).</li>
              <li>To detect fraud, abuse, and security incidents.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="mt-3">We do not sell your data or use it for advertising.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Legal basis for processing</h2>
            <p>We process your data on the basis of: <strong className="text-white">contract</strong> (to provide the Service you signed up for); <strong className="text-white">legitimate interests</strong> (security, fraud prevention, service improvement); and <strong className="text-white">legal obligation</strong> (financial record-keeping). Where we rely on consent, you may withdraw it at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-party processors</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong className="text-white">Supabase</strong> — authentication and database hosting. Data stored in EU data centres. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white transition">Privacy policy</a>.</li>
              <li><strong className="text-white">Stripe</strong> — payment processing. PCI-DSS compliant. <a href="https://stripe.com/gb/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white transition">Privacy policy</a>.</li>
              <li><strong className="text-white">Anthropic</strong> — AI model provider that powers listing generation. Item content you submit is sent to Anthropic's API and subject to their <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white transition">privacy policy</a>. Anthropic does not use API inputs to train models.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data retention</h2>
            <p>We retain your account data for as long as your account is active. Listing history is retained for 12 months and can be deleted at any time from your dashboard. If you close your account, we delete your personal data within 30 days, except where we are required to retain it by law (e.g. financial records for 6 years under HMRC rules).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your rights</h2>
            <p className="mb-3">Under UK GDPR you have the right to:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-white">Access</strong> — request a copy of your personal data.</li>
              <li><strong className="text-white">Rectification</strong> — ask us to correct inaccurate data.</li>
              <li><strong className="text-white">Erasure</strong> — ask us to delete your data ("right to be forgotten").</li>
              <li><strong className="text-white">Portability</strong> — receive your data in a machine-readable format.</li>
              <li><strong className="text-white">Restriction</strong> — ask us to limit processing in certain circumstances.</li>
              <li><strong className="text-white">Object</strong> — object to processing based on legitimate interests.</li>
            </ul>
            <p className="mt-3">To exercise any right, email <a href="mailto:privacy@listmate.co.uk" className="text-indigo-300 hover:text-white transition">privacy@listmate.co.uk</a>. We will respond within 30 days. You also have the right to lodge a complaint with the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white transition">Information Commissioner's Office (ICO)</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Cookies</h2>
            <p>We use a single session cookie to keep you logged in. We do not use tracking, analytics, or advertising cookies. No cookie consent banner is required as we only use strictly necessary cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Security</h2>
            <p>We use industry-standard measures to protect your data including HTTPS, encrypted passwords (bcrypt), and database-level row security. No system is completely secure — if you believe your account has been compromised, contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Changes to this policy</h2>
            <p>We may update this policy from time to time. Material changes will be communicated by email or a notice on the Service. The date at the top of this page shows when it was last updated.</p>
          </section>

        </div>
      </main>

      <footer className="border-t border-indigo-500/20 px-6 py-8 text-center text-xs text-white/30">
        <p>© 2025 ListMate · <Link to="/terms" className="hover:text-indigo-300 transition">Terms</Link> · <Link to="/privacy" className="hover:text-indigo-300 transition">Privacy</Link> · <Link to="/refund" className="hover:text-indigo-300 transition">Refunds</Link> · <Link to="/contact" className="hover:text-indigo-300 transition">Contact</Link></p>
      </footer>
    </div>
  );
}
