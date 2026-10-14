import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/emails/send'
import { contactConfirmationEmail } from '@/lib/emails/contact-confirmation'
import { contactNotificationEmail } from '@/lib/emails/contact-notification'

export const dynamic = 'force-dynamic'

// NG team inbox - pulled from the public-facing ContactMethods + Footer.
// If this ever changes, update /components/Footer.tsx + ContactMethods.tsx
// to keep customer-visible copy in sync.
const TEAM_EMAIL = 'ng@solavita.com'

const REQUIRED_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'subject',
  'message',
  'consent',
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
    if (k === 'consent') return v !== true
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

  // ── 3. Map to row ───────────────────────────────────────────────
  const row = {
    salutation: body.salutation ? String(body.salutation) : null,
    first_name: String(body.firstName),
    last_name: String(body.lastName),
    email,
    phone: body.phone ? String(body.phone) : null,
    // Accept both `postcode` (DB column name + UK API convention) and
    // `postalCode` (the field name the contact form uses in its
    // FormState) so the data isn't silently dropped if either side
    // gets renamed in isolation.
    postcode: body.postcode || body.postalCode
      ? String(body.postcode || body.postalCode)
      : null,
    city: body.city ? String(body.city) : null,
    subject: String(body.subject),
    message: String(body.message),
    consent: true,
    updated_at: new Date().toISOString(),
  }

  // ── 4. INSERT ───────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('ng_contact_leads')
    .insert(row)
    .select('id')
    .single()

  if (error || !data) {
    console.error('[/api/contact] insert error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }

  // ── 5. Customer confirmation email ──────────────────────────────
  const confirmation = contactConfirmationEmail({
    firstName: String(body.firstName),
    subject: row.subject,
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
      email_type: 'contact_confirmation',
      sent_to: email,
      status: emailResult.success ? 'sent' : 'failed',
      provider_id: emailResult.success ? emailResult.id ?? null : null,
      error: emailResult.success ? null : emailResult.error?.message ?? 'Unknown email error',
    })
  } catch (emailErr) {
    console.error('[/api/contact] confirmation email threw:', emailErr)
    await supabase.from('email_logs').insert({
      customer_id: null,
      country: 'ng',
      email_type: 'contact_confirmation',
      sent_to: email,
      status: 'failed',
      provider_id: null,
      error: emailErr instanceof Error ? emailErr.message : 'Unknown email error',
    })
  }

  // ── 6. Team notification email ──────────────────────────────────
  const notification = contactNotificationEmail({
    salutation: row.salutation,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    postcode: row.postcode,
    city: row.city,
    subject: row.subject,
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
      email_type: 'contact_notification',
      sent_to: TEAM_EMAIL,
      status: emailResult.success ? 'sent' : 'failed',
      provider_id: emailResult.success ? emailResult.id ?? null : null,
      error: emailResult.success ? null : emailResult.error?.message ?? 'Unknown email error',
    })
  } catch (emailErr) {
    console.error('[/api/contact] notification email threw:', emailErr)
    await supabase.from('email_logs').insert({
      customer_id: null,
      country: 'ng',
      email_type: 'contact_notification',
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