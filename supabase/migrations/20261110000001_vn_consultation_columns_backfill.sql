-- ============================================================
-- VN consultation_leads — column backfill (idempotent) (2026-11-10)
--
-- WHY THIS FILE EXISTS
-- -------------------
-- The admin dashboard counts leads with a query that touches ONE
-- column:
--
--   SELECT id FROM consultation_leads WHERE country = 'vn'
--
-- while /admin/leads selects the full column list. Any column that is
-- missing in the database makes the LIST query fail with a PostgREST
-- error (42703 "column ... does not exist") while the COUNT query
-- keeps working — the dashboard shows "2" and the list shows nothing.
-- The admin pages used to swallow that error, so a failed query looked
-- exactly like an empty table.
--
-- The same missing column also broke every C&I consultation
-- submission: /api/consultation only names `business_profile` in the
-- INSERT when the visitor filled a business profile, and a PostgREST
-- INSERT naming a non-existent column fails outright (HTTP 500).
--
-- VERIFIED AGAINST THE LIVE PROJECT on 2026-11-10:
--   - `business_profile` was MISSING  → this script adds it.
--   - `daytime_usage_ratio`, the five `plan_*` columns, `plan_token`
--     and `solution_type` were present → the guards below are no-ops.
--   - `consultation_leads_country_check` already allows 'vn' and
--     `consultation_leads_solution_type_check` already allows
--     'balcony' → sections 4/5 rebuild them ONLY if that stops being
--     true (checked, not assumed).
--
-- HOW TO VERIFY (run first, in the Supabase SQL Editor):
--
--   SELECT column_name FROM information_schema.columns
--    WHERE table_schema = 'public' AND table_name = 'consultation_leads'
--    ORDER BY column_name;
--
-- Then paste this file into the same editor and run it. It only runs
-- DDL — no row data is read or written.
-- ============================================================

-- ── 1. Identity / bearer token ──────────────────────────────────────────────
-- /api/consultation INSERTs without naming plan_token and reads it back
-- with `.select('id, plan_token')`; /api/my-plan/[token] looks a row up
-- by it. Missing column → every new VN lead INSERT fails.
ALTER TABLE public.consultation_leads
  ADD COLUMN IF NOT EXISTS plan_token uuid NOT NULL DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS idx_consultation_leads_plan_token
  ON public.consultation_leads(plan_token);

-- ── 2. VN form columns ──────────────────────────────────────────────────────
-- Step 3 of the VN form collects a daytime-usage band. The INSERT and
-- the /api/consultation/update route both name this column, so a
-- missing column breaks every submission (HTTP 500), not just the
-- admin list.
ALTER TABLE public.consultation_leads
  ADD COLUMN IF NOT EXISTS daytime_usage_ratio VARCHAR;

COMMENT ON COLUMN public.consultation_leads.daytime_usage_ratio IS
  'Share of electricity used during daylight hours. One of
   ''under-30'' / ''30-50'' / ''50-70'' / ''over-70'' / ''unknown''.
   VN-only; NULL for other country sites.';

-- THE FIX: the C&I profile attached from /solutions/business-solar.
-- NULL-able and no default, so the shared table's other country sites
-- are unaffected. Without this column the admin list query fails
-- wholesale and every C&I consultation submission returns HTTP 500.
ALTER TABLE public.consultation_leads
  ADD COLUMN IF NOT EXISTS business_profile TEXT;

COMMENT ON COLUMN public.consultation_leads.business_profile IS
  'Business (C&I) profile attached from /solutions/business-solar:
   business type, average monthly electricity bill, available roof
   area, operating hours and backup requirement. VN-only; NULL for
   other country sites and for home leads.';

