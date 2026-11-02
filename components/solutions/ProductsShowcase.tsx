'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import SectionEyebrow from '@/components/ui/section-eyebrow'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProductsShowcase — the "③产品简介" block.
 *
 * Per `docs/修改建议(2).docx` §"Solutions - Residential - 详情页" and
 * §"Solutions - Commercial & Industrial - 详情页":
 *
 *   气泡框标题：Products
 *   Module            → "Power your world reliably."
 *   Inverter          → "Intelligent control."
 *   Battery           → "Reliable backup."
 *   C&I ESS (business only) → "One Cabinet. Real Returns."
 *
 * Each card links to its own detail page under /products. The card
 * images are still pending from the reference folder, so they render
 * the neutral `ImagePlaceholder` until the assets arrive.
 */

export interface ShowcaseProduct {
  /** Product title on the card, e.g. "Module". */
  title: string
  /** One-liner under the title, e.g. "Power your world reliably." */
  tagline: string
  /** Detail-page href, e.g. "/products/module". */
  href: string
  /** What the image should show. */
  imageDescription: string
  /** Optional image path — set once the reference assets land. */
  imagePath?: string
}

interface ProductsShowcaseProps {
  products: ShowcaseProduct[]
  /** Anchor id. */
  id?: string
}

export default function ProductsShowcase({
  products,
  id = 'products-showcase',
}: ProductsShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.showcase-product-card',
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
      id={id}
      className="relative py-16 md:py-24 bg-white scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The docx's 气泡框标题 is the section eyebrow — the standard
            `SectionEyebrow`, not a bespoke pill. */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <SectionEyebrow>PRODUCTS</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            The Components <span className="text-gradient">Behind Every System</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Modules, inverters, batteries and the All-in-One ESS — each
            matched, tested and shipped as part of the same system.
          </p>
        </div>

        <div
          className={
            products.length > 3
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6'
              : 'grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6'
          }
        >
          {products.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="showcase-product-card group flex flex-col rounded-2xl border border-uk-line bg-white overflow-hidden hover:border-uk-teal/50 hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-44 md:h-48 bg-uk-line/30">
                {p.imagePath ? (
                  <img
                    src={p.imagePath}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <ImagePlaceholder
                    description={p.imageDescription}
                    className="!rounded-none !border-0"
                  />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-cw-bold text-uk-navy leading-snug">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm text-uk-slate font-cw-regular flex-1">
                  {p.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-cw-bold text-uk-teal-dark group-hover:text-uk-teal transition-colors">
                  Learn more
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* The docx's "View More Products" tail link is intentionally
            gone: there is no /products hub any more (removed Oct 2026)
            and every product already has a card in the grid above, so
            the link had no destination that showed anything new. */}
      </div>
    </section>
  )
}
