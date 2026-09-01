/**
 * Confirmation email sent to a /contact-us visitor after their
 * message is saved. UK-only — see assertion below.
 *
 * Visual style mirrors consultation-confirmation.ts (gradient header
 * card, info box, footer block) so customer-facing emails share a
 * recognisable shape.
 */

export function contactConfirmationEmail(data: {
  firstName?: string
  subject: string
}) {
  // UK repo only serves the English template. If we ever see 'de' here,
  // it's a bug — German templates live in the DE repo.
  const name = data.firstName?.trim() || 'there'

  return {
    subject: 'Thanks for getting in touch — Solavita UK',
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); padding:32px 40px; text-align:center;">
<h1 style="margin:0; font-size:22px; color:#ffffff; font-weight:700;">✓ Message received</h1>
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px;">
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 20px 0;">Hi ${name},</p>
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 24px 0;">Thanks for your <strong>${data.subject}</strong> message. Our UK team is on it and will reply within one working day.</p>

<!-- Info box -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
<tr><td style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:20px;">
<p style="margin:0 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Need to reach us directly?</p>
<p style="margin:0; font-size:14px; color:#374151;">uk@solavita.com · Mon–Fri 9–18 GMT</p>
</td></tr>
</table>

<p style="font-size:14px; color:#374151; line-height:1.6; margin:0 0 8px 0;">In the meantime, feel free to explore:</p>
<p style="margin:0; font-size:14px;"><a href="https://uk.solavita.com/solutions" style="color:#0f766e;">Our solar solutions</a> &nbsp;·&nbsp; <a href="https://uk.solavita.com/cases" style="color:#0f766e;">Customer stories</a></p>
</td></tr>

<!-- Footer -->
<tr><td style="background-color:#f9fafb; padding:24px 40px; border-top:1px solid #e5e7eb; text-align:center;">
<p style="margin:0; font-size:13px; color:#6b7280; font-weight:600;">Solavita UK Ltd</p>
<p style="margin:6px 0 0 0; font-size:11px; color:#9ca3af;">Registered in England and Wales · A SKYWORTH Group company</p>
<p style="margin:6px 0 0 0; font-size:11px; color:#9ca3af;">www.solavita.com</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`,
  }
}