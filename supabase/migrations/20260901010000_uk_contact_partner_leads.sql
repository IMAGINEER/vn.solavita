-- ============================================================
-- UK contact-us + for-partners submission tables.
-- UK-only tables — no `country` column (always UK). These are
-- separate from `consultation_leads` because:
--   1. The data shape is very different (contact has subject +
--      message + GDPR consent; partner has company + partner_track).
--   2. No `plan_token` / my-plan linkage for these forms.
--   3. They are not driven by the homepage 5-step Consultation
--      wizard; they are independent enquiry destinations.
-- Mirrors the RLS + service_role pattern from 20260901000000_admin_auth.sql.
-- Run in Supabase SQL Editor.
-- ============================================================

-- 1. uk_contact_leads — submissions from /contact-us
CREATE TABLE IF NOT EXISTS public.uk_contact_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salutation TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  postcode TEXT,
  city TEXT,
  subject TEXT NOT NULL,                 -- 'general' | 'sales' | 'support' | 'partner' | 'press' | 'other'
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uk_contact_leads_created_at
  ON public.uk_contact_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uk_contact_leads_email
  ON public.uk_contact_leads(email);

ALTER TABLE public.uk_contact_leads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.uk_contact_leads TO service_role;

-- 2. uk_partner_leads — submissions from /for-partners
CREATE TABLE IF NOT EXISTS public.uk_partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  partner_track TEXT NOT NULL,           -- 'installer' | 'business'
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uk_partner_leads_created_at
  ON public.uk_partner_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uk_partner_leads_email
  ON public.uk_partner_leads(email);

ALTER TABLE public.uk_partner_leads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.uk_partner_leads TO service_role;

-- No anon/authenticated policies — service-role only (server-side writes
-- from the public /contact-us and /for-partners forms; admin reads via
-- service_role client).

-- 3. updated_at trigger (re-declared as OR REPLACE so the migration is
--    self-contained — earlier 20260901000000_admin_auth.sql may or may
--    not have run first).
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_uk_contact_leads_updated_at ON public.uk_contact_leads;
CREATE TRIGGER trg_uk_contact_leads_updated_at
  BEFORE UPDATE ON public.uk_contact_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_uk_partner_leads_updated_at ON public.uk_partner_leads;
CREATE TRIGGER trg_uk_partner_leads_updated_at
  BEFORE UPDATE ON public.uk_partner_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();