'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import {
  partnerBenefits,
  partnerGroupFacts,
  partnerStats,
} from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Why partner with Solavita?" — layout ported from the For-Partner
 * 页面修改参考页 PPTX:
 *
 *   ┌─ Title: "Why Partner with Solavita?" ─────────────────────┐
 *   │                                                          │
 *   │   ┌─ 800,000+ ───────┐   ┌─ 34.6GW ───────────┐            │
 *   │   │ Solar Stations  │   │ Cumulative Installed│           │
 *   │   │ Installed       │   │ Capacity           │           │
 *   │   │ Worldwide       │   │                    │           │
 *   │   └─────────────────┘   └────────────────────┘            │
 *   │                                                          │
 *   │   Body paragraph + tagline.                              │
 *   │                                                          │
 *   │   ┌─ [ Local Wareh. ] ┐  ┌─ [ Full Warranty ] ┐  ┌─ [ Sales Sup. ] ┐
 *   │   │  No full container │  │  Local backup for  │  │  Leads & tech  │
 *   │   │  needed            │  │  claims            │  │  backup        │
 *   │   └────────────────────┘  └────────────────────┘  └────────────────┘
 *   └──────────────────────────────────────────────────────────┘
 */
export default function WhyPartner() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-partner-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
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
      id="why-partner"
      className="relative py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Vì sao hợp tác
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Vì sao nên hợp tác cùng{' '}
            <span className="text-gradient">Solavita</span>?
          </h2>
        </div>

        {/* Hero stats banner — 2-up grid, large numbers + caption */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto">
          {partnerStats.map((s) => (
            <div
              key={s.caption}
              className="why-partner-card rounded-2xl border border-uk-line bg-uk-line/20 p-6 md:p-8 text-center"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy">
                {s.value}
              </div>
              <div className="mt-2 text-sm md:text-base text-uk-slate font-cw-regular">
                {s.caption}
              </div>
            </div>
          ))}
        </div>

        {/* Body paragraph + tagline */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className="text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Solavita đồng hành cùng các đối tác năng lượng bằng sản phẩm sản
            xuất tại nhà máy, với mô hình giải pháp trọn gói: chuỗi cung ứng,
            tài chính, logistics và vận hành — bảo trì đều thuộc về phía
            Solavita. Khi trở thành đối tác, bạn có quyền tiếp cận tồn kho tại
            địa phương, bảo hành toàn hệ thống và hỗ trợ chia sẻ khách hàng.
          </p>
          <p className="mt-3 text-lg md:text-xl font-cw-bold text-uk-navy">
            Phát triển kinh doanh, đồng hành cùng khu vực của bạn!
          </p>
        </div>

        {/* SKYWORTH group credibility strip — the numbers printed on
            page 1 of the VN recruitment brochure. A partner's first
            question is "who stands behind the warranty?", so the
            group's scale answers it before the feature cards do. */}
        <div className="mb-10 md:mb-14">
          <p className="text-center text-xs font-cw-bold uppercase tracking-wider text-uk-slate mb-5">
            Solavita là thương hiệu điện mặt trời thuộc Tập đoàn SKYWORTH
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {partnerGroupFacts.map((f) => (
              <div
                key={f.caption}
                className="why-partner-card rounded-xl border border-uk-line bg-white px-4 py-5 text-center"
              >
                <div className="text-xl md:text-2xl font-cw-bold text-uk-navy leading-tight">
                  {f.value}
                </div>
                <div className="mt-1.5 text-xs text-uk-slate font-cw-regular leading-snug">
                  {f.caption}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 highlight cards — image with overlay pill + caption */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerBenefits.map((b) => (
            <div
              key={b.label}
              className="why-partner-card relative rounded-2xl overflow-hidden border border-uk-line bg-uk-line/20 group"
            >
              <div className="aspect-[4/3] relative">
                {/* Render the real image when supplied; fall back to the
                    neutral placeholder until business confirms the final
                    artwork for a given card. Both branches sit under the
                    same dark gradient + overlay pill so the visual
                    treatment stays identical either way. */}
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder
                    description={b.description}
                    aspectRatio="4/3"
                  />
                )}
                {/* Dark gradient overlay so the pill + caption stay legible
                    regardless of the eventual image content. */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.45) 40%, rgba(15,23,42,0) 70%)',
                  }}
                />
                {/* Overlay pill + caption (positioned bottom-left) */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-cw-bold uppercase tracking-wider bg-white/95 text-uk-navy">
                    [ {b.label} ]
                  </span>
                  <p className="mt-2 text-sm md:text-base text-white font-cw-bold leading-snug">
                    {b.caption}
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
