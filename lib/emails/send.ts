import { Resend } from 'resend'

// Lazy initialization - Next.js evaluates this module during the build to collect
// page data, but env vars aren't injected in the build environment. Constructing
// the Resend client at module load would throw. We defer creation to first use.
let _client: Resend | null = null

function getResend(): Resend {
  if (_client) return _client
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error(
      'Resend env var missing. Set RESEND_API_KEY in the runtime environment (Netlify → Site settings → Environment variables).'
    )
  }
  _client = new Resend(key)
  return _client
}

// Single source of truth for sender address per country. Mirrors the DE repo's
// table - keep both in sync if Resend approved-domain list changes.
//
// UK TEMP: `solavita.com` is not yet verified in Resend, so we send from
// `uk@skyworth-solavita.de` (the verified DE parent domain) to keep the
// confirmation email flowing. TODO: once `solavita.com` is verified in
// Resend (SPF + DKIM added), flip UK back to `Solavita <no-reply@solavita.com>`
// so the customer-facing From header matches the brand domain. The DE
// repo's send.ts already uses the same temporary pattern.
const FROM_BY_COUNTRY: Record<'de' | 'uk', string> = {
  de: 'Solavita <no-reply@solavita.com>',
  uk: 'Solavita UK <uk@skyworth-solavita.de>',
}

export async function sendEmail({
  country,
  to,
  subject,
  html,
}: {
  // Optional with default 'uk' to mirror the DE repo's signature -
  // keeps the two repos' send.ts byte-symmetric so future cross-repo
  // syncs don't break either side. UK site only ever passes 'uk'.
  country?: 'de' | 'uk'
  to: string
  subject: string
  html: string
}) {
  const from = FROM_BY_COUNTRY[country ?? 'uk']
  const { data, error } = await getResend().emails.send({
    from,
    to,
    subject,
    html,
  })

  if (error) {
    console.error('❌ Email send error:', error)
    return { success: false, error }
  }

  console.log('✅ Email sent:', data?.id)
  return { success: true, id: data?.id }
}