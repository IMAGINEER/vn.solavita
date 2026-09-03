// /api/admin/blog/categories
//   GET   list all categories (with post counts)
//   POST  create a new category
//
// Both gated by requireApiAdmin().

import { NextResponse, type NextRequest } from 'next/server'
import { requireApiAdmin } from '@/lib/auth'
import {
  createCategory,
  getCategories,
} from '@/lib/data/blog'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response

  try {
    const cats = await getCategories()
    // Counts: a single grouped query is cheaper than N+1.
    const { data: countRows, error: cErr } = await supabase
      .from('blog_posts')
      .select('category_id')
      .eq('status', 'published')
    if (cErr) throw new Error(cErr.message)
    const counts = new Map<string, number>()
    for (const row of (countRows ?? []) as unknown as Array<{ category_id: string }>) {
      counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1)
    }
    return NextResponse.json({
      success: true,
      categories: cats.map((c) => ({ ...c, post_count: counts.get(c.id) ?? 0 })),
    })
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
  if (
    !body ||
    typeof body !== 'object' ||
    typeof (body as Record<string, unknown>).slug !== 'string' ||
    typeof (body as Record<string, unknown>).name_en !== 'string'
  ) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 },
    )
  }
  const v = body as Record<string, unknown>
  try {
    const id = await createCategory({
      slug: v.slug as string,
      name_en: v.name_en as string,
      description_en: (v.description_en as string | null | undefined) ?? null,
      sort_order: (v.sort_order as number | undefined) ?? 0,
    })
    return NextResponse.json({ success: true, id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = /duplicate key|unique constraint/i.test(message) ? 409 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}
