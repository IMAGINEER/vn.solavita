// Blog data-access layer. UK locale columns; the schema is shared with
// IT but each app reads its own locale column.
//
// Public read paths enforce the visibility contract:
//   blog_posts      → WHERE status = 'published'
//   blog_post_tags   → joined via post.status check
// Categories + tags + authors are public (no PII).
//
// Write paths are admin-only and live in app/api/admin/blog/**/route.ts.
// This module exports them too, but the API routes are the only callers
// in production (no direct DB writes from server components).

import { supabase } from '@/lib/supabase'
import type {
  BlogAuthor,
  BlogCategory,
  BlogListFilters,
  BlogListResult,
  BlogPost,
  BlogPostDraftInput,
  BlogPostFull,
  BlogPostRevision,
  BlogPostStatus,
  BlogPostSummary,
  BlogTag,
} from '@/lib/types/blog'

// ── Public read paths ──────────────────────────────────────────────────────────

const POST_PUBLIC_SELECT =
  'id, slug, title, excerpt, body_md, cover_image_url, ' +
  'category_id, author_id, status, published_at, ' +
  'meta_title, meta_description, reading_time_min, ' +
  'created_at, updated_at'

const POST_SUMMARY_SELECT =
  'id, slug, title, excerpt, cover_image_url, ' +
  'category_id, author_id, status, published_at, ' +
  'meta_title, meta_description, reading_time_min, ' +
  'created_at, updated_at'

/**
 * Fetch all UK-locale categories ordered for nav/filtering.
 *
 * Filters out rows where `name_en` is NULL - those are IT-only
 * categories that share the same table on the same Supabase project.
 * Without the filter they render as empty `<option>` elements in the
 * admin category dropdown (selectable but invisible), and they leak
 * into the public `/blog` filter chips as blank labels.
 */
export async function getCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('id, slug, name_en, description_en, sort_order, created_at')
    .not('name_en', 'is', null)
    .order('sort_order', { ascending: true })
    .order('name_en', { ascending: true })
  if (error) throw new Error(`getCategories: ${error.message}`)
  return (data ?? []) as unknown as BlogCategory[]
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('id, slug, name_en, description_en, sort_order, created_at')
    .eq('slug', slug)
    .not('name_en', 'is', null)
    .maybeSingle()
  if (error) throw new Error(`getCategoryBySlug: ${error.message}`)
  return (data ?? null) as unknown as BlogCategory | null
}

/** Fetch all tags (alphabetical). Used for filter chips + tag pickers. */
export async function getTags(): Promise<BlogTag[]> {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('id, slug, name_en, created_at')
    .not('name_en', 'is', null)
    .order('name_en', { ascending: true })
  if (error) throw new Error(`getTags: ${error.message}`)
  return (data ?? []) as unknown as BlogTag[]
}

/** Resolve a list of tag slugs into BlogTag rows. */
export async function getTagsBySlugs(slugs: string[]): Promise<BlogTag[]> {
  if (slugs.length === 0) return []
  const { data, error } = await supabase
    .from('blog_tags')
    .select('id, slug, name_en, created_at')
    .not('name_en', 'is', null)
    .in('slug', slugs)
  if (error) throw new Error(`getTagsBySlugs: ${error.message}`)
  return (data ?? []) as unknown as BlogTag[]
}

export async function getAuthor(id: string): Promise<BlogAuthor | null> {
  const { data, error } = await supabase
    .from('blog_authors')
    .select('id, admin_user_id, display_name, role, avatar_url, bio_en, created_at')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`getAuthor: ${error.message}`)
  return (data ?? null) as unknown as BlogAuthor | null
}

// ── Helpers for join hydration ─────────────────────────────────────────────────

type RawRow = Record<string, unknown>

/** Strip `body_md` from a full post row to produce a summary. */
function toSummary(row: RawRow, category: BlogCategory, author: BlogAuthor, tags: BlogTag[]): BlogPostSummary {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt ?? null) as string | null,
    cover_image_url: (row.cover_image_url ?? null) as string | null,
    category_id: row.category_id as string,
    author_id: row.author_id as string,
    status: row.status as BlogPostStatus,
    published_at: (row.published_at ?? null) as string | null,
    meta_title: (row.meta_title ?? null) as string | null,
    meta_description: (row.meta_description ?? null) as string | null,
    reading_time_min: row.reading_time_min as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    category,
    author,
    tags,
  }
}

