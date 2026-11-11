/**
 * Confirmation email sent to a /for-partners visitor after their
 * enquiry is saved. VN-only.
 *
 * Visual style mirrors consultation-confirmation.ts so customer-facing
 * emails share a recognisable shape.
 */

const TRACK_LABEL: Record<string, string> = {
  'core-service': 'Đại lý kinh doanh',
  'certified-installer': 'Đối tác lắp đặt',
  'lead-partner': 'Đối tác kinh doanh',
}

function trackLabel(track: string): string {
  return TRACK_LABEL[track] ?? track
}

export function partnerConfirmationEmail(data: {
  fullName?: string
  partnerTrack: string
  /** Optional campaign tag, e.g. 'gold-partner'. */
  campaign?: string | null
}) {
  const name = data.fullName?.trim() || 'Quý khách'
  const track = trackLabel(data.partnerTrack)
  const isGoldPartner = data.campaign === 'gold-partner'

  return {
    subject: isGoldPartner
      ? 'SKYWORTH Việt Nam đã nhận đăng ký Chương trình Đối tác Vàng của bạn'
      : 'SKYWORTH Việt Nam đã nhận yêu cầu hợp tác của bạn',
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background: linear-gradient(135deg, #0f766e 0%, #10b981 100%); padding:32px 40px; text-align:center;">
<h1 style="margin:0; font-size:22px; color:#ffffff; font-weight:700;">✓ Đã tiếp nhận yêu cầu hợp tác</h1>
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px;">
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 20px 0;">Kính chào ${name},</p>
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 16px 0;">${
  isGoldPartner
    ? 'Cảm ơn bạn đã đăng ký Chương trình Đối tác Vàng của SKYWORTH.'
    : 'Cảm ơn bạn đã quan tâm đến chương trình đối tác của SKYWORTH.'
}</p>
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 24px 0;">Chúng tôi đã nhận được thông tin của bạn. Đội ngũ hợp tác của SKYWORTH Việt Nam sẽ xem xét hồ sơ và liên hệ sớm để trao đổi các bước tiếp theo, bao gồm hình thức hợp tác phù hợp nhất với doanh nghiệp của bạn.</p>
<p style="font-size:15px; color:#374151; line-height:1.6; margin:0 0 24px 0;">Nếu cần trao đổi ngay, bạn có thể liên hệ qua <a href="https://wa.me/8618500875025" style="color:#0f766e;">WhatsApp</a> hoặc email <a href="mailto:vn@solavita.com" style="color:#0f766e;">vn@solavita.com</a>.${
  isGoldPartner
    ? ' <strong>Hotline đối tác: <a href="tel:0939738000" style="color:#0f766e;">0939738000</a></strong>'
    : ''
}</p>

<!-- Info box -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
<tr><td style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:20px;">
${
  isGoldPartner
    ? '<p style="margin:0 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Chương trình bạn đã đăng ký</p><p style="margin:0 0 12px 0; font-size:14px; color:#374151; font-weight:600;">Chương trình Đối tác Vàng — Liên kết giới thiệu khách hàng</p>'
    : '<p style="margin:0 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Hình thức bạn đã đăng ký</p>'
}
<p style="margin:0; font-size:14px; color:#374151;">${track}</p>
</td></tr>
</table>

<p style="font-size:14px; color:#374151; line-height:1.6; margin:0 0 8px 0;">Tìm hiểu thêm trong lúc chờ:</p>
<p style="margin:0; font-size:14px;"><a href="https://vn.solavita.com/for-partners" style="color:#0f766e;">Vì sao nên hợp tác cùng SKYWORTH</a></p>
</td></tr>

<!-- Footer -->
<tr><td style="background-color:#f9fafb; padding:24px 40px; border-top:1px solid #e5e7eb; text-align:center;">
<p style="margin:0; font-size:13px; color:#6b7280; font-weight:600;">TBD — Pháp nhân chính thức (chờ xác nhận) · TBD — Mã số đăng ký doanh nghiệp (chờ xác nhận)</p>
<p style="margin:6px 0 0 0; font-size:11px; color:#9ca3af;">TBD — Địa chỉ văn phòng đã đăng ký (chờ xác nhận)</p>
<p style="margin:6px 0 0 0; font-size:11px; color:#9ca3af;">SKYWORTH Việt Nam — thương hiệu giải pháp năng lượng mặt trời của Tập đoàn SKYWORTH · vn.solavita.com</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`,
  }
}