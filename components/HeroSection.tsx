'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Phone, Shield, Star } from 'lucide-react'
import { openFormModal } from '@/lib/form-modal'
import type { HeroCopy } from '@/lib/campaigns/types'

interface HeroSectionProps {
  override?: HeroCopy
}

/* ────────────────────────────────────────────────────────────────────────
   Inline SVG icons. Theme-neutral: stroke uses `currentColor` so a
   `text-uk-teal-dark` wrapper decides the tint; the Union Jack is full-colour
   on purpose (it's a national flag, not a UI icon).
   ──────────────────────────────────────────────────────────────────────── */

const FlagUK = ({ className }: { className?: string }) => (
  <svg
    className={className ?? 'w-5 h-4'}
    viewBox="0 0 60 30"
    aria-hidden="true"
    role="img"
  >
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
  </svg>
)

/* Lucide icons — stroke uses `currentColor` so a `text-*` wrapper decides the
   tint; the Union Jack above is full-colour on purpose (it's a national flag,
   not a UI icon). */

const StarIcon = ({ className }: { className?: string }) => (
  <Star className={className ?? 'w-4 h-4'} fill="currentColor" />
)

/* ──────────────────────────────────────────────────────────────────────── */

export default function HeroSection({ override }: HeroSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const pillsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const trustpilotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 })

    tl.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        pillsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        imageRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.9'
      )
      .fromTo(
        trustpilotRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
  }, [])

  const defaultBadge = 'Designed for the UK · Premium Quality'
  const defaultH1: [string, string, string] = [
    'Power Your Home.',
    'Shape a Greener UK.',
    '',
  ]
  const defaultSubhead =
    'Smart solar & storage solutions for UK homes. Save more. Worry less. Live better.'
  const defaultCtaLabel = 'Get Free Design & Quote →'

  const badge = override?.badge ?? defaultBadge
  const h1 = override?.h1 ?? defaultH1
  const subhead = override?.subhead ?? defaultSubhead
  const ctaLabel = override?.primaryCta.label ?? defaultCtaLabel

  // Figma-aligned 4 trust pills (below the CTAs). Inline SVG icons keep the
  // visual identical in both light and dark mode.
  const trustPills = [
    {
      icon: <FlagUK className="w-5 h-4 rounded-sm overflow-hidden" />,
      text: 'Designed for the UK',
    },
    {
      icon: <Phone className="w-4 h-4 text-white" strokeWidth={1.6} />,
      text: 'Local Support in the UK',
    },
    {
      icon: <Shield className="w-4 h-4 text-white" strokeWidth={1.6} />,
      text: '5–15 Years Warranty',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="hero-banner relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/banner_uk.webp)' }}
    >
      {/* Directional overlay — darkest behind the left copy column, fading
         out toward the right so the banner image shows through behind the
         product photo column. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 35%, rgba(15,23,42,0.25) 60%, rgba(15,23,42,0) 80%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-w-0">
          <div className="space-y-6 min-w-0 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              <span className="text-xs font-cw-regular text-white/90">{badge}</span>
            </div>

            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-white"
            >
              {h1[0]}
              <br />
              {h1[1] && (
                <>
                  <span className="text-gradient">{h1[1]}</span>
                  <br />
                </>
              )}
              {h1[2]}
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-white/85 font-cw-light max-w-xl leading-relaxed"
            >
              {subhead}
            </p>

            {/* CTAs — primary uses original theme `.btn-gradient`; secondary uses a
               white outline that flips to white-on-navy on hover. */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={openFormModal}
                className="btn-gradient text-white px-8 py-4 rounded-full font-cw-bold text-center text-base cursor-pointer"
              >
                {ctaLabel}
              </button>
              <a
                href="#products"
                className="px-8 py-4 rounded-full border-2 border-white bg-uk-navy font-cw-regular text-center text-base hover:bg-white hover:text-uk-navy transition-colors"
              >
                Explore Solutions
              </a>
            </div>

            {/* Trust pills row (UK Figma: 4 trust badges below the CTAs) */}
            <div
              ref={pillsRef}
              className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4"
            >
              {trustPills.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  <span className="font-cw-regular text-white text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div ref={imageRef} className="hidden">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-uk-line bg-uk-teal-soft">
              <img
                src="/static/images/hero-placeholder.webp"
                alt="UK home with solar panels"
                loading="eager"
                className="w-full h-full object-cover"
              />

              {/* Union Jack overlay — top-right (Figma placement) */}
              <div className="absolute top-4 right-4 w-16 h-12 rounded-md shadow-md overflow-hidden border border-white/40 bg-white flex items-center justify-center">
                <FlagUK className="w-14 h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trustpilot card — pinned to the bottom-right of the entire section
         (sits outside the right-column image frame, over the banner image). */}
      <div
        ref={trustpilotRef}
        className="absolute bottom-6 right-4 sm:right-6 lg:right-8 max-w-xs bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-uk-line"
      >
        <div className="text-xs font-semibold text-uk-slate tracking-wider uppercase">
          Trusted by UK Homeowners
        </div>
        <div className="flex gap-0.5 mt-2 text-uk-emerald">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="w-4 h-4" />
          ))}
        </div>
      </div>
    </section>
  )
}