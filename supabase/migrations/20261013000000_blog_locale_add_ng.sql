-- ─────────────────────────────────────────────────────────────────────────────
-- NG blog locale — extend the locale whitelist to include 'ng'.
--
-- The blog tables (blog_posts, blog_categories, blog_tags, blog_authors)
-- were created by IT's `20260904000000_blog_module.sql` with a CHECK
-- constraint `(locale IN ('it', 'uk', 'de'))`. Each app — IT, UK, NG —
-- writes its own rows with its own locale code and reads only its own
-- locale back.
--
-- IT's app reads `name_it` and filters by `locale='it'`.
-- UK reads `name_en` and (in the data layer) currently filters by
--   `name_en IS NOT NULL` to exclude IT-only rows.
-- NG (this app) reads `name_en` and will filter by `locale='ng'`.
--
-- Two notes on the data shape:
--   1. Existing English rows are tagged `locale='uk'` because they were
--      seeded/authored from the UK app. After this migration runs the NG
--      data layer (lib/data/blog.ts) will switch from
--      `name_en IS NOT NULL` to `locale='ng'` so those UK rows become
--      invisible to the NG site. No backfill needed — we don't want to
--      silently rebrand UK content as Nigerian.
--   2. We do NOT add a default value to `locale` on INSERT: the app
--      always sets it explicitly. A default would let a careless INSERT
--      leak a row into the wrong bucket if the writer was on autopilot.

-- ── Drop + re-add CHECK constraints to include 'ng' ──────────────────────────
--
-- Postgres doesn't support ALTER CHECK ... ADD VALUE; we have to drop
-- and recreate. The IT-created migration named the original
-- constraints `*_locale_chk` (note: `_chk`, not `_check`). The NG
-- migration adds supersets under `*_locale_check` and removes the
-- originals so only one constraint per column remains. The new
-- constraints cover every value the old ones allowed (it/uk/de) plus
-- `ng`, so UK and IT INSERTs continue to succeed.

alter table public.blog_posts
  drop constraint blog_posts_locale_chk,
  add constraint blog_posts_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text]));

alter table public.blog_categories
  drop constraint blog_categories_locale_chk,
  add constraint blog_categories_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text]));

alter table public.blog_tags
  drop constraint blog_tags_locale_chk,
  add constraint blog_tags_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text]));

alter table public.blog_authors
  drop constraint blog_authors_locale_chk,
  add constraint blog_authors_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text]));

-- ── Indexes for fast locale filtering ────────────────────────────────────────
--
-- Every public read path filters by `locale = '<this site>'`. The
-- composite indexes below put `locale` first so the planner can do an
-- index-only scan and ignore the other locale's rows. Without these
-- the table gets a sequential scan as soon as the IT blog grows.

create index if not exists blog_posts_locale_published_idx
  on public.blog_posts (locale, status, published_at desc);

create index if not exists blog_categories_locale_idx
  on public.blog_categories (locale, sort_order);

create index if not exists blog_tags_locale_idx
  on public.blog_tags (locale);

create index if not exists blog_authors_locale_idx
  on public.blog_authors (locale);

-- ── Verify ──────────────────────────────────────────────────────────────────
-- select conname, pg_get_constraintdef(oid)
--   from pg_constraint
--  where conname in (
--    'blog_posts_locale_check',
--    'blog_categories_locale_check',
--    'blog_tags_locale_check',
--    'blog_authors_locale_check'
--  );