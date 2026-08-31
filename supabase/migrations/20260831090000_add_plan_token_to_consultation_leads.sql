-- Add `plan_token` column to `consultation_leads`.
--
-- Purpose: the `/my-plan?id={token}` route looks up a row via this UUID.
-- It's a public, unguessable bearer — no auth required (122 bits of
-- entropy means brute-force is not a realistic threat). The column is
-- auto-generated on insert by `gen_random_uuid()` (pgcrypto extension).
--
-- This migration is metadata-only on PG 11+: ADD COLUMN with a constant
-- DEFAULT doesn't rewrite the table, so existing rows are backfilled
-- instantly with a new UUID each. No `BEFORE` trigger needed.
--
-- Out of scope (per the plan):
--   - No trigger to preserve the original token on UPDATE — the API route
--     at `app/api/consultation/route.ts` already omits `plan_token` from
--     its UPDATE payload, so re-submissions won't clobber the original.
--   - No RLS changes. The query is server-side via service_role.
--   - No FK constraints — plan_token is a public bearer, not a join key.

ALTER TABLE consultation_leads
  ADD COLUMN plan_token uuid NOT NULL DEFAULT gen_random_uuid();

-- Index for the `eq('plan_token', token)` lookup in
-- `app/api/my-plan/[token]/route.ts`. UUIDs aren't sorted by insertion
-- time, but the planner still benefits from the btree for the eq check.
CREATE INDEX IF NOT EXISTS idx_consultation_leads_plan_token
  ON consultation_leads(plan_token);