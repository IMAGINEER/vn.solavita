// /admin/blog/tags - manage free-form tags.

import { requireAdmin } from '@/lib/auth'
import { getTags } from '@/lib/data/blog'
import { TagsManager } from './TagsManager'
import { ButtonLink } from '@/components/ui/button-link'

export const dynamic = 'force-dynamic'

export default async function AdminTagsPage() {
  await requireAdmin()
  const tags = await getTags()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-cw-bold text-uk-navy">Thẻ blog</h1>
          <p className="mt-1 text-sm text-uk-slate">
            Thẻ dùng xuyên danh mục: cùng một thẻ có thể xuất hiện ở nhiều danh mục khác nhau.
          </p>
        </div>
        <ButtonLink href="/admin/blog" variant="ghost">
          ← Bài viết
        </ButtonLink>
      </div>

      <TagsManager tags={tags} />
    </div>
  )
}
