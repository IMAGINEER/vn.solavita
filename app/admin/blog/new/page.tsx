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
          <h1 className="text-2xl font-cw-bold text-uk-navy">新建文章</h1>
          <p className="mt-1 text-sm text-uk-slate">
            使用 Markdown 撰写内容，可保存为草稿或直接发布。
          </p>
        </div>
        <ButtonLink href="/admin/blog" variant="ghost">
          ← 返回列表
        </ButtonLink>
      </div>

      <PostEditor
        categories={categories}
        tags={tags}
      />
    </div>
  )
}
