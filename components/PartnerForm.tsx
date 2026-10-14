'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Check,
  Loader2,
  Mail,
  Phone,
} from 'lucide-react'
import { partnerTypes } from '@/lib/data/partners'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * PartnerForm — single-page partner enquiry form.
 *
 * Posts to `/api/partner`, which inserts into Supabase's `ng_partner_leads`
 * table and emails the Nigerian partner contact (see `TEAM_EMAIL` in
 * `app/api/partner/route.ts`).
 *
 * Why a dedicated component (and not a re-use of the consultation
 * `Form.tsx`)?
 * - The partner form has 5 fields on one screen; the consultation
 *   form has 14 fields across 5 steps. The shapes don't overlap.
 * - The partner submission route and the consultation route have
 *   different Supabase tables and different transactional emails. Two
 *   dedicated submission paths avoids accidentally writing a partner
 *   lead to `ng_consultations` (or vice versa).
 *
 * Field contract is shared with `app/api/partner/route.ts`:
 *   { fullName, company, email, partnerTrack, message }
 * The route rejects unknown partnerTrack values (whitelist in route).
 */
export interface PartnerFormProps {
  /** Fires after a successful submit; the modal uses this to close. */
  onClose?: () => void
  /** Optional pre-seed for the track selector. */
  defaultTrack?: 'installer' | 'referral' | 'community'
  /** Visible label on the Submit button. Default `Submit enquiry`. */
  submitButtonLabel?: string
  /** Override the submit endpoint. Default `/api/partner`. */
  submitEndpoint?: string
}

export default function PartnerForm({
  onClose,
  defaultTrack,
  submitButtonLabel = 'Submit enquiry',
  submitEndpoint = '/api/partner',
}: PartnerFormProps) {
  const [form, setForm] = useState({
    fullName: '',
    company: '',
    email: '',
    partnerTrack: defaultTrack ?? 'installer',
    message: '',
  })
  const [errors, setErrors] = useState<{ [k: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const next: { [k: string]: string } = {}
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.'
    if (!form.company.trim()) next.company = 'Please enter your company name.'
    if (!form.email.trim()) {
      next.email = 'Please enter your email address.'
    } else if (!EMAIL_RE.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }
    if (!form.partnerTrack) next.partnerTrack = 'Please choose a partner track.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          partnerTrack: form.partnerTrack,
          message: form.message.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setIsSubmitted(true)
      } else {
        setSubmitError(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-uk-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-uk-emerald/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8"
        >
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
              >
                <Check className="w-10 h-10 text-green-500" strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-bold text-uk-navy mb-3">
                Thank you for your enquiry.
              </h3>
              <p className="text-uk-slate mb-8 max-w-md">
                We&apos;ll get back within two working days with the next
                steps — including which partner track fits your business best.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-uk-teal text-white font-semibold hover:bg-uk-teal-dark transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-uk-line bg-white text-[10px] font-cw-bold tracking-wider uppercase text-uk-slate">
                  Become a Solavita partner
                </span>
                <h2 className="mt-3 text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
                  Tell us about your business.
                </h2>
                <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  We&apos;ll get back within two working days with next
                  steps — including which partner track fits your business
                  best.
                </p>
              </div>

              {/* Full name */}
              <label className="block">
                <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                  Full name
                </span>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Jane Smith"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.fullName ? 'border-red-500' : 'border-uk-line'
                  } bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </label>

              {/* Company */}
              <label className="block">
                <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                  Company
                </span>
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="Acme Solar Ltd"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.company ? 'border-red-500' : 'border-uk-line'
                  } bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal`}
                />
                {errors.company && (
                  <p className="text-red-500 text-xs mt-1">{errors.company}</p>
                )}
              </label>

              {/* Work email */}
              <label className="block">
                <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                  Work email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@acme.co"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-500' : 'border-uk-line'
                  } bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </label>

              {/* Partner track */}
              <label className="block">
                <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                  Partner track
                </span>
                <select
                  name="partnerTrack"
                  value={form.partnerTrack}
                  onChange={(e) => update('partnerTrack', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.partnerTrack ? 'border-red-500' : 'border-uk-line'
                  } bg-white text-uk-navy focus:outline-none focus:border-uk-teal`}
                >
                  {partnerTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                {errors.partnerTrack && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.partnerTrack}
                  </p>
                )}
              </label>

              {/* Message */}
              <label className="block">
                <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                  Tell us a bit about your business
                </span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Region, size, current focus…"
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal"
                />
              </label>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2 border-t border-uk-line/50">
                <p className="text-xs text-uk-slate">
                  Or email us directly:{' '}
                  <a
                    href="mailto:ng@solavita.com"
                    className="text-uk-teal-dark hover:text-uk-teal transition-colors font-cw-bold"
                  >
                    ng@solavita.com
                  </a>
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gradient px-8 py-3 rounded-full font-cw-bold text-base text-white w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    submitButtonLabel
                  )}
                </button>
              </div>

              {submitError && (
                <p className="text-red-500 text-sm text-center">
                  {submitError}
                </p>
              )}

              {/* Privacy */}
              <p className="text-xs text-uk-slate/80 leading-relaxed pt-2">
                By submitting, you agree to our{' '}
                <a href="/privacy" className="text-uk-teal-dark underline">
                  Privacy Policy
                </a>
                . Your data is used solely to evaluate your partnership
                enquiry.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}