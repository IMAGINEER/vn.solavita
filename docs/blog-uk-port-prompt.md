# /blog 改动任务 — UK 站点

执行前先看 **「0. 项目根」**、**「2. UK 站点当前状态」**、**「3. Schema 决策」** 三节 —— 直接给改动清单，不要再问"背景是什么"。

---

## 0. 项目根

- 工作目录：`D:\UK.solavita`
- 框架：Next.js 16 + Tailwind v4 + React 19（看根目录 `AGENTS.md`，Next 16 API 与训练数据有差异）
- Tailwind token：`uk-teal`、`uk-teal-dark`、`uk-teal-soft`、`uk-emerald`、`uk-navy`、`uk-slate`、`uk-line`（**不是 `it-*`**；`uk-*` 已在 `app/globals.css` @theme 里定义）
- 货币 GBP / £（不是 EUR / €）
- Locale：`en_GB` / `en-GB`（不是 `it_IT`）
- Admin session cookie：`uk_admin_session`，`path: '/admin'`（UK `lib/auth.ts` 已固定，不要改）
- 站点 URL：`https://solavita.uk`（`app/layout.tsx` 里 `metadataBase` 暂留 TODO 注释 —— 全部 SEO/canonical 走 `lib/seo/site.ts` 的 `SITE_URL` env var，默认 fallback 也是 `https://solavita.uk`）

---

## 1. 任务清单（必须全部完成）

