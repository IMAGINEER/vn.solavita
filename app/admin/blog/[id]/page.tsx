// /admin/blog/[id] - edit an existing post. Server component fetches
// the post (via the admin helper which does not filter by status) plus
// taxonomy; PostEditor handles save/delete. Author byline is loaded
// from the joined author row and pre-filled in the editor.

import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import {
  getCategories,
  getPostByIdAdmin,
  getTags,
  listRevisions,
} from '@/lib/data/blog'
import { PostEditor } from '@/components/admin/blog/PostEditor'
import { ButtonLink } from '@/components/ui/button-link'

export const dynamic = 'force-dynamic'

export default async function EditBlogPostPage(props: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await props.params

  const [post, categories, tags, revisions] = await Promise.all([
    getPostByIdAdmin(id),
    getCategories(),
    getTags(),
    listRevisions(id),
  ])

  if (!post) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-cw-bold text-uk-navy">
            Chỉnh sửa bài viết
          </h1>
          <p className="mt-1 text-sm text-uk-slate">
            Trạng thái hiện tại:{' '}
            {post.status === 'published' ? (
              <span className="text-emerald-700 font-cw-bold">Đã xuất bản</span>
            ) : (
              <span className="text-uk-slate font-cw-bold">Bản nháp</span>
            )}
            {post.published_at && (
              <> · xuất bản ngày {new Date(post.published_at).toLocaleDateString('vi-VN')}</>
            )}
          </p>
        </div>
        <ButtonLink href="/admin/blog" variant="ghost">
          ← Quay lại danh sách
        </ButtonLink>
      </div>

      <PostEditor
        initial={post}
        categories={categories}
        tags={tags}
      />

      {revisions.length > 0 && (
        <section className="rounded-2xl border border-uk-line bg-white p-5">
          <h2 className="text-sm font-cw-bold text-uk-navy uppercase tracking-wider mb-3">
            Lịch sử chỉnh sửa
          </h2>
          <ul className="divide-y divide-uk-line text-xs">
            {revisions.map((r) => (
              <li key={r.id} className="py-2 flex items-center justify-between">
                <span className="font-mono text-uk-slate">
                  {new Date(r.edited_at).toLocaleString('vi-VN')}
                </span>
                <span className="text-uk-slate">{r.note ?? 'bản lưu tạm'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
