'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CircleHelp } from 'lucide-react'
import { ukArticles, ukFaqItem } from '@/lib/data/uk-articles'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Learn, Compare, Decide with Confidence" section.
 * 3 article cards + 1 FAQ card — all 4 share the same visual hierarchy
 * (visual area · tag · title · arrow). FAQ uses a light-teal variant for
 * emphasis; a separate bottom CTA routes to the full article library.
 * Uses the same card primitive as ProductSelector / CasesSection.
 */
export default function ArticlesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.article-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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
      id="learn"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background:
          'linear-gradient(100deg, rgba(20, 184, 166, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Knowledge Hub
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Learn, Compare, Decide with{' '}
            <span className="text-gradient">Confidence</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Plain-English guides, side-by-side product comparisons, and FAQs
            written by our UK engineers — so you understand every decision
            before you sign anything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ukArticles.map((article) => (
            <a
              key={article.title}
              href="#learn"
              className="article-card group rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col"
            >
              <div className="mb-4 h-40 flex items-center justify-center">
                <img
                  src={article.imagePath}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-auto object-contain"
                />
              </div>
              <span className="text-xs font-cw-bold tracking-wider text-uk-teal-dark">
                {article.tag}
              </span>
              <h3 className="mt-2 text-lg font-cw-bold text-uk-navy group-hover:text-uk-teal-dark transition-colors">
                {article.title}
              </h3>
              <span className="mt-auto pt-4 text-uk-teal text-sm font-cw-bold transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          ))}

          {/* FAQ card — same hierarchy, light-teal variant, icon visual */}
          <a
            href="#faq"
            className="article-card group rounded-2xl p-6 bg-uk-teal-soft border border-uk-teal/30 hover:shadow-md transition-all flex flex-col"
          >
            <div className="mb-4 h-40 flex items-center justify-center text-uk-teal-dark">
              <CircleHelp className="w-16 h-16" strokeWidth={1.4} />
            </div>
            <span className="text-xs font-cw-bold tracking-wider text-uk-teal-dark">
              FAQ
            </span>
            <h3 className="mt-2 text-lg font-cw-bold text-uk-navy">
              {ukFaqItem.q}
            </h3>
            <span className="mt-auto pt-4 text-uk-teal-dark text-sm font-cw-bold transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        <div className="text-center mt-10">
          <a
            href="#learn"
            className="inline-flex items-center gap-2 text-uk-teal-dark font-cw-bold hover:text-uk-teal transition-colors"
          >
            Browse All Articles →
          </a>
        </div>
      </div>
    </section>
  )
}