function toFull(row: RawRow, category: BlogCategory, author: BlogAuthor, tags: BlogTag[]): BlogPostFull {
  return {
    ...toSummary(row, category, author, tags),
    body_md: row.body_md as string,
  }
}

async function hydratePosts(
  rows: RawRow[],
): Promise<Array<{ row: RawRow; summary: BlogPostSummary; full: BlogPostFull }>> {
  if (rows.length === 0) return []
  const categoryIds = Array.from(new Set(rows.map((r) => r.category_id as string)))
  const authorIds = Array.from(new Set(rows.map((r) => r.author_id as string)))
  const postIds = rows.map((r) => r.id as string)

  const [catRes, authRes, joinRes] = await Promise.all([
    supabase
      .from('blog_categories')
      .select('id, slug, name_en, description_en, sort_order, created_at')
      .in('id', categoryIds),
    supabase
      .from('blog_authors')
      .select('id, admin_user_id, display_name, role, avatar_url, bio_en, created_at')
      .in('id', authorIds),
    supabase
      .from('blog_post_tags')
      .select('post_id, blog_tags:blog_tags(id, slug, name_en, created_at)')
      .in('post_id', postIds),
  ])

  if (catRes.error) throw new Error(`hydrate categories: ${catRes.error.message}`)
  if (authRes.error) throw new Error(`hydrate authors: ${authRes.error.message}`)
  if (joinRes.error) throw new Error(`hydrate tags: ${joinRes.error.message}`)

  const catMap = new Map<string, BlogCategory>(
    ((catRes.data ?? []) as unknown as BlogCategory[]).map((c) => [c.id, c]),
  )
  const authMap = new Map<string, BlogAuthor>(
    ((authRes.data ?? []) as unknown as BlogAuthor[]).map((a) => [a.id, a]),
  )

  type JoinRow = { post_id: string; blog_tags: BlogTag | BlogTag[] | null }
  const tagsByPost = new Map<string, BlogTag[]>()
  for (const j of ((joinRes.data ?? []) as unknown as JoinRow[])) {
    const tag = Array.isArray(j.blog_tags) ? j.blog_tags[0] : j.blog_tags
    if (!tag) continue
    const list = tagsByPost.get(j.post_id) ?? []
    list.push(tag)
    tagsByPost.set(j.post_id, list)
  }

  return rows.map((row) => {
    const id = row.id as string
    const category = catMap.get(row.category_id as string)!
    const author = authMap.get(row.author_id as string)!
    const tags = tagsByPost.get(id) ?? []
    return { row, summary: toSummary(row, category, author, tags), full: toFull(row, category, author, tags) }
  })
}

// ── List query (public) ────────────────────────────────────────────────────────

export async function listPublishedPosts(filters: BlogListFilters = {}): Promise<BlogListResult> {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 9))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('blog_posts')
    .select(POST_SUMMARY_SELECT, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (filters.categorySlug) {
    // Resolve category id first - one extra roundtrip but keeps the
    // main query single-purpose (no join + range paginate dance).
    const cat = await getCategoryBySlug(filters.categorySlug)
    if (!cat) {
      return { posts: [], total: 0, page, pageSize, totalPages: 0 }
    }
    query = query.eq('category_id', cat.id)
  }

  if (filters.tagSlug) {
    // Two-step: post ids with this tag, then re-query with those ids.
    const { data: joinRows, error: joinErr } = await supabase
      .from('blog_post_tags')
      .select('post_id, blog_tags!inner(slug)')
      .eq('blog_tags.slug', filters.tagSlug)
    if (joinErr) throw new Error(`list tag join: ${joinErr.message}`)
    const ids = ((joinRows ?? []) as unknown as Array<{ post_id: string }>).map((j) => j.post_id)
    if (ids.length === 0) {
      return { posts: [], total: 0, page, pageSize, totalPages: 0 }
    }
    query = query.in('id', ids)
  }

  const { data, count, error } = await query
  if (error) throw new Error(`listPublishedPosts: ${error.message}`)

  const rows = (data ?? []) as unknown as RawRow[]
  const hydrated = await hydratePosts(rows)
  const total = count ?? 0
  return {
    posts: hydrated.map((h) => h.summary),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

/** N latest posts for the homepage "Insights" preview - hard 3. */
export async function getLatestPosts(limit = 3): Promise<BlogPostSummary[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_SUMMARY_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(`getLatestPosts: ${error.message}`)
  const rows = (data ?? []) as unknown as RawRow[]
  const hydrated = await hydratePosts(rows)
  return hydrated.map((h) => h.summary)
}

/** Single post by (category_slug, post_slug). Returns null if not found
 *  or not published. */
export async function getPublishedPostBySlug(
  categorySlug: string,
  postSlug: string,
): Promise<BlogPostFull | null> {
  const cat = await getCategoryBySlug(categorySlug)
  if (!cat) return null

  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_PUBLIC_SELECT)
    .eq('category_id', cat.id)
    .eq('slug', postSlug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) throw new Error(`getPublishedPostBySlug: ${error.message}`)
  if (!data) return null

  const [hydrated] = await hydratePosts([data as unknown as RawRow])
  return hydrated?.full ?? null
}

/** Posts in the same category, excluding the current one, for the
 *  "Related posts" block. */
export async function getRelatedPosts(
  categoryId: string,
  excludePostId: string,
  limit = 3,
): Promise<BlogPostSummary[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_SUMMARY_SELECT)
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', excludePostId)
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(`getRelatedPosts: ${error.message}`)
  const rows = (data ?? []) as unknown as RawRow[]
  const hydrated = await hydratePosts(rows)
  return hydrated.map((h) => h.summary)
}