-- ── 3. Plan lifecycle columns ───────────────────────────────────────────────
-- Drive the 4-state Plan badge on /admin/leads
-- (not_sent | sent_unopened | sent_opened_unconfirmed | sent_opened_confirmed).
-- All nullable: NULL means the signal has not fired yet.
ALTER TABLE public.consultation_leads
  ADD COLUMN IF NOT EXISTS plan_sent_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS plan_provider_id text NULL,
  ADD COLUMN IF NOT EXISTS plan_first_opened_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS plan_last_opened_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS plan_confirmed_at timestamptz NULL;

CREATE INDEX IF NOT EXISTS idx_consultation_leads_plan_provider_id
  ON public.consultation_leads(plan_provider_id)
  WHERE plan_provider_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_consultation_leads_plan_sent_at
  ON public.consultation_leads(plan_sent_at DESC NULLS LAST);

-- ── 4. solution_type CHECK must allow 'balcony' (SolaMate) ──────────────────
-- Checked, not assumed: the constraint is only rebuilt when it does not
-- already allow every value the VN form can write. NOT VALID so the
-- historical UK/DE/IT/NG rows are never re-validated; new writes are
-- still checked.
DO $$
DECLARE
  def text;
BEGIN
  SELECT pg_get_constraintdef(oid) INTO def
    FROM pg_constraint
   WHERE conrelid = 'public.consultation_leads'::regclass
     AND conname = 'consultation_leads_solution_type_check';

  IF def IS NULL OR def NOT LIKE '%balcony%' THEN
    ALTER TABLE public.consultation_leads
      DROP CONSTRAINT IF EXISTS consultation_leads_solution_type_check;
    ALTER TABLE public.consultation_leads
      ADD CONSTRAINT consultation_leads_solution_type_check
      CHECK (
        solution_type IS NULL
        OR solution_type IN ('home', 'balcony', 'business', 'exploring')
      ) NOT VALID;
  END IF;
END;
$$;

-- ── 5. country CHECK must allow 'vn' ────────────────────────────────────────
-- The shared table originally allowed de/uk/it/ng only; every VN write
-- was rejected with 23514 until 'vn' was added.
DO $$
DECLARE
  def text;
BEGIN
  SELECT pg_get_constraintdef(oid) INTO def
    FROM pg_constraint
   WHERE conrelid = 'public.consultation_leads'::regclass
     AND conname = 'consultation_leads_country_check';

  IF def IS NULL OR def NOT LIKE '%vn%' THEN
    ALTER TABLE public.consultation_leads
      DROP CONSTRAINT IF EXISTS consultation_leads_country_check;
    ALTER TABLE public.consultation_leads
      ADD CONSTRAINT consultation_leads_country_check
      CHECK (country IS NULL OR country IN ('de', 'uk', 'it', 'ng', 'vn'))
      NOT VALID;
  END IF;
END;
$$;

-- ── 6. Plan-lifecycle RPCs ──────────────────────────────────────────────────
-- Called by /api/my-plan/[token] (open) and
-- /api/track/my-plan-confirm (confirmation). Failures are non-fatal in
-- the app, but the timestamps would never be written.
CREATE OR REPLACE FUNCTION public.record_my_plan_open(p_token uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE consultation_leads
  SET
    plan_first_opened_at = COALESCE(plan_first_opened_at, now()),
    plan_last_opened_at  = now()
  WHERE plan_token = p_token;
END;
$$;

REVOKE ALL ON FUNCTION public.record_my_plan_open(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_my_plan_open(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.record_my_plan_confirm(p_token uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE consultation_leads
  SET plan_confirmed_at = COALESCE(plan_confirmed_at, now())
  WHERE plan_token = p_token;
END;
$$;

REVOKE ALL ON FUNCTION public.record_my_plan_confirm(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_my_plan_confirm(uuid) TO service_role;

-- ── 7. Verify ───────────────────────────────────────────────────────────────
-- Expected: every column named above is present, and the two queries
-- the admin pages run now agree:
--
--   SELECT count(*) FROM public.consultation_leads WHERE country = 'vn';
--
--   SELECT id, email FROM public.consultation_leads
--    WHERE country = 'vn'
--    ORDER BY updated_at DESC, created_at DESC;
