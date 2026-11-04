'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BadgeCheck } from 'lucide-react'
import { aboutCertifications } from '@/lib/data/about'
import TbdText from '@/components/ui/tbd-text'

gsap.registerPlugin(ScrollTrigger)

const BadgeIcon = ({ className }: { className?: string }) => (
  <BadgeCheck className={className ?? 'w-5 h-5'} strokeWidth={1.6} />
)

/**
 * Technology / Expertise - explains the engineering credentials behind
 * Solavita and lists the certifications that apply. The list itself is
 * data-driven from `aboutCertifications` in `lib/data/about.ts` so NG
 * pages render TBDs until business confirms which certifications apply
 * to the Vietnamese market (no other market's certification may be
 * carried over without verification).
 *
 * The right-hand image is the existing product render used on the
 * homepage /solutions section - reusing it keeps the asset catalogue
 * small while still giving the section a focal point.
 */
export default function Technology() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tech-copy',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
      gsap.fromTo(
        '.tech-image',
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="relative py-16 md:py-24 bg-sv-light dark:bg-sv-darker"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="tech-copy space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate">
              <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              Kỹ thuật SKYWORTH
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Kỹ thuật{' '}
              <span className="text-gradient">bền vững qua nhiều thập kỷ</span>
            </h2>

            <p className="text-lg text-uk-slate font-cw-regular leading-relaxed max-w-xl">
              Mỗi hệ thống Solavita được xây dựng từ{' '}
              <TbdText text="linh kiện Tier-1" inline />{' '}
              do Tập đoàn SKYWORTH thiết kế — cùng chuỗi cung ứng đang phục vụ
              hàng triệu hộ gia đình trên thế giới với TV, thiết bị gia dụng và
              hệ thống nhà thông minh.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {aboutCertifications.map((c) => (
                <li
                  key={c.label}
                  className="rounded-xl border border-uk-line bg-white p-4 flex items-start gap-3"
                >
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-uk-teal-soft flex items-center justify-center flex-shrink-0 text-uk-teal-dark">
                    <BadgeIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm font-cw-bold text-uk-navy">
                      {c.label}
                    </div>
                    <div className="text-xs text-uk-slate mt-0.5 leading-snug">
                      {c.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="tech-image">
            <div className="relative rounded-3xl overflow-hidden border border-uk-line bg-uk-teal-soft aspect-[4/5] shadow-sm">
              <img
                src="/images/electronic.webp"
                alt="Chi tiết hệ thống Solavita"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
