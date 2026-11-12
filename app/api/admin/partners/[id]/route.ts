// /api/admin/partners/[id]
//   PATCH  set the status of one vn_partner_leads row
//
// Gated by requireApiAdmin(). Used by the 状态 actions on
// /admin/partners:
//   - 标记已联系 → status 'contacted'
//   - 已参会     → status 'attended'
// 'new' is accepted too so a mis-click can be undone from the UI.
//
// The endpoint writes ONLY `status` (+ the trigger maintains
// `updated_at`); contact details are never editable through it.

import { NextResponse, type NextRequest } from 'next/server'
import { requireApiAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const STATUSES = ['new', 'contacted', 'attended'] as const
type PartnerStatus = (typeof STATUSES)[number]

interface Ctx {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiAdmin()
  if ('response' in gate) return gate.response

  const { id } = await ctx.params
  if (!UUID_RE.test(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid id' },
      { status: 400 },
    )
  }

  const body = await req.json().catch(() => null)
  const status =
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).status
      : null
  if (typeof status !== 'string' || !STATUSES.includes(status as PartnerStatus)) {
    return NextResponse.json(
      { success: false, error: 'Invalid status' },
      { status: 400 },
    )
  }

  const { data, error } = await supabase
    .from('vn_partner_leads')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .maybeSingle()

  if (error) {
    console.error('[/api/admin/partners/[id]] update error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
  if (!data) {
    return NextResponse.json(
      { success: false, error: 'Not found' },
      { status: 404 },
    )
  }

  return NextResponse.json({ success: true, id: data.id, status: data.status })
}