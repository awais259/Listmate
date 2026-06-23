import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 font-sans text-white overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-[rgba(15,10,30,0.72)] backdrop-blur-2xl shadow-2xl shadow-purple-900/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3 text-white/95">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-xl font-bold text-white shadow-lg shadow-purple-500/50">L</div>
            <span className="font-semibold tracking-widest text-lg">ListMate</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/60 lg:flex">
            <a href="#features" className="transition hover:text-purple-300 hover:drop-shadow-lg">Features</a>
            <a href="#pricing" className="transition hover:text-purple-300 hover:drop-shadow-lg">Pricing</a>
            <Link to="/login" className="transition hover:text-purple-300 hover:drop-shadow-lg">Login</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/signup" className="rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 duration-300">
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
              'linear-gradient(rgba(168,85,247,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.6) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>
        <div className="absolute inset-0 -z-10 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl opacity-20 animate-glow-float" style={{left: '-10%', top: '10%'}}></div>
        <div className="absolute inset-0 -z-10 h-96 w-96 rounded-full bg-purple-900/10 blur-3xl opacity-30 animate-glow-float-delay" style={{right: '-5%', bottom: '20%'}}></div>
        <div className="absolute inset-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl opacity-40 animate-glow-pulse-large" style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}></div>

        <section className="grid gap-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] bg-transparent px-4 py-12 sm:px-6">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_50%_0%,_rgba(168,85,247,0.35)_0%,_transparent_65%)] blur-3xl" />
            <div className="relative space-y-8">
              <div className="max-w-2xl space-y-6">
                <div className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/10 border border-purple-500/30 px-4 py-2 backdrop-blur-sm overflow-hidden">
                  <span className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)]"></span>
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.9)]"></span>
                  <span className="relative text-xs font-semibold text-purple-200 tracking-wider">POWERED BY AI</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_45px_rgba(168,85,247,0.35)]">
                  Listings that sell.
                </h1>
                <p className="text-lg lg:text-xl leading-relaxed text-white/70 max-w-xl">
                  AI-powered listing magic for eBay, Vinted, Depop & TikTok Shop. Generate marketplace-ready titles, descriptions and pricing in seconds.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/signup" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-4 text-sm font-semibold text-white transition hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 duration-300">
                  Get started free
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center rounded-full border border-purple-500/50 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white/90 transition hover:bg-purple-500/10 hover:border-purple-400/80 duration-300">
                  See how it works →
                </a>
              </div>
            </div>
          </div>

            <div className="group relative rounded-[2rem] border border-purple-500/40 bg-gradient-to-br from-purple-900/20 via-slate-900/30 to-slate-900/40 p-8 backdrop-blur-xl shadow-2xl shadow-purple-900/20 hover:shadow-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-purple-500/5 to-transparent group-hover:from-purple-500/15 transition-all duration-500"></div>
            <p className="text-xs uppercase tracking-[0.4em] text-purple-300 font-semibold">Live Preview</p>
            <div className="mt-8 space-y-5 relative z-10">
              <div className="space-y-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition duration-300">
                <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Platform</label>
                <div className="rounded-xl border border-purple-400/30 bg-gradient-to-r from-purple-900/30 to-slate-900/30 px-4 py-3 text-white font-medium">eBay</div>
              </div>
              <div className="space-y-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition duration-300">
                <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Item</label>
                <div className="rounded-xl border border-purple-400/30 bg-gradient-to-r from-purple-900/30 to-slate-900/30 px-4 py-3 text-white font-medium">Nike Air Max 97, Size UK 9</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition duration-300">
                  <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Condition</label>
                  <div className="rounded-xl border border-purple-400/30 bg-gradient-to-r from-purple-900/30 to-slate-900/30 px-4 py-3 text-white font-medium">Used - Good</div>
                </div>
                <div className="space-y-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition duration-300">
                  <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Price</label>
                  <div className="rounded-xl border border-purple-400/30 bg-gradient-to-r from-purple-900/30 to-slate-900/30 px-4 py-3 text-white font-medium">£59.99</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-32 rounded-[2rem] border border-purple-500/30 bg-gradient-to-r from-purple-900/20 via-slate-900/20 to-purple-900/20 backdrop-blur-xl px-8 py-16 sm:px-12 shadow-xl shadow-purple-900/20">
          <p className="text-xs uppercase tracking-[0.4em] text-purple-300 font-semibold mb-8">Trusted by resellers on</p>
          <div className="grid gap-6 sm:grid-cols-4">
            {['eBay', 'Vinted', 'Depop', 'TikTok Shop'].map((label) => (
              <div key={label} className="group rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-transparent hover:from-purple-500/20 px-6 py-5 text-center text-sm font-semibold text-purple-200 backdrop-blur-sm transition hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 duration-300 cursor-pointer">
                {label}
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mt-40 space-y-16">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-300 font-semibold">Why choose ListMate</p>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">Powerful features for smarter selling.</h2>
            <p className="text-lg leading-relaxed text-white/60 max-w-2xl">
              Everything you need to create professional listings that convert. Built for modern resellers.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative rounded-[2rem] border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-slate-900/50 p-8 hover:border-purple-400/60 transition duration-500 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/10 transition duration-500"></div>
              <p className="mb-6 text-4xl relative z-10">⚡</p>
              <p className="text-xl font-bold text-white relative z-10 mb-3">30-second listings</p>
              <p className="text-sm leading-7 text-white/60 relative z-10">Generate optimized titles and descriptions instantly. No more writer's block.</p>
            </div>
            <div className="group relative rounded-[2rem] border border-purple-500/40 bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-slate-900/50 p-8 hover:border-purple-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer overflow-hidden hover:bg-purple-900/40 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/8 group-hover:to-purple-600/12 transition-all duration-500"></div>
              <p className="mb-6 text-4xl relative z-10 flex items-center justify-start"><span className="inline-block text-5xl">🌍</span></p>
              <p className="text-xl font-bold text-white relative z-10 mb-3">Built for UK resellers</p>
              <p className="text-sm leading-7 text-white/60 relative z-10">Pricing, postage and copy tailored for UK buyers and sellers.</p>
            </div>
            <div className="group relative rounded-[2rem] border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-slate-900/50 p-8 hover:border-purple-400/60 transition duration-500 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/10 transition duration-500"></div>
              <p className="mb-6 text-4xl relative z-10">🔄</p>
              <p className="text-xl font-bold text-white relative z-10 mb-3">All platforms covered</p>
              <p className="text-sm leading-7 text-white/60 relative z-10">One workflow for eBay, Vinted, Depop and TikTok Shop.</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mt-40 rounded-[2.5rem] border border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-slate-900/30 to-purple-900/20 backdrop-blur-xl px-8 py-20 sm:px-12 shadow-2xl shadow-purple-900/20">
          <div className="max-w-3xl space-y-4 mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-300 font-semibold">Simple workflow</p>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">Three steps to perfect listings.</h2>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            <div className="pointer-events-none absolute left-1/2 top-20 hidden h-64 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent md:block" />
            {[
              { title: 'Enter item details', description: 'Add title, condition, price, description and notes.' },
              { title: 'Pick your platform', description: 'Choose eBay, Vinted, Depop or TikTok Shop.' },
              { title: 'Copy and paste', description: 'Use the AI-written copy directly in your listing.' },
            ].map((step, index) => (
              <div key={step.title} className="group relative rounded-[2rem] border border-purple-500/40 bg-gradient-to-br from-purple-900/40 to-slate-900/40 p-8 backdrop-blur-sm hover:border-purple-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 hover:bg-purple-900/50 hover:-translate-y-2 cursor-pointer">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-2xl font-bold text-white shadow-lg shadow-purple-600/50 group-hover:shadow-purple-600/80 transition duration-300">{index + 1}</div>
                <p className="mt-8 text-xl font-bold text-white">{step.title}</p>
                <p className="mt-4 text-sm leading-7 text-white/60">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mt-40 space-y-12">
          <div className="max-w-4xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-300 font-semibold">Simple transparent pricing</p>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">Choose your plan.</h2>
            <p className="text-lg text-white/60 max-w-2xl">Start free. Scale as you grow. No surprises.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 pt-8 items-start">
            <div className="group relative rounded-[2rem] border border-purple-500/40 bg-white/[0.03] backdrop-blur-xl p-8 text-white transition-all duration-500 hover:border-purple-400/70 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="text-xs uppercase tracking-[0.3em] text-purple-300 font-semibold">Free</div>
                <p className="mt-6 text-5xl font-bold">£0</p>
                <p className="mt-3 text-sm text-white/70 font-medium">5 listings / month</p>
                <ul className="mt-8 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-3"><span className="text-purple-400 mt-1">✓</span> <span>AI listing generation</span></li>
                  <li className="flex items-start gap-3"><span className="text-purple-400 mt-1">✓</span> <span>Basic UK pricing</span></li>
                  <li className="flex items-start gap-3"><span className="text-purple-400 mt-1">✓</span> <span>Email support</span></li>
                </ul>
                <button className="mt-8 w-full rounded-full border border-purple-500/40 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/20 hover:border-purple-400/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30">Start free</button>
              </div>
            </div>

            <div className="group relative rounded-[2rem] border border-purple-400/70 bg-gradient-to-br from-purple-500/10 via-slate-900/30 to-slate-900/50 p-8 pt-10 text-white shadow-2xl shadow-purple-900/40 overflow-hidden transition-all duration-500 hover:border-purple-300 hover:shadow-purple-500/50 hover:-translate-y-2.5 hover:from-purple-500/20 cursor-pointer lg:scale-[1.04] animate-border-glow">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-600/30 to-pink-600/20 blur-3xl -z-10 group-hover:blur-2xl transition-all duration-500"></div>
              <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <div className="relative z-10">
                <div className="relative inline-flex overflow-hidden rounded-full bg-gradient-to-r from-purple-500/40 to-pink-500/30 border border-purple-400/70 px-4 py-1.5 text-xs font-bold text-purple-100 backdrop-blur-sm tracking-wider group-hover:border-purple-300 transition-all duration-300">
                  <span className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)]"></span>
                  <span className="relative">MOST POPULAR</span>
                </div>
                <div className="mt-6 text-xs uppercase tracking-[0.3em] text-purple-200 font-semibold">Starter</div>
                <p className="mt-6 flex items-baseline gap-1 text-5xl font-bold">
                  £4.99 <span className="text-base font-medium text-white/50">/mo</span>
                </p>
                <p className="mt-3 text-sm text-white/70 font-medium">50 listings / month</p>
                <ul className="mt-8 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-3"><span className="text-purple-300 mt-1">✓</span> <span>All Free features</span></li>
                  <li className="flex items-start gap-3"><span className="text-purple-300 mt-1">✓</span> <span>Priority generation</span></li>
                  <li className="flex items-start gap-3"><span className="text-purple-300 mt-1">✓</span> <span>Platform optimization</span></li>
                </ul>
                <button className="mt-8 w-full rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/70 hover:-translate-y-1.5 hover:from-purple-500 hover:to-pink-500 active:translate-y-0 group-hover:scale-105">Choose Starter</button>
              </div>
            </div>

            <div className="group relative rounded-[2rem] border border-purple-500/40 bg-white/[0.03] backdrop-blur-xl p-8 text-white transition-all duration-500 hover:border-purple-400/70 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="text-xs uppercase tracking-[0.3em] text-purple-300 font-semibold">Pro</div>
                <p className="mt-6 flex items-baseline gap-1 text-5xl font-bold">
                  £9.99 <span className="text-base font-medium text-white/50">/mo</span>
                </p>
                <p className="mt-3 text-sm text-white/70 font-medium">Unlimited listings</p>
                <ul className="mt-8 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-3"><span className="text-purple-400 mt-1">✓</span> <span>Everything in Starter</span></li>
                  <li className="flex items-start gap-3"><span className="text-purple-400 mt-1">✓</span> <span>Unlimited outputs</span></li>
                  <li className="flex items-start gap-3"><span className="text-purple-400 mt-1">✓</span> <span>Priority support</span></li>
                </ul>
                <button className="mt-8 w-full rounded-full border border-purple-500/40 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/20 hover:border-purple-400/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30">Go Pro</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative mt-40 border-t border-purple-500/20 bg-gradient-to-b from-slate-950/50 to-slate-950 px-6 py-12 text-white/60 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-sm font-bold text-white">L</div>
            <div>
              <p className="font-semibold text-white">ListMate</p>
              <p className="text-xs text-white/40">© 2025 All rights reserved</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-sm">
            <Link to="/login" className="transition hover:text-purple-300 hover:drop-shadow-lg duration-300">Login</Link>
            <Link to="/signup" className="transition hover:text-purple-300 hover:drop-shadow-lg duration-300">Signup</Link>
            <a href="#" className="transition hover:text-purple-300 hover:drop-shadow-lg duration-300">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
