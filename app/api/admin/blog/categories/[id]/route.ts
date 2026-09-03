// /api/admin/blog/categories/[id]
//   PUT    update category
//   DELETE delete category (RESTRICT will block if posts reference it)
//
// Gated by requireApiAdmin().

import { NextResponse, type NextRequest } from 'next/server'
import { requireApiAdmin } from '@/lib/auth'
import {
  deleteCategory,
  updateCategory,
} from '@/lib/data/blog'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface Ctx {
  params: Promise<{ id: string }>
}

function readPayload(value: unknown):
  | { ok: true; slug: string; name_en: string; description_en: string | null; sort_order: number }
  | { ok: false } {
  if (!value || typeof value !== 'object') return { ok: false }
  const v = value as Record<string, unknown>
  if (typeof v.slug !== 'string' || typeof v.name_en !== 'string') {
    return { ok: false }
  }
  return {
    ok: true,
    slug: v.slug,
    name_en: v.name_en,
    description_en: (v.description_en as string | null | undefined) ?? null,
    sort_order: typeof v.sort_order === 'number' ? v.sort_order : 0,
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response

  const parsed = readPayload(await req.json().catch(() => null))
  if (!parsed.ok) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 },
    )
  }
  const { id } = await ctx.params
  try {
    await updateCategory(id, parsed)
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
    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    // 409 when referenced by posts - the FK is ON DELETE RESTRICT.
    const status = /foreign key|violates/i.test(message) ? 409 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}
