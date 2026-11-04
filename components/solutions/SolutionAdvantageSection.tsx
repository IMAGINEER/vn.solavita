'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import ImagePlaceholder from '@/components/ui/image-placeholder'

gsap.registerPlugin(ScrollTrigger)

/**
 * SolutionAdvantageSection — the scenario-specific advantage block.
 *
 * Per `docs/修改建议(2).docx`:
 *   - Residential 详情页 ②优势-解决方案整体优势
 *       eyebrow : "POWERED BY VITAL LIFE."
 *       ENERGY COSTS, STEP DOWN. / BLACKOUT-PROOF NIGHTS. / ONE SCREEN. FULL CONTROL.
 *   - Commercial & Industrial 详情页 ②优势-解决方案优势
 *       Zero Downtime / Cut Energy Costs / Built Tough
 *
 * Layout — the three advantages are NOT three separate cards. They are
 * three parts of ONE card: each part is a full-width band with its own
 * background image and the title + body overlaid on that image, so the
 * copy reads on top of the picture rather than beside it.
 *
 * A row with no `imagePath` keeps the neutral `ImagePlaceholder` as
 * its background band — the dashed frame and the "IMAGE TBD" caption
 * stay visible on the uncovered side, per the NG content strategy.
 */

export interface SolutionAdvantage {
  /** Headline, e.g. "ENERGY COSTS, STEP DOWN." */
  title: string
  /** One-line body. */
  body: string
  /** What the image should show. */
  imageDescription: string
  /** Optional image path — set once the reference assets land. */
  imagePath?: string
}

interface SolutionAdvantageSectionProps {
  /** The docx's 气泡框标题 — rendered as the standard section eyebrow. */
  eyebrow: string
  /** Section heading. */
  heading: React.ReactNode
  /** Optional lead paragraph under the heading. */
  intro?: string
  advantages: SolutionAdvantage[]
  /** Anchor id so the section can be linked to. */
  id?: string
}

export default function SolutionAdvantageSection({
  eyebrow,
  heading,
  intro,
  advantages,
  id = 'solution-advantage',
}: SolutionAdvantageSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.solution-advantage-band',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
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

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative py-16 md:py-24 bg-uk-line/20 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            {heading}
          </h2>
          {intro && (
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
              {intro}
            </p>
          )}
        </div>

        {/* One card, three parts — each part is a background image with
            the copy overlaid on it. */}
        <div className="rounded-3xl overflow-hidden border border-uk-line bg-white shadow-sm">
          {advantages.map((a, i) => (
            <div
              key={a.title}
              className={`solution-advantage-band relative min-h-[260px] md:min-h-[320px] ${
                i > 0 ? 'border-t border-uk-line/60' : ''
              }`}
            >
              {/* Background image (or the TBD placeholder) */}
              <div className="absolute inset-0">
                {a.imagePath ? (
                  <img
                    src={a.imagePath}
                    alt={a.imageDescription}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder
                    description={a.imageDescription}
                    className="!rounded-none !border-0 h-full"
                  />
                )}
              </div>

              {/* Legibility gradient — covers the left side only so an
                  image (or its placeholder) stays readable on the right. */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to right, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.72) 38%, rgba(15,23,42,0.35) 62%, rgba(15,23,42,0) 85%)',
                }}
              />

              {/* Copy overlaid on the background */}
              <div className="relative px-6 md:px-12 py-10 md:py-14 flex items-center h-full">
                <div className="max-w-xl">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-cw-bold text-white leading-tight">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-white/85 font-cw-regular leading-relaxed">
                    {a.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
