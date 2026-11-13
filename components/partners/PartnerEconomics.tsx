'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Banknote,
  Check,
  Coins,
  Gauge,
  Percent,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { partnerPayoutTerms } from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Mức hoa hồng" — how the partner commission works.
 *
 * This page is the *overview*: it explains the model (commission per
 * watt of the system actually signed, a flat rate fixed by the
 * partner's role, and the 50/50 payout split) without publishing the
 * rates.
 *
 * The concrete numbers — the per-watt rates for the individual and
 * company roles and the income projection — belong to the "Chương
 * trình Đối tác Vàng" campaign page, which is where the recruitment
 * push happens. This card links there.
 *
 * The installer track is deliberately shown without a number: the
 * brochure puts installers under the "Energy Partner Solavita" arm
 * (the group surveys, designs and installs) but prints no rate for
 * them, so the placeholder stays visible rather than guessing.
 */
export default function PartnerEconomics() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.economics-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
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
      id="partner-economics"
      className="relative py-16 md:py-24 bg-sv-light overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[460px] h-[460px] rounded-full bg-uk-teal-soft/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Mức hoa hồng
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Hoa hồng theo mỗi watt —{' '}
            <span className="text-gradient">rõ ràng theo vai trò</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Hoa hồng tính theo công suất thực tế của từng hệ thống bạn ký
            được; mức cố định theo vai trò — cá nhân hoặc doanh nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* The model */}
          <div className="economics-card rounded-3xl bg-white border border-uk-line shadow-sm p-7 md:p-9">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark">
                <Percent className="w-5 h-5" strokeWidth={1.8} />
              </span>
              <h3 className="text-xl font-cw-bold text-uk-navy">
                Cách tính hoa hồng
              </h3>
            </div>
            <dl className="space-y-3.5">
              {[
                {
                  icon: Gauge,
                  k: 'Tính theo công suất thực tế',
                  v: 'Đồng trên mỗi watt',
                },
                {
                  icon: TrendingUp,
                  k: 'Vai trò',
                  v: 'Cá nhân / Doanh nghiệp',
                },
                {
                  icon: Wallet,
                  k: 'Mức hoa hồng',
                  v: 'Cố định theo vai trò',
                },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex items-center justify-between gap-4 py-3 border-b border-uk-line/60 last:border-0"
                >
                  <dt className="flex items-center gap-2.5 text-sm text-uk-navy font-cw-regular">
                    <row.icon
                      className="w-4 h-4 text-uk-emerald flex-shrink-0"
                      strokeWidth={2}
                    />
                    {row.k}
                  </dt>
                  <dd className="text-sm font-cw-bold text-uk-teal-dark whitespace-nowrap">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 pt-5 border-t border-uk-line/60 text-xs text-uk-slate font-cw-regular leading-relaxed">
              Con số cụ thể cho từng vai trò được công bố trong{' '}
              <Link
                href="/for-partners/gold-partner/"
                className="font-cw-bold text-uk-teal-dark hover:underline"
              >
                Chương trình Đối tác Vàng
              </Link>
              .
            </p>
          </div>

          {/* Payout terms */}
          <div className="economics-card rounded-3xl bg-white border border-uk-line shadow-sm p-7 md:p-9">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark">
                <Banknote className="w-5 h-5" strokeWidth={1.8} />
              </span>
              <h3 className="text-xl font-cw-bold text-uk-navy">
                Cách bạn được trả tiền
              </h3>
            </div>
            <ul className="space-y-3">
              {partnerPayoutTerms.map((term) => (
                <li
                  key={term}
                  className="flex items-start gap-2.5 text-sm md:text-base text-uk-navy font-cw-regular leading-relaxed"
                >
                  <Check
                    className="w-4 h-4 mt-1 text-uk-emerald flex-shrink-0"
                    strokeWidth={2.5}
                  />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 pt-5 border-t border-uk-line/60 text-xs text-uk-slate font-cw-regular leading-relaxed">
              Hoa hồng được tính trên công suất thực tế của hệ thống và chi
              trả theo lịch trên.
            </p>
          </div>

          {/* Installer track */}
          <div className="economics-card rounded-3xl bg-white border border-uk-line shadow-sm p-7 md:p-9">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark">
                <Coins className="w-5 h-5" strokeWidth={1.8} />
              </span>
              <h3 className="text-xl font-cw-bold text-uk-navy">
                Đối tác lắp đặt
              </h3>
            </div>
            <p className="text-sm md:text-base text-uk-slate font-cw-regular leading-relaxed">
              Đối tác lắp đặt làm việc cùng Energy Partner Solavita: Solavita
              khảo sát, thiết kế và giám sát thi công, đối tác nhận công trình
              theo thỏa thuận từng dự án.
            </p>
            {/* The per-project payout line is intentionally absent: the
                figure is not confirmed for Vietnam, and a TBD here read
                as a placeholder on a page whose job is to recruit
                installers. The survey/design text above is the whole
                public claim until the rate is signed off. */}
          </div>
        </div>
      </div>
    </section>
  )
}