| # | 文件 | 改动 |
|---|---|---|
| 1 | `supabase/migrations/20260905000010_blog_module_uk_columns.sql` | **新建** `blog_*` 表加 `*_en` 列（categories / tags / authors），不影响 IT 的 `*_it` 数据 |
| 2 | `supabase/migrations/20260905000011_blog_storage.sql` | **新建** `post-images-uk` bucket（5 MB cap，image/* mimes，public read） |
| 3 | `supabase/migrations/20260905000012_grant_blog_to_service_role.sql` | **新建** 显式 GRANT SELECT/INSERT/UPDATE/DELETE 给 service_role（参考 IT 的两份 grant 迁移，**要全**） |
| 4 | `lib/types/blog.ts` | **新建** —— IT 版的镜像，所有 `name_it` → `name_en`，`description_it` → `description_en`，`bio_it` → `bio_en`；其他 schema 不变 |
| 5 | `lib/data/blog.ts` | **新建** —— IT 版的完整镜像，所有 SELECT 改读 `_en` 列；`slugifyTagName` 同款；`resolveOrCreateTagIds` 同款 race-safe 逻辑；`createCategory / updateCategory` 改用 `name_en / description_en` |
| 6 | `lib/seo/site.ts` | **新建** —— `SITE_URL='https://solavita.uk'`、`SITE_NAME='Solavita UK'`、`SITE_LOCALE='en_GB'`、`DEFAULT_DESCRIPTION` 用英文版 |
| 7 | `lib/seo/metadata.ts` | **新建** —— IT 版的完整镜像；`buildCategoryMetadata` 用 `name_en`；`buildPostMetadata` 用 `name_en`，tag keywords 用 `name_en`；`NOINDEX_METADATA` 用英文 |
| 8 | `lib/seo/jsonld.ts` | **新建** —— IT 版的完整镜像；`articleJsonLd` 里 `inLanguage: 'en-GB'`；publisher 走 `SITE_NAME` |
| 9 | `app/api/admin/blog/posts/route.ts` | **新建** —— IT 版的完整镜像（GET list + POST create）；验证 `BlogPostDraftInput`；unique violation → 409 |
| 10 | `app/api/admin/blog/posts/[id]/route.ts` | **新建** —— IT 版的完整镜像（GET + PUT + DELETE） |
| 11 | `app/api/admin/blog/upload/route.ts` | **新建** —— IT 版的完整镜像，但 bucket 名改为 **`post-images-uk`**（与 IT 的 `post-images` 隔离），folder 仍是 `drafts/` / `posts/<id>/` / `cover/` |
| 12 | `app/api/admin/blog/categories/route.ts` | **新建** —— IT 版的完整镜像（GET with post counts + POST） |
| 13 | `app/api/admin/blog/categories/[id]/route.ts` | **新建** —— IT 版的完整镜像（PUT + DELETE with RESTRICT） |
| 14 | `app/api/admin/blog/tags/route.ts` | **新建** —— IT 版的完整镜像（GET + POST + DELETE ?id=） |
| 15 | `components/admin/blog/PostEditor.tsx` | **新建** —— IT 版的完整镜像；token 输入 + Generate SEO 按钮 + 实时 markdown preview；改用 `uk-*` token；表单标签翻英文 |
| 16 | `app/admin/blog/page.tsx` | **新建** —— IT 版的完整镜像，英文 UI |
| 17 | `app/admin/PostsTable.tsx` | **新建** —— IT 版的完整镜像，英文 status chips |
| 18 | `app/admin/blog/new/page.tsx` | **新建** —— IT 版的完整镜像 |
| 19 | `app/admin/blog/[id]/page.tsx` | **新建** —— IT 版的完整镜像（含 revisions 列表） |
| 20 | `app/admin/blog/categories/page.tsx` | **新建** —— IT 版的完整镜像 |
| 21 | `app/admin/blog/categories/CategoriesManager.tsx` | **新建** —— IT 版的完整镜像 |
| 22 | `app/admin/blog/tags/page.tsx` | **新建** —— IT 版的完整镜像 |
| 23 | `app/admin/blog/tags/TagsManager.tsx` | **新建** —— IT 版的完整镜像 |
| 24 | `app/blog/page.tsx` | **新建** —— IT 版的完整镜像；9 posts/page；英文 hero + filters + cards |
| 25 | `app/blog/category/[slug]/page.tsx` | **新建** —— IT 版的完整镜像（路径段改成 `/category/`，不用 `/categoria/`） |
| 26 | `app/blog/[category]/[slug]/page.tsx` | **新建** —— IT 版的完整镜像；breadcrumb + author/date/reading-time strip + tag chips + JSON-LD |
| 27 | `components/blog/BlogHero.tsx` | **新建** —— IT 版的完整镜像；用 `uk-*` token；英文标题 |
| 28 | `components/blog/BlogCard.tsx` | **新建** —— IT 版的完整镜像；用 `uk-*` token；英文标签 |
| 29 | `components/blog/BlogFilters.tsx` | **新建** —— IT 版的完整镜像；client-side category chips；更新 `?category=` URL |
| 30 | `components/blog/PostBody.tsx` | **新建** —— IT 版的完整镜像；server-rendered markdown；hand-rolled `.post-prose` 样式（不要装 `prose` 插件） |
| 31 | `components/blog/RelatedPosts.tsx` | **新建** —— IT 版的完整镜像；3-card grid |
| 32 | `components/blog/LatestPostsSection.tsx` | **新建** —— UK 站点首页 "Insights & Updates" 区域；**先保留 UK 现有的 static `ukArticles` 卡片**（在 `lib/data/uk-articles.ts`），不接 Supabase（参考 IT 同款 —— IT 首页这块也是 static placeholder） |
| 33 | `app/sitemap.ts` | **新建** —— IT 版的完整镜像；static paths + dynamic blog category/post entries via `listAllPublishedForSitemap` |
| 34 | `app/robots.ts` | **新建** —— IT 版的完整镜像；allow `/`，disallow `/admin` `/api` `/my-plan/*` `/*/draft*` |
| 35 | `app/admin/AdminShell.tsx` | **修改** —— `NAV_ITEMS` 加 `{ label: 'Blog', href: '/admin/blog', icon: FileText }`（lucide `FileText` 已用） |
| 36 | `package.json` | **检查 + 改** —— 确认 `react-markdown`、`remark-gfm` 已列在 `dependencies`；如缺则加（参考 IT 的版本号） |
| 37 | `app/layout.tsx` | **可选改** —— 如果 IT 那边把 default keywords 集中在 `lib/seo/site.ts`，UK 这边**保持现状**不动；只是把 `metadataBase` 的 TODO 注释保留（待真生产域名替换） |

---

## 2. UK 站点当前状态

| 文件 | 现状 |
|---|---|
| `supabase/migrations/` | 没有 blog 相关 migration；最新 4 个：plan_token / admin_auth / consultation_plan_lifecycle / contact_partner_leads |
| `lib/types/blog.ts` | **不存在** |
| `lib/data/blog.ts` | **不存在** |
| `lib/seo/` | **整个目录不存在** |
| `app/sitemap.ts` / `app/robots.ts` | **不存在** |
| `app/blog/` | **不存在**（含 `page.tsx` / `categoria/[slug]/page.tsx` / `[category]/[slug]/page.tsx`） |
| `app/admin/blog/` | **不存在**（含 `page.tsx` / `new/page.tsx` / `[id]/page.tsx` / `categories/` / `tags/` / `PostsTable.tsx`） |
| `app/api/admin/blog/` | **不存在**（含 `posts/` / `categories/` / `tags/` / `upload/`） |
| `components/blog/` | **不存在**（含 `BlogHero` / `BlogCard` / `BlogFilters` / `PostBody` / `RelatedPosts` / `LatestPostsSection`） |
| `components/admin/blog/` | **不存在**（仅 `PostEditor.tsx`） |
| `app/admin/AdminShell.tsx` | 有 4 个 nav item：Dashboard / Leads / Contacts / Partners；**没有 Blog** |
| `components/Header.tsx` | **没有** Blog link —— 改动 task #37+ 见第 4 节「可选改」 |
| `components/ArticlesSection.tsx` | UK 已有 **static** "Insights & Updates" 区块（在 `lib/data/uk-articles.ts` 里有 3 张 static 文章卡 + 1 个 FAQ 卡），**不是数据驱动**。Task #32 把这个文件搬进 `components/blog/LatestPostsSection.tsx` 但保持 static 行为，**不接 Supabase**（参考 IT 同款行为 —— IT 首页那块也是 static placeholder，IT 任务清单里没说改） |
| `app/layout.tsx` | 已有 `metadataBase: https://solavita.uk`（带 TODO）；default keywords 写在 layout 里（solavita.uk / solar / SEG / ...），**别动** |
| `app/globals.css` | 已有 `uk-*` Tailwind tokens（`@theme` block）—— 直接用，**别再追加** |
| `lib/auth.ts` | 已固定 `SESSION_COOKIE='uk_admin_session'` + `path='/admin'` —— **别改** |
| `lib/supabase.ts` | UK 自家 lazy Proxy client（共享同 Supabase project）—— **别改**，新代码继续从 `@/lib/supabase` import |

