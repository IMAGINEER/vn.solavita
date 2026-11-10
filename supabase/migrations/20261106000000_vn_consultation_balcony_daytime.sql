-- ============================================================
-- VN consultation form (2026-11-06)
--
--   1. Step 1 gains a balcony-PV answer ('balcony' — SolaMate).
--      The CHECK constraint previously allowed only
--      'home' / 'business' / 'exploring'.
--   2. Step 3 gains a daytime-usage-ratio question. The monthly
--      electricity band reuses the existing `electricity_usage`
--      column; only the ratio needs a new column.
--
-- The constraint stays NOT VALID so historical UK/DE/IT/NG rows
-- are never re-validated. New rows are checked on write.
-- ============================================================

ALTER TABLE public.consultation_leads
  DROP CONSTRAINT IF EXISTS consultation_leads_solution_type_check;

ALTER TABLE public.consultation_leads
  ADD CONSTRAINT consultation_leads_solution_type_check
  CHECK (
    solution_type IS NULL
    OR solution_type IN ('home', 'balcony', 'business', 'exploring')
  ) NOT VALID;

ALTER TABLE public.consultation_leads
  ADD COLUMN IF NOT EXISTS daytime_usage_ratio VARCHAR;

COMMENT ON COLUMN public.consultation_leads.daytime_usage_ratio IS
  'Share of electricity used during daylight hours. One of
   ''under-30'' / ''30-50'' / ''50-70'' / ''over-70'' / ''unknown''.
   VN-only; NULL for other country sites.';