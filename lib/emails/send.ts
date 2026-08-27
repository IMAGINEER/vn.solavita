import { Resend } from 'resend'

// Lazy initialization — Next.js evaluates this module during the build to collect
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

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const { data, error } = await getResend().emails.send({
    from: 'Solavita UK <uk@solavita.com>',
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