---

## 3. Schema 决策（**3 个关键决定**）

### 3.1 IT 与 UK 共享表 vs 独立表

UK 与 IT 共享同一个 Supabase project（`lib/supabase.ts` 用同一组 env var）。两种方案：

- **方案 A：共享表 + 加 `_en` 列**（**推荐**）
  - 现有 IT 的 `blog_categories` / `blog_tags` / `blog_authors` 加 `name_en` / `description_en` / `bio_en` 列，与 `name_it` / `description_it` / `bio_it` 并存。
  - 单条 row 可以两种语言都填（IT 填 `_it`，UK 填 `_en`），互不覆盖。
  - 应用层 UK 站点 SELECT 时读 `_en` 列，IT 站点 SELECT 时读 `_it` 列；不需要 WHERE 过滤。
  - RLS 完全保持现状（public read of categories/tags/authors；public read of `blog_posts WHERE status='published'`）。
  - **优点**：schema 维护成本最低；和 IT 的 `_it` 模式对称；future-proof 多语言扩展。
  - **缺点**：一条 row 三列 NULL（UK 没填的 `_it` 列 NULL；反之亦然），无害。

- **方案 B：独立 `blog_*_uk` 表**
  - 完全复制 6 张表到 `blog_categories_uk` / `blog_tags_uk` / `blog_authors_uk` / `blog_posts_uk` / `blog_post_tags_uk` / `blog_post_revisions_uk`。
  - 各自带 GRANT / RLS 策略。
  - 各自带存储 bucket `post-images-uk`。
  - **优点**：两站完全隔离；删 UK 数据不影响 IT。
  - **缺点**：schema 维护成本 2×；升级要同步两份。

**→ 选 A（共享表 + `_en` 列）**。理由：
1. IT 与 UK 共享 Supabase project，row-level 隔离天然不必要；
2. 与 IT 现有 `_it` 模式对称，未来如果加 DE（`name_de`）或 CHS（`name_chs`）都是 ALTER TABLE 加列；
3. 存储 bucket 走单独 `post-images-uk`（task #2）隔离图片，schema 不隔离；
4. RLS 策略**不需要**加 `country` 过滤 —— 因为两站 SELECT 不同的列，根本不会读到对方的 NULL 内容。

### 3.2 列名后缀：`name_en` vs `name`

- **方案 X：保留 `_en` 后缀**（**推荐**）—— `name_en` / `description_en` / `bio_en`，与 IT 的 `_it` 模式对称
- **方案 Y：去掉后缀** —— 直接 `name` / `description` / `bio`，UK 是单语言不需要区分

**→ 选 X（保留 `_en` 后缀）**。理由：
1. 与 IT 现有 schema 形状 1:1 对称，未来如果加多语言列只需 `ALTER TABLE ... ADD COLUMN name_de`；
2. `lib/types/blog.ts` 字段名跨站可比（grep `name_en` 一次找到 UK 文件，`name_it` 找到 IT 文件）；
3. 成本为零（多 6 个字符 / 字段）。

