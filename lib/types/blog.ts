// Shared TypeScript types for the blog module.
//
// Locale model: every row carries a `locale` column ('it' | 'uk' | 'de'
// | 'ng') so each app reads and writes only its own bucket. The locale
// text columns (`name_en`/`name_it`, `description_en`/`description_it`,
// `bio_en`/`bio_it`) live alongside it because the project decided not
// to fully localise the schema.
//
// For NG:
//   - Read  : filter by `locale = 'ng'`
//   - Write : always set `locale = 'ng'` explicitly
//   - Locale text columns used: `name_en`, `description_en`, `bio_en`
//
// The DB columns are lowercase_snake_case; these interfaces mirror them
// exactly so the hand-rolled `(rows || []) as unknown as BlogPost[]`
// cast at every call site stays safe and grep-able.

export type BlogPostStatus = 'draft' | 'published'

export type BlogLocale = 'it' | 'uk' | 'de' | 'ng'

/** Locale this app writes and reads. Centralised so call sites that
 *  hard-code the filter (`locale='ng'`) are grep-able in one place. */
export const BLOG_LOCALE: BlogLocale = 'ng'

export interface BlogCategory {
  id: string
  slug: string
  name_en: string
  description_en: string | null
  sort_order: number
  created_at: string
  locale: BlogLocale
}

export interface BlogTag {
  id: string
  slug: string
  name_en: string
  created_at: string
  locale: BlogLocale
}

export interface BlogAuthor {
  id: string
  admin_user_id: string | null
  display_name: string
  role: string
  avatar_url: string | null
  bio_en: string | null
  created_at: string
  locale: BlogLocale
}

/** A post as exposed to the public surface - body_md included so the
 *  detail page renders markdown directly without a second round-trip. */
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  body_md: string
  cover_image_url: string | null
  category_id: string
  author_id: string
  status: BlogPostStatus
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  reading_time_min: number
  created_at: string
  updated_at: string
  locale: BlogLocale
}

/** A post joined with its category + author + tags - returned by the
 *  public list/get queries so the page renders without N+1 fetches. */
export interface BlogPostFull extends BlogPost {
  category: BlogCategory
  author: BlogAuthor
  tags: BlogTag[]
}

/** Lightweight list item - the heavy `body_md` is stripped for index
 *  pages (only the first 200 chars are needed for the excerpt rendering). */
export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image_url: string | null
  category_id: string
  author_id: string
  status: BlogPostStatus
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  reading_time_min: number
  created_at: string
  updated_at: string
  category: BlogCategory
  author: BlogAuthor
  tags: BlogTag[]
  locale: BlogLocale
}

export interface BlogPostRevision {
  id: string
  post_id: string
  body_md: string
  edited_by: string | null
  edited_at: string
  note: string | null
}

// ── Admin write payloads ───────────────────────────────────────────────────────

export interface BlogPostDraftInput {
  title: string
  slug: string
  excerpt?: string | null
  body_md: string
  cover_image_url?: string | null
  category_id: string
  /**
   * Author byline as typed by the editor - free text, 1-120 chars.
   * The server resolves this to a blog_authors row (case-insensitive
   * match on display_name; creates a new row on miss). Lets authors
   * attribute posts to a contributor without first registering them
   * in the Authors admin page.
   */
  author_byline: string
  status: BlogPostStatus
  published_at?: string | null
  meta_title?: string | null
  meta_description?: string | null
  /**
   * Tag names typed inline by the editor. Takes precedence over
   * `tag_ids` when present; the server resolves names to existing tag
   * rows and creates any missing ones. Either of these two fields can
   * be omitted to skip tag updates.
   */
  tag_names?: string[]
  /**
   * @deprecated Prefer `tag_names`. Kept for backward compatibility
   * with any older callers; ignored if `tag_names` is provided.
   */
  tag_ids?: string[]
}

export interface BlogCategoryInput {
  slug: string
  name_en: string
  description_en?: string | null
  sort_order?: number
}

export interface BlogTagInput {
  slug: string
  name_en: string
}

// ── Query params for the public index ─────────────────────────────────────────

export interface BlogListFilters {
  categorySlug?: string
  tagSlug?: string
  /** 1-indexed page number; backend clamps. */
  page?: number
  pageSize?: number
}

export interface BlogListResult {
  posts: BlogPostSummary[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}