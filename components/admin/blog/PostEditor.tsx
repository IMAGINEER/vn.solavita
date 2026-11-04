'use client'

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Loader2, Save, Sparkles, Trash2, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type {
  BlogCategory,
  BlogPostFull,
  BlogPostStatus,
  BlogTag,
} from '@/lib/types/blog'

// PostEditor - markdown + dual-pane preview editor for the admin.
//
// Shape (large breakpoint):
//   ┌──────────────────────┬────────────────────────┐
//   │ Form (cover, meta)   │   Markdown (left)      │
//   │                     │   Preview (right)      │
//   │                     │                        │
//   └──────────────────────┴────────────────────────┘
//
// Image upload: drop an image file via the "Insert image" button on
// the toolbar; the file is POSTed to /api/admin/blog/upload, the
// returned URL is inserted into the textarea at the caret as
// `![alt](url)` and the markdown preview re-renders immediately.

export interface PostEditorProps {
  /** Optional existing post - if absent, creates a new draft. */
  initial?: BlogPostFull
  categories: BlogCategory[]
  tags: BlogTag[]
}

interface FormState {
  title: string
  slug: string
  excerpt: string
  body_md: string
  cover_image_url: string
  category_id: string
  /**
   * Free-text author byline (e.g. "Nguyễn Văn A"). The server
   * resolves this to a blog_authors row - case-insensitive lookup on
   * display_name, creating a new row on miss. Defaults to the
   * Đội ngũ Solavita Việt Nam byline for new posts.
   */
  author_byline: string
  status: BlogPostStatus
  meta_title: string
  meta_description: string
  /**
   * Selected tags for the post. Each token carries the display name and
   * (when known) the existing tag id. New names typed inline have id
   * undefined until the server resolves them on save.
   */
  tag_tokens: TagToken[]
}

