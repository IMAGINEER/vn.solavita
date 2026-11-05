'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BookOpen,
  MessagesSquare,
  Phone,
  Ruler,
  ShieldCheck,
} from 'lucide-react'
import {
  partnerTraining,
  PARTNER_CONTACT,
  PARTNER_HOTLINE,
} from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

const icons = {
  book: BookOpen,
  messages: MessagesSquare,
  ruler: Ruler,
} as const

/**
 * "Ba chương trình đào tạo" — the training block from page 3 of the VN
 * recruitment brochure.
 *
 * The brochure's promise is that a partner needs no prior background:
 * product knowledge, sales consulting and market development are
 * taught; a dedicated Zalo group answers questions in real time; and
 * the on-site survey practice includes hands-on roof measurement.
 */
export default function PartnerTraining() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.training-card',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="partner-training"
      className="relative py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Đào tạo & hỗ trợ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Không cần nền tảng —{' '}
            <span className="text-gradient">làm chủ nhanh chóng</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Ba chương trình đào tạo do chuyên gia phụ trách, đồng hành cùng bạn
            từ lúc tìm được khách hàng đầu tiên.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {partnerTraining.map((program) => {
            const Icon = icons[program.icon]
            return (
              <div
                key={program.title}
                className="training-card rounded-3xl border border-uk-line bg-sv-light p-7 md:p-8"
              >
                <span className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-5">
                  <Icon className="w-6 h-6" strokeWidth={1.6} />
                </span>
                <h3 className="text-xl font-cw-bold text-uk-navy leading-snug">
                  {program.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-uk-slate font-cw-regular leading-relaxed">
                  {program.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Support card */}
        <div className="training-card rounded-3xl border border-uk-line bg-gradient-to-br from-uk-navy to-[#14243f] p-7 md:p-9">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            <div className="md:col-span-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/10 text-xs font-cw-bold uppercase tracking-wider text-white/85 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.8} />
                Cam kết chất lượng
              </span>
              <h3 className="text-2xl md:text-3xl font-cw-bold text-white leading-tight">
                SKYWORTH cam kết uy tín — chất lượng từ sản phẩm đến vận hành và
                thi công
              </h3>
              <p className="mt-4 text-sm md:text-base text-white/70 font-cw-regular leading-relaxed">
                Bạn không phải lo phần kỹ thuật: toàn bộ phương án hệ thống,
                khảo sát, thiết kế và chỉ đạo thi công do tổng bộ thực hiện.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h4 className="text-sm font-cw-bold uppercase tracking-wider text-white/85 mb-4">
                Liên hệ nhanh
              </h4>
              <ul className="space-y-3 text-sm text-white/75 font-cw-regular">
                <li className="flex items-center justify-between gap-3">
                  <span>Hotline đối tác</span>
                  <a
                    href={`tel:${PARTNER_HOTLINE}`}
                    className="inline-flex items-center gap-1.5 font-cw-bold text-white hover:text-uk-emerald transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                    {PARTNER_HOTLINE}
                  </a>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Đầu mối</span>
                  <span className="font-cw-bold text-white">{PARTNER_CONTACT.name}</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Điện thoại</span>
                  <a
                    href={PARTNER_CONTACT.phoneHref}
                    className="font-cw-bold text-white hover:text-uk-emerald transition-colors"
                  >
                    {PARTNER_CONTACT.phone}
                  </a>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Email</span>
                  <a
                    href={`mailto:${PARTNER_CONTACT.email}`}
                    className="font-cw-bold text-white hover:text-uk-emerald transition-colors break-all text-right"
                  >
                    {PARTNER_CONTACT.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
