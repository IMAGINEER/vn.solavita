export function consultationConfirmationEmail(data: {
  country: 'de' | 'uk' // UK repo only serves 'uk' - see assertion below
  salutation?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  /**
   * Personalised /my-plan URL with plan_token baked in. Drives the
   * "Plan: opened" lifecycle transition: the customer must click this
   * link to land on /my-plan where `record_my_plan_open()` fires.
   * Optional so older call sites can omit it.
   */
  planLink?: string
}) {
  // UK repo only serves the English template. If we ever see 'de' here,
  // it's a bug - German templates live in the DE repo.
  if (data.country !== 'uk') {
    throw new Error(
      `consultationConfirmationEmail called with country='${data.country}' from UK repo - German templates live in the DE repo.`
    )
  }

  const salutation = data.salutation || ''
  const name = [salutation, data.firstName, data.lastName].filter(Boolean).join(' ') || 'there'

  return {
    subject: 'Your enquiry is with us - Solavita UK',
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); padding:32px 40px; text-align:center;">
<h1 style="margin:0; font-size:22px; color:#ffffff; font-weight:700;">✓ Enquiry received</h1>
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px;">
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 20px 0;">Hi ${name},</p>
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 24px 0;">Thanks for your enquiry. Our UK team is reviewing your details and will be in touch within one working day with your bespoke solar design and quote.</p>
${
  data.planLink
    ? `<!-- Plan CTA - drives /my-plan open tracking -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
<tr><td align="center">
<a href="${data.planLink}" target="_blank" rel="noopener" style="display:inline-block; background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; padding:14px 32px; border-radius:8px;">View your personalised plan &rarr;</a>
<p style="margin:10px 0 0 0; font-size:12px; color:#9ca3af;">Opens your bespoke system design, savings estimate and quote.</p>
</td></tr>
</table>`
    : ''
}

<!-- Info box -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
<tr><td style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:20px;">
<p style="margin:0 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Your details</p>
<p style="margin:0 0 4px 0; font-size:14px; color:#374151;">Email: ${data.email}</p>
${data.phone ? `<p style="margin:0; font-size:14px; color:#374151;">Phone: ${data.phone}</p>` : ''}
</td></tr>
</table>

<p style="font-size:14px; color:#374151; line-height:1.6; margin:0 0 8px 0;">You can reach our team directly:</p>
<p style="font-size:13px; color:#6b7280; line-height:1.7; margin:0;">uk@solavita.com · Mon-Fri 9-18 GMT</p>
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