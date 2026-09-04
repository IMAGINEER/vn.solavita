'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Partner enquiry CTA. Visually heavier than the standard CTA block
 * because this is the page's conversion goal - the inline form posts
 * to /api/partner, which saves the row to `uk_partner_leads` and
 * fires a confirmation email + a team notification.
 *
 * On 2xx the form swaps to an emerald success card mirroring the
 * ContactForm success UX.
 */
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function PartnerCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

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
      company: String(data.get('company') || '').trim(),
      email: String(data.get('email') || '').trim(),
      partnerTrack: String(data.get('track') || '').trim(),
      message: String(data.get('message') || '').trim(),
    }
    if (
      !payload.fullName ||
      !payload.company ||
      !payload.email ||
      !payload.partnerTrack
    ) {
      setSubmitError('Please fill in all required fields.')
      setStatus('error')
      return
    }

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
        setSubmitError(json.message || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }
      setStatus('success')
      form.reset()
    } catch {
      setSubmitError('Network error. Please try again.')
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setSubmitError(null)
  }

  return (
    <section
      ref={sectionRef}
      id="partner-cta"
      className="relative py-16 md:py-24 bg-sv-light dark:bg-sv-darker overflow-hidden"
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
              Partner with Solavita
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Tell us about{' '}
              <span className="text-gradient">your business.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
              We&rsquo;ll get back within two working days with next
              steps - including which partner track fits your business
              best.
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
                  Thanks - we&rsquo;ve got your enquiry.
                </h3>
                <p className="mt-3 text-sm lg:text-base text-uk-slate font-cw-regular max-w-md">
                  Our partnerships team will get back to you within two
                  working days. If it&rsquo;s urgent, you can reach us
                  directly at{' '}
                  <a
                    href="mailto:partners@solavita.com"
                    className="text-uk-teal-dark hover:text-uk-teal transition-colors"
                  >
                    partners@solavita.com
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
                >
                  Submit another enquiry →
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
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Company
                  </span>
                  <input
                    type="text"
                    name="company"
                    required
                    placeholder="Acme Solar Ltd"
                    className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Work email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="jane@acme.co.uk"
                    className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Partner track
                  </span>
                  <select
                    name="track"
                    defaultValue="installer"
                    className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy focus:outline-none focus:border-uk-teal"
                  >
                    <option value="installer">Installer</option>
                    <option value="business">Energy / Business Partner</option>
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="block text-xs font-cw-bold tracking-wider uppercase text-uk-slate mb-1.5">
                    Tell us a bit about your business
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Region, size, current focus..."
                    className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal"
                  />
                </label>

                {submitError && (
                  <div
                    role="alert"
                    className="md:col-span-2 rounded-lg border border-uk-danger/40 bg-uk-danger/10 px-4 py-3 text-sm text-uk-danger"
                  >
                    {submitError}
                  </div>
                )}

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                  <p className="text-xs text-uk-slate">
                    Or email us directly:{' '}
                    <a
                      href="mailto:partners@solavita.com"
                      className="text-uk-teal-dark hover:text-uk-teal transition-colors"
                    >
                      partners@solavita.com
                    </a>
                  </p>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-gradient px-8 py-4 rounded-full font-cw-bold text-base text-white w-full sm:w-auto inline-flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {status === 'submitting' ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>Submit enquiry →</>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}