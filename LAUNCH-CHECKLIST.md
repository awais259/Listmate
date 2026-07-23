# ListMate — Launch Checklist (updated 21 July 2026, 1:30 AM)

## 🚀 FULLY LAUNCHED: https://listmate.co.uk
(also reachable at https://listmate-ntgl.onrender.com)

Everything below is COMPLETE except final end-to-end payment test:
- ✅ Deployed on Render, build working
- ✅ Custom domain live with HTTPS (DNS done at Namecheap; Zoho email records preserved)
- ✅ Supabase auth + database verified in production
- ✅ AI listing generation tested live (real Claude output, saved to database)
- ✅ Stripe webhook "listmate-production" active with signing secret set in Render
- 🔲 Final test: sign up on the site, generate a listing, upgrade with test card 4242 4242 4242 4242, confirm plan upgrades (check Stripe → Workbench → Webhooks → Event deliveries shows "Succeeded")

## ✅ Already done (verified today)

- **Code audit** — server, frontend, quotas, Stripe checkout, AI generation all wired correctly
- **Supabase database** — `listings` + `subscriptions` tables exist and match the server code, RLS enabled
- **Supabase auth** — signups enabled, email confirmation off (instant login)
- **Supabase URLs** — Site URL set to `https://listmate.co.uk`; redirect URLs added for production + localhost
- **API keys** — Anthropic, Supabase (anon + service role), Stripe test key all present in `.env`
- **.gitignore** — `.env` is safely excluded from GitHub
- **render.yaml** — ready for one-click Render deploy (health check, env vars, FRONTEND_URL=https://listmate.co.uk)

## ✅ Step 1 — Code pushed to GitHub (done 20 July)

## ✅ Step 2 — Deployed on Render (done 21 July)

Service: `listmate` on Render free plan.
Live URL: **https://listmate-ntgl.onrender.com** (verified working — frontend + API).
Build fix applied: `npm install --include=dev` so Vite is available during build.
Supabase redirect URL for the onrender address also added.

## 🔶 Step 3 — Point listmate.co.uk at Render (Render side DONE — DNS is yours)

Both `listmate.co.uk` and `www.listmate.co.uk` are added in Render (status: Waiting for DNS).

**Your part:** log in at your domain registrar (where you bought listmate.co.uk) → DNS settings → add:

| Type  | Name / Host | Value                          |
|-------|-------------|--------------------------------|
| A     | @           | 216.24.57.1                    |
| CNAME | www         | listmate-ntgl.onrender.com     |

(Delete any old A/CNAME records for @ and www first. If verification doesn't turn green in a few hours, open Render → listmate → Settings → Custom Domains and check the exact records it shows.)

Render issues free HTTPS automatically once DNS verifies.

## 🔲 Step 4 — Stripe webhook (needed for paid upgrades to activate)

Without this, customers can pay but their plan won't upgrade automatically.

1. Stripe Dashboard (test mode) → **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://listmate.co.uk/api/stripe-webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the signing secret (`whsec_...`) → paste it into Render → Environment → `STRIPE_WEBHOOK_SECRET` → save (service redeploys)

## 🔲 Step 5 — Test the live app

- Sign up with a real email, log in
- Generate a listing (checks Anthropic key + Supabase storage)
- Check history shows the listing
- Go to Pricing → upgrade → pay with Stripe test card `4242 4242 4242 4242`, any future date, any CVC
- Confirm your plan shows as upgraded in Settings

## ⚠️ Notes & known limitations

- **Stripe is in TEST mode** — no real money can be taken. When ready for real customers: activate your Stripe account, create live keys, create the two products (Starter £5.99/mo, Pro £11.99/mo), and swap `STRIPE_SECRET_KEY` + webhook to live versions in Render.
- **Render free plan sleeps** after 15 min idle — first visit takes ~30s to wake. Upgrade to Starter ($7/mo) when you have real traffic.
- **Free plan has no persistent disk** — that's fine, all data lives in Supabase.
- **Security**: your `.env` contains live secrets. Never share this folder or paste `.env` contents anywhere public. If keys ever leak, rotate them (Anthropic console / Supabase settings / Stripe dashboard).
- The file `supabase/migrations/001_initial.sql` is an old unused schema — ignore it; `supabase-setup.sql` is the correct one (already applied).
