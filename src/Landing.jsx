import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import LogoMark from './LogoMark';

function renderCell(value, isListmate) {
  if (value === true) {
    return (
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${isListmate ? 'bg-indigo-500/20 text-indigo-300' : 'bg-green-500/15 text-green-400'}`}>
        ✓
      </span>
    );
  }
  if (value === false) {
    return <span className="text-white/20 text-lg">—</span>;
  }
  // string — price value or ⚡ partial-support note
  const isPartial = typeof value === 'string' && value.startsWith('⚡');
  return (
    <span className={`text-xs font-medium ${isListmate ? 'text-indigo-300 font-bold' : isPartial ? 'text-amber-400/80' : 'text-white/50'}`}>
      {value}
    </span>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  async function handleChoosePlan(plan) {
    if (!user) {
      navigate('/signup');
      return;
    }

    setCheckoutError('');
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
      setCheckoutError(err.message);
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 font-sans text-white overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-indigo-500/20 bg-[rgba(6,4,18,0.76)] backdrop-blur-2xl shadow-2xl shadow-indigo-900/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3 text-white/95">
            <LogoMark size={44} />
            <span className="font-semibold tracking-widest text-lg">ListMate</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/60 lg:flex">
            <a href="#features" className="transition hover:text-indigo-300 hover:drop-shadow-lg">Features</a>
            <a href="#compare" className="transition hover:text-indigo-300 hover:drop-shadow-lg">Compare</a>
            <a href="#pricing" className="transition hover:text-indigo-300 hover:drop-shadow-lg">Pricing</a>
            <Link to="/login" className="transition hover:text-indigo-300 hover:drop-shadow-lg">Login</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/signup" className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-0.5 duration-300">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-28 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.07] animate-grid-drift"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>
        <div className="absolute inset-0 -z-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl opacity-20 animate-glow-float" style={{left: '-10%', top: '10%'}}></div>
        <div className="absolute inset-0 -z-10 h-96 w-96 rounded-full bg-indigo-900/10 blur-3xl opacity-30 animate-glow-float-delay" style={{right: '-5%', bottom: '20%'}}></div>
        <div className="absolute inset-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 blur-3xl opacity-40 animate-glow-pulse-large" style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}></div>

        <section className="grid gap-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] bg-transparent px-4 py-12 sm:px-6">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_50%_0%,_rgba(99,102,241,0.35)_0%,_transparent_65%)] blur-3xl" />
            <div className="relative space-y-8">
              <div className="max-w-2xl space-y-6">
                <div className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 px-4 py-2 backdrop-blur-sm overflow-hidden">
                  <span className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.9)]"></span>
                  <span className="relative text-xs font-semibold text-indigo-200 tracking-wider">POWERED BY AI</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_45px_rgba(99,102,241,0.35)]">
                  Listings that sell.
                </h1>
                <p className="text-lg lg:text-xl leading-relaxed text-white/70 max-w-xl">
                  AI-powered listing magic for eBay, Vinted, Depop & TikTok Shop. Generate marketplace-ready titles, descriptions and pricing in seconds.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/signup" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-4 text-sm font-semibold text-white transition hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 duration-300">
                  Get started free
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center rounded-full border border-indigo-500/50 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white/90 transition hover:bg-indigo-500/10 hover:border-indigo-400/80 duration-300">
                  See how it works →
                </a>
              </div>
            </div>
          </div>

            <div className="group relative rounded-[2rem] border border-indigo-500/40 bg-gradient-to-br from-indigo-900/20 via-slate-900/30 to-slate-900/40 p-8 backdrop-blur-xl shadow-2xl shadow-indigo-900/20 hover:shadow-indigo-500/30 hover:border-indigo-400/60 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500/5 to-transparent group-hover:from-indigo-500/15 transition-all duration-500"></div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Live Preview</p>
            <div className="mt-8 space-y-5 relative z-10">
              <div className="space-y-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition duration-300">
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Platform</label>
                <div className="rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-900/30 to-slate-900/30 px-4 py-3 text-white font-medium">eBay</div>
              </div>
              <div className="space-y-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition duration-300">
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Item</label>
                <div className="rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-900/30 to-slate-900/30 px-4 py-3 text-white font-medium">Nike Air Max 97, Size UK 9</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition duration-300">
                  <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Condition</label>
                  <div className="rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-900/30 to-slate-900/30 px-4 py-3 text-white font-medium">Used - Good</div>
                </div>
                <div className="space-y-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition duration-300">
                  <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Price</label>
                  <div className="rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-900/30 to-slate-900/30 px-4 py-3 text-white font-medium">£59.99</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-32 rounded-[2rem] border border-indigo-500/30 bg-gradient-to-r from-indigo-900/20 via-slate-900/20 to-indigo-900/20 backdrop-blur-xl px-8 py-16 sm:px-12 shadow-xl shadow-indigo-900/20">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold mb-8">Trusted by resellers on</p>
          <div className="grid gap-6 sm:grid-cols-4">
            {['eBay', 'Vinted', 'Depop', 'TikTok Shop'].map((label) => (
              <div key={label} className="group rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 to-transparent hover:from-indigo-500/20 px-6 py-5 text-center text-sm font-semibold text-indigo-200 backdrop-blur-sm transition hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 duration-300 cursor-pointer">
                {label}
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mt-40 space-y-16">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Why choose ListMate</p>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">Powerful features for smarter selling.</h2>
            <p className="text-lg leading-relaxed text-white/60 max-w-2xl">
              Everything you need to create professional listings that convert. Built for modern resellers.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative rounded-[2rem] border border-indigo-500/30 bg-gradient-to-br from-indigo-900/30 via-slate-900/40 to-slate-900/50 p-8 hover:border-indigo-400/60 transition duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-indigo-600/10 transition duration-500"></div>
              <p className="mb-6 text-4xl relative z-10">⚡</p>
              <p className="text-xl font-bold text-white relative z-10 mb-3">30-second listings</p>
              <p className="text-sm leading-7 text-white/60 relative z-10">Generate optimized titles and descriptions instantly. No more writer's block.</p>
            </div>
            <div className="group relative rounded-[2rem] border border-indigo-500/40 bg-gradient-to-br from-indigo-900/30 via-slate-900/40 to-slate-900/50 p-8 hover:border-indigo-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/30 cursor-pointer overflow-hidden hover:bg-indigo-900/40 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/8 group-hover:to-indigo-600/12 transition-all duration-500"></div>
              <p className="mb-6 text-4xl relative z-10 flex items-center justify-start"><span className="inline-block text-5xl">🌍</span></p>
              <p className="text-xl font-bold text-white relative z-10 mb-3">Built for UK resellers</p>
              <p className="text-sm leading-7 text-white/60 relative z-10">Pricing, postage and copy tailored for UK buyers and sellers.</p>
            </div>
            <div className="group relative rounded-[2rem] border border-indigo-500/30 bg-gradient-to-br from-indigo-900/30 via-slate-900/40 to-slate-900/50 p-8 hover:border-indigo-400/60 transition duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-indigo-600/10 transition duration-500"></div>
              <p className="mb-6 text-4xl relative z-10">🔄</p>
              <p className="text-xl font-bold text-white relative z-10 mb-3">All platforms covered</p>
              <p className="text-sm leading-7 text-white/60 relative z-10">One workflow for eBay, Vinted, Depop and TikTok Shop.</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mt-40 rounded-[2.5rem] border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 via-slate-900/30 to-indigo-900/20 backdrop-blur-xl px-8 py-20 sm:px-12 shadow-2xl shadow-indigo-900/20">
          <div className="max-w-3xl space-y-4 mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Simple workflow</p>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">Three steps to perfect listings.</h2>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            <div className="pointer-events-none absolute left-1/2 top-20 hidden h-64 w-px bg-gradient-to-b from-indigo-500/50 via-indigo-500/20 to-transparent md:block" />
            {[
              { title: 'Enter item details', description: 'Add title, condition, price, description and notes.' },
              { title: 'Pick your platform', description: 'Choose eBay, Vinted, Depop or TikTok Shop.' },
              { title: 'Copy and paste', description: 'Use the AI-written copy directly in your listing.' },
            ].map((step, index) => (
              <div key={step.title} className="group relative rounded-[2rem] border border-indigo-500/40 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 p-8 backdrop-blur-sm hover:border-indigo-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/30 hover:bg-indigo-900/50 hover:-translate-y-2 cursor-pointer">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-2xl font-bold text-white shadow-lg shadow-indigo-600/50 group-hover:shadow-indigo-600/80 transition duration-300">{index + 1}</div>
                <p className="mt-8 text-xl font-bold text-white">{step.title}</p>
                <p className="mt-4 text-sm leading-7 text-white/60">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Competitor Comparison ──────────────────────────────────── */}
        <section id="compare" className="mt-40 space-y-12">

          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Honest comparison</p>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">See why resellers choose ListMate.</h2>
            <p className="text-lg text-white/60 max-w-2xl">We measured ourselves against the tools UK resellers actually use. The gap is hard to ignore.</p>
          </div>

          {/* Quick-win stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { num: '10×', label: 'faster than writing manually' },
              { num: '£14', label: 'cheaper than Zik Analytics per month' },
              { num: '4', label: 'platforms covered in one workflow' },
            ].map(({ num, label }) => (
              <div key={label} className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/20 to-slate-900/20 backdrop-blur-sm px-5 py-6 text-center">
                <p className="text-4xl font-bold text-indigo-300">{num}</p>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-[2rem] border border-indigo-500/30 bg-gradient-to-br from-indigo-900/10 via-slate-900/20 to-slate-900/30 backdrop-blur-xl shadow-xl shadow-indigo-900/20">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-indigo-500/20">
                  <th className="text-left px-6 py-6 text-white/40 font-semibold w-52 text-xs uppercase tracking-wider">Feature</th>

                  {/* ListMate — highlighted column */}
                  <th className="px-5 py-6 text-center font-bold relative w-36">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/12 via-indigo-500/6 to-transparent pointer-events-none rounded-tl-none" />
                    <span className="block text-xs text-indigo-400 font-bold tracking-widest mb-1.5 relative z-10">★ BEST VALUE</span>
                    <span className="text-indigo-200 text-base font-bold relative z-10">ListMate</span>
                    <span className="block text-xs text-indigo-400/60 font-normal mt-0.5 relative z-10">from £0/mo</span>
                  </th>

                  <th className="px-5 py-6 text-center text-white/35 text-base font-semibold w-32">ChatGPT</th>
                  <th className="px-5 py-6 text-center text-white/35 text-base font-semibold w-36">Zik Analytics</th>
                  <th className="px-5 py-6 text-center text-white/35 text-base font-semibold w-28">AutoDS</th>
                </tr>
              </thead>
              <tbody>

                {/* ── AI & Generation ── */}
                <tr className="bg-indigo-950/50 border-y border-white/5">
                  <td colSpan={5} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-indigo-400/60">
                    AI &amp; Generation
                  </td>
                </tr>
                {[
                  { feature: 'AI listing generation',    lm: true,  gpt: '⚡ Manual prompt', zik: false,          ads: false },
                  { feature: 'Image-aware AI analysis',  lm: true,  gpt: true,               zik: false,          ads: false },
                  { feature: 'Platform-specific copy',   lm: true,  gpt: false,              zik: false,          ads: false },
                  { feature: 'Pricing suggestions',      lm: true,  gpt: false,              zik: true,           ads: true  },
                  { feature: 'Keyword optimisation',     lm: true,  gpt: false,              zik: '⚡ eBay only', ads: false },
                ].map(({ feature, lm, gpt, zik, ads }, i) => (
                  <tr key={feature} className={`border-b border-white/[0.04] hover:bg-indigo-500/5 transition-colors ${i % 2 ? 'bg-white/[0.015]' : ''}`}>
                    <td className="px-6 py-4 text-white/70 font-medium">{feature}</td>
                    <td className="px-5 py-4 text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/8 to-transparent pointer-events-none" />
                      <span className="relative z-10">{renderCell(lm, true)}</span>
                    </td>
                    <td className="px-5 py-4 text-center">{renderCell(gpt, false)}</td>
                    <td className="px-5 py-4 text-center">{renderCell(zik, false)}</td>
                    <td className="px-5 py-4 text-center">{renderCell(ads, false)}</td>
                  </tr>
                ))}

                {/* ── Platform Support ── */}
                <tr className="bg-indigo-950/50 border-y border-white/5">
                  <td colSpan={5} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-indigo-400/60">
                    Platform Support
                  </td>
                </tr>
                {[
                  { feature: 'eBay',                  lm: true, gpt: '⚡ Generic', zik: true,           ads: true  },
                  { feature: 'Vinted',                lm: true, gpt: '⚡ Generic', zik: false,          ads: false },
                  { feature: 'Depop',                 lm: true, gpt: '⚡ Generic', zik: false,          ads: false },
                  { feature: 'TikTok Shop',           lm: true, gpt: '⚡ Generic', zik: false,          ads: false },
                  { feature: 'Built for UK resellers',lm: true, gpt: false,        zik: '⚡ Partial',   ads: false },
                ].map(({ feature, lm, gpt, zik, ads }, i) => (
                  <tr key={feature} className={`border-b border-white/[0.04] hover:bg-indigo-500/5 transition-colors ${i % 2 ? 'bg-white/[0.015]' : ''}`}>
                    <td className="px-6 py-4 text-white/70 font-medium">{feature}</td>
                    <td className="px-5 py-4 text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/8 to-transparent pointer-events-none" />
                      <span className="relative z-10">{renderCell(lm, true)}</span>
                    </td>
                    <td className="px-5 py-4 text-center">{renderCell(gpt, false)}</td>
                    <td className="px-5 py-4 text-center">{renderCell(zik, false)}</td>
                    <td className="px-5 py-4 text-center">{renderCell(ads, false)}</td>
                  </tr>
                ))}

                {/* ── Workflow & Tools ── */}
                <tr className="bg-indigo-950/50 border-y border-white/5">
                  <td colSpan={5} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-indigo-400/60">
                    Workflow &amp; Tools
                  </td>
                </tr>
                {[
                  { feature: 'Hashtag / tag generation',   lm: true, gpt: false, zik: false, ads: false },
                  { feature: 'Platform tips per listing',  lm: true, gpt: false, zik: false, ads: false },
                  { feature: 'Listing history & export',   lm: true, gpt: false, zik: true,  ads: true  },
                  { feature: 'One-click copy per section', lm: true, gpt: false, zik: false, ads: false },
                  { feature: 'No setup or import needed',  lm: true, gpt: true,  zik: false, ads: false },
                ].map(({ feature, lm, gpt, zik, ads }, i) => (
                  <tr key={feature} className={`border-b border-white/[0.04] hover:bg-indigo-500/5 transition-colors ${i % 2 ? 'bg-white/[0.015]' : ''}`}>
                    <td className="px-6 py-4 text-white/70 font-medium">{feature}</td>
                    <td className="px-5 py-4 text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/8 to-transparent pointer-events-none" />
                      <span className="relative z-10">{renderCell(lm, true)}</span>
                    </td>
                    <td className="px-5 py-4 text-center">{renderCell(gpt, false)}</td>
                    <td className="px-5 py-4 text-center">{renderCell(zik, false)}</td>
                    <td className="px-5 py-4 text-center">{renderCell(ads, false)}</td>
                  </tr>
                ))}

                {/* ── Value & Pricing ── */}
                <tr className="bg-indigo-950/50 border-y border-white/5">
                  <td colSpan={5} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-indigo-400/60">
                    Value &amp; Pricing
                  </td>
                </tr>
                {[
                  { feature: 'Free tier available',    lm: true,        gpt: true,      zik: false,     ads: false      },
                  { feature: 'No credit card to try',  lm: true,        gpt: false,     zik: false,     ads: false      },
                  { feature: 'Starting price (paid)',  lm: '£5.99/mo',  gpt: '£17/mo',  zik: '£19/mo',  ads: '£9.90/mo' },
                ].map(({ feature, lm, gpt, zik, ads }, i) => (
                  <tr key={feature} className={`border-b border-white/[0.04] hover:bg-indigo-500/5 transition-colors ${i % 2 ? 'bg-white/[0.015]' : ''}`}>
                    <td className="px-6 py-4 text-white/70 font-medium">{feature}</td>
                    <td className="px-5 py-4 text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/8 to-transparent pointer-events-none" />
                      <span className="relative z-10">{renderCell(lm, true)}</span>
                    </td>
                    <td className="px-5 py-4 text-center">{renderCell(gpt, false)}</td>
                    <td className="px-5 py-4 text-center">{renderCell(zik, false)}</td>
                    <td className="px-5 py-4 text-center">{renderCell(ads, false)}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-5 text-xs text-white/35">
              <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 inline-flex items-center justify-center text-[10px] font-bold">✓</span> Full support</span>
              <span className="flex items-center gap-1.5"><span className="text-amber-400/80 font-medium">⚡</span> Partial / limited</span>
              <span className="flex items-center gap-1.5"><span className="text-white/20 text-base">—</span> Not available</span>
            </div>
            <p className="text-xs text-white/25">Based on publicly available info, June 2025. Prices in GBP.</p>
          </div>

          {/* CTA under the table */}
          <div className="flex justify-center pt-4">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-4 text-sm font-semibold text-white transition hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 duration-300">
              Start free — no card needed →
            </Link>
          </div>

        </section>

        <section id="pricing" className="mt-40 space-y-12">
          <div className="max-w-4xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Simple transparent pricing</p>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">Choose your plan.</h2>
            <p className="text-lg text-white/60 max-w-2xl">Start free. Scale as you grow. No surprises.</p>
            {checkoutError && (
              <p className="text-sm font-medium text-red-400">{checkoutError}</p>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3 pt-8 items-start">
            <div className="group relative rounded-[2rem] border border-indigo-500/40 bg-white/[0.03] backdrop-blur-xl p-8 text-white transition-all duration-500 hover:border-indigo-400/70 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-indigo-600/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="text-xs uppercase tracking-[0.3em] text-indigo-300 font-semibold">Free</div>
                <p className="mt-6 text-5xl font-bold">£0</p>
                <p className="mt-3 text-sm text-white/70 font-medium">5 listings / month</p>
                <ul className="mt-8 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-3"><span className="text-indigo-400 mt-1">✓</span> <span>AI listing generation</span></li>
                  <li className="flex items-start gap-3"><span className="text-indigo-400 mt-1">✓</span> <span>Basic UK pricing</span></li>
                  <li className="flex items-start gap-3"><span className="text-indigo-400 mt-1">✓</span> <span>Email support</span></li>
                </ul>
                <Link to="/signup" className="mt-8 block w-full rounded-full border border-indigo-500/40 bg-white/5 backdrop-blur-sm px-6 py-3 text-center text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/20 hover:border-indigo-400/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30">Start free</Link>
              </div>
            </div>

            <div className="group relative rounded-[2rem] border border-indigo-400/70 bg-gradient-to-br from-indigo-500/10 via-slate-900/30 to-slate-900/50 p-8 pt-10 text-white shadow-2xl shadow-indigo-900/40 overflow-hidden transition-all duration-500 hover:border-indigo-300 hover:shadow-indigo-500/50 hover:-translate-y-2.5 hover:from-indigo-500/20 cursor-pointer lg:scale-[1.04] animate-border-glow">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-600/30 to-violet-600/20 blur-3xl -z-10 group-hover:blur-2xl transition-all duration-500"></div>
              <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
              <div className="relative z-10">
                <div className="relative inline-flex overflow-hidden rounded-full bg-gradient-to-r from-indigo-500/40 to-pink-500/30 border border-indigo-400/70 px-4 py-1.5 text-xs font-bold text-indigo-100 backdrop-blur-sm tracking-wider group-hover:border-indigo-300 transition-all duration-300">
                  <span className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)]"></span>
                  <span className="relative">MOST POPULAR</span>
                </div>
                <div className="mt-6 text-xs uppercase tracking-[0.3em] text-indigo-200 font-semibold">Starter</div>
                <p className="mt-6 flex items-baseline gap-1 text-5xl font-bold">
                  £5.99 <span className="text-base font-medium text-white/50">/mo</span>
                </p>
                <p className="mt-3 text-sm text-white/70 font-medium">50 listings / month</p>
                <ul className="mt-8 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-3"><span className="text-indigo-300 mt-1">✓</span> <span>All Free features</span></li>
                  <li className="flex items-start gap-3"><span className="text-indigo-300 mt-1">✓</span> <span>Priority generation</span></li>
                  <li className="flex items-start gap-3"><span className="text-indigo-300 mt-1">✓</span> <span>Platform optimization</span></li>
                </ul>
                <button
                  type="button"
                  onClick={() => handleChoosePlan('starter')}
                  disabled={loadingPlan === 'starter'}
                  className="mt-8 w-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/70 hover:-translate-y-1.5 hover:from-indigo-500 hover:to-violet-500 active:translate-y-0 group-hover:scale-105 disabled:opacity-60"
                >
                  {loadingPlan === 'starter' ? 'Redirecting…' : 'Choose Starter'}
                </button>
              </div>
            </div>

            <div className="group relative rounded-[2rem] border border-indigo-500/40 bg-white/[0.03] backdrop-blur-xl p-8 text-white transition-all duration-500 hover:border-indigo-400/70 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-indigo-600/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="text-xs uppercase tracking-[0.3em] text-indigo-300 font-semibold">Pro</div>
                <p className="mt-6 flex items-baseline gap-1 text-5xl font-bold">
                  £11.99 <span className="text-base font-medium text-white/50">/mo</span>
                </p>
                <p className="mt-3 text-sm text-white/70 font-medium">Unlimited listings</p>
                <ul className="mt-8 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-3"><span className="text-indigo-400 mt-1">✓</span> <span>Everything in Starter</span></li>
                  <li className="flex items-start gap-3"><span className="text-indigo-400 mt-1">✓</span> <span>Unlimited outputs</span></li>
                  <li className="flex items-start gap-3"><span className="text-indigo-400 mt-1">✓</span> <span>Priority support</span></li>
                </ul>
                <button
                  type="button"
                  onClick={() => handleChoosePlan('pro')}
                  disabled={loadingPlan === 'pro'}
                  className="mt-8 w-full rounded-full border border-indigo-500/40 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/20 hover:border-indigo-400/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60"
                >
                  {loadingPlan === 'pro' ? 'Redirecting…' : 'Go Pro'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative mt-40 border-t border-indigo-500/20 bg-gradient-to-b from-slate-950/50 to-slate-950 px-6 py-12 text-white/60 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark size={32} />
            <div>
              <p className="font-semibold text-white">ListMate</p>
              <p className="text-xs text-white/40">© 2025 All rights reserved</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-sm">
            <Link to="/login" className="transition hover:text-indigo-300 hover:drop-shadow-lg duration-300">Login</Link>
            <Link to="/signup" className="transition hover:text-indigo-300 hover:drop-shadow-lg duration-300">Sign up</Link>
            <Link to="/pricing" className="transition hover:text-indigo-300 hover:drop-shadow-lg duration-300">Pricing</Link>
            <Link to="/terms" className="transition hover:text-indigo-300 hover:drop-shadow-lg duration-300">Terms</Link>
            <Link to="/privacy" className="transition hover:text-indigo-300 hover:drop-shadow-lg duration-300">Privacy</Link>
            <Link to="/refund" className="transition hover:text-indigo-300 hover:drop-shadow-lg duration-300">Refunds</Link>
            <Link to="/contact" className="transition hover:text-indigo-300 hover:drop-shadow-lg duration-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
