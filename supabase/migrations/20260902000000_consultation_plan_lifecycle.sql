-- Plan lifecycle tracking for consultation_leads.
-- Drives the 4-state Plan badge on /admin/leads:
--   not_sent | sent_unopened | sent_opened_unconfirmed | sent_opened_confirmed
--
-- Signals (3 sources):
--   - Resend webhook (`app/api/webhooks/resend`) writes plan_sent_at when
--     `email.delivered` fires; also writes plan_first_opened_at /
--     plan_last_opened_at when `email.opened` fires.
--   - Page mount (`app/api/my-plan/[token]`) records the actual page
--     visit via record_my_plan_open() RPC.
--   - Talk to an expert click (`app/api/track/my-plan-confirm`) records
--     confirmation via record_my_plan_confirm() RPC.
--
-- All writes are idempotent: timestamps preserve the FIRST occurrence
-- (COALESCE) while plan_last_opened_at always updates.

-- ────────────────────────────────────────────────────────────────────────────
-- Columns
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE consultation_leads
  ADD COLUMN IF NOT EXISTS plan_sent_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS plan_provider_id text NULL,
  ADD COLUMN IF NOT EXISTS plan_first_opened_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS plan_last_opened_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS plan_confirmed_at timestamptz NULL;

COMMENT ON COLUMN consultation_leads.plan_sent_at IS
  'First time Resend reported email.delivered. Set by webhook, not by /api/consultation.';
COMMENT ON COLUMN consultation_leads.plan_provider_id IS
  'Resend message id. Correlation handle for webhooks; allows UPDATE by id only (no PII).';
COMMENT ON COLUMN consultation_leads.plan_first_opened_at IS
  'First /my-plan visit. Idempotent (COALESCE preserves first).';
COMMENT ON COLUMN consultation_leads.plan_last_opened_at IS
  'Most recent /my-plan visit. Always updates on every page load.';
COMMENT ON COLUMN consultation_leads.plan_confirmed_at IS
  'User clicked Talk to an expert. Idempotent (COALESCE preserves first).';

-- ────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ────────────────────────────────────────────────────────────────────────────
-- Webhook lookup index (Resend sends event.data.id = provider_id).
CREATE INDEX IF NOT EXISTS idx_consultation_leads_plan_provider_id
  ON consultation_leads(plan_provider_id)
  WHERE plan_provider_id IS NOT NULL;

-- Admin sort index: show latest sends first.
CREATE INDEX IF NOT EXISTS idx_consultation_leads_plan_sent_at
  ON consultation_leads(plan_sent_at DESC NULLS LAST);

-- ────────────────────────────────────────────────────────────────────────────
-- RPC: record /my-plan page open
--   - plan_first_opened_at: COALESCE preserves the first occurrence
--   - plan_last_opened_at:  always updated to now()
--   - SECURITY DEFINER so service_role can call without RLS gymnastics
-- ────────────────────────────────────────────────────────────────────────────
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

-- ────────────────────────────────────────────────────────────────────────────
-- RPC: record Talk to an expert click
--   - plan_confirmed_at: COALESCE preserves the first occurrence
-- ────────────────────────────────────────────────────────────────────────────
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