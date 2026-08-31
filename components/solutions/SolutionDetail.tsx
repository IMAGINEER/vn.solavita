'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'
import { type SolutionDetail } from '@/lib/data/solutions'

gsap.registerPlugin(ScrollTrigger)

const CheckIcon = ({ className }: { className?: string }) => (
  <Check className={className ?? 'w-3 h-3'} strokeWidth={3} />
)

interface SolutionDetailSectionProps {
  detail: SolutionDetail
  /**
   * When true the image sits on the LEFT and copy on the RIGHT (so detail
   * sections alternate down the page). Default false = image right.
   */
  reverse?: boolean
  /** Section background — alternates with adjacent sections for rhythm. */
  surface?: 'white' | 'light'
}

/**
 * One detail block per solution category. The parent /solutions page
 * passes `reverse` and `surface` so the four sections read as one
 * flowing series without feeling like four identical cards.
 */
export default function SolutionDetailSection({
  detail,
  reverse = false,
  surface = 'white',
}: SolutionDetailSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        copyRef.current,
        { opacity: 0, x: reverse ? 40 : -40 },
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
        imageRef.current,
        { opacity: 0, x: reverse ? -40 : 40 },
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
  }, [reverse])

  const bgClass = surface === 'light' ? 'bg-sv-light' : 'bg-white'

  return (
    <section
      ref={sectionRef}
      id={detail.id}
      className={`relative py-16 md:py-24 ${bgClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          {/* Copy column */}
          <div ref={copyRef} className="detail-copy space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate">
              <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              {detail.eyebrow}
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              {detail.title}
            </h2>

            <p className="text-lg text-uk-slate font-cw-regular leading-relaxed max-w-xl">
              {detail.intro}
            </p>

            <ul className="space-y-3 pt-2">
              {detail.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-uk-navy"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/10 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-uk-emerald" />
                  </span>
                  <span className="font-cw-regular">{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <a
                href="#design-quote"
                className="inline-flex items-center gap-2 text-uk-teal-dark font-cw-bold hover:text-uk-teal transition-colors"
              >
                Get a design for this solution →
              </a>
            </div>
          </div>

          {/* Image column */}
          <div ref={imageRef} className="detail-image">
            <div className="relative rounded-2xl overflow-hidden border border-uk-line bg-uk-teal-soft aspect-[4/3] shadow-sm">
              <img
                src={detail.imagePath}
                alt={detail.imageAlt}
                loading="lazy"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
