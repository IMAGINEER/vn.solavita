-- Backfill plan lifecycle columns for consultation_leads rows that were
-- sent BEFORE the stamp logic was added in /api/consultation route.
--
-- Strategy: for each UK consultation_leads row with NULL plan_provider_id,
-- find the most recent email_logs row of type consultation_confirmation
-- sent to the same email address (country='uk') and copy its provider_id
-- (Resend message id) and created_at timestamp.
--
-- This only backfills `plan_provider_id` and `plan_sent_at`. The opened
-- and confirmed timestamps remain NULL until /my-plan is actually
-- visited or Talk to an expert is clicked.
--
-- Safe to re-run: WHERE clause filters to rows where plan_provider_id
-- is still NULL.

UPDATE consultation_leads cl
SET
  plan_provider_id = latest.provider_id,
  plan_sent_at     = latest.created_at
FROM (
  SELECT DISTINCT ON (sent_to)
    sent_to,
    provider_id,
    created_at
  FROM email_logs
  WHERE email_type = 'consultation_confirmation'
    AND country    = 'uk'
    AND provider_id IS NOT NULL
    AND status     = 'sent'
  ORDER BY sent_to, created_at DESC
) latest
WHERE
  cl.country           = 'uk'
  AND cl.email         = latest.sent_to
  AND cl.plan_provider_id IS NULL;