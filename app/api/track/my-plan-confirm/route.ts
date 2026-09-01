/**
 * POST /api/track/my-plan-confirm
 *
 * Called from /my-plan when the user clicks "Talk to an expert". Records
 * plan_confirmed_at via the SECURITY DEFINER RPC `record_my_plan_confirm`
 * - idempotent (COALESCE preserves the first confirmation).
 *
 * Response is always 200 `{ ok: true }` to avoid leaking whether the
 * plan_token exists. Failures are logged but not surfaced to the caller
 * - the click still triggers the success toast in the UI regardless.
 *
 * **Why no auth?** The plan_token is already in the customer's email and
 * in their URL bar. Confirming it doesn't grant access to anything - the
 * /api/my-plan/[token] endpoint is the only read path and that already
 * filters to `country = 'uk'`. If we later add a portal login, narrow
 * this to `where email = auth.email()`.
 */

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(req: Request) {
  let body: { planToken?: unknown }
  try {
    body = (await req.json()) as { planToken?: unknown }
  } catch {
    return NextResponse.json({ ok: true })
  }

  const rawToken = body?.planToken
  if (typeof rawToken !== 'string' || !UUID_RE.test(rawToken)) {
    return NextResponse.json({ ok: true })
  }

  try {
    // Lazy import to avoid pulling Supabase into the build-time module
    // graph when this endpoint isn't reached (it shares the same
    // init-lazy pattern as lib/emails/send.ts).
    const { supabase } = await import('@/lib/supabase')
    const { error } = await supabase.rpc('record_my_plan_confirm', {
      p_token: rawToken,
    })
    if (error) {
      console.error('[/api/track/my-plan-confirm] RPC error:', error)
    }
  } catch (err) {
    console.error('[/api/track/my-plan-confirm] threw:', err)
  }

  return NextResponse.json({ ok: true })
}