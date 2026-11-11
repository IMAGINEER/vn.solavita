'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import AppStoreLinks from '@/components/ui/app-store-links'

gsap.registerPlugin(ScrollTrigger)

/**
 * SolutionAdvantageSection — the scenario-specific advantage block.
 *
 * Per `docs/修改建议(2).docx`:
 *   - Residential 详情页 ②优势-解决方案整体优势
 *       eyebrow : "POWERED BY VITAL LIFE."
 *       DIESEL, STEP DOWN. / BLACKOUT-PROOF NIGHTS. / ONE SCREEN. FULL CONTROL.
 *   - Commercial & Industrial 详情页 ②优势-解决方案优势
 *       Zero Downtime / Cut Diesel / Built Tough
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
  /** Headline, e.g. "DIESEL, STEP DOWN." */
  title: string
  /** One-line body. */
  body: string
  /** What the image should show. */
  imageDescription: string
  /** Optional image path — set once the reference assets land. */
  imagePath?: string
  /**
   * `object-position` for the band image. Defaults to 'center'.
   *
   * Needed when the section pins a wide ratio (4:1): the crop keeps
   * only the middle ~60% of a 2.3:1 photo, which can slice a subject
   * that sits high in the frame (a person, a roof-mounted array) or
   * low in it. 'center 30%' keeps the top of the picture, 'right
   * center' keeps the right-hand side.
   */
  imagePosition?: string
  /**
   * Renders the App Store / Google Play download buttons inside this
   * band. Set on the monitoring-app band ("ONE SCREEN. FULL CONTROL.")
   * — the download CTA belongs with the app pitch, not under the card.
   */
  appDownloads?: boolean
}

interface SolutionAdvantageSectionProps {
  /** The docx's 气泡框标题 — rendered as the standard section eyebrow. */
  eyebrow: string
  /** Section heading. */
  heading: React.ReactNode
  /** Optional lead paragraph under the heading. */
  intro?: string
  advantages: SolutionAdvantage[]
  /**
   * One fixed aspect ratio for every band in the section, e.g. '4 / 1'.
   *
   * With this set the bands become uniform cinematic strips: all three
   * are the same shape and the same height at every breakpoint, and
   * each photo is cropped (object-cover) to that ratio. Without it
   * each band follows its own image, so the three heights differ.
   *
   * Note the min-height floors: a 4:1 band of the widest container
   * (max-w-6xl → 1088px) is 272px, so the md+ floor has to sit below
   * that or it would always win and the ratio would never apply.
   */
  bandRatio?: string
  /** Anchor id so the section can be linked to. */
  id?: string
}

export default function SolutionAdvantageSection({
  eyebrow,
  heading,
  intro,
  advantages,
  bandRatio,
  id = 'solution-advantage',
}: SolutionAdvantageSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  /**
   * Natural width/height of each loaded band image, keyed by title.
   *
   * The band takes the picture's OWN ratio so the background image is
   * never cropped — the whole height of the photo shows. Deriving it
   * from the loaded file instead of hardcoding a number per asset
   * means a re-exported (or resized) picture can't silently go stale
   * and start cropping again.
   */
  const [imageRatios, setImageRatios] = useState<Record<string, string>>({})

  const rememberRatio = (title: string, img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return
    const ratio = `${img.naturalWidth} / ${img.naturalHeight}`
    setImageRatios((prev) =>
      prev[title] === ratio ? prev : { ...prev, [title]: ratio },
    )
  }

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
              className={`solution-advantage-band relative flex flex-col justify-center ${
                // Image bands keep a floor for the copy on narrow
                // screens; from md up the picture's own ratio decides
                // the height, so nothing is cropped.
                //
                // With `bandRatio` the section asks for uniform strips:
                // the md+ floor drops to 240px so a 4:1 band (240px at
                // lg, 272px at xl) is not overridden by it.
                a.imagePath
                  ? bandRatio
                    ? 'min-h-[420px] md:min-h-[240px]'
                    : 'min-h-[420px] md:min-h-[360px]'
                  : 'min-h-[260px] md:min-h-[320px]'
              } ${i > 0 ? 'border-t border-uk-line/60' : ''}`}
              // The band takes the picture's own ratio, so the photo
              // shows at its full height instead of being cropped to
              // the band — unless the section pins one ratio for all
              // of them, in which case every band is the same strip.
              // Placeholder bands keep the fixed height.
              style={
                (bandRatio ?? imageRatios[a.title])
                  ? { aspectRatio: bandRatio ?? imageRatios[a.title] }
                  : undefined
              }
            >
              {/* Background image (or the TBD placeholder) */}
              <div className="absolute inset-0">
                {a.imagePath ? (
                  <img
                    src={a.imagePath}
                    alt={a.imageDescription}
                    loading="lazy"
                    onLoad={(e) => rememberRatio(a.title, e.currentTarget)}
                    style={{ objectPosition: a.imagePosition ?? 'center' }}
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
              <div
                className={`relative px-6 md:px-12 py-10 ${
                  // A pinned 4:1 strip is only ~240px tall, so the copy
                  // sits tighter than it does in a free-height band —
                  // otherwise the title, the body and the two store
                  // buttons would not fit inside it.
                  bandRatio ? 'md:py-6' : 'md:py-14'
                }`}
              >
                <div className="max-w-xl">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-cw-bold text-white leading-tight">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-white/85 font-cw-regular leading-relaxed">
                    {a.body}
                  </p>
                  {/* Download CTA — lives inside the monitoring-app band
                      so it sits with the pitch it belongs to. */}
                  {a.appDownloads && (
                    <AppStoreLinks className="mt-6 justify-start" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
