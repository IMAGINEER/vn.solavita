// /admin/blog - posts list. Server component: fetches the first page
// (status/search/page via querystring), then delegates to the client
// table component which handles filters + pagination.

import { Plus } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import {
  listAllPostsAdmin,
  listAllAuthors,
  getCategories,
} from '@/lib/data/blog'
import type { BlogPostStatus } from '@/lib/types/blog'
import { PostsTable } from './PostsTable'
import { ButtonLink } from '@/components/ui/button-link'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage(props: {
  searchParams: Promise<{
    status?: string
    search?: string
    page?: string
  }>
}) {
  await requireAdmin()

  const sp = await props.searchParams
  const status: BlogPostStatus | undefined =
    sp.status === 'draft' || sp.status === 'published' ? sp.status : undefined
  const search = sp.search?.trim() || undefined
  const page = Number(sp.page ?? '1') || 1
  const pageSize = 20

  const [result, categories, authors] = await Promise.all([
    listAllPostsAdmin({ status, search, page, pageSize }),
    getCategories(),
    listAllAuthors(),
  ])

  // Build a (id → name) lookup so the table can show category/author
  // labels without a second round-trip.
  const catById = new Map(categories.map((c) => [c.id, c]))
  const authById = new Map(authors.map((a) => [a.id, a]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-cw-bold text-uk-navy">Blog</h1>
          <p className="mt-1 text-sm text-uk-slate">
            Articles, guides and news published on the site. {result.total} total.
          </p>
        </div>
        <ButtonLink href="/admin/blog/new">
          <Plus className="size-4" />
          New post
        </ButtonLink>
      </div>

      <PostsTable
        rows={result.rows}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        totalPages={result.totalPages}
        catById={Object.fromEntries(
          Array.from(catById.entries()).map(([k, v]) => [k, v.name_en]),
        )}
        authById={Object.fromEntries(
          Array.from(authById.entries()).map(([k, v]) => [k, v.display_name]),
        )}
        initialStatus={status ?? 'all'}
        initialSearch={search ?? ''}
      />
    </div>
  )
}
