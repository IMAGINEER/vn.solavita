import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/emails/send'
import { partnerConfirmationEmail } from '@/lib/emails/partner-confirmation'
import { partnerNotificationEmail } from '@/lib/emails/partner-notification'

export const dynamic = 'force-dynamic'

// UK team inbox - keep in sync with /components/Footer.tsx + ContactMethods.tsx.
const TEAM_EMAIL = 'ng@solavita.com'

const REQUIRED_FIELDS = ['fullName', 'company', 'email', 'partnerTrack'] as const

// Mirrors the `id` values of `partnerTypes` in
// `lib/data/partners.ts` (also rendered as `<option>` values inside
// `components/PartnerForm.tsx`). If the UI adds a new track, update
// this whitelist + `partnerTypes` + `PartnerForm` in the same change.
// `distribution` was removed from the NG programme - the route
// rejects it explicitly so any stale forms can't slip through.
const VALID_TRACKS = [
  'installer',
  'referral',
  'community',
] as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  // ── 1. Parse body ───────────────────────────────────────────────
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON' },
      { status: 400 },
    )
  }

  // ── 2. Validate ─────────────────────────────────────────────────
  const missing = REQUIRED_FIELDS.filter((k) => {
    const v = body[k]
    return typeof v !== 'string' || !v.trim()
  })
  if (missing.length) {
    return NextResponse.json(
      { success: false, message: 'Required fields missing' },
      { status: 400 },
    )
  }

  const email = String(body.email)
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { success: false, message: 'Invalid email format' },
      { status: 400 },
    )
  }

  const partnerTrack = String(body.partnerTrack)
  if (!VALID_TRACKS.includes(partnerTrack as (typeof VALID_TRACKS)[number])) {
    return NextResponse.json(
      { success: false, message: 'Invalid partner track' },
      { status: 400 },
    )
  }

  // ── 3. Map to row ───────────────────────────────────────────────
  const row = {
    full_name: String(body.fullName),
    company: String(body.company),
    email,
    partner_track: partnerTrack,
    message: body.message ? String(body.message) : null,
    updated_at: new Date().toISOString(),
  }

  // ── 4. INSERT ───────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('ng_partner_leads')
    .insert(row)
    .select('id')
    .single()

  if (error || !data) {
    console.error('[/api/partner] insert error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }

  // ── 5. Customer confirmation email ──────────────────────────────
  const confirmation = partnerConfirmationEmail({
    fullName: row.full_name,
    partnerTrack: row.partner_track,
  })
  try {
    const emailResult = await sendEmail({
      country: 'ng',
      to: email,
      subject: confirmation.subject,
      html: confirmation.html,
    })
    await supabase.from('email_logs').insert({
      customer_id: null,
      country: 'ng',
      email_type: 'partner_confirmation',
      sent_to: email,
      status: emailResult.success ? 'sent' : 'failed',
      provider_id: emailResult.success ? emailResult.id ?? null : null,
      error: emailResult.success ? null : emailResult.error?.message ?? 'Unknown email error',
    })
  } catch (emailErr) {
    console.error('[/api/partner] confirmation email threw:', emailErr)
    await supabase.from('email_logs').insert({
      customer_id: null,
      country: 'ng',
      email_type: 'partner_confirmation',
      sent_to: email,
      status: 'failed',
      provider_id: null,
      error: emailErr instanceof Error ? emailErr.message : 'Unknown email error',
    })
  }

  // ── 6. Team notification email ──────────────────────────────────
  const notification = partnerNotificationEmail({
    fullName: row.full_name,
    company: row.company,
    email: row.email,
    partnerTrack: row.partner_track,
    message: row.message,
  })
  try {
    const emailResult = await sendEmail({
      country: 'ng',
      to: TEAM_EMAIL,
      subject: notification.subject,
      html: notification.html,
    })
    await supabase.from('email_logs').insert({
      customer_id: null,
      country: 'ng',
      email_type: 'partner_notification',
      sent_to: TEAM_EMAIL,
      status: emailResult.success ? 'sent' : 'failed',
      provider_id: emailResult.success ? emailResult.id ?? null : null,
      error: emailResult.success ? null : emailResult.error?.message ?? 'Unknown email error',
    })
  } catch (emailErr) {
    console.error('[/api/partner] notification email threw:', emailErr)
    await supabase.from('email_logs').insert({
      customer_id: null,
      country: 'ng',
      email_type: 'partner_notification',
      sent_to: TEAM_EMAIL,
      status: 'failed',
      provider_id: null,
      error: emailErr instanceof Error ? emailErr.message : 'Unknown email error',
    })
  }

  // ── 7. Respond ──────────────────────────────────────────────────
  return NextResponse.json({
    success: true,
    id: data.id,
    message: 'Submission successful',
  })
}