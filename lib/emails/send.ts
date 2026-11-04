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

// Single source of truth for sender address per country. Mirrors the
// DE/UK/IT repos' tables - keep them all in sync if Resend approved-domain
// list changes.
//
// `solavita.com` is verified in Resend for DE/UK/NG, so all sites now
// send from the same brand-domain `no-reply@` address. (Per-market
// aliases were retired in 2026-09; reply-to rules handle per-market
// routing if needed.)
const FROM_BY_COUNTRY: Record<'de' | 'uk' | 'ng' | 'vn', string> = {
  de: 'Solavita <no-reply@solavita.com>',
  uk: 'Solavita <no-reply@solavita.com>',
  ng: 'Solavita <no-reply@solavita.com>',
  vn: 'Solavita Việt Nam <no-reply@solavita.com>',
}

export async function sendEmail({
  country,
  to,
  subject,
  html,
}: {
  // Optional with default 'vn' for the VN repo. The VN site always
  // passes 'vn'; kept optional so the signature stays cross-repo
  // compatible with DE/UK/NG.
  country?: 'de' | 'uk' | 'ng' | 'vn'
  to: string
  subject: string
  html: string
}) {
  const from = FROM_BY_COUNTRY[country ?? 'vn']
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