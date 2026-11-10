/**
 * POST /api/webhooks/resend
 *
 * Receives Resend delivery events and writes the relevant
 * `consultation_leads` lifecycle columns. Drives the "Plan: sent" /
 * "Plan: opened" transitions on /admin/leads.
 *
 * Events handled:
 *   email.delivered  → plan_sent_at            (COALESCE; first delivery wins)
 *   email.opened     → plan_first_opened_at    (COALESCE)
 *                      plan_last_opened_at     (always now())
 *   email.sent       → log only (delivery hasn't happened yet)
 *   email.bounced /
 *   email.complained → log only
 *
 * Security: Resend uses Svix for webhook signing. Every request must
 * carry `svix-id` / `svix-timestamp` / `svix-signature` headers, verified
 * against `RESEND_WEBHOOK_SECRET` (configured in Resend dashboard). Any
 * verification failure returns 401 and we drop the payload.
 *
 * **Why we never log PII**: this handler only needs `event.data.email_id`
 * (the Resend message id) to look up the consultation row. Customer
 * email/name never travels through the webhook for our use case.
 *
 * **Setup** (one-time, after deploy):
 *   1. Resend dashboard → Webhooks → Add endpoint
 *      URL:    https://vn.solavita.com/api/webhooks/resend
 *      Events: email.delivered, email.opened
 *   2. Copy the signing secret → Netlify env RESEND_WEBHOOK_SECRET
 *   Without these, all leads stay "Plan: not sent" forever.
 *
 *   NOTE: the Resend account is shared with the sibling country sites.
 *   This endpoint only stamps rows with `country = 'vn'`, so it never
 *   writes to another site's leads - but a sibling site's endpoint
 *   may still be the one registered for the whole account. Check that
 *   the endpoint registered for the VN sends points at vn.solavita.com.
 */

import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/** Svix header names exactly as Resend sends them. */
const SVIX_ID_HEADER = 'svix-id'
const SVIX_TIMESTAMP_HEADER = 'svix-timestamp'
const SVIX_SIGNATURE_HEADER = 'svix-signature'

/**
 * Updates only happen for these event types. Anything else is logged
 * and acknowledged with 200 so Resend stops retrying.
 */
const HANDLED_EVENT_TYPES = new Set(['email.delivered', 'email.opened'])

/**
 * Lazy because `Webhook` throws on construction if the secret is missing,
 * and module-load happens during build. Mirrors lib/emails/send.ts.
 */
function getWebhookVerifier(): Webhook | null {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return null
  return new Webhook(secret)
}

/**
 * Map a Resend event into the Supabase patch to apply. Returns null when
 * the event type doesn't update anything (caller just returns 200).
 */
function buildPatch(eventType: string): Record<string, string> | null {
  if (eventType === 'email.delivered') {
    // Single column; COALESCE runs in the SQL update below.
    return { plan_sent_at: new Date().toISOString() }
  }
  if (eventType === 'email.opened') {
    // First-opened is preserved by the WHERE filter in the RPC; we also
    // pass it explicitly so the second column is always "now" regardless
    // of whether first-opened changed.
    return {
      plan_first_opened_at: new Date().toISOString(),
      plan_last_opened_at: new Date().toISOString(),
    }
  }
  return null
}

/**
 * Apply the patch with COALESCE semantics so repeated webhook deliveries
 * preserve the first timestamp. We do this by reading the row, computing
 * the merged values, then UPDATE — keeps the logic in TS and avoids
 * another RPC for webhook-specific behaviour.
 */
