-- Migration: Add invite codes system
-- Run this after 001_create_waitlist.sql

-- Create invite_codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(8) NOT NULL UNIQUE,
  max_uses        INTEGER NOT NULL DEFAULT 10,
  current_uses    INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  waitlist_id     UUID NOT NULL UNIQUE REFERENCES public.waitlist(id) ON DELETE CASCADE
);

-- Create invite_code_usages table
CREATE TABLE IF NOT EXISTS public.invite_code_usages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code_id  UUID NOT NULL REFERENCES public.invite_codes(id) ON DELETE CASCADE,
  feature_used    TEXT,
  fingerprint     VARCHAR(64),
  ip_address      INET,
  user_agent      TEXT,
  used_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for invite_codes
CREATE INDEX IF NOT EXISTS invite_codes_code_idx ON public.invite_codes (code);
CREATE INDEX IF NOT EXISTS invite_codes_is_active_idx ON public.invite_codes (is_active);
CREATE INDEX IF NOT EXISTS invite_codes_waitlist_id_idx ON public.invite_codes (waitlist_id);

-- Indexes for invite_code_usages
CREATE INDEX IF NOT EXISTS invite_code_usages_invite_code_id_idx ON public.invite_code_usages (invite_code_id);
CREATE INDEX IF NOT EXISTS invite_code_usages_used_at_idx ON public.invite_code_usages (used_at DESC);
CREATE INDEX IF NOT EXISTS invite_code_usages_fingerprint_idx ON public.invite_code_usages (fingerprint);

-- RLS disabled: operations happen from server-side API routes
ALTER TABLE public.invite_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_code_usages DISABLE ROW LEVEL SECURITY;

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for invite_codes updated_at
DROP TRIGGER IF EXISTS update_invite_codes_updated_at ON public.invite_codes;
CREATE TRIGGER update_invite_codes_updated_at
  BEFORE UPDATE ON public.invite_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: Create admin user with invite code
-- ============================================

-- Insert admin into waitlist
INSERT INTO public.waitlist (email, feedback, locale)
VALUES ('admin@araby.digital', 'Admin account', 'en')
ON CONFLICT (email) DO NOTHING;

-- Create invite code for admin with unlimited uses
INSERT INTO public.invite_codes (code, max_uses, current_uses, is_active, waitlist_id)
SELECT
  'ADMIN001',
  9999,
  0,
  true,
  id
FROM public.waitlist
WHERE email = 'admin@araby.digital'
ON CONFLICT (waitlist_id) DO UPDATE SET
  max_uses = 9999,
  is_active = true;

-- Optional: Create some test users with codes
-- Uncomment if you want test data

-- INSERT INTO public.waitlist (email, feedback, locale)
-- VALUES
--   ('test1@example.com', 'Test user 1', 'en'),
--   ('test2@example.com', 'Test user 2', 'ar')
-- ON CONFLICT (email) DO NOTHING;

-- INSERT INTO public.invite_codes (code, max_uses, current_uses, is_active, waitlist_id)
-- SELECT
--   'TEST' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
--   10,
--   0,
--   true,
--   id
-- FROM public.waitlist
-- WHERE email IN ('test1@example.com', 'test2@example.com')
-- ON CONFLICT (waitlist_id) DO NOTHING;

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- View all invite codes with owner email
-- SELECT ic.*, w.email
-- FROM invite_codes ic
-- JOIN waitlist w ON ic.waitlist_id = w.id;

-- View usage statistics per code
-- SELECT
--   ic.code,
--   w.email,
--   ic.max_uses,
--   ic.current_uses,
--   ic.max_uses - ic.current_uses as remaining_uses,
--   COUNT(icu.id) as total_usages
-- FROM invite_codes ic
-- JOIN waitlist w ON ic.waitlist_id = w.id
-- LEFT JOIN invite_code_usages icu ON ic.id = icu.invite_code_id
-- GROUP BY ic.id, w.email;

-- View recent code usages
-- SELECT
--   icu.*,
--   ic.code,
--   w.email
-- FROM invite_code_usages icu
-- JOIN invite_codes ic ON icu.invite_code_id = ic.id
-- JOIN waitlist w ON ic.waitlist_id = w.id
-- ORDER BY icu.used_at DESC
-- LIMIT 20;
