-- ============================================================
-- vn_partner_leads — add the two fields the Gold Partner campaign
-- needs as first-class columns:
--
--   tracking_code  the `?lp=` code from the campaign URL
--                  (e.g. ?lp=fb-nov -> 'fb-nov')
--   event_ids      which November conference(s) the applicant
--                  registered for, comma-separated ids from
--                  `lib/data/partnerEvents.ts`
--                  (e.g. 'bac-giang-2026-11-29,hai-phong-2026-11-23')
--
-- Both were previously carried only inside `message`. The admin
-- table now shows and filters on them, and `POST /api/partner`
-- writes them for every new submission.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS, so re-running is harmless.
-- Backfills existing rows from `message`, which was written as
--   "[Chương trình Đối tác Vàng] Hội nghị tham dự: <label> (<id>); …
--    Mã theo dõi: <code>"
-- The message text is left untouched.
--
-- Run in Supabase SQL Editor. This file only touches
-- public.vn_partner_leads.
-- ============================================================

-- 1. Columns
ALTER TABLE public.vn_partner_leads
  ADD COLUMN IF NOT EXISTS tracking_code TEXT;

ALTER TABLE public.vn_partner_leads
  ADD COLUMN IF NOT EXISTS event_ids TEXT;

-- 2. Backfill the tracking code from the last line of `message`.
--    `substring(text from pattern)` returns NULL when there is no
--    match, so rows without a code stay NULL.
UPDATE public.vn_partner_leads
SET tracking_code = substring(message from 'Mã theo dõi: ([A-Za-z0-9_-]{1,64})')
WHERE tracking_code IS NULL
  AND message LIKE '%Mã theo dõi:%';

-- 3. Backfill conference ids from the parenthesised ids on the
--    "Hội nghị tham dự" line, e.g. "(bac-giang-2026-11-29)".
UPDATE public.vn_partner_leads AS l
SET event_ids = (
  SELECT string_agg(m[1], ',' ORDER BY m[1])
  FROM regexp_matches(l.message, '\(([a-z0-9][a-z0-9-]{2,63})\)', 'g') AS m
)
WHERE l.event_ids IS NULL
  AND l.message LIKE '%Hội nghị tham dự:%';

-- 4. Indexes — the admin table groups/filters by both.
CREATE INDEX IF NOT EXISTS idx_vn_partner_leads_tracking_code
  ON public.vn_partner_leads(tracking_code);

CREATE INDEX IF NOT EXISTS idx_vn_partner_leads_event_ids
  ON public.vn_partner_leads(event_ids);