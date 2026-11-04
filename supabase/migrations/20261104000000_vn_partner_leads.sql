-- ============================================================
-- VN partner-leads table — separate from `uk_partner_leads` and
-- `ng_partner_leads` so VN / UK / NG / IT / DE can coexist on a
-- single Supabase instance without cross-locale data bleed.
--
-- Field contract mirrors `app/api/partner/route.ts`:
--   { full_name, whatsapp, company, email, partner_track, message }
-- partner_track accepts the three VN tracks:
--   'core-service' | 'certified-installer' | 'lead-partner'
--
-- Idempotent so this migration is safe to run on a fresh database
-- (CREATE TABLE IF NOT EXISTS) and on one that already has the table
-- from a prior hand-applied step (ADD COLUMN IF NOT EXISTS).
--
-- This file does NOT touch `uk_partner_leads`, `ng_partner_leads` or
-- any other locale-prefixed table — those projects keep their
-- existing schema and writes.
-- Run in Supabase SQL Editor.
-- ============================================================

-- 1. vn_partner_leads — submissions from vn.solavita.com/for-partners
CREATE TABLE IF NOT EXISTS public.vn_partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  partner_track TEXT NOT NULL,           -- 'core-service' | 'certified-installer' | 'lead-partner'
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add the `whatsapp` column on existing installs (the table was
--    created without it in the NG/UK source). IF NOT EXISTS keeps
--    the migration safe to re-run.
ALTER TABLE public.vn_partner_leads
  ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- 3. Add a CHECK constraint that locks partner_track to the three
--    VN track IDs. `NOT VALID` means the constraint is applied to
--    new rows only, so a partially-populated table never fails the
--    migration.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'vn_partner_leads_partner_track_check'
      AND conrelid = 'public.vn_partner_leads'::regclass
  ) THEN
    ALTER TABLE public.vn_partner_leads
      ADD CONSTRAINT vn_partner_leads_partner_track_check
      CHECK (partner_track IN (
        'core-service',
        'certified-installer',
        'lead-partner'
      )) NOT VALID;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vn_partner_leads_created_at
  ON public.vn_partner_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vn_partner_leads_email
  ON public.vn_partner_leads(email);

ALTER TABLE public.vn_partner_leads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vn_partner_leads TO service_role;

-- No anon/authenticated policies — service-role only (server-side
-- writes from the public /for-partners form; admin reads via
-- service_role client).

-- 4. updated_at trigger (re-declared as OR REPLACE so the migration is
--    self-contained — `set_updated_at` may or may not exist yet).
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_vn_partner_leads_updated_at ON public.vn_partner_leads;
CREATE TRIGGER trg_vn_partner_leads_updated_at
  BEFORE UPDATE ON public.vn_partner_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();