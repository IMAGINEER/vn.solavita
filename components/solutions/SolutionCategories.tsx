'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sun, Battery, Home, Plug, ArrowRight } from 'lucide-react'
import {
  solutionCategories,
  type SolutionCategory,
} from '@/lib/data/solutions'

gsap.registerPlugin(ScrollTrigger)

/* Lucide icons - theme-neutral via currentColor. The wrapping
   `text-uk-teal-dark` token controls the tint. */
const iconFor = (icon: SolutionCategory['icon']) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (icon) {
    case 'sun':
      return <Sun {...props} />
    case 'battery':
      return <Battery {...props} />
    case 'home':
      return <Home {...props} />
    case 'plug':
      return <Plug {...props} />
  }
}

/**
 * Four-card grid (2×2 desktop, 1 column mobile) - the four solution
 * categories. Each card jumps to the matching detail section via anchor
 * id, mirroring how the homepage `#products` section is reached.
 */
export default function SolutionCategories() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.solution-cat-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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
      id="solution-categories"
      className="relative py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Find your system
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Find the right{' '}
            <span className="text-gradient">solution for your home</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Start where you are - add more later. Every Solavita system is
            designed to grow with your home and your energy needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutionCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="solution-cat-card group rounded-2xl p-6 lg:p-8 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex items-start gap-5"
            >
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark flex-shrink-0">
                {iconFor(cat.icon)}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
                  {cat.eyebrow}
                </span>
                <h3 className="mt-1 text-xl font-cw-bold text-uk-navy leading-tight">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {cat.short}
                </p>

                {cat.metric && (
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-emerald">
                    <span className="w-1.5 h-1.5 rounded-full bg-uk-emerald" />
                    {cat.metric}
                  </div>
                )}
              </div>

              <span className="hidden sm:inline-flex flex-shrink-0 self-center w-9 h-9 rounded-full border border-uk-line items-center justify-center text-uk-slate group-hover:text-uk-teal group-hover:border-uk-teal transition-colors">
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