async function applyPatch(
  emailId: string,
  patch: Record<string, string>,
): Promise<{ matched: boolean; updated: boolean }> {
  const { data: row, error: readErr } = await supabase
    .from('consultation_leads')
    .select('id, plan_sent_at, plan_first_opened_at, plan_last_opened_at')
    .eq('plan_provider_id', emailId)
    // Country scope: this site writes only VN rows, and the Resend
    // account is shared with the sibling country sites. Without the
    // filter, an event for a UK/DE send that lands on THIS endpoint
    // would stamp timestamps onto another site's lead row.
    .eq('country', 'vn')
    .maybeSingle()

  if (readErr) {
    console.error('[/api/webhooks/resend] lookup error:', readErr)
    return { matched: false, updated: false }
  }
  if (!row) {
    // Either the email was fired before we started writing
    // plan_provider_id (old consultations), the id is bogus, or the
    // row belongs to another country site. Either way, nothing to
    // update. Return matched=false so the caller can log.
    return { matched: false, updated: false }
  }

  // COALESCE on the JS side mirrors the SQL COALESCE - first non-null
  // value wins for first-opened / sent-at; last-opened always updates.
  const merged: Record<string, string> = { ...patch }
  if ('plan_sent_at' in merged && row.plan_sent_at) {
    merged.plan_sent_at = row.plan_sent_at
  }
  if ('plan_first_opened_at' in merged && row.plan_first_opened_at) {
    merged.plan_first_opened_at = row.plan_first_opened_at
  }

  // Update the exact row we read (id), not "every row sharing this
  // provider id" - the id is unique per row, country included.
  const { error: updateErr } = await supabase
    .from('consultation_leads')
    .update(merged)
    .eq('id', row.id)
    .eq('country', 'vn')

  if (updateErr) {
    console.error('[/api/webhooks/resend] update error:', updateErr)
    return { matched: true, updated: false }
  }
  return { matched: true, updated: true }
}

export async function POST(req: Request) {
  const verifier = getWebhookVerifier()
  if (!verifier) {
    // Don't leak the missing env in production; in dev this surfaces
    // immediately so setup isn't silently skipped.
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[/api/webhooks/resend] RESEND_WEBHOOK_SECRET missing - check Netlify env.',
      )
    }
    return NextResponse.json({ ok: false, error: 'webhook_not_configured' }, { status: 503 })
  }

  // Svix verify() requires the raw body string (it re-serialises for HMAC).
  const rawBody = await req.text()
  const headers = {
    [SVIX_ID_HEADER]: req.headers.get(SVIX_ID_HEADER) ?? '',
    [SVIX_TIMESTAMP_HEADER]: req.headers.get(SVIX_TIMESTAMP_HEADER) ?? '',
    [SVIX_SIGNATURE_HEADER]: req.headers.get(SVIX_SIGNATURE_HEADER) ?? '',
  }

  let payload: { type?: string; data?: { email_id?: string } }
  try {
    // Svix returns `unknown` for verify(); cast through unknown first to
    // satisfy TS's structural overlap check (it can't prove the JSON shape
    // we declared above is a subset of `unknown`).
    payload = verifier.verify(rawBody, headers) as unknown as typeof payload
  } catch (err) {
    console.warn('[/api/webhooks/resend] signature verification failed:', err)
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 })
  }

  const eventType = payload?.type
  const emailId = payload?.data?.email_id
  if (typeof eventType !== 'string' || typeof emailId !== 'string') {
    // Malformed event - acknowledge so Resend doesn't retry forever.
    console.warn('[/api/webhooks/resend] malformed event:', { eventType, emailId })
    return NextResponse.json({ ok: true })
  }

  // Log non-handled event types but still 200 - we don't want retries.
  if (!HANDLED_EVENT_TYPES.has(eventType)) {
    console.log('[/api/webhooks/resend] ignored event:', eventType, emailId)
    return NextResponse.json({ ok: true })
  }

  const patch = buildPatch(eventType)
  if (!patch) {
    return NextResponse.json({ ok: true })
  }

  const result = await applyPatch(emailId, patch)
  console.log(
    '[/api/webhooks/resend]',
    eventType,
    emailId,
    'matched=' + result.matched,
    'updated=' + result.updated,
  )
  return NextResponse.json({ ok: true })
}