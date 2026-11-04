export function consultationConfirmationEmail(data: {
  country: 'de' | 'uk' | 'ng' | 'vn'
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
  // The VN repo serves the Vietnamese template. 'de' is a bug - German
  // templates live in the DE repo.
  if (data.country === 'de') {
    throw new Error(
      `consultationConfirmationEmail called with country='${data.country}' from VN repo - German templates live in the DE repo.`
    )
  }

  const salutation = data.salutation || ''
  const name = [salutation, data.firstName, data.lastName].filter(Boolean).join(' ') || 'Quý khách'

  return {
    subject: 'Yêu cầu của bạn đã được tiếp nhận - Solavita Việt Nam',
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); padding:32px 40px; text-align:center;">
<h1 style="margin:0; font-size:22px; color:#ffffff; font-weight:700;">✓ Đã tiếp nhận yêu cầu</h1>
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px;">
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 20px 0;">Kính chào ${name},</p>
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 24px 0;">Cảm ơn bạn đã gửi yêu cầu. Đội ngũ Solavita Việt Nam đang xem xét thông tin của bạn và sẽ liên hệ trong vòng một ngày làm việc với thiết kế hệ thống cùng báo giá dành riêng cho bạn.</p>
${
  data.planLink
    ? `<!-- Plan CTA - drives /my-plan open tracking -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
<tr><td align="center">
<a href="${data.planLink}" target="_blank" rel="noopener" style="display:inline-block; background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; padding:14px 32px; border-radius:8px;">Xem phương án của bạn &rarr;</a>
<p style="margin:10px 0 0 0; font-size:12px; color:#9ca3af;">Mở thiết kế hệ thống, ước tính tiết kiệm và báo giá của bạn.</p>
</td></tr>
</table>`
    : ''
}

<!-- Info box -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
<tr><td style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:20px;">
<p style="margin:0 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Thông tin của bạn</p>
<p style="margin:0 0 4px 0; font-size:14px; color:#374151;">Email: ${data.email}</p>
${data.phone ? `<p style="margin:0; font-size:14px; color:#374151;">Điện thoại: ${data.phone}</p>` : ''}
</td></tr>
</table>

<p style="font-size:14px; color:#374151; line-height:1.6; margin:0 0 8px 0;">Bạn có thể liên hệ trực tiếp với đội ngũ của chúng tôi:</p>
<p style="font-size:13px; color:#6b7280; line-height:1.7; margin:0;">vn@solavita.com · TBD — Giờ làm việc chính thức (chờ xác nhận)</p>
</td></tr>

<!-- Footer -->
<tr><td style="background-color:#f9fafb; padding:24px 40px; border-top:1px solid #e5e7eb; text-align:center;">
<p style="margin:6px 0 0 0; font-size:11px; color:#9ca3af;">Solavita là thương hiệu giải pháp năng lượng mặt trời trực thuộc Tập đoàn SKYWORTH · vn.solavita.com</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`,
  }
}