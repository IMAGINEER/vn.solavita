// /admin/blog/categories - manage blog categories.

import { requireAdmin } from '@/lib/auth'
import {
  getCategories,
  listAllPostsAdmin,
} from '@/lib/data/blog'
import { CategoriesManager } from './CategoriesManager'
import { ButtonLink } from '@/components/ui/button-link'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  await requireAdmin()

  const [cats, allPosts] = await Promise.all([
    getCategories(),
    listAllPostsAdmin({ pageSize: 100 }),
  ])

  // Count of posts (any status) per category - the manager surfaces
  // the count so the user knows which categories are in use.
  const counts = new Map<string, number>()
  for (const p of allPosts.rows) {
    counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1)
  }
  const enriched = cats.map((c) => ({ ...c, post_count: counts.get(c.id) ?? 0 }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-cw-bold text-uk-navy">
            Danh mục blog
          </h1>
          <p className="mt-1 text-sm text-uk-slate">
            Ba danh mục chính: hướng dẫn, tin tức, câu chuyện khách hàng. Chỉ thêm
            danh mục mới khi cần tách riêng luồng đọc.
          </p>
        </div>
        <ButtonLink href="/admin/blog" variant="ghost">
          ← Bài viết
        </ButtonLink>
      </div>

      <CategoriesManager categories={enriched} />
    </div>
  )
}