### 3.3 Storage bucket：`post-images` vs `post-images-uk`

- **方案 P：复用 IT 的 `post-images` bucket**（共享存储）
- **方案 Q：新建 `post-images-uk` bucket**（**推荐**）

**→ 选 Q（独立 `post-images-uk` bucket）**。理由：
1. 上传路径前缀不会撞（`/cover/uk-hero.webp` vs `/cover/it-hero.webp` 同 bucket 也行，但 bucket 名隔离更清晰）；
2. 5 MB cap / mime 类型 / public read 策略完全独立，删 UK 图片不影响 IT；
3. Supabase Storage 一个 project 允许多个 bucket，无成本；
4. RLS 策略不变（`storage.objects` 用 `bucket_id = 'post-images-uk'` 过滤）。

---

## 4. 各文件的具体改动

### 4.1 `supabase/migrations/20260905000010_blog_module_uk_columns.sql`（**新建**）

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- Blog module - UK locale columns.
--
-- Mirrors the IT blog module by adding `*_en` columns to the existing
-- blog_categories / blog_tags / blog_authors tables. The IT `_it` columns
-- stay untouched (UK admin never writes to them; IT admin never writes to
-- `_en`). Each app site SELECTs only its own locale column.
--
-- blog_posts / blog_post_tags / blog_post_revisions have no locale
-- columns (title / body / slug are language-neutral at the row level; the
-- app layer decides what locale to expose via metadata + JSON-LD). No
-- schema change needed on those tables.
--
-- This migration is idempotent: `add column if not exists` makes it safe
-- to re-run on an env where `_en` columns already exist.
-- ─────────────────────────────────────────────────────────────────────────

-- ── Categories ──────────────────────────────────────────────────────────────

alter table public.blog_categories
  add column if not exists name_en text,
  add column if not exists description_en text;

-- ── Tags ────────────────────────────────────────────────────────────────────

alter table public.blog_tags
  add column if not exists name_en text;

-- ── Authors ─────────────────────────────────────────────────────────────────

alter table public.blog_authors
  add column if not exists bio_en text;

-- ── Seed UK categories ─────────────────────────────────────────────────────
-- Insert only when no row with the matching slug exists; preserves any
-- existing IT categories (and the on conflict do update keeps names in
-- sync for re-runs).

insert into public.blog_categories (slug, name_en, description_en, sort_order) values
  ('solar-guides', 'Solar Guides',
   'In-depth guides on solar PV, battery storage, SEG and UK MCS regulations.', 10),
  ('solar-news',   'Solar News',
   'Industry updates, exhibitions, incentive changes and product launches.', 20),
  ('customer-stories','Customer Stories',
   'Verified UK installations: how families use Solavita day-to-day.', 30)
on conflict (slug) do update set
  name_en = excluded.name_en,
  description_en = excluded.description_en,
  sort_order = excluded.sort_order;

-- Seed a default UK author row so the admin UI can attach posts to it
-- immediately. Inserts only when no author with the same display_name
-- already exists (idempotent across re-runs).
insert into public.blog_authors (display_name, role, bio_en)
select 'Solavita UK Team', 'editor',
       'The Solavita UK technical and editorial team. Verified guides, up-to-date regulations.'
where not exists (
  select 1 from public.blog_authors where display_name = 'Solavita UK Team'
);

-- ── Verify ─────────────────────────────────────────────────────────────────
-- select slug, name_it, name_en from public.blog_categories order by sort_order;
-- select display_name, role, bio_en from public.blog_authors;
```

### 4.2 `supabase/migrations/20260905000011_blog_storage.sql`（**新建**）

镜像 IT 的 `20260904000001_blog_storage.sql`，但 bucket 名是 **`post-images-uk`**：

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- UK blog image storage bucket.
--
-- Bucket: `post-images-uk`
--   - public read (so /blog/[cat]/[post] cover/body images render
--     directly via the public URL).
--   - service_role writes only. The UK /api/admin/blog/upload route
--     uploads on behalf of an authenticated admin and writes into
--     `posts/<postId>/<filename>`.
--   - 5 MB hard cap, image/* mime types only.
--
-- Separate from IT's `post-images` bucket so the two sites never collide
-- on object paths and either can be wiped without touching the other.
-- ─────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images-uk',
  'post-images-uk',
  true,
  5 * 1024 * 1024,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "post_images_uk_public_read" on storage.objects;
create policy "post_images_uk_public_read"
  on storage.objects for select
  using (bucket_id = 'post-images-uk');

-- service_role writes are allowed by default (service_role bypasses RLS);
-- no additional policy required.

-- ── Verify ─────────────────────────────────────────────────────────────────
-- select id, name, public, file_size_limit from storage.buckets where id = 'post-images-uk';
```

