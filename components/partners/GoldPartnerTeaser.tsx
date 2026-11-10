'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Crown } from 'lucide-react'
import { goldMedalProgram, PARTNER_HOTLINE } from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

/**
 * Entry point to the standalone "Chương trình Đối tác Vàng" page
 * (`/for-partners/gold-partner/`).
 *
 * The campaign used to live as a section inside /for-partners; it now
 * has its own page (and its own sign-up form), so the general partner
 * page needs a visible pointer to it. It sits directly under the hero
 * because the campaign is the highest-converting recruitment offer the
 * business runs — capped intake, stepped commission, no capital.
 */
export default function GoldPartnerTeaser() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gold-teaser',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="gold-teaser" className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
        <div className="gold-teaser relative overflow-hidden rounded-3xl border border-[#E8B44A]/30 bg-gradient-to-br from-[#0A1628] via-[#12203A] to-[#0A1628] p-7 md:p-10">
          {/* Gold glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full bg-[#E8B44A]/10 blur-[130px]" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8B44A]/30 bg-[#E8B44A]/10 text-xs font-cw-bold uppercase tracking-wider text-[#F5D48A] mb-4">
                <Crown className="w-4 h-4" strokeWidth={1.8} />
                {goldMedalProgram.name}
              </span>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-cw-bold text-white leading-tight">
                {goldMedalProgram.subtitleLead}{' '}
                <span className="text-[#F5D48A]">{goldMedalProgram.subtitleHighlight}</span>
              </h2>

              <p className="mt-3 text-sm md:text-base text-white/70 font-cw-regular leading-relaxed max-w-2xl">
                Đợt tuyển chọn riêng với{' '}
                <span className="font-cw-bold text-[#F5D48A]">
                  {goldMedalProgram.slots} suất
                </span>
                : hoa hồng tăng 25% từ đơn hàng thứ 3, tài liệu tiếp thị và
                hỗ trợ đào tạo đi kèm. Không cần vốn, không cần tồn kho.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                  href="/for-partners/gold-partner/"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-cw-bold text-base text-[#0A1628] transition-transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(100deg, #E8B44A 0%, #F5D48A 100%)' }}
                >
                  Xem chi tiết chương trình
                  <ArrowUpRight
                    className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
                    strokeWidth={2.5}
                  />
                </Link>
                <a
                  href={`tel:${PARTNER_HOTLINE}`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/20 font-cw-bold text-base text-white hover:border-white/40 hover:bg-[#14243f] transition-colors"
                >
                  Gọi ngay {PARTNER_HOTLINE}
                </a>
              </div>
            </div>

            {/* Headline numbers */}
            <div className="grid grid-cols-2 gap-3">
              {goldMedalProgram.stats.slice(0, 4).map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
                >
                  <div className="text-xl md:text-2xl font-cw-bold text-[#F5D48A] leading-none">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[11px] md:text-xs text-white/60 font-cw-regular leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
