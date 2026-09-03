// /api/admin/blog/posts/[id]
//   GET    fetch a single post (admin)
//   PUT    update the post
//   DELETE delete the post
//
// Gated by requireApiAdmin(). The id is the blog_posts.id (UUID).

import { NextResponse, type NextRequest } from 'next/server'
import { requireApiAdmin } from '@/lib/auth'
import {
  deletePost,
  getPostByIdAdmin,
  updatePost,
} from '@/lib/data/blog'
import type { BlogPostDraftInput } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface Ctx {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response

  const { id } = await ctx.params
  try {
    const post = await getPostByIdAdmin(id)
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 },
      )
    }
    return NextResponse.json({ success: true, post })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 },
    )
  }
  if (!isValidDraftInput(body)) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 },
    )
  }

  const { id } = await ctx.params
  try {
    await updatePost(id, body, gate.user.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = /duplicate key|unique constraint/i.test(message) ? 409 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response

  const { id } = await ctx.params
  try {
    await deletePost(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

function isValidDraftInput(value: unknown): value is BlogPostDraftInput {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  const byline = typeof v.author_byline === 'string' ? v.author_byline.trim() : ''
  return (
    typeof v.title === 'string' &&
    typeof v.slug === 'string' &&
    typeof v.body_md === 'string' &&
    typeof v.category_id === 'string' &&
    byline.length > 0 &&
    byline.length <= 120 &&
    (v.status === 'draft' || v.status === 'published') &&
    (v.tag_ids === undefined ||
      (Array.isArray(v.tag_ids) && v.tag_ids.every((t) => typeof t === 'string'))) &&
    (v.tag_names === undefined ||
      (Array.isArray(v.tag_names) &&
        v.tag_names.every(
          (t) => typeof t === 'string' && t.trim().length > 0 && t.trim().length <= 80,
        )))
  )
}
