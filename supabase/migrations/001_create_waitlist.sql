-- Create waitlist table
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  feedback    text,
  locale      text default 'en',
  created_at  timestamptz not null default now()
);

-- RLS disabled: inserts only happen from server-side API route (safe)
alter table public.waitlist disable row level security;

-- Index for fast lookup
create index if not exists waitlist_email_idx on public.waitlist (email);
create index if not exists waitlist_created_idx on public.waitlist (created_at desc);
