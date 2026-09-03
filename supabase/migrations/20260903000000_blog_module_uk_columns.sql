-- ─────────────────────────────────────────────────────────────────────────────
-- UK blog module — locale column mirror.
--
-- The IT blog tables were created by IT's `20260904000000_blog_module.sql`
-- with `_it` text columns (name_it, description_it, bio_it) plus locale-neutral
-- content columns (title, excerpt, body_md, ...).
--
-- UK shares the same Supabase project, so we add parallel `_en` columns here
-- and have the UK app SELECT `name_en/description_en/bio_en` while IT keeps
-- selecting `*_it`. Each row stores ONE locale's text — the other column is
-- NULL. The two apps never read each other's locale.
--
-- This migration is idempotent: `add column if not exists` is a no-op when
-- the column is already present, so re-running on an environment that already
-- has these columns is safe.
--
-- Tables NOT touched here:
--   - blog_posts          → title/excerpt/body_md/meta_* are locale-neutral
--                          in both IT and UK; we render the post body in
--                          one language per row, not per-locale.
--   - blog_post_tags      → pure join table, no text.
--   - blog_post_revisions → body_md snapshot, locale-neutral.
-- Tables NOT recreated here (already exist from IT's migration):
--   - blog_categories, blog_tags, blog_authors, blog_posts,
--     blog_post_tags, blog_post_revisions
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Locale text columns ──────────────────────────────────────────────────────

alter table public.blog_categories
  add column if not exists name_en        text,
  add column if not exists description_en text;

alter table public.blog_tags
  add column if not exists name_en text;

alter table public.blog_authors
  add column if not exists bio_en text;

-- ── Loosen the shared _it columns to nullable ────────────────────────────────
--
-- IT's 20260904000000_blog_module.sql declared these as `text not null`,
-- which blocks a UK-side INSERT of a row that only has `name_en` filled in.
-- Relaxing to nullable is safe: existing IT rows already have `name_it`
-- populated, so this is a no-op for them — and it lets the UK seed (and
-- any future admin-side row created from /admin/blog/categories) write
-- rows that carry one locale's text only.
--
-- `ALTER COLUMN ... DROP NOT NULL` is itself idempotent in Postgres
-- (re-running against an already-nullable column is a no-op).

alter table public.blog_categories
  alter column name_it        drop not null,
  alter column description_it drop not null;

alter table public.blog_tags
  alter column name_it drop not null;

-- blog_authors.bio_it was already nullable in IT's schema, no change needed.

-- ── Seed UK categories ──────────────────────────────────────────────────────
--
-- Slugs match IT's taxonomy so URL structure stays the same across locales
-- (e.g. `/blog/solar-guides/...` vs `/blog/guide-solari/...`), but the UK
-- slugs are English so the SEO and breadcrumb read in the user's locale.
--
-- sort_order matches IT's 10/20/30 spacing, so any future re-order UI in
-- either app doesn't surprise the other one.

insert into public.blog_categories (slug, name_en, description_en, sort_order) values
  ('solar-guides',     'Solar Guides',
   'In-depth guides on solar PV, battery storage, SEG and UK MCS regulations.', 10),
  ('solar-news',       'Solar News',
   'Industry updates, exhibitions, incentive changes and product launches.',    20),
  ('customer-stories', 'Customer Stories',
   'Verified UK installations: how families use Solavita day-to-day.',           30)
on conflict (slug) do update set
  name_en        = excluded.name_en,
  description_en = excluded.description_en,
  sort_order     = excluded.sort_order;

-- ── Seed default UK author ──────────────────────────────────────────────────
--
-- Insert only when missing so re-running this migration does not blow away
-- or duplicate the row an admin has already customised (avatar_url,
-- admin_user_id link, etc.).

insert into public.blog_authors (display_name, role, bio_en)
select 'Solavita UK Team', 'editor',
       'The Solavita UK technical and editorial team. Verified guides, up-to-date regulations.'
where not exists (
  select 1 from public.blog_authors where display_name = 'Solavita UK Team'
);

-- ── Verify ──────────────────────────────────────────────────────────────────
-- select slug, name_en from public.blog_categories order by sort_order;
-- select count(*) from public.blog_authors where display_name = 'Solavita UK Team'; -- = 1
