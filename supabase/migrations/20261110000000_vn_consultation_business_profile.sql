-- ============================================================
-- VN business (C&I) profile on consultation_leads (2026-11-10)
--
-- The C&I page (/solutions/business-solar) asks the visitor five
-- questions — business type, average monthly bill, available roof
-- area, operating hours and backup requirement — and the savings
-- estimator computes a configuration from their numbers. Both hand
-- that summary to the consultation form as `interestedProduct`.
--
-- The column is free text on purpose: the profile shape will change
-- with the C&I line-up, and a text column keeps the change a
-- front-end edit instead of a migration every time.
--
-- NULL-able and no default, so the shared table's other country
-- sites (UK/DE/IT/NG) are unaffected — they never write this column.
-- ============================================================

ALTER TABLE public.consultation_leads
  ADD COLUMN IF NOT EXISTS business_profile TEXT;

COMMENT ON COLUMN public.consultation_leads.business_profile IS
  'Business (C&I) profile attached from /solutions/business-solar:
   business type, average monthly electricity bill, available roof
   area, operating hours and backup requirement. VN-only; NULL for
   other country sites and for home leads.';
