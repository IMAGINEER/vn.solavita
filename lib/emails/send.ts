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
// `solavita.com` is now verified in Resend for both DE and UK, so both
// countries send from the brand domain. DE uses a generic `no-reply@`
// address (single brand); UK keeps a country-specific `uk@` alias so the
// inbox still routes per-market.
const FROM_BY_COUNTRY: Record<'de' | 'uk', string> = {
  de: 'Solavita <no-reply@solavita.com>',
  uk: 'Solavita UK <uk@solavita.com>',
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