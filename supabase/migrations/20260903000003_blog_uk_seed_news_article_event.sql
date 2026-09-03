-- ─────────────────────────────────────────────────────────────────────────────
-- UK blog — seed initial categories News / Article / Event.
--
-- The original seed in `20260903000000_blog_module_uk_columns.sql` mirrored
-- IT's topic-driven taxonomy (solar-guides / solar-news / customer-stories).
-- The UK admin team prefers a format-driven taxonomy instead, so this
-- migration inserts the three defaults the team asked for.
--
-- Idempotent: `ON CONFLICT (slug) DO NOTHING` preserves any row the team
-- has already renamed, re-ordered or deleted from /admin/blog/categories.
-- Re-running this migration is safe.
--
-- sort_order starts at 10/20/30 (same spacing as the original seed) so a
-- future re-order UI in either app sees a consistent baseline.
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.blog_categories (slug, name_en, description_en, sort_order) values
  ('news',    'News',
   'Company announcements, product launches and Solavita UK milestones.', 10),
  ('article', 'Article',
   'Long-form reads on solar, storage, SEG and the wider UK energy transition.', 20),
  ('event',   'Event',
   'Upcoming webinars, open days, exhibitions and community meetups.', 30)
on conflict (slug) do nothing;

-- ── Verify ──────────────────────────────────────────────────────────────────
-- select slug, name_en, sort_order from public.blog_categories order by sort_order;