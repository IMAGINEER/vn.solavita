import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/emails/send'
import { partnerConfirmationEmail } from '@/lib/emails/partner-confirmation'
import { partnerNotificationEmail } from '@/lib/emails/partner-notification'

export const dynamic = 'force-dynamic'

// Local partnerships team inbox - keep in sync with /components/Footer.tsx + ContactMethods.tsx.
const TEAM_EMAIL = 'vn@solavita.com'

// `company` is deliberately NOT in this list: the VN programme targets
// individuals as much as businesses ("Cá nhân có sẵn nguồn khách hàng
// tiềm năng" — Đối tác Vàng standee), and requiring a registered
// business name puts most of the target audience off. It is still
// mandatory for the two commercial tracks — see the check below.
const REQUIRED_FIELDS = ['fullName', 'email', 'partnerTrack'] as const

// Mirrors the `id` values of `partnerTypes` in
// `lib/data/partners.ts` (also rendered as `<option>` values inside
// `components/PartnerForm.tsx`). If the UI adds a new track, update
// this whitelist + `partnerTypes` + `PartnerForm` in the same change.
// The three VN partner tracks: Đại lý kinh doanh, Đối tác lắp đặt,
// Đối tác kinh doanh.
const VALID_TRACKS = [
  'core-service',
  'certified-installer',
  'lead-partner',
] as const

/**
 * Optional campaign tag. `gold-partner` is the "Chương trình Đối tác
 * Vàng" intake (standee 20/09/2026) — a capped, bonus-incentivised
 * variant of the referral track. The tag is stored as a prefix on the
 * lead's message so campaign applications can be filtered out of the
 * generic partner enquiries without a schema change.
 */
const CAMPAIGNS = ['gold-partner'] as const

const CAMPAIGN_LABEL: Record<string, string> = {
  'gold-partner': 'Chương trình Đối tác Vàng',
}

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

  // `company` is NOT NULL in the table but is only meaningful for the
  // two commercial tracks. Individual referral partners fall back to
  // their own name so the row still carries something searchable.
  const company = String(body.company ?? '').trim()
  if (!company && partnerTrack !== 'lead-partner') {
    return NextResponse.json(
      { success: false, message: 'Company is required' },
      { status: 400 },
    )
  }

  // Optional campaign tag — see CAMPAIGNS above.
  const campaign = body.campaign ? String(body.campaign).trim() : ''
  if (campaign && !CAMPAIGNS.includes(campaign as (typeof CAMPAIGNS)[number])) {
    return NextResponse.json(
      { success: false, message: 'Invalid campaign' },
      { status: 400 },
    )
  }

  // ── 3. Map to row ───────────────────────────────────────────────
  // The `whatsapp` column + the 3-value `partner_track` CHECK
  // constraint are applied by `20261104000000_vn_partner_leads.sql`.
  const rawMessage = body.message ? String(body.message).trim() : ''
  const message = campaign
    ? `[${CAMPAIGN_LABEL[campaign]}] ${rawMessage}`.trim()
    : rawMessage || null

  const row = {
    full_name: String(body.fullName),
    whatsapp: body.whatsapp ? String(body.whatsapp) : null,
    company: company || String(body.fullName),
    email,
    partner_track: partnerTrack,
    message,
    updated_at: new Date().toISOString(),
  }

  // ── 4. INSERT ───────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('vn_partner_leads')
    .insert(row)
    .select('id')
    .single()

  if (error || !data) {
    console.error('[/api/partner] insert error:', error)
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
      { status: 500 },
    )
  }

  // ── 5. Customer confirmation email ──────────────────────────────
  const confirmation = partnerConfirmationEmail({
    fullName: row.full_name,
    partnerTrack: row.partner_track,
    campaign: campaign || null,
  })
  try {
    const emailResult = await sendEmail({
      country: 'vn',
      to: email,
      subject: confirmation.subject,
      html: confirmation.html,
    })
    await supabase.from('email_logs').insert({
      customer_id: null,
      country: 'vn',
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
      country: 'vn',
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
    whatsapp: row.whatsapp,
    message: row.message,
    campaign: campaign || null,
  })
  try {
    const emailResult = await sendEmail({
      country: 'vn',
      to: TEAM_EMAIL,
      subject: notification.subject,
      html: notification.html,
    })
    await supabase.from('email_logs').insert({
      customer_id: null,
      country: 'vn',
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
      country: 'vn',
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