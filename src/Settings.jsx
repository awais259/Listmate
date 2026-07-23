import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthProvider';

const PLAN_LABELS = { free: 'Free', starter: 'Starter', pro: 'Pro' };
const PLAN_LIMITS = { free: 5, starter: 50, pro: Infinity };
const PLAN_COLOURS = {
  free:    'bg-slate-700/60 text-slate-200 border border-slate-600',
  starter: 'bg-indigo-900/40 text-indigo-200 border border-indigo-600/50',
  pro:     'bg-amber-900/40 text-amber-200 border border-amber-600/50',
};

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState('free');
  const [usageThisMonth, setUsageThisMonth] = useState(0);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Fetch quota / plan from server
  useEffect(() => {
    if (!user) return;
    fetch(`/api/quota?userId=${encodeURIComponent(user.id)}`)
      .then((r) => r.json())
      .then((data) => {
        setPlan(data.plan || 'free');
        setUsageThisMonth(data.usedThisMonth ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoadingUsage(false));
  }, [user]);

  const limit = PLAN_LIMITS[plan] ?? 5;
  const pct = limit === Infinity ? 0 : Math.min(100, Math.round((usageThisMonth / limit) * 100));

  async function handleUpgrade(targetPlan) {
    if (!user) return;
    setError('');
    setLoadingPlan(targetPlan);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: targetPlan, userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to start checkout.');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoadingPlan(null);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    navigate('/login');
  }

  async function handleManageSubscription() {
    if (!user) return;
    setError('');
    setPortalLoading(true);
    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to open the subscription portal.');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setPortalLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="card" style={{ maxWidth: 680 }}>
        {/* Header */}
        <div className="app-header">
          <div>
            <p className="app-welcome">Account settings</p>
            <p className="app-subtitle">Manage your plan, usage, and account details.</p>
          </div>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button type="button" className="secondary">← Back to generator</button>
          </Link>
        </div>

        {error && <div className="message error" style={{ marginBottom: 20 }}>{error}</div>}

        {/* Profile */}
        <section className="panel" style={{ marginBottom: 20 }}>
          <h2>Profile</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Email address</span>
              <span style={{ color: '#e0e7ff', fontWeight: 600 }}>{user?.email || '—'}</span>
            </div>
            <hr className="hr-soft" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Current plan</span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${PLAN_COLOURS[plan] || PLAN_COLOURS.free}`}>
                {PLAN_LABELS[plan] || 'Free'}
              </span>
            </div>
            <hr className="hr-soft" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Account ID</span>
              <span style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace' }}>{user?.id?.slice(0, 18) || '—'}…</span>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="panel" style={{ marginBottom: 20 }}>
          <h2>Usage this month</h2>
          {loadingUsage ? (
            <p style={{ color: '#64748b' }}>Loading…</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Listings generated</span>
                <span style={{ color: '#e0e7ff', fontWeight: 700 }}>
                  {usageThisMonth} / {limit === Infinity ? '∞' : limit}
                </span>
              </div>
              {limit !== Infinity && (
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden', height: 8 }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                      borderRadius: 8,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              )}
              {limit !== Infinity && pct >= 80 && (
                <p style={{ color: '#fbbf24', fontSize: '0.83rem', marginTop: 10 }}>
                  ⚠️ You're using {pct}% of your monthly allowance. Upgrade to avoid hitting the limit.
                </p>
              )}
              {limit !== Infinity && usageThisMonth >= limit && (
                <p style={{ color: '#f87171', fontSize: '0.83rem', marginTop: 10 }}>
                  🚫 You've reached your monthly limit. Upgrade to continue generating listings.
                </p>
              )}
            </>
          )}
        </section>

        {/* Plan upgrade */}
        {plan !== 'pro' && (
          <section className="panel" style={{ marginBottom: 20 }}>
            <h2>Upgrade your plan</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {plan === 'free' && (
                <div style={{ border: '1px solid rgba(99,102,241,0.35)', borderRadius: 20, padding: '20px 18px' }}>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 4px' }}>Starter</p>
                  <p style={{ color: '#818cf8', fontWeight: 700, fontSize: '1.4rem', margin: '0 0 12px' }}>£5.99<span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748b' }}>/mo</span></p>
                  <p style={{ color: '#a5b4fc', fontSize: '0.85rem', margin: '0 0 16px', lineHeight: 1.6 }}>50 listings/month, priority generation, platform tips.</p>
                  <button
                    type="button"
                    onClick={() => handleUpgrade('starter')}
                    disabled={!!loadingPlan}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, fontSize: '0.9rem' }}
                  >
                    {loadingPlan === 'starter' ? 'Redirecting…' : 'Choose Starter'}
                  </button>
                </div>
              )}
              <div style={{ border: '1px solid rgba(251,191,36,0.35)', borderRadius: 20, padding: '20px 18px' }}>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 4px' }}>Pro</p>
                <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.4rem', margin: '0 0 12px' }}>£11.99<span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748b' }}>/mo</span></p>
                <p style={{ color: '#a5b4fc', fontSize: '0.85rem', margin: '0 0 16px', lineHeight: 1.6 }}>Unlimited listings, priority support, all features.</p>
                <button
                  type="button"
                  onClick={() => handleUpgrade('pro')}
                  disabled={!!loadingPlan}
                  style={{ width: '100%', padding: '10px', borderRadius: 12, fontSize: '0.9rem', background: 'linear-gradient(135deg,#92400e,#b45309)', color: '#fef3c7' }}
                >
                  {loadingPlan === 'pro' ? 'Redirecting…' : 'Go Pro'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Manage subscription */}
        {plan !== 'free' && (
          <section className="panel" style={{ marginBottom: 20 }}>
            <h2>Manage subscription</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>
                Update payment details, view invoices, or cancel your plan.
              </span>
              <button
                type="button"
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="secondary"
                style={{ padding: '8px 16px', borderRadius: 12, fontSize: '0.85rem' }}
              >
                {portalLoading ? 'Opening…' : 'Manage or cancel →'}
              </button>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 10 }}>
              Cancellation takes effect at the end of your current billing period — you keep access until then.
            </p>
          </section>
        )}

        {/* Password */}
        <section className="panel" style={{ marginBottom: 20 }}>
          <h2>Security</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Password</span>
            <Link to="/forgot-password" style={{ color: '#818cf8', fontSize: '0.9rem', textDecoration: 'underline' }}>
              Change password →
            </Link>
          </div>
        </section>

        {/* Sign out */}
        <section className="panel">
          <h2>Session</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Signed in as <strong style={{ color: '#e0e7ff' }}>{user?.email}</strong></span>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="secondary"
              style={{ padding: '8px 16px', borderRadius: 12, fontSize: '0.85rem' }}
            >
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