// ── Sitemap helper (public) ────────────────────────────────────────────────────────────────

export interface SitemapPostEntry {
  categorySlug: string
  slug: string
  published_at: string | null
  updated_at: string
}

export async function listAllPublishedForSitemap(): Promise<SitemapPostEntry[]> {
  // Fetch joined category slug in one round-trip.
  //
  // `blog_categories` is shared with the DE site on the same Supabase
  // project. The inner join on `slug` alone would let through posts
  // whose category row has `name_en IS NULL` (IT/DE-only category).
  // Those rows are excluded from `getCategoryBySlug()` on the dynamic
  // route via `.not('name_en', 'is', null)`, so the post URL would 404
  // even though it's marked published. Mirror that filter here so the
  // sitemap only lists URLs that actually resolve to a page.
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, published_at, updated_at, blog_categories!inner(slug)')
    .eq('status', 'published')
    .not('blog_categories.name_en', 'is', null)
    .order('published_at', { ascending: false })
  if (error) throw new Error(`listAllPublishedForSitemap: ${error.message}`)
  return ((data ?? []) as unknown as Array<{
    slug: string
    published_at: string | null
    updated_at: string
    blog_categories: { slug: string } | { slug: string }[]
  }>).map((row) => {
    const cat = Array.isArray(row.blog_categories) ? row.blog_categories[0] : row.blog_categories
    return {
      categorySlug: cat.slug,
      slug: row.slug,
      published_at: row.published_at,
      updated_at: row.updated_at,
    }
  })
}

// ── Admin write paths ─────────────────────────────────────────────────────────

/** Admin: list every post regardless of status. */
export async function listAllPostsAdmin(opts: {
  status?: BlogPostStatus
  search?: string
  page?: number
  pageSize?: number
} = {}): Promise<{ rows: Array<BlogPostSummary & { tags: BlogTag[] }>; total: number; page: number; pageSize: number; totalPages: number }> {
  const page = Math.max(1, opts.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('blog_posts')
    .select(POST_SUMMARY_SELECT, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(from, to)

  if (opts.status) query = query.eq('status', opts.status)
  if (opts.search) query = query.ilike('title', `%${opts.search}%`)

  const { data, count, error } = await query
  if (error) throw new Error(`listAllPostsAdmin: ${error.message}`)

  const rows = (data ?? []) as unknown as RawRow[]
  const hydrated = await hydratePosts(rows)
  return {
    rows: hydrated.map((h) => h.summary),
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  }
}

export async function getPostByIdAdmin(id: string): Promise<BlogPostFull | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_PUBLIC_SELECT)
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`getPostByIdAdmin: ${error.message}`)
  if (!data) return null
  const [hydrated] = await hydratePosts([data as unknown as RawRow])
  return hydrated?.full ?? null
}

