'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'
import { ukProducts, type UkProduct } from '@/lib/data/uk-products'

gsap.registerPlugin(ScrollTrigger)

export default function ProductSelector({
  onOpenForm,
  planDetailsAnchorFor,
}: {
  /**
   * Per-product anchor target for the "Plan Details →" link. When
   * provided, the link jumps to the matching detail section on the
   * current page. When omitted, defaults to `/solutions` - the
   * homepage behaviour.
   */
  planDetailsAnchorFor?: (productId: UkProduct['id']) => string
  /**
   * When provided, the bottom CTA renders as a button that opens the
   * global form modal with the label "Get Free Plan →" - used by
   * /solutions. When omitted, the CTA stays an anchor link labelled
   * "Plan Details →" (homepage behaviour).
   */
  onOpenForm?: () => void
} = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<UkProduct['id']>('pro')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.product-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.product-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="products" className="relative py-16 md:py-24 bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="product-title text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Choose your system
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold mb-4 text-uk-navy leading-tight">
            Find Your{' '}
            <span className="text-gradient">Perfect Solar Solution</span>
          </h2>
          <p className="text-base md:text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto">
            From simple start to complete energy independence. All prices include
            installation and VAT.
          </p>
        </div>

        {/* Product Cards Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="product-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {ukProducts.map((product) => {
            const isSelected = selectedProduct === product.id
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`product-card relative flex flex-col rounded-2xl p-6 cursor-pointer transition-all duration-500 group bg-white border ${
                  isSelected
                    ? 'border-uk-teal shadow-lg shadow-uk-teal/10 scale-[1.02]'
                    : 'border-uk-line hover:border-uk-teal/50 hover:shadow-md'
                }`}
              >
                {/* "Popular" badge (Figma: emerald pill, top-right) */}
                {product.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-uk-emerald text-white text-xs font-cw-bold tracking-wider">
                    POPULAR
                  </div>
                )}

                {/* Product name */}
                <h3 className="text-lg font-cw-bold text-uk-navy">{product.name}</h3>
                <div className="text-xs text-uk-slate mt-0.5">{product.subtitle}</div>

                {/* Power & Storage */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-uk-teal font-cw-bold text-base">{product.power}</span>
                  {product.storage !== '-' && (
                    <>
                      <span className="text-uk-slate">/</span>
                      <span className="text-uk-teal font-cw-bold text-base">{product.storage}</span>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mt-4 pr-28 relative z-[1]">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-uk-navy">
                      <Check
                        className="w-4 h-4 text-uk-emerald flex-shrink-0 mt-0.5"
                        strokeWidth={3}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Product image - anchored to the bottom-right corner of the card */}

                {/* CTA - pinned to the bottom via mt-auto */}
                <div className="mt-auto pt-4 border-t border-uk-line relative">
                  {/* Product image - bottom edge sits on the divider line, anchored to the right */}
                  <img
                    src={product.imagePath}
                    alt={`${product.name} solar system`}
                    loading="lazy"
                    className={`absolute right-4 bottom-[calc(100%+8px)] ${
                    product.id === 'pro' ? 'w-24' : 'h-24'
                  } object-contain pointer-events-none`}
                  />
                  {onOpenForm ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenForm()
                      }}
                      className={`mt-3 w-full py-2.5 rounded-lg text-sm font-cw-bold text-center transition-all duration-300 block cursor-pointer ${
                        isSelected
                          ? 'btn-gradient text-white'
                          : 'border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-white hover:-translate-y-0.5 hover:shadow-md'
                      }`}
                    >
                      Get Free Plan →
                    </button>
                  ) : (
                    <a
                      href={planDetailsAnchorFor ? planDetailsAnchorFor(product.id) : '/solutions'}
                      onClick={(e) => e.stopPropagation()}
                      className={`mt-3 w-full py-2.5 rounded-lg text-sm font-cw-bold text-center transition-all duration-300 block ${
                        isSelected
                          ? 'btn-gradient text-white'
                          : 'border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-white hover:-translate-y-0.5 hover:shadow-md'
                      }`}
                    >
                      Plan Details →
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}