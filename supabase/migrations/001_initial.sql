-- ============================================================
-- ListMate — Supabase Initial Schema
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ── Enable Row Level Security everywhere ─────────────────────
-- (each table enables RLS individually below)

-- ── 1. profiles ──────────────────────────────────────────────
-- Extends the built-in auth.users table with plan info.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  plan        text not null default 'free',  -- 'free' | 'starter' | 'pro'
  stripe_customer_id      text,
  stripe_subscription_id  text,
  subscription_status     text default 'inactive', -- 'active' | 'cancelled' | 'inactive'
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

-- Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 2. listings_history ──────────────────────────────────────
-- Stores every AI-generated listing per user.
create table if not exists public.listings_history (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  platform    text not null,
  item_name   text not null,
  condition   text,
  category    text,
  details     text,
  price       text,
  postage     text,
  output      jsonb,          -- parsed JSON from AI
  raw_output  text,           -- raw string fallback
  is_demo     boolean default false,
  created_at  timestamptz default now()
);

alter table public.listings_history enable row level security;

create policy "Users can view own history"
  on public.listings_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own history"
  on public.listings_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own history"
  on public.listings_history for delete
  using (auth.uid() = user_id);

-- Index for fast per-user queries ordered by date
create index if not exists listings_history_user_date_idx
  on public.listings_history(user_id, created_at desc);


-- ── 3. subscriptions (mirror of Stripe state) ────────────────
-- Updated by the Stripe webhook handler on the server.
-- The `profiles` table is the source of truth for the plan field,
-- this table keeps the full Stripe event history.
create table if not exists public.subscriptions (
  id                     bigint generated always as identity primary key,
  user_id                uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id     text,
  plan                   text not null default 'free',
  status                 text not null default 'inactive',
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean default false,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Service role (backend) inserts/updates via webhook — no user-facing write policy needed.


-- ── Helper: count listings this month for a user ─────────────
create or replace function public.listings_this_month(p_user_id uuid)
returns bigint language sql stable as $$
  select count(*)
  from public.listings_history
  where user_id = p_user_id
    and date_trunc('month', created_at) = date_trunc('month', now());
$$;


-- ── Done ──────────────────────────────────────────────────────
-- After running this:
--   1. Go to Authentication → Email Templates and customise the confirmation email.
--   2. Set the Site URL in Authentication → URL Configuration to your domain.
--   3. Add /confirm as an allowed redirect URL.
--   4. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
