/**
 * Confirmation email sent to a /for-partners visitor after their
 * enquiry is saved. UK-only.
 *
 * Visual style mirrors consultation-confirmation.ts so customer-facing
 * emails share a recognisable shape.
 */

const TRACK_LABEL: Record<string, string> = {
  installer: 'Installer',
  business: 'Energy / Business Partner',
}

function trackLabel(track: string): string {
  return TRACK_LABEL[track] ?? track
}

export function partnerConfirmationEmail(data: {
  fullName?: string
  partnerTrack: string
}) {
  const name = data.fullName?.trim() || 'there'
  const track = trackLabel(data.partnerTrack)

  return {
    subject: 'We received your partnership enquiry - Solavita UK',
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); padding:32px 40px; text-align:center;">
<h1 style="margin:0; font-size:22px; color:#ffffff; font-weight:700;">✓ Partnership enquiry received</h1>
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px;">
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 20px 0;">Hi ${name},</p>
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 16px 0;">Thanks for your interest in the Solavita UK <strong>${track}</strong> programme.</p>
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 24px 0;">Our partnerships team will be in touch within <strong>two working days</strong> to discuss next steps - including which programme tier fits your business best.</p>

<!-- Info box -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
<tr><td style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:20px;">
<p style="margin:0 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Partnerships team</p>
<p style="margin:0; font-size:14px; color:#374151;">uk@solavita.com · Mon-Fri 9-18 GMT</p>
</td></tr>
</table>

<p style="font-size:14px; color:#374151; line-height:1.6; margin:0 0 8px 0;">Learn more while you wait:</p>
<p style="margin:0; font-size:14px;"><a href="https://uk.solavita.com/for-partners" style="color:#0f766e;">Why partner with Solavita</a> &nbsp;·&nbsp; <a href="https://uk.solavita.com/cases" style="color:#0f766e;">UK customer stories</a></p>
</td></tr>

<!-- Footer -->
<tr><td style="background-color:#f9fafb; padding:24px 40px; border-top:1px solid #e5e7eb; text-align:center;">
<p style="margin:0; font-size:13px; color:#6b7280; font-weight:600;">Solavita Energy UK Limited · Company No. 17466951</p>
<p style="margin:6px 0 0 0; font-size:11px; color:#9ca3af;">Registered in England and Wales</p>
<p style="margin:6px 0 0 0; font-size:11px; color:#9ca3af;">Registered office: C/O Buzzacott LLP, 130 Wood Street, London EC2V 6DL, United Kingdom</p>
<p style="margin:6px 0 0 0; font-size:11px; color:#9ca3af;">A SKYWORTH Group company · uk.solavita.com</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`,
  }
}