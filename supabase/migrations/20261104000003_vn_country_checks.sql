-- ============================================================
-- Widen the shared `country` CHECK constraints to accept 'vn'.
--
-- The VN site writes to two tables that are shared with the other
-- Solavita locales:
--   * consultation_leads  — .insert({ country: 'vn' }) in
--     app/api/consultation/route.ts
--   * email_logs          — .insert({ country: 'vn' }) in the
--     consultation / contact / partner API routes
--
-- Both tables shipped with a CHECK constraint that predates VN:
--   consultation_leads: de | uk | it | ng
--   email_logs:         de | uk | it
-- so every VN write failed with 23514 (check constraint violation).
-- `app/api/contact` and `app/api/partner` swallow the email_logs error
-- (the insert is fire-and-forget), which is why only the consultation
-- form surfaced the failure.
--
-- Widening a CHECK is additive: no existing row can become invalid and
-- other locales keep writing exactly as before. `country` is nullable,
-- and a NULL never violates a CHECK, so existing NULL rows are fine.
--
-- Idempotent — safe to re-run.
-- Run in Supabase SQL Editor.
-- ============================================================

ALTER TABLE public.consultation_leads
  DROP CONSTRAINT IF EXISTS consultation_leads_country_check;

ALTER TABLE public.consultation_leads
  ADD CONSTRAINT consultation_leads_country_check
  CHECK (country::text = ANY (ARRAY['de','uk','it','ng','vn']));

ALTER TABLE public.email_logs
  DROP CONSTRAINT IF EXISTS email_logs_country_check;

ALTER TABLE public.email_logs
  ADD CONSTRAINT email_logs_country_check
  CHECK (country::text = ANY (ARRAY['de','uk','it','ng','vn']));