export async function createPost(input: BlogPostDraftInput, editorUserId: string | null): Promise<string> {
  // Slug uniqueness per category is enforced by DB constraint; if it
  // blows up we surface a typed error so the API route can return 409.
  const authorId = await resolveOrCreateAuthorId(input.author_byline)
  const insertRow = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt ?? null,
    body_md: input.body_md,
    cover_image_url: input.cover_image_url ?? null,
    category_id: input.category_id,
    author_id: authorId,
    status: input.status,
    published_at:
      input.status === 'published'
        ? input.published_at ?? new Date().toISOString()
        : null,
    meta_title: input.meta_title ?? null,
    meta_description: input.meta_description ?? null,
  }
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(insertRow)
    .select('id')
    .single()
  if (error) throw new Error(`createPost: ${error.message}`)
  const postId = (data as unknown as { id: string }).id

  // Tag resolution: `tag_names` takes precedence (author typed them
  // inline, missing rows are auto-created). `tag_ids` is kept for
  // backward compatibility with any older callers.
  let resolvedTagIds: string[] = []
  if (input.tag_names && input.tag_names.length > 0) {
    resolvedTagIds = await resolveOrCreateTagIds(input.tag_names)
  } else if (input.tag_ids && input.tag_ids.length > 0) {
    resolvedTagIds = input.tag_ids
  }
  if (resolvedTagIds.length > 0) {
    const { error: tagErr } = await supabase
      .from('blog_post_tags')
      .insert(resolvedTagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })))
    if (tagErr) throw new Error(`createPost tags: ${tagErr.message}`)
  }

  await supabase.from('blog_post_revisions').insert({
    post_id: postId,
    body_md: input.body_md,
    edited_by: editorUserId,
    note: 'initial',
  })

  return postId
}

export async function updatePost(
  id: string,
  input: BlogPostDraftInput,
  editorUserId: string | null,
): Promise<void> {
  // Snapshot the current body for revision history before overwriting.
  const { data: prev } = await supabase
    .from('blog_posts')
    .select('body_md')
    .eq('id', id)
    .maybeSingle()
  if (prev) {
    const prevRow = prev as unknown as { body_md: string }
    if (prevRow.body_md !== input.body_md) {
      await supabase.from('blog_post_revisions').insert({
        post_id: id,
        body_md: prevRow.body_md,
        edited_by: editorUserId,
        note: 'pre-update snapshot',
      })
    }
  }

  const authorId = await resolveOrCreateAuthorId(input.author_byline)
  const updateRow = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt ?? null,
    body_md: input.body_md,
    cover_image_url: input.cover_image_url ?? null,
    category_id: input.category_id,
    author_id: authorId,
    status: input.status,
    published_at:
      input.status === 'published'
        ? input.published_at ?? new Date().toISOString()
        : null,
    meta_title: input.meta_title ?? null,
    meta_description: input.meta_description ?? null,
  }
  const { error } = await supabase
    .from('blog_posts')
    .update(updateRow)
    .eq('id', id)
  if (error) throw new Error(`updatePost: ${error.message}`)

  // Tag diff: simplest correct strategy is full replace.
  await supabase.from('blog_post_tags').delete().eq('post_id', id)
  let resolvedTagIds: string[] = []
  if (input.tag_names && input.tag_names.length > 0) {
    resolvedTagIds = await resolveOrCreateTagIds(input.tag_names)
  } else if (input.tag_ids && input.tag_ids.length > 0) {
    resolvedTagIds = input.tag_ids
  }
  if (resolvedTagIds.length > 0) {
    const { error: tagErr } = await supabase
      .from('blog_post_tags')
      .insert(resolvedTagIds.map((tagId) => ({ post_id: id, tag_id: tagId })))
    if (tagErr) throw new Error(`updatePost tags: ${tagErr.message}`)
  }
}

export async function deletePost(id: string): Promise<void> {
  // CASCADE on blog_post_tags + blog_post_revisions cleans the joins.
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(`deletePost: ${error.message}`)
}

export async function listRevisions(postId: string): Promise<BlogPostRevision[]> {
  const { data, error } = await supabase
    .from('blog_post_revisions')
    .select('id, post_id, body_md, edited_by, edited_at, note')
    .eq('post_id', postId)
    .order('edited_at', { ascending: false })
    .limit(50)
  if (error) throw new Error(`listRevisions: ${error.message}`)
  return (data ?? []) as unknown as BlogPostRevision[]
}

// ── Admin taxonomy ─────────────────────────────────────────────────────────────

