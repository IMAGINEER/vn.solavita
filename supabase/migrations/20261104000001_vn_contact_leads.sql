-- ============================================================
-- VN contact-us submission table.
-- VN-only table — no `country` column (always VN). Separate from
-- `uk_contact_leads` / `ng_contact_leads` because:
--   1. The data shape is very different from `consultation_leads`
--      (contact has subject + message + consent).
--   2. No `plan_token` / my-plan linkage for this form.
--   3. It is not driven by the homepage consultation wizard; it is
--      an independent enquiry destination.
--
-- Field contract mirrors `app/api/contact/route.ts`:
--   { salutation, first_name, last_name, email, phone, postcode,
--     city, subject, message, consent }
-- `postcode` is reused as the Vietnamese "Tỉnh / Thành phố" field so
-- the shared API shape stays compatible across locales.
--
-- Mirrors the RLS + service_role pattern from the UK/NG tables.
-- Run in Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.vn_contact_leads (
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

CREATE INDEX IF NOT EXISTS idx_vn_contact_leads_created_at
  ON public.vn_contact_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vn_contact_leads_email
  ON public.vn_contact_leads(email);

ALTER TABLE public.vn_contact_leads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vn_contact_leads TO service_role;

-- No anon/authenticated policies — service-role only (server-side writes
-- from the public /contact-us form; admin reads via service_role client).

-- updated_at trigger. `public.set_updated_at()` is SHARED with other
-- locale tables on this database and is already defined there with a
-- `to_jsonb(new) ? 'updated_at'` guard, so this file re-declares it with
-- the SAME guarded body — an unguarded replacement would break triggers
-- on tables that have no `updated_at` column.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF to_jsonb(NEW) ? 'updated_at' THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_vn_contact_leads_updated_at ON public.vn_contact_leads;
CREATE TRIGGER trg_vn_contact_leads_updated_at
  BEFORE UPDATE ON public.vn_contact_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();