/** A committed tag chip in the editor. */
interface TagToken {
  name: string
  /** Present for tags loaded from the server; undefined for freshly typed names. */
  id?: string
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

export function PostEditor({
  initial,
  categories,
  tags,
}: PostEditorProps) {
  const router = useRouter()
  const titleId = useId()
  const slugId = useId()
  const excerptId = useId()
  const coverId = useId()
  const categoryId = useId()
  const authorBylineId = useId()
  const tagId = useId()
  const metaTitleId = useId()
  const metaDescId = useId()
  const bodyId = useId()

  // Default cover image for new posts. Existing posts keep their own
  // cover so we don't accidentally overwrite a curated image when an
  // editor opens the draft to tweak a few words.
  const DEFAULT_COVER = '/images/hero-blog.webp'

  const [form, setForm] = useState<FormState>(() => ({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    excerpt: initial?.excerpt ?? '',
    body_md: initial?.body_md ?? '',
    cover_image_url: initial?.cover_image_url ?? DEFAULT_COVER,
    category_id:
      initial?.category_id ?? categories[0]?.id ?? '',
    // Pre-fill byline with the existing author for edits, or the
    // default Vietnam team byline for new posts.
    author_byline:
      initial?.author?.display_name ?? 'Đội ngũ Solavita Việt Nam',
    status: initial?.status ?? 'draft',
    meta_title: initial?.meta_title ?? '',
    meta_description: initial?.meta_description ?? '',
    tag_tokens:
      initial?.tags.map((t) => ({ name: t.name_en, id: t.id })) ?? [],
  }))

  // Auto-fill slug from title the first time the user types (and only
  // if the slug field is still empty - never overwrite a manual edit).
  const slugTouchedRef = useRef(Boolean(initial?.slug))
  const handleTitleChange = (value: string) => {
    setForm((f) => {
      const next = { ...f, title: value }
      if (!slugTouchedRef.current && !initial) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  // Cover upload reuses the same endpoint; we let it sit in its own
  // folder (`cover/`) so it's easy to reason about storage structure.
  const [coverUploading, setCoverUploading] = useState(false)
  const [bodyUploading, setBodyUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const uploadFile = useCallback(
    async (file: File, folder: string): Promise<string | null> => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      try {
        const res = await fetch('/api/admin/blog/upload', {
          method: 'POST',
          body: fd,
        })
        const json = (await res.json()) as {
          success: boolean
          url?: string
          error?: string
        }
        if (!res.ok || !json.success || !json.url) {
          setError(json.error ?? 'Tải lên thất bại')
          return null
        }
        return json.url
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Lỗi kết nối khi tải lên',
        )
        return null
      }
    },
    [],
  )

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting same file
    if (!file) return
    setError(null)
    setCoverUploading(true)
    const url = await uploadFile(file, 'cover')
    setCoverUploading(false)
    if (url) setForm((f) => ({ ...f, cover_image_url: url }))
  }

  const handleBodyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    setBodyUploading(true)
    const url = await uploadFile(
      file,
      initial ? `posts/${initial.id}` : 'drafts',
    )
    setBodyUploading(false)
    if (!url) return

    // Insert ![alt](url) at the caret, preserving the current selection.
    const ta = bodyTextareaRef.current
    if (!ta) {
      setForm((f) => ({
        ...f,
        body_md: `${f.body_md}${f.body_md ? '\n\n' : ''}![${file.name}](${url})\n`,
      }))
      return
    }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const before = form.body_md.slice(0, start)
    const after = form.body_md.slice(end)
    const inserted = `![${file.name}](${url})`
    const next = `${before}${inserted}${after}`
    setForm((f) => ({ ...f, body_md: next }))
    // Restore caret right after the inserted snippet.
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + inserted.length
      ta.setSelectionRange(pos, pos)
    })
  }

  // ── Tag text input ─────────────────────────────────────────────────────
  // Authors type tag names separated by spaces, commas, or newlines.
  // We split the current input on those delimiters and commit each
  // trimmed, case-insensitive-unique token as a TagToken. The server
  // resolves names to ids (creating missing ones) on save.
  const [tagDraft, setTagDraft] = useState('')
  const tagInputRef = useRef<HTMLInputElement | null>(null)

  // Split a free-form string into individual tag names. Treats spaces,
  // commas, semicolons, tabs, and newlines as separators.
  function parseTagInput(raw: string): string[] {
    return raw
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  function commitTagString(raw: string) {
    const candidates = parseTagInput(raw)
    if (candidates.length === 0) return
    setForm((f) => {
      const next: TagToken[] = [...f.tag_tokens]
      const seen = new Set(
        next.map((t) => t.name.toLowerCase()).filter(Boolean),
      )
      for (const name of candidates) {
        const key = name.toLowerCase()
        if (seen.has(key)) continue
        // If the user typed a name that already exists in the catalog
        // (case-insensitive), prefer the canonical row's id so the
        // payload doesn't create a duplicate.
        const catalogHit = tags.find(
          (t) => t.name_en.toLowerCase() === key,
        )
        if (catalogHit) {
          // If we already have a token with this id, skip.
          if (next.some((t) => t.id === catalogHit.id)) continue
          next.push({ name: catalogHit.name_en, id: catalogHit.id })
        } else {
          next.push({ name })
        }
        seen.add(key)
      }
      return { ...f, tag_tokens: next }
    })
  }

  const handleTagInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';' || e.key === ' ') {
      e.preventDefault()
      const value = tagDraft
      if (parseTagInput(value).length === 0) return
      commitTagString(value)
      setTagDraft('')
    } else if (e.key === 'Backspace' && tagDraft === '' && form.tag_tokens.length > 0) {
      // Convenience: backspace on an empty input removes the last token.
      e.preventDefault()
      setForm((f) => ({ ...f, tag_tokens: f.tag_tokens.slice(0, -1) }))
    }
  }

  const handleTagInputBlur = () => {
    if (tagDraft.trim().length === 0) return
    commitTagString(tagDraft)
    setTagDraft('')
  }

  const removeTagToken = (index: number) => {
    setForm((f) => ({
      ...f,
      tag_tokens: f.tag_tokens.filter((_, i) => i !== index),
    }))
  }

  // ── Generate SEO ───────────────────────────────────────────────────────
  // Fills empty meta_title / meta_description from the title / excerpt.
  // Manual edits are preserved - we only write into currently-empty fields.
  const handleGenerateSeo = () => {
    setForm((f) => {
      const next = { ...f }
      if (f.meta_title.trim() === '' && f.title.trim() !== '') {
        next.meta_title = f.title.trim().slice(0, 60)
      }
      if (
        f.meta_description.trim() === '' &&
        f.excerpt.trim() !== ''
      ) {
        next.meta_description = f.excerpt.trim().slice(0, 155)
      }
      return next
    })
  }

  const canGenerateSeo =
    (form.meta_title.trim() === '' && form.title.trim() !== '') ||
    (form.meta_description.trim() === '' && form.excerpt.trim() !== '')

  const payload = useMemo(
    () => ({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      body_md: form.body_md,
      cover_image_url: form.cover_image_url || null,
      category_id: form.category_id,
      author_byline: form.author_byline,
      status: form.status,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      // Server resolves names to ids (creating missing rows). See
      // lib/data/blog.ts -> resolveOrCreateTagIds.
      tag_names: form.tag_tokens.map((t) => t.name),
    }),
    [form],
  )

  const handleSave = async (nextStatus?: BlogPostStatus) => {
    setError(null)
    if (!form.title.trim()) {
      setError('Vui lòng nhập tiêu đề.')
      return
    }
    if (!form.slug.trim()) {
      setError('Vui lòng nhập slug.')
      return
    }
    if (!form.category_id) {
      setError('Vui lòng chọn danh mục.')
      return
    }
    if (!form.author_byline.trim()) {
      setError('Vui lòng nhập tên tác giả.')
      return
    }
    setSaving(true)
    const body = nextStatus ? { ...payload, status: nextStatus } : payload
    const target = initial
      ? `/api/admin/blog/posts/${initial.id}`
      : '/api/admin/blog/posts'
    const method = initial ? 'PUT' : 'POST'
    try {
      const res = await fetch(target, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = (await res.json()) as {
        success: boolean
        id?: string
        error?: string
      }
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Lưu thất bại')
        return
      }
      const id = initial?.id ?? json.id
      router.push(`/admin/blog/${id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối mạng')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initial) return
    if (!window.confirm('Xoá vĩnh viễn bài viết này?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/blog/posts/${initial.id}`, {
        method: 'DELETE',
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Xoá thất bại')
        return
      }
      router.push('/admin/blog')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối mạng')
    } finally {
      setDeleting(false)
    }
  }

  // Body changes are large; the dual-pane preview re-renders the
  // entire markdown tree on every keystroke. Throttle via a separate
  // state with a small debounce.
  const [previewMd, setPreviewMd] = useState(form.body_md)
  useEffect(() => {
    const t = setTimeout(() => setPreviewMd(form.body_md), 80)
    return () => clearTimeout(t)
  }, [form.body_md])

  const isEditing = Boolean(initial)
  const wordCount = form.body_md.trim().length === 0
    ? 0
    : form.body_md.trim().split(/\s+/).length

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Side panel: cover, meta, taxonomy ──────────────────────── */}
        <aside className="space-y-5 lg:col-span-1 order-2 lg:order-1">
          <section className="rounded-2xl border border-uk-line bg-white p-5 space-y-4">
            <div>
              <Label htmlFor={coverId}>Ảnh bìa</Label>
              <div className="mt-1.5 space-y-2">
                {form.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.cover_image_url}
                    alt="Ảnh bìa"
                    className="w-full h-32 object-cover rounded-md border border-uk-line"
                  />
                ) : (
                  <div className="w-full h-32 rounded-md border border-dashed border-uk-line flex items-center justify-center text-xs text-uk-slate">
                    Chưa có ảnh
                  </div>
                )}
                <div className="flex gap-2">
                  <label
                    htmlFor={coverId}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-uk-line bg-white text-xs font-cw-bold text-uk-navy hover:bg-uk-teal-soft cursor-pointer"
                  >
                    {coverUploading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <ImagePlus className="size-3.5" />
                    )}
                    {coverUploading ? 'Đang tải lên…' : 'Tải lên'}
                  </label>
                  <input
                    id={coverId}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    className="sr-only"
                    onChange={handleCoverUpload}
                  />
                  {form.cover_image_url && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setForm((f) => ({ ...f, cover_image_url: '' }))}
                    >
                      Xoá
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-uk-slate">
                  Mặc định cho bài viết mới: <code className="font-mono">{DEFAULT_COVER}</code>
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor={titleId}>Tiêu đề</Label>
              <Input
                id={titleId}
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Tiết kiệm điện mặt trời tại Việt Nam 2026"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor={slugId}>Slug</Label>
              <Input
                id={slugId}
                value={form.slug}
                onChange={(e) => {
                  slugTouchedRef.current = true
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }}
                placeholder="tiet-kiem-dien-mat-troi-vn-2026"
                className="mt-1.5 font-mono"
              />
              <p className="text-[11px] text-uk-slate mt-1">
                URL: /blog/{form.category_id ? 'category-...' : '...'}/{form.slug || '...'}
              </p>
            </div>

            <div>
              <Label htmlFor={categoryId}>Danh mục</Label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                id={categoryId}
                className="mt-1.5 w-full h-9 rounded-md border border-uk-line bg-white px-3 text-sm text-uk-navy focus:outline-none focus:ring-2 focus:ring-uk-teal/40 focus:border-uk-teal"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name_en}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor={authorBylineId}>Tên tác giả</Label>
              <Input
                id={authorBylineId}
                value={form.author_byline}
                onChange={(e) => setForm((f) => ({ ...f, author_byline: e.target.value }))}
                placeholder="VD: Nguyễn Văn A hoặc Đội ngũ Solavita Việt Nam"
                className="mt-1.5"
              />
              <p className="text-[11px] text-uk-slate mt-1">
                Văn bản tự do hiển thị làm tác giả bài viết. Tên đã có sẽ được tự động liên kết với tác giả hiện có; tên mới sẽ tạo bản ghi tác giả mới khi lưu.
              </p>
            </div>

            <div>
              <Label htmlFor={tagId}>Thẻ</Label>
              <p className="mt-1 text-[11px] text-uk-slate">
                Nhập thẻ rồi nhấn Enter, dấu phẩy hoặc dấu cách để thêm. Những tên chưa tồn tại sẽ được tự động tạo khi lưu.
              </p>
              <div
                id={tagId}
                className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-md border border-uk-line bg-white px-2 py-2 focus-within:ring-2 focus-within:ring-uk-teal/40 focus-within:border-uk-teal"
              >
                {form.tag_tokens.map((t, i) => {
                  const isExisting = Boolean(t.id)
                  return (
                    <span
                      key={`${t.name}-${i}`}
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-cw-bold tracking-wider uppercase ${
                        isExisting
                          ? 'bg-uk-teal-dark text-white border-uk-teal-dark'
                          : 'bg-white text-uk-teal-dark border-uk-teal/40'
                      }`}
                    >
                      {t.name}
                      <button
                        type="button"
                        onClick={() => removeTagToken(i)}
                        aria-label={`Xoá thẻ ${t.name}`}
                        className={`inline-flex items-center justify-center rounded-full ${
                          isExisting
                            ? 'hover:bg-white/20'
                            : 'hover:bg-uk-teal-soft'
                        }`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )
                })}
                <input
                  ref={tagInputRef}
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={handleTagInputKey}
                  onBlur={handleTagInputBlur}
                  placeholder={
                    form.tag_tokens.length === 0
                      ? 'VD: điện mặt trời, pin lưu trữ'
                      : ''
                  }
                  className="min-w-[140px] flex-1 bg-transparent text-sm text-uk-navy outline-none placeholder:text-uk-slate/60"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={excerptId}>Tóm tắt</Label>
              <Textarea
                id={excerptId}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Mô tả ngắn về bài viết (hiển thị trên thẻ bài viết và OpenGraph)"
                className="mt-1.5 min-h-[80px] font-sans"
              />
            </div>

            <div className="border-t border-uk-line pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
                  SEO
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSeo}
                  disabled={!canGenerateSeo}
                  title={
                    canGenerateSeo
                      ? 'Điền các trường meta còn trống từ tiêu đề và tóm tắt'
                      : 'Cả hai trường đều đã được điền'
                  }
                >
                  <Sparkles className="size-3.5" />
                  Tạo SEO
                </Button>
              </div>
              <p className="text-[11px] text-uk-slate -mt-2">
                Các thẻ gắn với bài viết sẽ tự động được xuất thành <code>&lt;meta name=&quot;keywords&quot;&gt;</code>.
              </p>
              <div>
                <Label htmlFor={metaTitleId}>Tiêu đề meta (SEO)</Label>
                <Input
                  id={metaTitleId}
                  value={form.meta_title}
                  onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                  placeholder="Nếu để trống, dùng tiêu đề bài viết"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor={metaDescId}>Mô tả meta (SEO)</Label>
                <Textarea
                  id={metaDescId}
                  value={form.meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                  placeholder="~150 ký tự. Nếu để trống, dùng phần tóm tắt."
                  className="mt-1.5 min-h-[70px] font-sans"
                />
              </div>
            </div>
          </section>
        </aside>

        {/* ── Main: markdown editor + live preview ───────────────────── */}
        <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={bodyId}>Nội dung (Markdown)</Label>
              <span className="text-[11px] text-uk-slate">
                {wordCount} từ · {form.body_md.length} ký tự
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="body-upload"
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md border border-uk-line bg-white text-xs font-cw-bold text-uk-navy hover:bg-uk-teal-soft cursor-pointer"
              >
                {bodyUploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="size-3.5" />
                )}
                {bodyUploading ? 'Đang tải lên…' : 'Chèn ảnh'}
              </label>
              <input
                id="body-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="sr-only"
                onChange={handleBodyUpload}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Textarea
              id={bodyId}
              ref={bodyTextareaRef}
              value={form.body_md}
              onChange={(e) => setForm((f) => ({ ...f, body_md: e.target.value }))}
              placeholder={'Viết nội dung bằng **markdown** tại đây…\n\nKhông cần tiêu đề cấp # — tiêu đề bài viết bên trái đã được hiển thị làm H1 của trang.'}
              className="h-[60vh] font-mono text-[13px] leading-relaxed"
            />
            <div className="h-[60vh] overflow-auto rounded-md border border-uk-line bg-white px-5 py-4">
              <div className="prose prose-sm md:prose-base max-w-none text-uk-navy prose-headings:text-uk-navy prose-a:text-uk-teal-dark prose-strong:text-uk-navy">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {previewMd || '*Bản xem trước trống*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* ── Save bar ──────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-uk-line pt-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleSave('draft')}
                disabled={saving}
                variant="outline"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Lưu bản nháp
              </Button>
              <Button
                onClick={() => handleSave('published')}
                disabled={saving}
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {isEditing ? 'Cập nhật và xuất bản' : 'Xuất bản'}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {initial && (
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="outline"
                  className="text-red-700 border-red-200 hover:bg-red-50"
                >
                  {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  Xoá
                </Button>
              )}
              <ButtonLink href="/admin/blog" variant="ghost">
                Huỷ
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
