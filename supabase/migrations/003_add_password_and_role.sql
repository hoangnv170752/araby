-- Migration: Add password and role columns to waitlist
-- Password will be bcrypt hashed (done in application code)

-- Add password_hash column (nullable for existing users)
ALTER TABLE public.waitlist
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add role column with default 'user'
ALTER TABLE public.waitlist
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Create index on role for faster admin queries
CREATE INDEX IF NOT EXISTS waitlist_role_idx ON public.waitlist (role);

-- ============================================
-- UPDATE ADMIN USER WITH PASSWORD
-- ============================================
-- Note: Replace 'YOUR_BCRYPT_HASH' with actual bcrypt hash
-- You can generate it using: npx bcrypt-cli hash "your_password"
-- Or in Node.js: const hash = await bcrypt.hash("password", 12);

-- Example: Set admin role for admin@araby.digital
UPDATE public.waitlist
SET role = 'admin'
WHERE email = 'admin@araby.digital';

-- To set password, run this after generating bcrypt hash:
-- UPDATE public.waitlist
-- SET password_hash = '$2b$12$YOUR_BCRYPT_HASH_HERE'
-- WHERE email = 'admin@araby.digital';

-- ============================================
-- HELPER FUNCTION: Verify password (for PostgreSQL)
-- Note: This requires pgcrypto extension. Use application-level bcrypt instead.
-- ============================================

-- Create extension for password verification (optional, prefer app-level)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- List all admins
-- SELECT id, email, role, created_at FROM waitlist WHERE role = 'admin';

-- Check if user has password set
-- SELECT email, role, password_hash IS NOT NULL as has_password FROM waitlist;
