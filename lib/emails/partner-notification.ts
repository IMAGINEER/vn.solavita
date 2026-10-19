/**
 * Internal notification email sent to the local partnerships team
 * inbox (`ng@solavita.com`) whenever someone submits /for-partners.
 */

const TEAM_EMAIL = 'ng@solavita.com'

const TRACK_LABEL: Record<string, string> = {
  'core-service': 'Core Service Partner',
  'certified-installer': 'Certified Installer',
  'lead-partner': 'Lead Partner',
}

function trackLabel(track: string): string {
  return TRACK_LABEL[track] ?? track
}

export function partnerNotificationEmail(data: {
  fullName: string
  company: string
  email: string
  partnerTrack: string
  whatsapp?: string | null
  message: string | null
}) {
  const track = trackLabel(data.partnerTrack)

  return {
    subject: `[Partner] ${track} enquiry - ${data.company}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:24px 12px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); padding:20px 32px;">
<h1 style="margin:0; font-size:18px; color:#ffffff; font-weight:700;">New partnership enquiry</h1>
<p style="margin:6px 0 0 0; font-size:12px; color:#ccfbf1;">ng.solavita.com/for-partners → ${TEAM_EMAIL}</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:24px 32px;">

<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; width:120px; vertical-align:top;">Track</td><td style="padding:8px 0; font-size:14px; color:#0f172a; font-weight:600;">${track}</td></tr>
<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; vertical-align:top; border-top:1px solid #f1f5f9;">Name</td><td style="padding:8px 0; font-size:14px; color:#0f172a; border-top:1px solid #f1f5f9;">${data.fullName}</td></tr>
<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; vertical-align:top; border-top:1px solid #f1f5f9;">Company</td><td style="padding:8px 0; font-size:14px; color:#0f172a; border-top:1px solid #f1f5f9;">${data.company}</td></tr>
<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; vertical-align:top; border-top:1px solid #f1f5f9;">Email</td><td style="padding:8px 0; font-size:14px; border-top:1px solid #f1f5f9;"><a href="mailto:${data.email}" style="color:#0f766e;">${data.email}</a></td></tr>
${
  data.whatsapp
    ? `<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; vertical-align:top; border-top:1px solid #f1f5f9;">WhatsApp</td><td style="padding:8px 0; font-size:14px; border-top:1px solid #f1f5f9;"><a href="https://wa.me/${data.whatsapp.replace(/[^0-9+]/g, '')}" style="color:#0f766e;">${data.whatsapp}</a></td></tr>`
    : ''
}
</table>

${
  data.message
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
<tr><td style="background-color:#f0fdfa; border-left:4px solid #14B8A6; border-radius:8px; padding:16px;">
<p style="margin:0 0 8px 0; font-size:12px; color:#0f766e; text-transform:uppercase; letter-spacing:1px; font-weight:600;">About the business</p>
<p style="margin:0; font-size:14px; color:#374151; line-height:1.6; white-space:pre-wrap;">${data.message}</p>
</td></tr>
</table>`
    : ''
}

<p style="margin:24px 0 0 0; font-size:12px; color:#6b7280;">Hit Reply to respond directly to ${data.email}.</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`,
  }
}