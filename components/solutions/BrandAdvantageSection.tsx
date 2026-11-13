'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionEyebrow from '@/components/ui/section-eyebrow'

gsap.registerPlugin(ScrollTrigger)

/**
 * BrandAdvantageSection — the "VITAL ENERGY. VITAL TRUST." block.
 *
 * Per `docs/修改建议(2).docx` §"Solutions - Residential - 详情页"
 * ②优势-品牌赋能 and §"Solutions - Commercial & Industrial - 详情页"
 * ②优势-品牌赋能, both pages carry the identical three-item block:
 *
 *   1. One Supplier   — All PV & ESS products from one source. Lower costs, less hassle.
 *   2. Local Stock    — Ready inventory on ground. Rapid delivery, no delays.
 *   3. Trusted Service— Local team support. Fast response, zero worries.
 *
 * The docx's "气泡框标题" IS the page eyebrow — it uses the standard
 * `SectionEyebrow` component, not a bespoke pill.
 */

interface BrandAdvantage {
  title: string
  body: string
}

const BRAND_ADVANTAGES: BrandAdvantage[] = [
  {
    title: 'Một nhà cung cấp',
    body: 'Tấm pin, biến tần, pin lưu trữ và phụ kiện cùng một nhà sản xuất — chỉ một đầu mối cung cấp.',
  },
  {
    title: 'Sẵn hàng tại địa phương',
    body: 'Hàng có sẵn tại kho địa phương, giao nhanh khi có nhu cầu.',
  },
  {
    title: 'Dịch vụ tin cậy',
    body: 'Đội ngũ tại Việt Nam trực tiếp hỗ trợ, phản hồi nhanh khi bạn cần.',
  },
]

export default function BrandAdvantageSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.brand-advantage-item',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
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
      id="brand-advantage"
      className="relative py-16 md:py-24 bg-sv-blue/10 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <SectionEyebrow>VÌ SAO CHỌN SOLAVITA</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Trọn bộ thiết bị,{' '}
            <span className="text-gradient">hỗ trợ ngay tại Việt Nam</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Tấm pin, biến tần, pin lưu trữ và phụ kiện lắp đặt từ một nhà sản
            xuất — giao từ kho địa phương và hỗ trợ bởi đội ngũ tại chỗ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {BRAND_ADVANTAGES.map((item, i) => (
            <div
              key={item.title}
              className="brand-advantage-item rounded-2xl border border-uk-line bg-white p-6 md:p-7 hover:border-uk-teal/40 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-cw-bold text-uk-teal/40 tabular-nums">
                  {i + 1}
                </span>
                <h3 className="text-lg md:text-xl font-cw-bold text-uk-navy leading-tight">
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 text-sm md:text-base text-uk-slate font-cw-regular leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
