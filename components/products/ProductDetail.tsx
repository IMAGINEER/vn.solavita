'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import TbdText from '@/components/ui/tbd-text'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import CTA from '@/components/solutions/CTA'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PRODUCT_SPEC_TBD, type Product, type ProductVariant } from '@/lib/data/products'

/**
 * ProductDetail — the shared layout for every `/products/[slug]` page.
 *
 * Structure follows `docs/修改建议.docx` §"Products - … - 详情页":
 *   ① image  ② advantage breakdown  ③ brief spec table
 *
 * The source PPTX supplies three inverter families, so the variant
 * switcher at the top of the spec block is how the user moves between
 * the single-phase hybrid, the three-phase hybrid and the off-grid
 * unit without leaving the page.
 */

function SpecTable({
  variant,
}: {
  variant: ProductVariant
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-uk-line bg-white">
      <table className="w-full text-sm border-collapse min-w-[560px]">
        <thead>
          <tr className="bg-uk-line/30">
            {variant.columns.map((col, i) => (
              <th
                key={col}
                scope="col"
                className={`px-4 py-3 font-cw-bold text-uk-navy text-left whitespace-nowrap ${
                  i === 0 ? 'min-w-[180px]' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variant.rows.map((row, ri) => (
            <tr
              key={row.label}
              className={ri % 2 === 0 ? 'bg-white' : 'bg-uk-line/10'}
            >
              <th
                scope="row"
                className="px-4 py-3 text-left font-cw-regular text-uk-slate whitespace-nowrap"
              >
                {row.label}
              </th>
              {row.values.map((value, vi) => (
                <td
                  key={vi}
                  className="px-4 py-3 font-cw-bold text-uk-navy align-top"
                >
                  {value === null ? (
                    <TbdText
                      text={PRODUCT_SPEC_TBD}
                      inline
                      className="text-[11px] font-cw-regular"
                    />
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ProductDetail({ product }: { product: Product }) {
  const [activeVariant, setActiveVariant] = useState(0)
  const variant = product.variants[activeVariant]

  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* ① image + headline */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-uk-teal/5 to-uk-emerald/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <SectionEyebrow>PRODUCTS</SectionEyebrow>
              <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
                {product.name}
              </h1>
              <p className="mt-3 text-lg font-cw-bold text-uk-teal-dark">
                {product.tagline}
              </p>
              <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
                {product.description}
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {product.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-uk-line bg-white px-4 py-3 text-center"
                  >
                    <div className="text-lg font-cw-bold text-uk-teal-dark">
                      {s.value}
                    </div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-uk-slate font-cw-regular">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ImagePlaceholder
              description={product.imageDescription}
              aspectRatio="4/3"
              className="!rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ② advantage breakdown */}
      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>ADVANTAGES</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Why <span className="text-gradient">Solavita {product.name}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.advantages.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-uk-line bg-white p-6 h-full"
              >
                <h3 className="text-base font-cw-bold text-uk-navy leading-snug">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {a.body}
                </p>
              </div>
            ))}
          </div>

          {product.extraAdvantages && product.extraAdvantages.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {product.extraAdvantages.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-uk-emerald/30 bg-uk-emerald/5 p-6 h-full"
                >
                  <h3 className="text-base font-cw-bold text-uk-navy leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          {product.certifications && (
            <div className="mt-10 rounded-2xl border border-uk-line bg-uk-line/20 p-6">
              <h3 className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
                {product.certifications.title}
              </h3>
              <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-y-2">
                {product.certifications.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-uk-navy font-cw-regular"
                  >
                    <Check
                      className="w-4 h-4 text-uk-emerald flex-shrink-0 mt-0.5"
                      strokeWidth={3}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ③ spec table */}
      <section
        id="specs"
        className="relative py-16 md:py-20 bg-uk-line/30 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>TECHNICAL DATA</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Specifications <span className="text-gradient">at a Glance</span>
            </h2>
          </div>

          {product.variants.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveVariant(i)}
                  className={`px-5 py-2.5 rounded-full text-sm font-cw-bold border transition-all duration-300 ${
                    i === activeVariant
                      ? 'border-uk-teal bg-uk-teal text-white shadow-md shadow-uk-teal/20'
                      : 'border-uk-line bg-white text-uk-slate hover:border-uk-teal/40 hover:text-uk-teal-dark'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-lg font-cw-bold text-uk-navy">{variant.name}</h3>
            <p className="mt-1 text-sm font-cw-bold text-uk-teal-dark">
              {variant.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-3xl mx-auto">
            {variant.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-uk-line bg-white px-4 py-3 text-center"
              >
                <div className="text-base font-cw-bold text-uk-teal-dark">
                  {s.value}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-uk-slate font-cw-regular">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <SpecTable variant={variant} />

          <p className="mt-6 text-xs text-uk-slate font-cw-regular leading-relaxed max-w-4xl mx-auto">
            Figures marked in red are pending confirmation from the
            manufacturer&apos;s full datasheet and will be published once
            verified.
          </p>
        </div>
      </section>

      {/* Learn more → Support downloads */}
      <section className="relative py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/support#download"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-gradient text-sm font-cw-bold text-white"
          >
            Download specs &amp; manuals
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <p className="mt-4 text-sm text-uk-slate font-cw-regular">
            Product datasheets, manuals and warranty documents for every
            Solavita component.
          </p>
        </div>
      </section>

      <CTA
        eyebrow="Ready when you are"
        title={
          <>
            Not a Solavita customer yet?
            <br />
            <span className="text-gradient">Start with a free design.</span>
          </>
        }
        description="If you're still weighing your options, our team can prepare a free, no-obligation design that shows how solar panels, battery storage or a full home energy system would fit your home."
      />

      <Footer />
    </main>
  )
}
