/**
 * One-off Resend smoke test. Not part of the app - run with:
 *
 *   node scripts/test-resend-send.mjs
 *
 * Sends a simple test message to confirm the verified-domain sender
 * (Solavita NG <ng@solavita.com>) is accepted by Resend.
 */
import { readFileSync } from 'node:fs'
import { Resend } from 'resend'

// Inline-load .env.local without a dotenv dependency.
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const apiKey = env.RESEND_API_KEY
if (!apiKey) {
  console.error('❌ RESEND_API_KEY missing from .env.local')
  process.exit(1)
}

const resend = new Resend(apiKey)

const TO = '715653712@qq.com'
const FROM = 'Solavita NG <ng@solavita.com>'
const SUBJECT = 'Solavita NG · Resend domain verification test'

const HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f4f4f5; font-family:Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding:32px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#0f766e 0%,#10b981 100%); padding:28px 36px;">
<h1 style="margin:0; font-size:20px; color:#fff;">✓ Resend domain test</h1>
</td></tr>
<tr><td style="padding:32px 36px;">
<p style="margin:0 0 16px 0; font-size:15px; color:#374151; line-height:1.6;">
Hi - this is a one-off test email from the Solavita NG site.
</p>
<p style="margin:0 0 16px 0; font-size:15px; color:#374151; line-height:1.6;">
Confirming that <strong>ng@solavita.com</strong> is now an accepted Resend sender
for the NG site (previously sent from uk@skyworth-solavita.de while
solavita.com was pending verification).
</p>
<p style="margin:0; font-size:13px; color:#6b7280;">
Sent: ${new Date().toISOString()}<br/>
From: ${FROM}<br/>
To: ${TO}
</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const { data, error } = await resend.emails.send({
  from: FROM,
  to: TO,
  subject: SUBJECT,
  html: HTML,
})

if (error) {
  console.error('❌ Resend send failed:', JSON.stringify(error, null, 2))
  process.exit(1)
}

console.log('✅ Resend send succeeded')
console.log('   message id :', data?.id)
console.log('   from       :', FROM)
console.log('   to         :', TO)
console.log('   subject    :', SUBJECT)