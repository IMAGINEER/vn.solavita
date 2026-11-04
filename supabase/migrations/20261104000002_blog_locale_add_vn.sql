-- ─────────────────────────────────────────────────────────────────────────────
-- VN blog locale — extend the locale whitelist to include 'vn'.
--
-- The blog tables (blog_posts, blog_categories, blog_tags, blog_authors)
-- are shared by IT / UK / DE / NG / VN. Each app writes its own rows with
-- its own locale code and reads only its own locale back
-- (`lib/types/blog.ts` → `BLOG_LOCALE = 'vn'`).
--
-- The current constraint set (from the NG migrations) is the superset
--   ('it', 'uk', 'de', 'ng')
-- so `locale='vn'` INSERTs would be rejected. This migration drops and
-- re-adds each `*_locale_check` constraint with 'vn' added. The drops use
-- `if exists` so the file is safe to re-run and safe on a database where
-- the NG migrations landed under different names.
--
-- No backfill: existing English rows belong to UK/NG and must not be
-- silently rebranded as Vietnamese. The VN site starts with an empty
-- blog and its own seed category below.

-- ── 1. Drop + re-add CHECK constraints to include 'vn' ───────────────────────

alter table public.blog_posts
  drop constraint if exists blog_posts_locale_chk,
  drop constraint if exists blog_posts_locale_check,
  add constraint blog_posts_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text, 'vn'::text]));

alter table public.blog_categories
  drop constraint if exists blog_categories_locale_chk,
  drop constraint if exists blog_categories_locale_check,
  add constraint blog_categories_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text, 'vn'::text]));

alter table public.blog_tags
  drop constraint if exists blog_tags_locale_chk,
  drop constraint if exists blog_tags_locale_check,
  add constraint blog_tags_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text, 'vn'::text]));

alter table public.blog_authors
  drop constraint if exists blog_authors_locale_chk,
  drop constraint if exists blog_authors_locale_check,
  add constraint blog_authors_locale_check
    check (locale = any (array['it'::text, 'uk'::text, 'de'::text, 'ng'::text, 'vn'::text]));

-- ── 2. Locale-first composite indexes (idempotent; also created by the NG
--      migrations, re-declared here so this file stands alone) ──────────────

create index if not exists blog_posts_locale_published_idx
  on public.blog_posts (locale, status, published_at desc);

create index if not exists blog_categories_locale_idx
  on public.blog_categories (locale, sort_order);

create index if not exists blog_tags_locale_idx
  on public.blog_tags (locale);

create index if not exists blog_authors_locale_idx
  on public.blog_authors (locale);

-- ── 3. Default VN category ──────────────────────────────────────────────────
--
-- The editor's category dropdown is filtered by `locale='vn'`; until at
-- least one VN category exists the editor can't publish. The
-- `on conflict (slug) do update ... where blog_categories.locale='vn'`
-- clause is the idempotency guard: if the slug is already held by
-- another locale's row we leave it alone.

insert into public.blog_categories (
  slug,
  name_en,
  description_en,
  sort_order,
  locale
) values (
  'huong-dan-dien-mat-troi',
  'Hướng dẫn điện mặt trời',
  'Hướng dẫn dễ hiểu về tấm quang năng, pin lưu trữ, chi phí điện và quy định năng lượng tại Việt Nam. Dành cho hộ gia đình và doanh nghiệp nhỏ.',
  10,
  'vn'
)
on conflict (slug) do update set
  name_en        = excluded.name_en,
  description_en = excluded.description_en,
  sort_order     = excluded.sort_order
where blog_categories.locale = 'vn';

-- ── Verify ──────────────────────────────────────────────────────────────────
-- select conname, pg_get_constraintdef(oid) as def
--   from pg_constraint
--  where conname like '%_locale_check'
--  order by conrelid::regclass::text;
--
-- select id, slug, name_en, locale, sort_order
--   from public.blog_categories
--  where locale = 'vn'
--  order by sort_order;