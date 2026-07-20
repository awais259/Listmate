import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`ListMate enquiry from ${name || 'a customer'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:support@listmate.co.uk?subject=${subject}&body=${body}`;
  };

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
        <h1 className="text-4xl font-bold mb-2">Contact us</h1>
        <p className="text-white/40 text-sm mb-12">We usually reply within 1–2 working days.</p>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Get in touch</h2>
            <p className="mb-3">
              Questions about your account, billing, or a listing? Email us any time at{' '}
              <a href="mailto:support@listmate.co.uk" className="text-indigo-300 hover:text-white transition">support@listmate.co.uk</a>.
            </p>
            <p>For privacy or data requests, use{' '}
              <a href="mailto:privacy@listmate.co.uk" className="text-indigo-300 hover:text-white transition">privacy@listmate.co.uk</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-1">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-indigo-400/25 bg-slate-900/50 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-indigo-400/60 transition"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Your email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-indigo-400/25 bg-slate-900/50 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-indigo-400/60 transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-indigo-400/25 bg-slate-900/50 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-indigo-400/60 transition"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-400 transition"
              >
                Send message
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Company details</h2>
            <p className="mb-1">ListMate is operated by <strong className="text-white">lookntook ltd</strong>.</p>
            <p className="mb-1">Registered in England &amp; Wales.</p>
            <p className="text-white/40 text-sm">Company No. 14851224 · Registered office: 85 Blackburn Way, Hounslow, England, TW4 5AH</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-indigo-500/20 px-6 py-8 text-center text-xs text-white/30">
        <p>© 2025 ListMate · <Link to="/terms" className="hover:text-indigo-300 transition">Terms</Link> · <Link to="/privacy" className="hover:text-indigo-300 transition">Privacy</Link> · <Link to="/refund" className="hover:text-indigo-300 transition">Refunds</Link> · <Link to="/contact" className="hover:text-indigo-300 transition">Contact</Link></p>
      </footer>
    </div>
  );
}