export async function createCategory(input: { slug: string; name_en: string; description_en?: string | null; sort_order?: number }): Promise<string> {
  const { data, error } = await supabase
    .from('blog_categories')
    .insert({
      slug: input.slug,
      name_en: input.name_en,
      description_en: input.description_en ?? null,
      sort_order: input.sort_order ?? 0,
    })
    .select('id')
    .single()
  if (error) throw new Error(`createCategory: ${error.message}`)
  return (data as unknown as { id: string }).id
}

export async function updateCategory(id: string, input: { slug: string; name_en: string; description_en?: string | null; sort_order?: number }): Promise<void> {
  const { error } = await supabase
    .from('blog_categories')
    .update({
      slug: input.slug,
      name_en: input.name_en,
      description_en: input.description_en ?? null,
      sort_order: input.sort_order ?? 0,
    })
    .eq('id', id)
  if (error) throw new Error(`updateCategory: ${error.message}`)
}

export async function deleteCategory(id: string): Promise<void> {
  // FK is ON DELETE RESTRICT, so posts block this. Surface that error.
  const { error } = await supabase.from('blog_categories').delete().eq('id', id)
  if (error) throw new Error(`deleteCategory: ${error.message}`)
}

export async function createTag(input: { slug: string; name_en: string }): Promise<string> {
  const { data, error } = await supabase
    .from('blog_tags')
    .insert({ slug: input.slug, name_en: input.name_en })
    .select('id')
    .single()
  if (error) throw new Error(`createTag: ${error.message}`)
  return (data as unknown as { id: string }).id
}

// Slug derivation for tag names. Italian-style diacritics are stripped to
// ASCII so "Città" and "citta" produce the same slug. Mirrors the slugify
// already used in components/admin/blog/PostEditor.tsx (the editor only
// needs the local copy for the post slug).
export function slugifyTagName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

// Resolve a list of tag names into BlogTag UUIDs, creating any missing
// rows. Used by the editor's inline-tag flow so authors can type new tag
// names directly in the post form.
//
//   - Whitespace-only / empty entries are dropped.
//   - Case-insensitive dedup (first occurrence's casing wins).
//   - Slug uniqueness is enforced by DB; on race-condition collision we
//     re-fetch the row that the other writer just inserted.
export async function resolveOrCreateTagIds(names: string[]): Promise<string[]> {
  // 1. Normalize: trim, collapse internal whitespace, drop empties.
  const cleaned: string[] = []
  for (const raw of names) {
    const t = raw.trim().replace(/\s+/g, ' ')
    if (t.length === 0) continue
    cleaned.push(t)
  }
  if (cleaned.length === 0) return []

  // 2. Case-insensitive dedup, keep first occurrence.
  const seen = new Set<string>()
  const unique: string[] = []
  for (const n of cleaned) {
    const key = n.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(n)
  }

  // 3. Look up existing tags by lower(name_en). The tags table is small
  // (admin-curated taxonomy) so loading the whole table once and
  // filtering in JS is cheaper than one round-trip per name.
  //
  // Filter out rows where `name_en` IS NULL - those are IT-only tags
  // that share the same table on the same Supabase project. Without
  // this filter `name_en.toLowerCase()` would throw on the first row.
  const { data: allTags, error: readErr } = await supabase
    .from('blog_tags')
    .select('id, slug, name_en')
    .not('name_en', 'is', null)
  if (readErr) throw new Error(`resolveOrCreateTagIds read: ${readErr.message}`)

  const byName = new Map<string, { id: string; name_en: string }>()
  for (const t of (allTags ?? []) as unknown as Array<{ id: string; slug: string; name_en: string }>) {
    byName.set(t.name_en.toLowerCase(), { id: t.id, name_en: t.name_en })
  }

  const ids: string[] = []
  const toCreate: Array<{ slug: string; name_en: string }> = []
  const createIndex: number[] = [] // position in `ids` to back-fill

  for (let i = 0; i < unique.length; i++) {
    const name = unique[i]
    const hit = byName.get(name.toLowerCase())
    if (hit) {
      ids.push(hit.id)
      continue
    }
    const slug = slugifyTagName(name)
    if (slug.length === 0) {
      // Name was nothing but punctuation; skip without creating a row.
      continue
    }
    ids.push('')
    createIndex.push(ids.length - 1)
    toCreate.push({ slug, name_en: name })
  }

  // 4. Insert any new tags. Race-safe via a per-row fallback: if a slug
  // uniqueness violation (Postgres 23505) fires for one row, re-fetch by
  // slug and use that id. Other rows still succeed.
  for (let i = 0; i < toCreate.length; i++) {
    const row = toCreate[i]
    const slot = createIndex[i]
    const { data: ins, error: insErr } = await supabase
      .from('blog_tags')
      .insert(row)
      .select('id')
      .single()
    if (!insErr && ins) {
      ids[slot] = (ins as unknown as { id: string }).id
      continue
    }
    if (insErr && /duplicate key|unique constraint/i.test(insErr.message)) {
      // Lost the race - another writer just created this slug. Fetch it.
      const { data: existing, error: fetchErr } = await supabase
        .from('blog_tags')
        .select('id')
        .eq('slug', row.slug)
        .maybeSingle()
      if (fetchErr || !existing) {
        throw new Error(
          `resolveOrCreateTagIds: race for "${row.slug}" could not be reconciled: ${fetchErr?.message ?? 'not found'}`,
        )
      }
      ids[slot] = (existing as unknown as { id: string }).id
      continue
    }
    throw new Error(`resolveOrCreateTagIds insert "${row.slug}": ${insErr?.message ?? 'unknown error'}`)
  }

  // 5. Drop any placeholder slots (punctuation-only names that we
  // couldn't slugify).
  return ids.filter((id) => id.length > 0)
}

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase.from('blog_tags').delete().eq('id', id)
  if (error) throw new Error(`deleteTag: ${error.message}`)
}

