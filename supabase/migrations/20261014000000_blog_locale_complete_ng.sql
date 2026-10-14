-- ─────────────────────────────────────────────────────────────────────────────
-- NG blog locale — finish setup after partial application.
--
-- History:
--   20261013000000_blog_locale_add_ng.sql  intended to
--     drop the IT-created `*_locale_chk` constraints and add new
--     `*_locale_check` constraints that include 'ng'. It targeted
--     the wrong constraint names (`_check` vs IT's actual `_chk`) so
--     the drops silently no-op'd and the old constraints stayed in
--     place. The `add constraint *_locale_check` then ran twice (once
--     from the original attempt and once from a follow-up rerun),
--     producing "constraint already exists" errors. The end state is
--     still wrong: every blog table has BOTH `*_locale_chk` (blocking
--     'ng') AND `*_locale_check` (allowing 'ng'), so any
--     `locale='ng'` INSERT hits the old constraint and the index
--     creation step hasn't run either.
--
-- This migration finishes the job idempotently. Each step is safe to
-- re-run; nothing depends on whether the prior migration succeeded.
--
--   1. Drop the IT-created `*_locale_chk` constraints (they're now
--      redundant since `*_locale_check` is a superset).
--   2. No-op if `*_locale_check` is missing - but we still drop
--      `*_locale_check` and re-add it so the migration is idempotent
--      against partial / repeated runs.
--   3. Create the four locale-first composite indexes for index-only
--      scans on the public read path.
--   4. Seed the default NG category so /admin/blog/new has at least
--      one option in its category dropdown.

-- ── 1+2. Drop both the IT `_chk` constraints and any partial NG `_check`
--         constraints, then re-add the NG `_check` constraints once. ────────
--
-- Note: `drop constraint if exists` is a no-op when the named
-- constraint isn't there, so each drop is safe regardless of which
-- pieces already landed.

alter table public.blog_posts
  drop constraint if exists blog_posts_locale_chk,
  drop constraint if exists blog_posts_locale_check,
  add constraint blog_posts_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text]));

alter table public.blog_categories
  drop constraint if exists blog_categories_locale_chk,
  drop constraint if exists blog_categories_locale_check,
  add constraint blog_categories_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text]));

alter table public.blog_tags
  drop constraint if exists blog_tags_locale_chk,
  drop constraint if exists blog_tags_locale_check,
  add constraint blog_tags_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text]));

alter table public.blog_authors
  drop constraint if exists blog_authors_locale_chk,
  drop constraint if exists blog_authors_locale_check,
  add constraint blog_authors_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text]));

-- ── 3. Locale-first composite indexes for fast filtering ────────────────────

create index if not exists blog_posts_locale_published_idx
  on public.blog_posts (locale, status, published_at desc);

create index if not exists blog_categories_locale_idx
  on public.blog_categories (locale, sort_order);

create index if not exists blog_tags_locale_idx
  on public.blog_tags (locale);

create index if not exists blog_authors_locale_idx
  on public.blog_authors (locale);

-- ── 4. Default NG category seed ──────────────────────────────────────────────
--
-- The editor's category dropdown is filtered by `locale='ng'`; until
-- at least one NG category exists, the editor can't publish. The
-- `on conflict (slug) do update ... where blog_categories.locale='ng'`
-- clause is the idempotency guard: if the row is already present we
-- update its display fields; if the slug is held by a UK / IT row we
-- ignore it (the WHERE clause keeps the do-update branch quiet).

insert into public.blog_categories (
  slug,
  name_en,
  description_en,
  sort_order,
  locale
) values (
  'nigerian-solar-guides',
  'Nigerian Solar Guides',
  'Plain-English guides on solar panels, battery storage, fuel-bill maths and Nigerian energy regulation. Written for Nigerian homes and small businesses.',
  10,
  'ng'
)
on conflict (slug) do update set
  name_en        = excluded.name_en,
  description_en = excluded.description_en,
  sort_order     = excluded.sort_order
where blog_categories.locale = 'ng';

-- ── Verify ──────────────────────────────────────────────────────────────────
-- select conname, pg_get_constraintdef(oid) as def
--   from pg_constraint
--  where conname in (
--    'blog_posts_locale_chk',
--    'blog_posts_locale_check',
--    'blog_categories_locale_chk',
--    'blog_categories_locale_check',
--    'blog_tags_locale_chk',
--    'blog_tags_locale_check',
--    'blog_authors_locale_chk',
--    'blog_authors_locale_check'
--  )
--  order by conrelid::regclass::text, conname;
--
-- select id, slug, name_en, locale, sort_order
--   from public.blog_categories
--  where locale = 'ng'
--  order by sort_order;