'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Get Your Free Plan" section.
 *
 * The mid-page CTA that promotes the consultation form modal. Clicking the
 * button dispatches `onOpenForm` which CampaignOverrides mirrors into modal
 * state. The form itself lives in <FormModal />, not here.
 *
 * Left column carries the value proposition + CTA; right column shows a
 * static sample report image so the user can see what kind of professional
 * proposal they'll receive after submitting their details. Purely visual -
 * no interaction.
 */

const CheckIcon = ({ className }: { className?: string }) => (
  <Check className={className ?? 'w-3 h-3'} strokeWidth={3} />
)

export default function FreeDesignQuoteSection({
  onOpenForm,
}: { onOpenForm?: () => void } = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    // Safety net: if ScrollTrigger never fires (e.g. JS race / hydration hiccup),
    // force content visible so it never stays stuck at opacity:0.
    const safety = window.setTimeout(() => {
      if (leftRef.current && getComputedStyle(leftRef.current).opacity === '0') {
        gsap.set(leftRef.current, { opacity: 1, x: 0, clearProps: 'transform' })
        gsap.set(rightRef.current, { opacity: 1, x: 0, clearProps: 'transform' })
      }
    }, 1500)

    return () => {
      ctx.revert()
      window.clearTimeout(safety)
    }
  }, [])

  const benefits = [
    'Custom system design for your roof',
    'Energy savings analysis',
    'Battery & HEMS planning',
    'UK-specific recommendations',
  ]

  return (
    <section
      ref={sectionRef}
      id="design-quote"
      className="relative py-16 md:py-24 overflow-hidden bg-white"
    >
      {/* Soft accent - matches the page's teal direction */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-uk-teal/10 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ─────────── LEFT: value proposition + CTA ─────────── */}
          <div ref={leftRef} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white">
              <div className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              <span className="text-xs font-cw-regular text-uk-slate">
                Free UK plan
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Get Your Free
              <br />
              <span className="text-gradient">Plan</span>
              <br />
              in 24 hours
            </h2>

            <p className="text-lg text-uk-slate font-cw-regular leading-relaxed max-w-xl">
              Tell us about your home and energy needs. Our experts will design
              the best solution and provide a clear, no-obligation quote.
            </p>

            <ul className="space-y-3 pt-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-uk-navy"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/10 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-uk-emerald" />
                  </span>
                  <span className="font-cw-regular">{benefit}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onOpenForm}
              className="btn-gradient px-8 py-4 rounded-full font-cw-bold text-base text-white cursor-pointer"
            >
              Get Your Free Plan →
            </button>

            <p className="text-xs text-uk-slate">
              1-minute survey · No credit check · Reply within 1 working day
            </p>
          </div>

          {/* ─────────── RIGHT: sample report image ─────────── */}
          <div ref={rightRef}>
            <div className="relative rounded-2xl overflow-hidden border border-uk-line bg-white shadow-sm">
              <img
                src="/images/report_sample.webp"
                alt="Sample Solavita solar design & quote report"
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