// Resolve a free-form author byline string into a blog_authors UUID,
// creating a new row on miss. Mirrors `resolveOrCreateTagIds` so the
// editor can type any contributor name without first registering them.
//
//   - Trims + collapses internal whitespace.
//   - Case-insensitive dedup via lower(display_name).
//   - Empty byline throws (the editor's `author_byline` validation
//     already prevents this reaching here, but defence-in-depth).
//   - On insert collision (extremely unlikely because display_name is
//     not unique; we rely on the row we just inserted) we fall back to
//     a re-fetch by lower(display_name).
export async function resolveOrCreateAuthorId(byline: string): Promise<string> {
  const cleaned = byline.trim().replace(/\s+/g, ' ')
  if (cleaned.length === 0) {
    throw new Error('resolveOrCreateAuthorId: byline is empty')
  }
  if (cleaned.length > 120) {
    throw new Error('resolveOrCreateAuthorId: byline exceeds 120 characters')
  }

  // 1. Load the (small) authors table once and filter in JS. Authors
  // accumulate slowly (one row per contributor) so this stays cheap.
  const { data: rows, error: readErr } = await supabase
    .from('blog_authors')
    .select('id, display_name')
  if (readErr) throw new Error(`resolveOrCreateAuthorId read: ${readErr.message}`)

  const hit = (rows ?? []).find(
    (r) => r.display_name.toLowerCase() === cleaned.toLowerCase(),
  )
  if (hit) return hit.id as string

  // 2. Create the new author row. role defaults to 'editor' via the
  // DB column default - we don't need to specify it.
  const { data: ins, error: insErr } = await supabase
    .from('blog_authors')
    .insert({ display_name: cleaned })
    .select('id')
    .single()
  if (!insErr && ins) return (ins as unknown as { id: string }).id

  // 3. Race fallback: another writer may have just inserted the same
  // display_name. Re-fetch by lower(display_name).
  const { data: existing, error: fetchErr } = await supabase
    .from('blog_authors')
    .select('id')
    .ilike('display_name', cleaned)
    .maybeSingle()
  if (fetchErr || !existing) {
    throw new Error(
      `resolveOrCreateAuthorId: failed to create or fetch "${cleaned}": ${insErr?.message ?? fetchErr?.message ?? 'unknown error'}`,
    )
  }
  return (existing as unknown as { id: string }).id
}

export async function listAllAuthors(): Promise<BlogAuthor[]> {
  const { data, error } = await supabase
    .from('blog_authors')
    .select('id, admin_user_id, display_name, role, avatar_url, bio_en, created_at')
    .order('display_name', { ascending: true })
  if (error) throw new Error(`listAllAuthors: ${error.message}`)
  return (data ?? []) as unknown as BlogAuthor[]
}

// Re-export for the few call sites that want a direct BlogPost type
// without the join extensions.
export type { BlogPost }
