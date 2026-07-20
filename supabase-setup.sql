-- ─────────────────────────────────────────────────────────────────────────────
-- ListMate — Supabase schema for consolidated data storage
-- Run this once in the Supabase Dashboard → SQL Editor (New query → Run).
-- Safe to re-run: everything uses "if not exists" / "drop policy if exists".
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. LISTINGS  (replaces data/history/*.json)
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  platform    text,
  item_name   text,
  condition   text,
  category    text,
  details     text,
  price       text,
  postage     text,
  output      jsonb,
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists listings_user_created_idx
  on public.listings (user_id, created_at desc);

-- 2. SUBSCRIPTIONS  (replaces data/subscriptions.json)
create table if not exists public.subscriptions (
  user_id                 text primary key,
  plan                    text not null default 'free',
  stripe_customer_id      text,
  stripe_subscription_id  text,
  status                  text default 'active',
  updated_at              timestamptz not null default now()
);

create index if not exists subscriptions_customer_idx
  on public.subscriptions (stripe_customer_id);

-- 3. ROW LEVEL SECURITY
-- The server uses the SERVICE-ROLE key, which BYPASSES RLS, so all server
-- reads/writes keep working. These policies only guard any direct browser reads,
-- letting a signed-in user see only their own rows.
alter table public.listings      enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "own listings" on public.listings;
create policy "own listings" on public.listings
  for select using (auth.uid()::text = user_id);

drop policy if exists "own subscription" on public.subscriptions;
create policy "own subscription" on public.subscriptions
  for select using (auth.uid()::text = user_id);
