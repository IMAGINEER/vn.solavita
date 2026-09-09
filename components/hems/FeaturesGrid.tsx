'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sun, Battery, Plug, Flame, Coins, ShieldCheck } from 'lucide-react'
import { hemsFeatures, hemsDemoVideo, type HEMSFeature } from '@/lib/data/hems'

gsap.registerPlugin(ScrollTrigger)

/* Lucide icons — resolved by `iconKey` so we don't depend on emoji at
   paint time (some terminals / readers strip emoji glyphs). The
   wrapping `text-uk-teal-dark` token controls the tint. */
const lucideFor = (key: HEMSFeature['iconKey']) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (key) {
    case 'sun':
      return <Sun {...props} />
    case 'battery':
      return <Battery {...props} />
    case 'plug':
      return <Plug {...props} />
    case 'flame':
      return <Flame {...props} />
    case 'coins':
      return <Coins {...props} />
    case 'shield':
      return <ShieldCheck {...props} />
  }
}

/**
 * "Everything HEMS orchestrates" — heading → live demo video → 6-card
 * grid. The video sits directly under the heading (per product brief)
 * rather than as its own section, so the section reads as one cohesive
 * capability overview. Video is full-width, autoplaying, muted and
 * looping so it works on mobile Safari / Chrome without a tap.
 */
export default function FeaturesGrid() {
  const gridRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gridRef.current?.children
      if (items) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
          }
        )
      }
      gsap.fromTo(
        videoWrapRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: videoWrapRef.current, start: 'top 85%' },
        }
      )
    }, gridRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative py-16 md:py-24 bg-sv-light dark:bg-sv-darker overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            One brain, SIX SYSTEMS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Everything HEMS{' '}
            <span className="text-gradient">orchestrates</span>
          </h2>
        </div>

        {/* Live demo video — full-width, autoplaying, muted, looping.
           Sits directly under the heading per the product brief, so
           the section reads as one cohesive capability overview. */}
        <div
          ref={videoWrapRef}
          className="mb-10 md:mb-14 rounded-2xl overflow-hidden border border-uk-line bg-sv-navy shadow-xl"
        >
          <video
            ref={videoRef}
            src={hemsDemoVideo.src}
            className="w-full aspect-video block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={hemsDemoVideo.caption}
          />
        </div>

        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {hemsFeatures.map((f) => (
            <div
              key={f.title}
              className="group p-4 sm:p-5 rounded-xl bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark group-hover:scale-110 transition-transform">
                  {lucideFor(f.iconKey)}
                </div>
                <h3 className="text-sm sm:text-base font-cw-bold text-uk-navy leading-tight">
                  {f.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-uk-slate font-cw-regular leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}