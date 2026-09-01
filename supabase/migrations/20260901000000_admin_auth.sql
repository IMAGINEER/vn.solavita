-- ============================================================
-- UK admin authentication tables (mirror of DE 20260806_admin_auth.sql,
-- simplified: no `permissions` column — UK admin is single-role
-- 'admin' for v1, role gating can come later).
-- Run in Supabase SQL Editor.
-- ============================================================

-- 1. admin_users — admin accounts. password_hash is scrypt "salt:hash"
--    hex, generated server-side via lib/auth.ts (never in SQL).
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',          -- 'admin' (single role for v1)
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON COLUMN public.admin_users.password_hash IS 'scrypt salt:hash hex, see lib/auth.ts';

-- 2. admin_sessions — server-side session table. token is stored in an
--    HttpOnly cookie; deleting the row logs the user out (revocable).
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token
  ON public.admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user
  ON public.admin_sessions(admin_user_id);

-- 3. RLS enabled on both; only service_role has access (the login flow and
--    all admin code run server-side with the service-role client).
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_sessions TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- No anon/authenticated policies — these tables are service-role only.

-- 4. Trigger: keep admin_users.updated_at fresh on every UPDATE.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();