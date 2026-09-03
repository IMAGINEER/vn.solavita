// /api/admin/blog/tags
//   GET   list all tags
//   POST  create a new tag
//   DELETE ?id= delete a tag (kept on GET/POST handler for simplicity)

import { NextResponse, type NextRequest } from 'next/server'
import { requireApiAdmin } from '@/lib/auth'
import { createTag, deleteTag, getTags } from '@/lib/data/blog'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response
  try {
    const tags = await getTags()
    return NextResponse.json({ success: true, tags })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response
  const v = await req.json().catch(() => null)
  if (
    !v ||
    typeof v !== 'object' ||
    typeof (v as Record<string, unknown>).slug !== 'string' ||
    typeof (v as Record<string, unknown>).name_en !== 'string'
  ) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 },
    )
  }
  const r = v as Record<string, unknown>
  try {
    const id = await createTag({
      slug: r.slug as string,
      name_en: r.name_en as string,
    })
    return NextResponse.json({ success: true, id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = /duplicate key|unique constraint/i.test(message) ? 409 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

export async function DELETE(req: NextRequest) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response
  const id = new URL(req.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Missing id' },
      { status: 400 },
    )
  }
  try {
    await deleteTag(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
