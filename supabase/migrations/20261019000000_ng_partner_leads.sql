-- ============================================================
-- NG partner-leads table — separate from the UK `uk_partner_leads`
-- table so NG, UK, and IT can coexist on a single Supabase
-- instance without cross-locale data bleed.
--
-- Field contract mirrors `app/api/partner/route.ts`:
--   { full_name, whatsapp, company, email, partner_track, message }
-- partner_track accepts the three NG tracks per the latest brief:
--   'core-service' | 'certified-installer' | 'lead-partner'
--   (replaces the old UK/IT 'installer' | 'referral' | 'community').
--
-- Idempotent so this migration is safe to run on a fresh database
-- (CREATE TABLE IF NOT EXISTS) and on one that already has the table
-- from a prior hand-applied step (ADD COLUMN IF NOT EXISTS for the
-- `whatsapp` column added when the form was re-shaped).
--
-- This file does NOT touch `uk_partner_leads` or any IT-prefixed
-- table — the UK/IT projects keep their existing schema and writes.
-- Run in Supabase SQL Editor.
-- ============================================================

-- 1. ng_partner_leads — submissions from ng.solavita.com/for-partners
CREATE TABLE IF NOT EXISTS public.ng_partner_leads (
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
--    created without it before this migration existed). IF NOT EXISTS
--    keeps the migration safe to re-run.
ALTER TABLE public.ng_partner_leads
  ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- 3. Add a CHECK constraint that locks partner_track to the three
--    NG track IDs. `NOT VALID` means the constraint is applied to
--    new rows only — if the table was pre-populated with the old
--    UK/IT track IDs ('installer' | 'referral' | 'community'),
--    the migration won't fail trying to retroactively validate them.
--    Those stale rows can be cleaned up later; the form only sends
--    the new IDs so future inserts are always valid.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ng_partner_leads_partner_track_check'
      AND conrelid = 'public.ng_partner_leads'::regclass
  ) THEN
    ALTER TABLE public.ng_partner_leads
      ADD CONSTRAINT ng_partner_leads_partner_track_check
      CHECK (partner_track IN (
        'core-service',
        'certified-installer',
        'lead-partner'
      )) NOT VALID;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ng_partner_leads_created_at
  ON public.ng_partner_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ng_partner_leads_email
  ON public.ng_partner_leads(email);

ALTER TABLE public.ng_partner_leads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ng_partner_leads TO service_role;

-- No anon/authenticated policies — service-role only (server-side
-- writes from the public /for-partners form; admin reads via
-- service_role client).

-- 4. updated_at trigger (re-declared as OR REPLACE so the migration is
--    self-contained — the UK/IT migration's `set_updated_at` may or
--    may not have run first).
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ng_partner_leads_updated_at ON public.ng_partner_leads;
CREATE TRIGGER trg_ng_partner_leads_updated_at
  BEFORE UPDATE ON public.ng_partner_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
