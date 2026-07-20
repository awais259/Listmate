import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';

export default function Refund() {
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
        <h1 className="text-4xl font-bold mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: July 2026</p>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Overview</h2>
            <p>This policy explains how subscriptions to ListMate are cancelled and when refunds apply. It should be read alongside our <Link to="/terms" className="text-indigo-300 hover:text-white transition">Terms of Service</Link>. ListMate is operated by lookntook ltd.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Free plan</h2>
            <p>The Free plan (5 listings per month) is available at no cost and requires no payment details. You can stop using it at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Cancelling a paid plan</h2>
            <p className="mb-3">You can cancel your Starter (£5.99/mo) or Pro (£11.99/mo) subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period, and you keep access to paid features until then.</p>
            <p>After cancellation your account automatically returns to the Free plan. We do not charge any cancellation fee.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Refunds</h2>
            <p className="mb-3">Subscriptions are billed monthly in advance. We do not provide refunds for partial or unused portions of a billing period once that period has started.</p>
            <p>If you believe you were charged in error — for example a duplicate charge or a billing fault on our side — contact us within 14 days and we will investigate and issue a refund where a genuine error is found.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Your UK consumer rights</h2>
            <p className="mb-3">Under the UK Consumer Contracts Regulations you normally have a 14-day right to cancel a purchase of digital services. Because ListMate provides digital content and services immediately, by subscribing and starting to generate listings you agree that the service begins right away and acknowledge that your 14-day cancellation right may be lost once the service has been used.</p>
            <p>This policy does not affect your statutory rights under UK consumer law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. How to request a refund or cancel</h2>
            <p>Manage or cancel your subscription in your account settings, or email us at <a href="mailto:support@listmate.co.uk" className="text-indigo-300 hover:text-white transition">support@listmate.co.uk</a> and we will help. Please include the email address on your account.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-indigo-500/20 px-6 py-8 text-center text-xs text-white/30">
        <p>© 2025 ListMate · <Link to="/terms" className="hover:text-indigo-300 transition">Terms</Link> · <Link to="/privacy" className="hover:text-indigo-300 transition">Privacy</Link> · <Link to="/refund" className="hover:text-indigo-300 transition">Refunds</Link> · <Link to="/contact" className="hover:text-indigo-300 transition">Contact</Link></p>
      </footer>
    </div>
  );
}