### 4.3 `supabase/migrations/20260905000012_grant_blog_to_service_role.sql`（**新建**）

镜像 IT 的 `20260905000000_grant_blog_to_service_role.sql` + `20260905000001_grant_blog_tags_and_revisions_write.sql` —— UK admin API 同样走 service_role key，所以**必须**显式 GRANT（否则 INSERT/UPDATE/DELETE 在 RLS 严格模式下会 silently fail，参考 memory `blog-grant-migrations.md`）：

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- Explicit GRANTs to service_role on the blog tables.
--
-- RLS is enabled; service_role bypasses RLS but PostgREST still requires
-- explicit GRANTs for INSERT / UPDATE / DELETE per table. SELECT works
-- without a GRANT under default privileges, but writing these explicitly
-- matches the IT site's two-pass migration pattern and is easier to audit.
-- ─────────────────────────────────────────────────────────────────────────

-- SELECT (to anon + authenticated + service_role)
grant select on public.blog_categories      to anon, authenticated, service_role;
grant select on public.blog_tags            to anon, authenticated, service_role;
grant select on public.blog_authors         to anon, authenticated, service_role;
grant select on public.blog_posts           to anon, authenticated, service_role;
grant select on public.blog_post_tags       to anon, authenticated, service_role;
grant select on public.blog_post_revisions  to service_role;

-- INSERT / UPDATE / DELETE (to service_role only)
grant insert, update, delete on public.blog_categories      to service_role;
grant insert, update, delete on public.blog_tags            to service_role;
grant insert, update, delete on public.blog_authors         to service_role;
grant insert, update, delete on public.blog_posts           to service_role;
grant insert, update, delete on public.blog_post_tags       to service_role;
grant insert, update, delete on public.blog_post_revisions  to service_role;
```

### 4.4 `lib/types/blog.ts`（**新建**）

IT 版的完整镜像 —— **全文复制**，然后做以下重命名：
- 所有 `name_it` → `name_en`
- 所有 `description_it` → `description_en`
- 所有 `bio_it` → `bio_en`
- 文件头注释里 `// Shared TypeScript types for the blog module.` 保持不变；其余行把"// mirrors IT's schema"类叙述改掉，加一句"UK locale columns; the schema is shared with IT but each app reads its own locale column"

### 4.5 `lib/data/blog.ts`（**新建**）

IT 版的完整镜像。改动点：
- 每个 SELECT 的列名 `name_it, description_it, bio_it` 改成 `name_en, description_en, bio_en`
- `getCategoryBySlug` / `getCategories` 的 `.order('name_it')` 改成 `.order('name_en')`
- `createCategory` / `updateCategory` 的 `name_it: input.name_it, description_it: input.description_it` 改成 `name_en: input.name_en, description_en: input.description_en`
- 文件头 import 类型从 `@/lib/types/blog`（UK 新建的本地版本）—— **不要 import IT 的**
- 其余全部保持：`slugifyTagName` 同款 race-safe 逻辑、`resolveOrCreateTagIds` 同款、`hydratePosts` 同款、`createPost / updatePost / deletePost` 同款

### 4.6 `lib/seo/site.ts`（**新建**）

```ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://solavita.uk'

export const SITE_NAME = 'Solavita UK'
export const SITE_LOCALE = 'en_GB'
export const SITE_BRAND_SHORT = 'Solavita'

/** Default share image (1200x630). Public asset; bundled with the build. */
export const DEFAULT_OG_IMAGE = '/images/og-default.webp'

export const DEFAULT_DESCRIPTION =
  'Premium solar panels and battery storage for UK homes. MCS-certified. Two-week installation. UK-wide support.'

export function appendSiteTitle(title: string | null | undefined): string {
  const t = (title ?? '').trim()
  if (!t) return SITE_NAME
  if (t === SITE_NAME) return t
  if (t.endsWith(`| ${SITE_NAME}`)) return t
  return `${t} | ${SITE_NAME}`
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${clean}`
}
```

### 4.7 `lib/seo/metadata.ts`（**新建**）

IT 版的完整镜像。改动：
- `buildCategoryMetadata`: 用 `category.name_en`、`category.description_en` 替换 `name_it` / `description_it`；title 模板从 `${category.name_it} | Blog` 改成 `${category.name_en} | Blog`（其实一样，UK 也用 "Blog" 不需要翻）
- `buildPostMetadata`: `tagNames = post.tags.map((t) => t.name_en)`；`section: post.category.name_en`；`NOINDEX_METADATA` 标题从 `'Pagina non trovata'` 改成 `'Page not found'`
- `articleJsonLd` 里 `articleSection: post.category.name_en`

### 4.8 `lib/seo/jsonld.ts`（**新建**）

IT 版的完整镜像。改动：
- `articleJsonLd` 里 `inLanguage: 'en-GB'`（不是 `'it-IT'`）
- publisher logo 路径用 `/images/a1logo02.svg`（UK 已于 2026-09 资源统一迁移，所有 logo / hero 都在 `public/images/`）
- `keywords` 拼接用 `name_en`

### 4.9 `app/api/admin/blog/posts/route.ts`（**新建**）

IT 版的完整镜像 —— GET list + POST create。**不要 import IT 的 route**；从 `@/lib/data/blog`（UK 新建本地版）+ `@/lib/types/blog`（UK 新建本地版）+ `@/lib/auth`（UK 已存在的）import。`requireApiAdmin` 在 UK `lib/auth.ts` 已存在，直接用。

### 4.10 `app/api/admin/blog/posts/[id]/route.ts`（**新建**）

IT 版的完整镜像 —— GET + PUT + DELETE。

### 4.11 `app/api/admin/blog/upload/route.ts`（**新建**）

IT 版的完整镜像。**唯一改动**：bucket 名字符串从 `'post-images'` 改成 `'post-images-uk'`。

### 4.12 `app/api/admin/blog/categories/route.ts`（**新建**）

IT 版的完整镜像（GET with post counts + POST）。所有 `_it` 列 → `_en`。

### 4.13 `app/api/admin/blog/categories/[id]/route.ts`（**新建**）

IT 版的完整镜像（PUT + DELETE with RESTRICT）。所有 `_it` 列 → `_en`。

### 4.14 `app/api/admin/blog/tags/route.ts`（**新建**）

IT 版的完整镜像（GET + POST + DELETE）。所有 `_it` 列 → `_en`。

### 4.15 `components/admin/blog/PostEditor.tsx`（**新建**）

IT 版的完整镜像。改动：
- 所有 `it-*` Tailwind class 改成 `uk-*` 同色 token（`it-teal` → `uk-teal`、`it-teal-dark` → `uk-teal-dark`、`it-teal-soft` → `uk-teal-soft`、`it-navy` → `uk-navy`、`it-emerald` → `uk-emerald`、`it-line` → `uk-line`、`it-slate` → `uk-slate`）
- 表单标签、按钮文本、placeholder 全部翻英文（"Titolo" → "Title"、"Slug" 不变、"Estratto" → "Excerpt"、"Categoria" → "Category"、"Autore" → "Author"、"Tag" 不变、"Immagine di copertura" → "Cover image"、"Genera SEO" → "Generate SEO"、"Salva bozza" → "Save draft"、"Pubblica" → "Publish"、"Anteprima live" → "Live preview"）
- 其余 layout / props / state / 三栏布局 / token 输入逻辑 / Generate SEO 行为 —— **完全照搬**

### 4.16 `app/admin/blog/page.tsx`（**新建**）

IT 版的完整镜像。表单 label / 状态徽章 / 搜索 placeholder 翻英文。

### 4.17 `app/admin/PostsTable.tsx`（**新建**）

IT 版的完整镜像。状态徽章从 `Pubblicato` / `Bozza` 改成 `Published` / `Draft`；按钮 `Modifica` / `Elimina` 改成 `Edit` / `Delete`；`it-*` → `uk-*`。

### 4.18 `app/admin/blog/new/page.tsx`（**新建**）

IT 版的完整镜像 —— server component fetch taxonomy + null post → 传给 `<PostEditor>`。

### 4.19 `app/admin/blog/[id]/page.tsx`（**新建**）

IT 版的完整镜像 —— fetch post + revisions → `<PostEditor>`。

### 4.20 `app/admin/blog/categories/page.tsx`（**新建**）

IT 版的完整镜像，英文 UI。

### 4.21 `app/admin/blog/categories/CategoriesManager.tsx`（**新建**）

IT 版的完整镜像，英文 UI + `uk-*` token。

### 4.22 `app/admin/blog/tags/page.tsx`（**新建**）

IT 版的完整镜像，英文 UI。

### 4.23 `app/admin/blog/tags/TagsManager.tsx`（**新建**）

IT 版的完整镜像，英文 UI。

### 4.24 `app/blog/page.tsx`（**新建**）

IT 版的完整镜像。改动：
- 英文 hero 标题（参考 IT 同款的两行排版 —— 第一行白色，第二行 `<span className="text-gradient">` gradient accent）
  - 第一行："Insights & Updates"
  - 第二行 gradient："for UK solar"
  - 副标题用 UK copy：参考 `lib/data/uk-articles.ts` 的 tone（technical + British），但**不要照搬**那 3 张卡的 title —— 这是 blog index 的副标题
- `?category=` filter 行为不变
- 所有 `it-*` → `uk-*`

### 4.25 `app/blog/category/[slug]/page.tsx`（**新建**）

IT 版的完整镜像。**路径段从 `/categoria/` 改成 `/category/`**（UK 用 English URL segments）。

### 4.26 `app/blog/[category]/[slug]/page.tsx`（**新建**）

IT 版的完整镜像，英文 UI + `uk-*` + JSON-LD `inLanguage: 'en-GB'`。

### 4.27 `components/blog/BlogHero.tsx`（**新建**）

IT 版的完整镜像，`it-*` → `uk-*`，hero copy 翻英文。

### 4.28 `components/blog/BlogCard.tsx`（**新建**）

IT 版的完整镜像，`it-*` → `uk-*`，英文标签（`min di lettura` → `min read`）。

### 4.29 `components/blog/BlogFilters.tsx`（**新建**）

IT 版的完整镜像，英文 UI。

### 4.30 `components/blog/PostBody.tsx`（**新建**）

IT 版的完整镜像 —— server-rendered markdown + hand-rolled `.post-prose` 样式（**不要装 `@tailwindcss/typography` prose 插件**），`it-*` → `uk-*`。

### 4.31 `components/blog/RelatedPosts.tsx`（**新建**）

IT 版的完整镜像，`it-*` → `uk-*`，英文标题。

### 4.32 `components/blog/LatestPostsSection.tsx`（**新建**）

UK 首页 "Insights & Updates" 区块。**不要**接 Supabase —— UK 现状就是 static `ukArticles` 卡片（在 `lib/data/uk-articles.ts`）。文件内容参考 IT 的 `LatestPostsSection.tsx` 结构（hero pill + h1 + grid + FAQ card + "View all" link），但用 UK 的：
- 静态数据从 `lib/data/uk-articles.ts` 读（`ukArticles` 数组 + `ukFaqItem` 单条）
- 文件位置：**从 `components/ArticlesSection.tsx` 移动过来**到 `components/blog/LatestPostsSection.tsx`，**保留 ArticlesSection.tsx 的 export 名称不变**（如果有任何地方 import 它）；如果方便，可以同时保留 `components/ArticlesSection.tsx` 作为 re-export shim —— `export { LatestPostsSection as default } from './blog/LatestPostsSection'`，避免一次性 import 路径回归
- `it-*` → `uk-*`；FAQ 跳转从 `/contact-us` 改成 UK 同款页面（UK 没有 `/contact-us` —— 改成 UK 的 contact 路由；先看 `app/page.tsx` 或 `components/Footer.tsx` 的 contact link 是什么，套那个）
- "View all articles →" link 指向 `/blog`

### 4.33 `app/sitemap.ts`（**新建**）

IT 版的完整镜像。`listAllPublishedForSitemap` 从 `@/lib/data/blog`（UK 本地版）import —— 不要跨站 import IT 的 sitemap helper。

### 4.34 `app/robots.ts`（**新建**）

IT 版的完整镜像：
```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/my-plan', '/*/draft*'],
      },
    ],
  }
}
```

### 4.35 `app/admin/AdminShell.tsx`（**修改**）

在 `import { ... } from 'lucide-react'` 加上 `FileText`。`NAV_ITEMS` 数组末尾追加：
```ts
{ label: 'Blog', href: '/admin/blog', icon: FileText },
```

顺序：Dashboard → Leads → Contacts → Partners → **Blog**（Blog 放最后，跟 IT 的顺序一致 —— IT 的 NAV_ITEMS 也是 Blog 放最后）。

### 4.36 `package.json`（**检查 + 改**）

读 UK 的 `package.json`，确认 `dependencies` 里有：
- `react-markdown`
- `remark-gfm`

如果缺，加 IT 同款版本号（先读 IT 的 `package.json` 对比）。装的时候 `npm install`，不要手动改 `package.json` 写死版本号。

### 4.37 `app/layout.tsx`（**不动**）

`metadataBase` 的 TODO 注释 + default keywords（solavita.uk / SEG / MCS ...）保持现状。`lib/seo/site.ts` 的 `SITE_URL` 通过 env var 覆盖，未来真生产域名替换时不用碰 layout。

### 4.38 `components/Header.tsx`（**可选改**）

如果 UK Header 当前没有 Blog 链接，按 IT Header 的 nav pattern 加一条 `{ label: 'Blog', href: '/blog' }`。**先看 UK Header.tsx 的 nav 数组长什么样** —— 如果 IT/UK Header 的 nav 结构不一样（UK 可能是单行 nav 没 dropdown），那就**直接照搬 UK 现有 nav 的 pattern 加一条**，不要引入 dropdown。如果 IT 那边 Header 有 Blog dropdown，UK 也保持单行就够 —— 不需要 1:1 对称。

---

## 5. 决策点（**只有这 1 个要确认**）

### Storage bucket 名：`post-images-uk`

- Task #2 新建独立 bucket `post-images-uk`，不与 IT 共享
- 优点：两站图片路径不撞；删 UK 不影响 IT；RLS policy 简单（单 bucket_id 过滤）
- 缺点：bucket 数 +1（成本几乎为零）
- 默认按 Q 方案走；如果产品决定让 IT/UK 共享同一 bucket（省钱 + 单一管理），改成 task #2 的 bucket id 为 `post-images`、task #11 的字符串也用 `post-images`

---

## 6. 不要做的事

- ❌ 不要新建独立 `blog_*_uk` 表（task #1 选方案 A 共享表加 `_en` 列）
- ❌ 不要去掉 `_en` 后缀改成 `name` / `description`（保留 `_en` 与 IT `_it` 对称）
- ❌ 不要改 UK `lib/auth.ts` 的 cookie 名 / path / TTL
- ❌ 不要把 IT `lib/auth.ts` 的 `it_admin_session` / `path: '/'` 复制到 UK
- ❌ 不要把 IT `lib/seo/site.ts` 的 `https://it.solavita.com` / `'Solavita Italia'` / `'it_IT'` 复制过去
- ❌ 不要把 `it-*` Tailwind class 留在 UK 新文件里（`uk-*` 已在 `globals.css` 定义）
- ❌ 不要把 IT `app/blog/categoria/[slug]/page.tsx` 的 `/categoria/` 路径段搬过来（UK 用 `/category/`）
- ❌ 不要把 IT 的 ArticlesSection 文件名 / 路径直接复制（UK 现状是 `lib/data/uk-articles.ts` + `components/ArticlesSection.tsx`）
- ❌ 不要给 UK 装 `@tailwindcss/typography` prose 插件（PostBody 用 hand-rolled `.post-prose` 样式，跟 IT 同款）
- ❌ 不要给 UK `LatestPostsSection` 接 Supabase —— UK 首页这块保持 static placeholder（参考 IT 同款行为）
- ❌ 不要碰 IT 站点的任何文件（这次任务是**单向 port UK**，IT 那边不动）
- ❌ 不要在 UK `lib/supabase.ts` 之外新建第二个 client（用现有的 lazy Proxy）
- ❌ 不要自动截图（参考 memory `feedback-no-auto-screenshot.md`，UK 视觉 QA 习惯手动）

---

## 7. 完成后报告

1. `pnpm tsc --noEmit` 0 error
2. dev server 起来，访问 `http://localhost:3000/blog`，**手动**验证：
   - 3 张 UK seeded categories（Solar Guides / Solar News / Customer Stories）渲染 ✅
   - `?category=solar-guides` filter 切换 ✅
   - 进 post detail 页，breadcrumb + JSON-LD `inLanguage: 'en-GB'` 正确 ✅
   - `<meta name="keywords">` 来自 post tags ✅
3. UK admin 登录后访问 `/admin/blog`，**手动**验证：
   - PostsTable 列出 drafts + published ✅
   - 新建一篇 post：token 输入（Enter / comma commit）+ Generate SEO 按钮 + 实时 markdown preview ✅
   - 上传 cover image 到 `post-images-uk` bucket ✅
   - Categories / Tags manager CRUD ✅
4. 检查 `/sitemap.xml` 包含所有 published posts 的 `https://solavita.uk/blog/<cat>/<slug>` ✅
5. 检查 `/robots.txt` 包含 disallow `/admin` `/api` `/my-plan` `/*/draft*` ✅
6. 报告给用户：
   - 改了 / 新建了哪些文件，行数大致
   - bucket 名是 `post-images-uk` 还是回退到 `post-images`（看 task #2 的执行决定）
   - Header 是否加了 Blog link（task #38 是否执行）
   - LatestPostsSection 是否成功从 `components/ArticlesSection.tsx` 搬到 `components/blog/`（还是保留了 re-export shim）
   - `react-markdown` / `remark-gfm` 是否需要装
   - 任何"我没动但你可能想动"的项
