'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Partner enquiry CTA. Visually heavier than the standard CTA block
 * because this is the page's conversion goal — includes a short form
 * sketch (name / company / email) so the page reads as a real B2B
 * enquiry destination, not just "contact us". The form is wired only
 * to a `preventDefault` submit handler for now — the project brief
 * explicitly defers the real backend.
 */
export default function PartnerCTA() {
  const sectionRef = useRef<HTMLElement>(null)

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Backend wiring deferred per project brief.
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
              Become a Solavita partner
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Tell us about{' '}
              <span className="text-gradient">your business.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
              We&rsquo;ll get back within two working days with next
              steps — including which partner track fits your business
              best.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
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
                <option value="distributor">Distributor</option>
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
                placeholder="Region, size, current focus…"
                className="w-full px-4 py-3 rounded-xl border border-uk-line bg-white text-uk-navy placeholder:text-uk-slate/60 focus:outline-none focus:border-uk-teal"
              />
            </label>

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
                className="btn-gradient px-8 py-4 rounded-full font-cw-bold text-base text-white w-full sm:w-auto"
              >
                Submit enquiry →
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
