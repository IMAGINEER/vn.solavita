'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Loader2, Phone } from 'lucide-react'
import { PARTNER_HOTLINE } from '@/lib/data/partners'
import { eventLabel, goldPartnerEvents } from '@/lib/data/partnerEvents'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Registration form for the "Chương trình Đối tác Vàng" campaign.
 *
 * Posts to `/api/partner` with `partnerTrack: 'lead-partner'` and
 * `campaign: 'gold-partner'`. The route stores the lead in
 * `vn_partner_leads`, tags the message so campaign applications can be
 * filtered out of the generic partner enquiries, and sends both the
 * applicant confirmation and the internal team notification.
 *
 * Why a dedicated form instead of a link to the general partner form?
 * The campaign targets individuals ("Cá nhân có sẵn nguồn khách hàng
 * tiềm năng"), and the general form asks for a registered business
 * name — a requirement that puts most of the target audience off. Here
 * the company field is optional and the form asks for the two things
 * that actually matter for a referral partner: a phone number and the
 * customer pool they can reach.
 *
 * The form sits on a light card (the campaign page drops the dark
 * panel for this block) so the inputs are white with dark text — the
 * same field treatment as every other form on the site.
 */
export default function GoldMedalSignup({
  trackingCode,
}: {
  /**
   * `?lp=…` from the campaign URL (page.tsx reads it server-side and
   * passes it down). Written into the lead's message so the team can
   * tell which advert / QR standee produced the application.
   */
  trackingCode?: string
} = {}) {
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      fullName: String(data.get('name') || '').trim(),
      whatsapp: String(data.get('whatsapp') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company') || '').trim(),
      area: String(data.get('area') || '').trim(),
      message: String(data.get('message') || '').trim(),
    }

    // Which November conference(s) the lead registered for. Checkboxes
    // rather than a dropdown because a partner may be able to attend
    // both sessions; each ticked id comes from lib/data/partnerEvents.
    const eventIds = data.getAll('event').map(String)
    const events = goldPartnerEvents.filter((ev) => eventIds.includes(ev.id))

    // Client-side validation — mirrors the server-side checks in
    // /api/partner/route.ts.
    const nextErrors: Record<string, string> = {}
    if (eventIds.length === 0) {
      nextErrors.event = 'Vui lòng chọn ít nhất một buổi hội nghị.'
    }
    if (!payload.fullName) nextErrors.name = 'Vui lòng nhập họ tên.'
    if (!payload.whatsapp) {
      nextErrors.whatsapp = 'Vui lòng nhập số điện thoại để chúng tôi gọi lại.'
    }
    if (!payload.email) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email.'
    } else if (!EMAIL_RE.test(payload.email)) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }
    setFieldErrors({})

    setStatus('submitting')
    setSubmitError(null)

    // The extra fields (event, area, message) travel inside `message`
    // because the partner-leads row has no dedicated column for them;
    // the campaign tag lets the team filter them back out. The event
    // id goes first so it is the first thing the team reads.
    const messageParts = [
      events.length
        ? `Hội nghị tham dự: ${events
            .map((ev) => `${eventLabel(ev)} (${ev.id})`)
            .join('; ')}`
        : 'Hội nghị tham dự: chưa chọn',
      // Second line on purpose: the admin table clamps the message,
      // so the tracking code must sit above the free-text answers.
      trackingCode ? `Mã theo dõi: ${trackingCode}` : '',
      payload.area ? `Khu vực hoạt động: ${payload.area}` : '',
      payload.message ? `Nguồn khách hàng: ${payload.message}` : '',
    ].filter(Boolean)

    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: payload.fullName,
          whatsapp: payload.whatsapp,
          email: payload.email,
          company: payload.company,
          partnerTrack: 'lead-partner',
          campaign: 'gold-partner',
          event: events.map((ev) => ev.id).join(','),
          lp: trackingCode || '',
          message: messageParts.join('\n'),
        }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean
        message?: string
      }
      if (!res.ok || !json.success) {
        setSubmitError(json.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
        setStatus('error')
        return
      }
      setStatus('success')
      form.reset()
    } catch {
      setSubmitError('Lỗi kết nối mạng. Vui lòng thử lại.')
      setStatus('error')
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-uk-line bg-white shadow-sm">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left — the promise, over the roof the commission pays for. */}
        <div className="relative overflow-hidden bg-[#EAF4FB] p-7 md:p-10">
          {/* Shown complete at the panel's foot; the headline floats
              over the sky. */}
          <img
            src="/images/partner/card-vibe-2.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-x-0 bottom-0 w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#EAF4FB] via-[#EAF4FB]/92 to-[#EAF4FB]/20" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Cơ hội <span className="text-gradient">không đợi</span>
              <br />
              <span className="text-gradient">một ai</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-uk-slate font-cw-regular leading-relaxed">
              Điền thông tin, đội ngũ đối tác Solavita Việt Nam sẽ liên hệ với
              bạn để trao đổi hình thức hợp tác phù hợp nhất.
            </p>
          </div>
        </div>

        {/* Right — the form */}
        <div className="p-7 md:p-10">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col items-center text-center py-6"
              >
                <span className="w-16 h-16 rounded-full bg-uk-emerald/10 flex items-center justify-center text-uk-emerald mb-5">
                  <Check className="w-8 h-8" strokeWidth={2.5} />
                </span>
                <h3 className="text-2xl font-cw-bold text-uk-navy">
                  Chúng tôi đã nhận được đăng ký của bạn
                </h3>
                <p className="mt-3 text-sm md:text-base text-uk-slate font-cw-regular leading-relaxed">
                  Bạn sẽ nhận được email xác nhận kèm hướng dẫn chi tiết. Nếu
                  muốn trao đổi ngay, hãy gọi đường dây đối tác:{' '}
                  <a
                    href={`tel:${PARTNER_HOTLINE}`}
                    className="inline-flex items-center gap-1.5 font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
                  >
                    <Phone className="w-4 w-4" strokeWidth={2} />
                    {PARTNER_HOTLINE}
                  </a>
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                noValidate
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
            {/* First field of the form: which November conference the
                visitor is registering for. Checkbox tiles rather than
                a dropdown — both sessions are visible at a glance and
                both can be ticked. Required: at least one session
                must be chosen (validated below and mirrored in
                GoldStickyForm). Each ticked id travels with the
                submission as the first line of `message`. */}
            <fieldset className="md:col-span-2">
              <legend className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                Hội nghị bạn muốn tham dự{' '}
                <span className="text-uk-teal-dark">*</span>
              </legend>
              {/* Same pill treatment as the sticky form's picker
                  (GoldStickyForm): a compact rounded pill per session
                  with a 14px checkbox square, so the two sign-up
                  surfaces select conferences identically. */}
              <div className="flex flex-wrap items-center gap-2">
                {goldPartnerEvents.map((ev) => (
                  <label
                    key={ev.id}
                    className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-uk-line bg-white px-2.5 py-1.5 text-[11px] text-uk-slate transition-colors hover:border-uk-teal/60 has-[:checked]:border-uk-teal has-[:checked]:bg-uk-teal/5 has-[:checked]:text-uk-navy has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-uk-teal/40"
                  >
                    <input
                      type="checkbox"
                      name="event"
                      value={ev.id}
                      className="sr-only"
                    />
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-uk-slate/40 text-white transition-colors group-has-[:checked]:border-uk-teal group-has-[:checked]:bg-uk-teal">
                      <Check
                        className="h-2.5 w-2.5 opacity-0 group-has-[:checked]:opacity-100"
                        strokeWidth={3}
                      />
                    </span>
                    {eventLabel(ev)}
                  </label>
                ))}
              </div>
              {fieldErrors.event && (
                <p className="text-red-500 text-xs mt-1.5">
                  {fieldErrors.event}
                </p>
              )}
            </fieldset>

            <label className="block">
              <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                Họ tên <span className="text-uk-teal-dark">*</span>
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder="Nguyễn Văn A"
                className={`w-full px-4 py-3 rounded-xl border bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal transition-colors ${
                  fieldErrors.name ? 'border-red-500' : 'border-uk-line'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
              )}
            </label>

            <label className="block">
              <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                Số điện thoại <span className="text-uk-teal-dark">*</span>
              </span>
              <input
                type="tel"
                name="whatsapp"
                required
                placeholder="+84 900 000 000"
                className={`w-full px-4 py-3 rounded-xl border bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal transition-colors ${
                  fieldErrors.whatsapp ? 'border-red-500' : 'border-uk-line'
                }`}
              />
              {fieldErrors.whatsapp && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.whatsapp}</p>
              )}
            </label>

            <label className="block">
              <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                Email <span className="text-uk-teal-dark">*</span>
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="email@congty.vn"
                className={`w-full px-4 py-3 rounded-xl border bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal transition-colors ${
                  fieldErrors.email ? 'border-red-500' : 'border-uk-line'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </label>

            <label className="block">
              <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                Khu vực hoạt động
              </span>
              <input
                type="text"
                name="area"
                placeholder="Ví dụ: Phường Xuân Hòa, TP. Hồ Chí Minh"
                className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal transition-colors"
              />
              <span className="mt-1 block text-[11px] text-uk-slate/70 font-cw-regular">
                Ghi theo địa chỉ hành chính: phường/xã và tỉnh/thành phố.
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                Tên công ty / cơ sở (nếu có)
              </span>
              <input
                type="text"
                name="company"
                placeholder="Bỏ trống nếu bạn là cá nhân"
                className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal transition-colors"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                Nguồn khách hàng của bạn
              </span>
              <textarea
                name="message"
                rows={3}
                placeholder="Ví dụ: mạng lưới quan hệ với hộ gia đình, chủ cửa hàng, đơn tiền điện từ 2 triệu đồng/tháng..."
                className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal transition-colors"
              />
            </label>

            {submitError && (
              <div
                role="alert"
                className="md:col-span-2 rounded-lg border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {submitError}
              </div>
            )}

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
              <p className="text-xs text-uk-slate font-cw-regular leading-relaxed max-w-sm">
                Thông tin của bạn chỉ được dùng để xét tuyển đối tác và liên
                hệ tư vấn.
              </p>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-8 py-4 rounded-full font-cw-bold text-base w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0A1628] transition-transform hover:scale-[1.02] disabled:opacity-70"
                style={{ background: 'linear-gradient(100deg, #D19B2C 0%, #E8B44A 100%)' }}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>Đăng ký ngay</>
                )}
              </button>
            </div>
          </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
