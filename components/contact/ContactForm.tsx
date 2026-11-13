'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Mail, ShieldCheck, Send } from 'lucide-react'
import {
  contactSubjects,
  contactSalutations,
  type ContactSubjectId,
} from '@/lib/data/contact'

/**
 * Contact form. Mirrors the user-info field set used by the existing
 * Consultation form (salutation · first name · last name · email ·
 * phone · postal code · city) but intentionally OMITS the Solar
 * Configuration fields (region · house type · roof type · household
 * size · electricity usage · devices) - this is a plain contact
 * destination, not a quote request.
 *
 * Submit POSTs to /api/contact, which saves the row to
 * `vn_contact_leads` and fires a confirmation email + a team
 * notification. On 2xx the form swaps to the success card inline.
 */

type FormStatus = 'idle' | 'submitting' | 'success'

interface FormState {
  salutation: string
  firstName: string
  lastName: string
  email: string
  phone: string
  postalCode: string
  city: string
  subject: ContactSubjectId | ''
  message: string
  consent: boolean
}

const INITIAL_STATE: FormState = {
  salutation: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  postalCode: '',
  city: '',
  subject: '',
  message: '',
  consent: false,
}

const REQUIRED_FIELDS: Array<keyof FormState> = [
  'salutation',
  'firstName',
  'lastName',
  'email',
  'subject',
  'message',
  'consent',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Shared input class - mirrors PartnerCTA + the Consultation modal. */
const fieldClass =
  'w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal transition-colors'

const labelClass =
  'block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5'

export default function ContactForm() {
  const [state, setState] = useState<FormState>(INITIAL_STATE)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }))
    // Clear the error on the field as soon as the user edits it.
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[key]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}

    REQUIRED_FIELDS.forEach((f) => {
      if (f === 'consent') {
        if (!state.consent) next.consent = 'Vui lòng xác nhận để tiếp tục.'
        return
      }
      const v = state[f]
      if (typeof v === 'string' && !v.trim()) {
        next[f] = 'Trường này là bắt buộc.'
      }
    })

    if (state.email && !EMAIL_RE.test(state.email)) {
      next.email = 'Vui lòng nhập địa chỉ email hợp lệ.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    setSubmitError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean
        message?: string
      }
      if (!res.ok || !json.success) {
        setSubmitError(
          json.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
        )
        setStatus('idle')
        return
      }
      setStatus('success')
    } catch {
      setSubmitError('Lỗi kết nối mạng. Vui lòng thử lại.')
      setStatus('idle')
    }
  }

  const reset = () => {
    setState(INITIAL_STATE)
    setErrors({})
    setSubmitError(null)
    setStatus('idle')
  }

  return (
    <section
      id="contact-form"
      className="relative py-16 md:py-24 bg-white overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-uk-line bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left rail - context + trust signals */}
            <div className="lg:col-span-2 p-8 lg:p-10 bg-uk-teal-soft/40 border-b lg:border-b-0 lg:border-r border-uk-line">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-uk-emerald" />
                Liên hệ Solavita
              </span>
              <h2 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy leading-tight">
                Gửi tin nhắn <span className="text-gradient">cho chúng tôi.</span>
              </h2>
              <p className="mt-3 text-sm lg:text-base text-uk-slate font-cw-regular leading-relaxed">
                Hãy cho chúng tôi biết điều bạn muốn trao đổi — tin nhắn sẽ được
                chuyển đến đúng người phụ trách trong đội ngũ Solavita Việt Nam.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  {
                    icon: <Mail className="w-4 h-4" strokeWidth={1.6} />,
                    title: 'Phản hồi trong 1 ngày làm việc',
                  },
                  {
                    icon: <ShieldCheck className="w-4 h-4" strokeWidth={1.6} />,
                    title: 'Thông tin của bạn được bảo vệ',
                  },
                  {
                    icon: <Check className="w-4 h-4" strokeWidth={2} />,
                    title: 'Không gửi email quảng cáo',
                  },
                ].map((it) => (
                  <li
                    key={it.title}
                    className="flex items-start gap-3 text-uk-navy"
                  >
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-uk-teal-dark border border-uk-line">
                      {it.icon}
                    </span>
                    <span className="text-sm font-cw-regular">{it.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side - form OR success card */}
            <div className="lg:col-span-3 p-8 lg:p-10">
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
                    <h3 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy">
                      Cảm ơn bạn — chúng tôi đã nhận được tin nhắn.
                    </h3>
                    <p className="mt-3 text-sm lg:text-base text-uk-slate font-cw-regular max-w-md">
                      Đội ngũ Solavita Việt Nam sẽ phản hồi trong vòng một ngày
                      làm việc qua email bạn đã cung cấp. Nếu cần gấp, bạn có thể
                      liên hệ trực tiếp tại{' '}
                      <a
                        href="mailto:vn@solavita.com"
                        className="text-uk-teal-dark hover:text-uk-teal transition-colors"
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
                      Gửi tin nhắn khác
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
                    className="space-y-5"
                  >
                    {/* Salutation + first / last name */}
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                      <label className="block sm:col-span-2">
                        <span className={labelClass}>Danh xưng</span>
                        <select
                          name="salutation"
                          value={state.salutation}
                          onChange={(e) =>
                            setField('salutation', e.target.value)
                          }
                          className={`${fieldClass} ${
                            errors.salutation
                              ? 'border-uk-danger/60'
                              : ''
                          }`}
                          required
                        >
                          {contactSalutations.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block sm:col-span-2">
                        <span className={labelClass}>Họ và tên đệm</span>
                        <input
                          type="text"
                          name="firstName"
                          value={state.firstName}
                          onChange={(e) =>
                            setField('firstName', e.target.value)
                          }
                          placeholder="Nguyễn Văn"
                          className={`${fieldClass} ${
                            errors.firstName
                              ? 'border-uk-danger/60'
                              : ''
                          }`}
                          required
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className={labelClass}>Tên</span>
                        <input
                          type="text"
                          name="lastName"
                          value={state.lastName}
                          onChange={(e) =>
                            setField('lastName', e.target.value)
                          }
                          placeholder="A"
                          className={`${fieldClass} ${
                            errors.lastName ? 'border-uk-danger/60' : ''
                          }`}
                          required
                        />
                      </label>
                    </div>

                    {/* Email + phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className={labelClass}>Email</span>
                        <input
                          type="email"
                          name="email"
                          value={state.email}
                          onChange={(e) => setField('email', e.target.value)}
                          placeholder="email@example.com"
                          className={`${fieldClass} ${
                            errors.email ? 'border-uk-danger/60' : ''
                          }`}
                          required
                        />
                        {errors.email && (
                          <span className="mt-1 block text-xs text-uk-danger">
                            {errors.email}
                          </span>
                        )}
                      </label>

                      <label className="block">
                        <span className={labelClass}>
                          Điện thoại{' '}
                          <span className="text-uk-slate/60 normal-case tracking-normal font-cw-regular">
                            (không bắt buộc)
                          </span>
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={state.phone}
                          onChange={(e) => setField('phone', e.target.value)}
                          placeholder="+84 900 000 000"
                          className={fieldClass}
                        />
                      </label>
                    </div>

                    {/* Postcode + city */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="block sm:col-span-1">
                        <span className={labelClass}>
                          Mã bưu chính{' '}
                          <span className="text-uk-slate/60 normal-case tracking-normal font-cw-regular">
                            (không bắt buộc)
                          </span>
                        </span>
                        <input
                          type="text"
                          name="postalCode"
                          value={state.postalCode}
                          onChange={(e) =>
                            setField('postalCode', e.target.value)
                          }
                          placeholder="100001"
                          className={fieldClass}
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className={labelClass}>
                          Tỉnh / Thành phố{' '}
                          <span className="text-uk-slate/60 normal-case tracking-normal font-cw-regular">
                            (không bắt buộc)
                          </span>
                        </span>
                        <input
                          type="text"
                          name="city"
                          value={state.city}
                          onChange={(e) => setField('city', e.target.value)}
                          placeholder="Hà Nội"
                          className={fieldClass}
                        />
                      </label>
                    </div>

                    {/* Subject */}
                    <label className="block">
                      <span className={labelClass}>Chủ đề / Loại yêu cầu</span>
                      <select
                        name="subject"
                        value={state.subject}
                        onChange={(e) =>
                          setField(
                            'subject',
                            e.target.value as ContactSubjectId
                          )
                        }
                        className={`${fieldClass} ${
                          errors.subject ? 'border-uk-danger/60' : ''
                        }`}
                        required
                      >
                        <option value="">Chọn chủ đề...</option>
                        {contactSubjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <span className="mt-1 block text-xs text-uk-danger">
                          {errors.subject}
                        </span>
                      )}
                    </label>

                    {/* Message */}
                    <label className="block">
                      <span className={labelClass}>Nội dung</span>
                      <textarea
                        name="message"
                        value={state.message}
                        onChange={(e) => setField('message', e.target.value)}
                        rows={5}
                        placeholder="Chia sẻ ngắn gọn về nhu cầu của bạn..."
                        className={`${fieldClass} resize-y ${
                          errors.message ? 'border-uk-danger/60' : ''
                        }`}
                        required
                      />
                      {errors.message && (
                        <span className="mt-1 block text-xs text-uk-danger">
                          {errors.message}
                        </span>
                      )}
                    </label>

                    {/* Consent */}
                    <label className="flex items-start gap-3 pt-1">
                      <input
                        type="checkbox"
                        checked={state.consent}
                        onChange={(e) =>
                          setField('consent', e.target.checked)
                        }
                        className="mt-1 w-4 h-4 rounded border-uk-line text-uk-teal focus:ring-uk-teal"
                      />
                      <span className="text-xs text-uk-slate leading-relaxed">
                        Tôi đồng ý để Solavita liên hệ về yêu cầu của mình. Tôi đã
                        đọc{' '}
                        <a
                          href="/privacy/"
                          className="text-uk-teal-dark hover:text-uk-teal underline-offset-2 hover:underline"
                        >
                          Chính sách bảo mật
                        </a>
                        . Dữ liệu của tôi sẽ được xử lý theo quy định pháp luật
                        hiện hành về bảo vệ dữ liệu cá nhân tại Việt Nam.
                      </span>
                    </label>
                    {errors.consent && (
                      <span className="block text-xs text-uk-danger -mt-3">
                        {errors.consent}
                      </span>
                    )}

                    {/* Submit */}
                    <div className="pt-2 flex flex-col gap-3">
                      {submitError && (
                        <div
                          role="alert"
                          className="rounded-lg border border-uk-danger/40 bg-uk-danger/10 px-4 py-3 text-sm text-uk-danger"
                        >
                          {submitError}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                      <p className="text-xs text-uk-slate">
                        Chúng tôi phản hồi trong vòng một ngày làm việc.
                      </p>
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="btn-gradient px-8 py-4 rounded-full font-cw-bold text-base text-white inline-flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {status === 'submitting' ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" strokeWidth={2} />
                            Gửi tin nhắn
                          </>
                        )}
                      </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
