'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Loader2, Pencil, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { BlogPostStatus, BlogPostSummary } from '@/lib/types/blog'

// Client-side posts table used by app/admin/blog/page.tsx. Reuses the
// hand-rolled shadcn-style Table primitives that every other admin
// table in the project uses.

export interface PostsTableProps {
  rows: BlogPostSummary[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  catById: Record<string, string>
  authById: Record<string, string>
  initialStatus: 'all' | BlogPostStatus
  initialSearch: string
}

export function PostsTable({
  rows,
  total,
  page,
  pageSize,
  totalPages,
  catById,
  authById,
  initialStatus,
  initialSearch,
}: PostsTableProps) {
  const router = useRouter()
  const pathname = usePathname()

  const updateQuery = useCallback(
    (next: { status?: 'all' | BlogPostStatus; search?: string; page?: number }) => {
      const params = new URLSearchParams()
      if (next.status && next.status !== 'all') params.set('status', next.status)
      if (next.search) params.set('search', next.search)
      if (next.page && next.page > 1) params.set('page', String(next.page))
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [router, pathname],
  )

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    updateQuery({ search: String(fd.get('search') ?? ''), page: 1 })
  }

  // Permanent delete - hard remove from blog_posts. blog_post_tags +
  // blog_post_revisions cascade via FK ON DELETE CASCADE. The API is
  // already in place at /api/admin/blog/posts/[id] (DELETE).
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (post: BlogPostSummary) => {
    setDeleteError(null)
    const ok = window.confirm(
      `Xoá vĩnh viễn "${post.title}"?\n\n` +
        `Bài viết, liên kết thẻ và lịch sử chỉnh sửa sẽ bị xoá. ` +
        `Không thể hoàn tác.`,
    )
    if (!ok) return
    setDeletingId(post.id)
    try {
      const res = await fetch(`/api/admin/blog/posts/${post.id}`, {
        method: 'DELETE',
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (!res.ok || !json.success) {
        setDeleteError(json.error ?? 'Xoá thất bại')
        return
      }
      router.refresh()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Lỗi kết nối mạng')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {deleteError && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-uk-slate" />
            <Input
              name="search"
              defaultValue={initialSearch}
              placeholder="Tìm theo tiêu đề…"
              className="pl-8 w-64"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Tìm kiếm
          </Button>
        </form>

        <div className="flex items-center gap-1.5 ml-auto">
          {(['all', 'draft', 'published'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateQuery({ status: s, page: 1 })}
              className={`px-3 h-8 rounded-md text-xs font-cw-bold transition-colors ${
                initialStatus === s
                  ? 'bg-uk-teal-dark text-white'
                  : 'bg-white border border-uk-line text-uk-slate hover:bg-uk-teal-soft'
              }`}
            >
              {s === 'all' ? 'Tất cả' : s === 'draft' ? 'Bản nháp' : 'Đã xuất bản'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-uk-line bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-uk-teal-soft/50 text-uk-slate">
            <tr>
              <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">
                Tiêu đề
              </th>
              <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">
                Danh mục
              </th>
              <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">
                Tác giả
              </th>
              <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">
                Trạng thái
              </th>
              <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">
                Ngày
              </th>
              <th className="text-right font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5 w-28" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-uk-slate py-12 px-4">
                  Không có bài viết nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id} className="border-t border-uk-line">
                  <td className="px-4 py-3">
                    <div className="font-cw-bold text-uk-navy">{p.title}</div>
                    <div className="text-[11px] text-uk-slate font-mono mt-0.5">
                      /blog/{p.category.slug}/{p.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-uk-slate">
                    {catById[p.category_id] ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-uk-slate">
                    {authById[p.author_id] ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {p.status === 'published' ? (
                      <Badge variant="success">Đã xuất bản</Badge>
                    ) : (
                      <Badge variant="muted">Bản nháp</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-uk-slate text-xs tabular-nums">
                    {p.published_at
                      ? new Date(p.published_at).toLocaleDateString('vi-VN')
                      : new Date(p.updated_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-0.5">
                      <ButtonLink
                        href={`/admin/blog/${p.id}`}
                        variant="ghost"
                        size="icon"
                        aria-label="Chỉnh sửa"
                      >
                        <Pencil className="size-4" />
                      </ButtonLink>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Xoá ${p.title}`}
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p)}
                        className="text-red-700 hover:bg-red-50 hover:text-red-700"
                      >
                        {deletingId === p.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-uk-slate">
        <div>
          Hiển thị {(page - 1) * pageSize + (rows.length > 0 ? 1 : 0)}-{(page - 1) * pageSize + rows.length} trong {total}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateQuery({ page: page - 1 })}
            >
              ← Trước
            </Button>
            <span>
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateQuery({ page: page + 1 })}
            >
              Sau →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
