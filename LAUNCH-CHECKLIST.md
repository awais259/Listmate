# ListMate — Launch Checklist (20 July 2026)

## ✅ Already done (verified today)

- **Code audit** — server, frontend, quotas, Stripe checkout, AI generation all wired correctly
- **Supabase database** — `listings` + `subscriptions` tables exist and match the server code, RLS enabled
- **Supabase auth** — signups enabled, email confirmation off (instant login)
- **Supabase URLs** — Site URL set to `https://listmate.co.uk`; redirect URLs added for production + localhost
- **API keys** — Anthropic, Supabase (anon + service role), Stripe test key all present in `.env`
- **.gitignore** — `.env` is safely excluded from GitHub
- **render.yaml** — ready for one-click Render deploy (health check, env vars, FRONTEND_URL=https://listmate.co.uk)

## 🔲 Step 1 — Push latest code to GitHub (2 min)

Your repo `github.com/awais259/Listmate` is outdated (missing render.yaml and recent changes).

**Do this:** double-click `push_to_github.bat` in this folder.
It will commit and push everything (it also removes the old stray files from the repo).

## 🔲 Step 2 — Deploy on Render (10 min)

1. Go to https://dashboard.render.com and sign in (use "Sign in with GitHub" — free account)
2. Click **New → Blueprint**
3. Connect your GitHub account and select the **Listmate** repo
4. Render reads `render.yaml` automatically and asks for the env var values.
   Copy each value from the `.env` file in this folder:
   - `ANTHROPIC_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `SUPABASE_URL` and `VITE_SUPABASE_URL` (same value)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_ANON_KEY`
   - `STRIPE_WEBHOOK_SECRET` — leave blank for now (Step 4)
5. Click **Apply / Deploy** and wait ~5 min for the build
6. You'll get a URL like `https://listmate.onrender.com` — open it and check the app loads

## 🔲 Step 3 — Point listmate.co.uk at Render (5 min + DNS wait)

1. In Render: your service → **Settings → Custom Domains → Add** `listmate.co.uk` and `www.listmate.co.uk`
2. Render shows you DNS records. At your domain registrar add:
   - `A` record for `listmate.co.uk` → the IP Render shows (usually `216.24.57.1`)
   - `CNAME` record for `www` → your `xxx.onrender.com` address
3. Wait for DNS (minutes to a few hours). Render issues free HTTPS automatically.

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
