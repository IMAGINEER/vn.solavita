-- Demo / preview SQL: distribute existing UK leads across the 4 Plan
-- lifecycle states so /admin/leads shows a representative mix.
--
-- **This is a preview tool, not a production migration.** Re-running it
-- just re-shuffles the demo timestamps; it never sends any email or
-- triggers any real webhook.
--
-- How it works:
--   1. Picks the 4 most-recent UK consultation_leads rows (by created_at).
--   2. **Skips the freshest one** - leaves its plan_* columns untouched so
--      the most-recent lead keeps whatever state the real flow produced.
--   3. Clears plan_* on the next 3 rows to start from a clean slate.
--   4. Re-stamps them with timestamps that map to 3 of the 4 states:
--      lead[2] → sent_unopened
--      lead[3] → sent_opened_unconfirmed
--      lead[4] → sent_opened_confirmed
--   5. The freshest lead[1] represents `not_sent` (or whatever real state
--      it had if /my-plan has been visited / Talk to an expert clicked).
--
-- Run in Supabase SQL editor → then refresh /admin/leads.

DO $$
DECLARE
  lead_ids uuid[];
  total_count int;
BEGIN
  SELECT ARRAY(
    SELECT id FROM consultation_leads
    WHERE country = 'uk'
    ORDER BY created_at DESC
    LIMIT 4
  ) INTO lead_ids;

  total_count := array_length(lead_ids, 1);

  IF total_count IS NULL OR total_count = 0 THEN
    RAISE NOTICE 'No UK leads found - nothing to preview.';
    RETURN;
  END IF;

  -- 1. Clear all plan_* columns on leads 2..4 (skip lead[1] = freshest).
  IF total_count >= 2 THEN
    FOR i IN 2..total_count LOOP
      UPDATE consultation_leads
      SET plan_sent_at        = NULL,
          plan_first_opened_at = NULL,
          plan_last_opened_at  = NULL,
          plan_confirmed_at    = NULL,
          plan_provider_id     = NULL
      WHERE id = lead_ids[i];
    END LOOP;
  END IF;

  -- 2. lead[2] → sent_unopened: only sent_at set; no opens.
  IF total_count >= 2 THEN
    UPDATE consultation_leads
    SET plan_sent_at     = NOW() - INTERVAL '2 hours',
        plan_provider_id = 'demo-sent-unopened'
    WHERE id = lead_ids[2];
  END IF;

  -- 3. lead[3] → sent_opened_unconfirmed: sent + opened, no Talk-to-expert yet.
  IF total_count >= 3 THEN
    UPDATE consultation_leads
    SET plan_sent_at         = NOW() - INTERVAL '3 hours',
        plan_provider_id     = 'demo-opened-unconfirmed',
        plan_first_opened_at = NOW() - INTERVAL '2 hours',
        plan_last_opened_at  = NOW() - INTERVAL '20 minutes'
    WHERE id = lead_ids[3];
  END IF;

  -- 4. lead[4] → sent_opened_confirmed: full funnel.
  IF total_count >= 4 THEN
    UPDATE consultation_leads
    SET plan_sent_at         = NOW() - INTERVAL '1 day',
        plan_provider_id     = 'demo-opened-confirmed',
        plan_first_opened_at = NOW() - INTERVAL '23 hours',
        plan_last_opened_at  = NOW() - INTERVAL '1 hour',
        plan_confirmed_at    = NOW() - INTERVAL '30 minutes'
    WHERE id = lead_ids[4];
  END IF;

  RAISE NOTICE 'Demo Plan states applied to % UK leads (lead[1] untouched).', total_count;
END $$;

-- Optional: confirm by selecting the demo states back out.
SELECT
  email,
  plan_sent_at        IS NOT NULL AS sent,
  plan_first_opened_at IS NOT NULL AS opened,
  plan_confirmed_at   IS NOT NULL AS confirmed
FROM consultation_leads
WHERE country = 'uk'
ORDER BY created_at DESC
LIMIT 4;