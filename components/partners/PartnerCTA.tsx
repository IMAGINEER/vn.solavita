'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Loader2 } from 'lucide-react'
import { partnerTypes } from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Partner enquiry CTA. Inline (UK-style) B2B form that posts to
 * /api/partner, which inserts into Supabase's `vn_partner_leads`
 * table and sends confirmation + team notification emails.
 *
 * Why inline rather than modal (as on the consultation form)?
 *   The partners page is the page's primary conversion goal; an
 *   inline form makes the destination feel like a real B2B enquiry
 *   page rather than a contact-us alias. The form is also short
 *   enough (5 fields) to fit comfortably inline.
 *
 * On 2xx the form swaps to an emerald success card mirroring the
 * ContactForm success UX. Field contract is shared with
 * `app/api/partner/route.ts`:
 *   { fullName, company, email, partnerTrack, message }
 */
export default function PartnerCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [track, setTrack] = useState<string>('core-service')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.partner-cta-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      fullName: String(data.get('name') || '').trim(),
      whatsapp: String(data.get('whatsapp') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company') || '').trim(),
      partnerTrack: String(data.get('track') || '').trim(),
      message: String(data.get('message') || '').trim(),
    }

    // Client-side validation - mirrors server-side checks in
    // /api/partner/route.ts. Email regex matches the route.
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nextErrors: Record<string, string> = {}
    if (!payload.fullName) nextErrors.name = 'Vui lòng nhập họ tên.'
    if (!payload.email) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email.'
    } else if (!EMAIL_RE.test(payload.email)) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ.'
    }
    if (!payload.partnerTrack) {
      nextErrors.track = 'Vui lòng chọn hình thức hợp tác.'
    }
    // A registered business name is only meaningful for the two
    // commercial tracks. The referral track (Đối tác kinh doanh) also
    // accepts individuals, and /api/partner falls back to the
    // applicant's name when the field is left blank.
    if (!payload.company && payload.partnerTrack !== 'lead-partner') {
      nextErrors.company = 'Vui lòng nhập tên doanh nghiệp hoặc công ty.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }
    setFieldErrors({})

    setStatus('submitting')
    setSubmitError(null)
    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const reset = () => {
    setStatus('idle')
    setSubmitError(null)
    setFieldErrors({})
  }

  return (
    <section
      ref={sectionRef}
      id="partner-cta"
      className="relative py-16 md:py-24 bg-sv-light overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-uk-teal/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-uk-emerald/10 blur-[150px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="partner-cta-card rounded-3xl border border-uk-line bg-white p-8 md:p-12 lg:p-16 shadow-sm">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
              <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              Trở thành đối tác Solavita
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Bạn đã sẵn sàng trở thành{' '}
              <span className="text-gradient">đối tác Solavita?</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
              Đồng hành cùng chúng tôi ngay hôm nay.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col items-center text-center py-6 max-w-2xl mx-auto"
              >
                <span className="w-16 h-16 rounded-full bg-uk-emerald/10 flex items-center justify-center text-uk-emerald mb-5">
                  <Check className="w-8 h-8" strokeWidth={2.5} />
                </span>
                <h3 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy">
                  Chúng tôi đã nhận được yêu cầu hợp tác của bạn
                </h3>
                <p className="mt-3 text-sm lg:text-base text-uk-slate font-cw-regular max-w-md">
                  Đội ngũ đối tác Solavita Việt Nam sẽ xem xét thông tin và
                  liên hệ với bạn sớm. Nếu cần trao đổi ngay, hãy liên hệ trực
                  tiếp qua{' '}
                  <a
                    href="https://wa.me/8618500875025"
                    className="text-uk-teal-dark hover:text-uk-teal transition-colors font-cw-bold"
                  >
                    WhatsApp
                  </a>{' '}
                  or{' '}
                  <a
                    href="mailto:vn@solavita.com"
                    className="text-uk-teal-dark hover:text-uk-teal transition-colors font-cw-bold"
                  >
                    vn@solavita.com
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
                >
                  Gửi yêu cầu khác
                </button>
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
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
              >
                <label className="block">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Full name
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      fieldErrors.name ? 'border-red-500' : 'border-uk-line'
                    } bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal`}
                  />
                  {fieldErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                  )}
                </label>

                <label className="block">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    WhatsApp
                  </span>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="+84 900 000 000"
                    className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="email@congty.vn"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      fieldErrors.email ? 'border-red-500' : 'border-uk-line'
                    } bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </label>

                <label className="block">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Business / Company
                    {track === 'lead-partner' && (
                      <span className="ml-2 font-cw-regular normal-case tracking-normal text-uk-slate/70">
                        (không bắt buộc nếu bạn là cá nhân)
                      </span>
                    )}
                  </span>
                  <input
                    type="text"
                    name="company"
                    required={track !== 'lead-partner'}
                    placeholder="Công ty TNHH Năng lượng ABC"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      fieldErrors.company ? 'border-red-500' : 'border-uk-line'
                    } bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal`}
                  />
                  {fieldErrors.company && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.company}</p>
                  )}
                </label>

                <label className="block md:col-span-2">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Partner track
                  </span>
                  <select
                    name="track"
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      fieldErrors.track ? 'border-red-500' : 'border-uk-line'
                    } bg-white text-uk-navy focus:outline-none focus:border-uk-teal`}
                  >
                    {partnerTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.track && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.track}</p>
                  )}
                </label>

                <label className="block md:col-span-2">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Message
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Giới thiệu về đội ngũ, địa bàn hoạt động hoặc mô hình kinh doanh hiện tại."
                    className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal"
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
                  <p className="text-xs text-uk-slate">
                    Hoặc gửi email trực tiếp:{' '}
                    <a
                      href="mailto:vn@solavita.com"
                      className="text-uk-teal-dark hover:text-uk-teal transition-colors font-cw-bold"
                    >
                      vn@solavita.com
                    </a>
                  </p>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-gradient px-8 py-4 rounded-full font-cw-bold text-base text-white w-full sm:w-auto inline-flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>Liên hệ với chúng tôi</>
                    )}
                  </button>
                </div>

                <p className="md:col-span-2 text-xs text-uk-slate/80 leading-relaxed pt-2">
                  Khi gửi thông tin, bạn đồng ý với{' '}
                  <a href="/privacy/" className="text-uk-teal-dark underline">
                    Chính sách bảo mật
                  </a>
                  của chúng tôi. Dữ liệu chỉ được dùng để xem xét yêu cầu hợp tác
                  của bạn.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}