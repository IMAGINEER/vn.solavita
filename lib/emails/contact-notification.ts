/**
 * Internal notification email sent to the UK team inbox whenever
 * someone submits /contact-us. Includes the full submission so a
 * support agent can reply by hitting Reply-To (the Resend send
 * call sets `to: TEAM_EMAIL`, so the team's mail client will reply
 * to the customer's address which we put in the body).
 */

const TEAM_EMAIL = 'uk@solavita.com'

function subjectLabel(subject: string): string {
  // contactSubjects uses lowercase ids ('general', 'sales', ...). Capitalise
  // first letter for the email subject without inventing copy.
  return subject.charAt(0).toUpperCase() + subject.slice(1)
}

export function contactNotificationEmail(data: {
  salutation: string | null
  firstName: string
  lastName: string
  email: string
  phone: string | null
  postcode: string | null
  city: string | null
  subject: string
  message: string
}) {
  const fullName = [data.salutation, data.firstName, data.lastName]
    .filter(Boolean)
    .join(' ')

  return {
    subject: `[UK Contact] ${subjectLabel(data.subject)} - ${fullName || data.email}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:24px 12px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); padding:20px 32px;">
<h1 style="margin:0; font-size:18px; color:#ffffff; font-weight:700;">New contact enquiry</h1>
<p style="margin:6px 0 0 0; font-size:12px; color:#ccfbf1;">uk.solavita.com/contact-us → ${TEAM_EMAIL}</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:24px 32px;">

<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; width:120px; vertical-align:top;">Subject</td><td style="padding:8px 0; font-size:14px; color:#0f172a; font-weight:600;">${subjectLabel(data.subject)}</td></tr>
<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; vertical-align:top; border-top:1px solid #f1f5f9;">Name</td><td style="padding:8px 0; font-size:14px; color:#0f172a; border-top:1px solid #f1f5f9;">${fullName || '-'}</td></tr>
<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; vertical-align:top; border-top:1px solid #f1f5f9;">Email</td><td style="padding:8px 0; font-size:14px; border-top:1px solid #f1f5f9;"><a href="mailto:${data.email}" style="color:#0f766e;">${data.email}</a></td></tr>
${data.phone ? `<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; vertical-align:top; border-top:1px solid #f1f5f9;">Phone</td><td style="padding:8px 0; font-size:14px; color:#0f172a; border-top:1px solid #f1f5f9;">${data.phone}</td></tr>` : ''}
${data.postcode || data.city ? `<tr><td style="padding:8px 0; color:#6b7280; font-size:13px; vertical-align:top; border-top:1px solid #f1f5f9;">Location</td><td style="padding:8px 0; font-size:14px; color:#0f172a; border-top:1px solid #f1f5f9;">${[data.city, data.postcode].filter(Boolean).join(', ')}</td></tr>` : ''}
</table>

<!-- Message -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
<tr><td style="background-color:#f0fdfa; border-left:4px solid #14B8A6; border-radius:8px; padding:16px;">
<p style="margin:0 0 8px 0; font-size:12px; color:#0f766e; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Message</p>
<p style="margin:0; font-size:14px; color:#374151; line-height:1.6; white-space:pre-wrap;">${data.message}</p>
</td></tr>
</table>

<p style="margin:24px 0 0 0; font-size:12px; color:#6b7280;">Hit Reply to respond directly to ${data.email}.</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`,
  }
}