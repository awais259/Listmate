import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import LogoMark from './LogoMark';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '£0',
    period: '',
    tagline: '5 listings / month',
    features: [
      'AI listing generation',
      'All 4 platforms',
      'Basic pricing suggestions',
      'Listing history',
      'Email support',
    ],
    cta: 'Get started free',
    ctaLink: '/signup',
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '£5.99',
    period: '/mo',
    tagline: '50 listings / month',
    badge: 'Most popular',
    features: [
      'Everything in Free',
      'Priority generation',
      'Platform-specific tips',
      'Hashtag generation',
      'Image-aware AI',
    ],
    cta: 'Choose Starter',
    highlight: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '£11.99',
    period: '/mo',
    tagline: 'Unlimited listings',
    features: [
      'Everything in Starter',
      'Unlimited outputs',
      'Priority support',
      'Early access to new features',
    ],
    cta: 'Go Pro',
    highlight: false,
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  async function handleChoosePlan(plan) {
    if (!user) { navigate('/signup'); return; }
    setError('');
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to start checkout.');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 font-sans text-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-indigo-500/20 bg-[rgba(6,4,18,0.76)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-white/95 no-underline">
            <LogoMark size={38} />
            <span className="font-semibold tracking-widest text-base">ListMate</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/40 transition">
                Go to dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-white/60 hover:text-indigo-300 transition">Login</Link>
                <Link to="/signup" className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/40 transition">
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-20">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Simple, transparent pricing</p>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            Choose your plan.
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Start free. Scale as you grow. Cancel anytime — no long-term contracts.
          </p>
          {error && <p className="text-sm font-medium text-red-400">{error}</p>}
        </div>

        {/* Plans */}
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[2rem] p-8 text-white transition-all duration-500 overflow-hidden
                ${plan.highlight
                  ? 'border border-indigo-400/70 bg-gradient-to-br from-indigo-500/10 via-slate-900/30 to-slate-900/50 shadow-2xl shadow-indigo-900/40 lg:scale-[1.04]'
                  : 'border border-indigo-500/40 bg-white/[0.03] backdrop-blur-xl hover:border-indigo-400/70 hover:bg-white/[0.06]'
                }`}
            >
              {plan.highlight && (
                <>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-600/30 to-violet-600/20 blur-3xl -z-10" />
                  <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                </>
              )}

              {plan.badge && (
                <div className="mb-4 inline-flex overflow-hidden rounded-full bg-gradient-to-r from-indigo-500/40 to-violet-500/30 border border-indigo-400/70 px-4 py-1.5 text-xs font-bold text-indigo-100 tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="text-xs uppercase tracking-[0.3em] text-indigo-300 font-semibold">{plan.name}</div>
              <p className="mt-5 flex items-baseline gap-1 text-5xl font-bold">
                {plan.price}
                {plan.period && <span className="text-base font-medium text-white/50">{plan.period}</span>}
              </p>
              <p className="mt-2 text-sm text-white/60 font-medium">{plan.tagline}</p>

              <ul className="mt-8 space-y-3 text-sm text-white/70">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-0.5 ${plan.highlight ? 'text-indigo-300' : 'text-indigo-400'}`}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.ctaLink ? (
                <Link
                  to={plan.ctaLink}
                  className="mt-8 block w-full rounded-full border border-indigo-500/40 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-white/80 transition hover:bg-white/15 hover:border-indigo-400/60"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleChoosePlan(plan.id)}
                  disabled={!!loadingPlan}
                  className={`mt-8 w-full rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 disabled:opacity-60
                    ${plan.highlight
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-0.5'
                      : 'border border-indigo-500/40 bg-white/5 text-white/80 hover:bg-white/15 hover:border-indigo-400/60'
                    }`}
                >
                  {loadingPlan === plan.id ? 'Redirecting…' : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ-style reassurance */}
        <div className="mt-24 grid gap-6 sm:grid-cols-3 text-center">
          {[
            { icon: '🔒', title: 'No lock-in', body: 'Cancel your subscription any time from your account settings. No questions asked.' },
            { icon: '💳', title: 'Secure payments', body: 'Payments handled by Stripe. We never see or store your card details.' },
            { icon: '♻️', title: 'Resets monthly', body: 'Your listing count resets on the 1st of each month. Unused allowance doesn\'t roll over.' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-indigo-500/20 bg-indigo-900/10 backdrop-blur-sm px-6 py-8">
              <div className="text-3xl mb-4">{icon}</div>
              <p className="font-semibold text-white mb-2">{title}</p>
              <p className="text-sm text-white/50 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-16 text-center">
          <Link to="/" className="text-sm text-indigo-300 hover:text-white transition">← Back to home</Link>
        </div>
      </main>

      <footer className="border-t border-indigo-500/20 px-6 py-8 text-center text-xs text-white/30">
        <p>© 2025 ListMate · <Link to="/terms" className="hover:text-indigo-300 transition">Terms</Link> · <Link to="/privacy" className="hover:text-indigo-300 transition">Privacy</Link></p>
      </footer>
    </div>
  );
}
