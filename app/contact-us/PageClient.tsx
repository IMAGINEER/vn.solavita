'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TbdText from '@/components/ui/tbd-text'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import { contactSubjects, contactChannels } from '@/lib/data/contact'
import { openFormModal } from '@/lib/form-modal'

const ICON_MAP = {
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
} as const

const PRIMARY_CTA = 'Send Enquiry'
const SECONDARY_CTA = 'Explore Solar Solutions'

/**
 * /contact-us - Plain contact destination.
 *
 * Built from `content/nigeria/contact-us.md`. The form submits to
 * `/api/contact` (already NG-isolated in the function phase) and the
 * channels list surfaces every TBD through the unified TbdText.
 */
export default function ContactUsPage() {
  const [enquiryType, setEnquiryType] = useState<string>(contactSubjects[0]?.id ?? 'residential')
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitState('submitting')
    setErrorMessage('')
    const form = e.currentTarget
    const data = new FormData(form)
    const payload: Record<string, string> = {
      salutation: String(data.get('salutation') ?? ''),
      firstName: String(data.get('firstName') ?? ''),
      lastName: String(data.get('lastName') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      city: String(data.get('city') ?? ''),
      state: String(data.get('state') ?? ''),
      propertyType: String(data.get('propertyType') ?? ''),
      preferredContact: String(data.get('preferredContact') ?? ''),
      subject: enquiryType,
      message: String(data.get('message') ?? ''),
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      setSubmitState('success')
      form.reset()
    } catch (err) {
      setSubmitState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed')
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* ───── Section 1 — Hero (UK pattern) ───── */}
      <PageHero
        backgroundImage="/images/hero-contact.webp"
        eyebrow="CONTACT US"
        title="Let's Talk About* Your Power Needs*"
        body="Tell us about your home or business. We will design the right solar and battery system to cut your fuel bill, give you energy independence, and keep you lit through any power crisis. Get a free quote - no obligation."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' },
        ]}
      />

      {/* ───── Section 2 — Enquiry type chips ───── */}
      <section className="relative py-8 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center">
            <SectionEyebrow static>ENQUIRY TYPE</SectionEyebrow>
            <h2 className="mt-4 text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
              What Can We Help You With?
            </h2>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {contactSubjects.map((s) => {
              const active = enquiryType === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setEnquiryType(s.id)}
                  className={`px-4 py-2 rounded-full text-sm font-cw-bold border transition-colors ${
                    active
                      ? 'border-uk-teal bg-uk-teal text-white'
                      : 'border-uk-line text-uk-slate hover:border-uk-teal hover:text-uk-teal'
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-center text-sm text-uk-slate font-cw-regular">
            {contactSubjects.find((s) => s.id === enquiryType)?.description}
          </p>
        </div>
      </section>

      {/* ───── Section 3 — Contact form ───── */}
      <section className="relative py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <SectionEyebrow>SEND ENQUIRY</SectionEyebrow>
            <h2 className="mt-4 text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
              Tell Us How We Can Help
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" name="firstName" required />
              <Field label="Last name" name="lastName" required />
            </div>
            <Field label="Email address" name="email" type="email" required />
            <Field label="Telephone number" name="phone" type="tel" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="State" name="state" required />
              <Field label="City" name="city" required />
            </div>
            <div>
              <label className="block text-sm font-cw-bold text-uk-navy mb-1">
                Property type
              </label>
              <select
                name="propertyType"
                className="w-full rounded-lg border border-uk-line bg-white px-4 py-2.5 text-sm text-uk-navy"
              >
                <option value="">Select…</option>
                <option value="residential">Residential</option>
                <option value="small-commercial">Small commercial</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-cw-bold text-uk-navy mb-1">
                Preferred contact method
              </label>
              <select
                name="preferredContact"
                className="w-full rounded-lg border border-uk-line bg-white px-4 py-2.5 text-sm text-uk-navy"
              >
                <option value="">Select…</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-cw-bold text-uk-navy mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full rounded-lg border border-uk-line bg-white px-4 py-2.5 text-sm text-uk-navy"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="btn-gradient px-6 py-3 rounded-full text-sm font-cw-bold text-white disabled:opacity-60"
              >
                {submitState === 'submitting' ? 'Sending…' : PRIMARY_CTA}
              </button>
              {submitState === 'success' && (
                <p className="text-sm text-uk-emerald font-cw-bold">
                  Thanks — your enquiry is with us.
                </p>
              )}
              {submitState === 'error' && (
                <p className="text-sm text-red-600 font-cw-bold">
                  {errorMessage || 'Submission failed. Please try again.'}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* ───── Section 4 — Local contact details (all TBD) ───── */}
      <section className="relative py-12 md:py-16 bg-uk-line/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <SectionEyebrow>LOCAL CONTACT</SectionEyebrow>
            <h2 className="mt-4 text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
              Local Contact Details
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactChannels.map((ch) => {
              const Icon = ICON_MAP[ch.icon]
              return (
                <div key={ch.label} className="rounded-2xl border border-uk-line bg-white p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark">
                      <Icon className="w-5 h-5" strokeWidth={1.6} />
                    </div>
                    <h3 className="text-sm font-cw-bold uppercase tracking-wider text-uk-slate">
                      {ch.label}
                    </h3>
                  </div>
                  <p className="text-sm text-uk-navy font-cw-bold">
                    <TbdText text="Verified Nigerian contact" />
                  </p>
                  {ch.description && (
                    <p className="mt-2 text-xs text-uk-slate font-cw-regular">
                      {ch.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-6 text-sm text-uk-slate font-cw-regular max-w-2xl">
            Do not publish a fabricated address, map pin or telephone
            number.
          </p>
        </div>
      </section>

      {/* ───── Section 5 — Final CTA ───── */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-uk-teal/5 to-uk-emerald/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionEyebrow>NOT SURE</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Not Sure Where to Start?
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Explore the available solar solutions and tell us which
            appliances you need to power.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/solutions"
              className="btn-gradient px-6 py-3 rounded-full text-sm font-cw-bold text-white"
            >
              {SECONDARY_CTA}
            </a>
            <button
              type="button"
              onClick={openFormModal}
              className="px-6 py-3 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-white transition-colors"
            >
              {PRIMARY_CTA}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-cw-bold text-uk-navy mb-1">
        {label}{required ? <span className="text-red-600"> *</span> : null}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-uk-line bg-white px-4 py-2.5 text-sm text-uk-navy"
      />
    </div>
  )
}
