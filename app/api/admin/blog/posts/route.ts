// /api/admin/blog/posts
//   GET  ?status=&search=&page=&pageSize=  list posts (admin)
//   POST                                  create a new post
//
// Both gated by requireApiAdmin().

import { NextResponse, type NextRequest } from 'next/server'
import { requireApiAdmin } from '@/lib/auth'
import {
  createPost,
  listAllPostsAdmin,
} from '@/lib/data/blog'
import type {
  BlogPostDraftInput,
  BlogPostStatus,
} from '@/lib/types/blog'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function parseStatus(raw: string | null): BlogPostStatus | undefined {
  if (raw === 'draft' || raw === 'published') return raw
  return undefined
}

export async function GET(req: NextRequest) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response

  const url = new URL(req.url)
  const status = parseStatus(url.searchParams.get('status'))
  const search = url.searchParams.get('search')?.trim() || undefined
  const page = Number(url.searchParams.get('page') ?? '1')
  const pageSize = Number(url.searchParams.get('pageSize') ?? '20')

  try {
    const result = await listAllPostsAdmin({
      status,
      search,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 20,
    })
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

  try {
    const id = await createPost(body, gate.user.id)
    return NextResponse.json({ success: true, id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    // Slug-per-category uniqueness is a 409; everything else is a 500.
    const status = /duplicate key|unique constraint/i.test(message) ? 409 : 500
    return NextResponse.json({ success: false, error: message }, { status })
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
