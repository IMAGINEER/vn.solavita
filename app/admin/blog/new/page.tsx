// /admin/blog/new - create a new post. Server component fetches
// taxonomy (categories + tags) and passes them to the PostEditor
// client component. Author byline is free-text in the editor - no
// pre-fetched authors prop.

import { requireAdmin } from '@/lib/auth'
import {
  getCategories,
  getTags,
} from '@/lib/data/blog'
import { PostEditor } from '@/components/admin/blog/PostEditor'
import { ButtonLink } from '@/components/ui/button-link'

export const dynamic = 'force-dynamic'

export default async function NewBlogPostPage() {
  await requireAdmin()

  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-cw-bold text-uk-navy">Bài viết mới</h1>
          <p className="mt-1 text-sm text-uk-slate">
            Viết nội dung bằng markdown. Lưu thành bản nháp hoặc xuất bản ngay.
          </p>
        </div>
        <ButtonLink href="/admin/blog" variant="ghost">
          ← Quay lại danh sách
        </ButtonLink>
      </div>

      <PostEditor
        categories={categories}
        tags={tags}
      />
    </div>
  )
}
