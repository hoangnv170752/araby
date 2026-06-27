-- Create waitlist table
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  feedback    text,
  locale      text default 'en',
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Allow inserts from anon (API route uses service key anyway, but good practice)
create policy "Allow public insert"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Index for fast lookup
create index if not exists waitlist_email_idx on public.waitlist (email);
create index if not exists waitlist_created_idx on public.waitlist (created_at desc);
