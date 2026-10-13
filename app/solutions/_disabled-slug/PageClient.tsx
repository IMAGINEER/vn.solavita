'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TbdText from '@/components/ui/tbd-text'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import PageHero from '@/components/ui/page-hero'
import TrustBar from '@/components/TrustBar'
import type { SolutionDetail } from '@/lib/data/solutions'
import { openFormModal } from '@/lib/form-modal'

interface SolutionDetailPageProps {
  detail: SolutionDetail
}

/**
 * /solutions/[slug]/ - Nigeria per-tier detail page.
 *
 * Composition (top → bottom):
 *   Header → Breadcrumb → Hero (eyebrow + title + intro + 6 KPIs +
 *   image) → Highlights icon row → Manufacturer intro → Spec table →
 *   Box contents → Gallery → FAQ accordion → Final CTA → Footer.
 *
 * The per-slug tier data lives in `lib/data/solutions.ts`. No
 * per-tier image asset is shipped - the hero image is replaced by a
 * unified `ImagePlaceholder` (every photo is TBD for the NG market
 * per the strategy). The 6-number KPI strip uses the data file's
 * `kpis[]` array; no currency claims are made.
 */
export default function SolutionDetailPage({ detail }: SolutionDetailPageProps) {
  return (
    <main className="min-h-screen bg-sv-light">
      <Header logoHref="/" />

      {/* Hero — uses the same UK pattern: background image + dark gradient
          overlay + eyebrow pill + breadcrumb. We pick the matching
          hero-<solutions>.webp asset; if the page's content shifts
          per tier in the future, override the backgroundImage. */}
      <PageHeroForTier detail={detail} />

      {/* Product body (image + buy box + highlights) */}
      <section className="relative py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionEyebrow>{detail.eyebrow.toUpperCase()}</SectionEyebrow>
              <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
                {detail.title}
              </h1>
              {detail.metric && (
                <p className="mt-3 text-base font-cw-bold text-uk-emerald">
                  {detail.metric}
                </p>
              )}
              <p className="mt-5 text-base lg:text-lg text-uk-slate font-cw-regular leading-relaxed">
                {detail.intro}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openFormModal}
                  className="btn-gradient px-5 py-2.5 rounded-full text-sm font-cw-bold text-white"
                >
                  Get Free Quote →
                </button>
                <a
                  href="/contact-us"
                  className="px-5 py-2.5 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-white transition-colors"
                >
                  Talk to Our Team
                </a>
              </div>
              {/* KPI strip */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {detail.kpis.map((kpi, idx) => (
                  <div key={idx} className="rounded-2xl border border-uk-line bg-uk-line/30 p-4 text-center">
                    <p className="text-base font-cw-bold text-uk-teal-dark">{kpi.value}</p>
                    <p className="mt-1 text-[11px] font-cw-regular text-uk-slate uppercase tracking-wider">
                      {kpi.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <ImagePlaceholder
                description={`${detail.title} system in a Nigerian residential or commercial setting`}
                aspectRatio="4/3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <HighlightsRow highlights={detail.highlights} />

      {/* Manufacturer intro */}
      <section className="relative py-12 lg:py-16 bg-sv-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <SectionEyebrow>FROM THE MANUFACTURER</SectionEyebrow>
          </div>
          <h2 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy leading-tight text-center">
            From the manufacturer
          </h2>
          <p className="mt-5 text-base lg:text-lg text-uk-slate font-cw-regular leading-relaxed">
            {detail.intro}
          </p>
        </div>
      </section>

      {/* Spec table */}
      <section className="relative py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <SectionEyebrow>TECHNICAL DETAILS</SectionEyebrow>
          </div>
          <h2 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy leading-tight text-center">
            Technical Details
          </h2>
          <div className="mt-6 rounded-2xl border border-uk-line bg-white overflow-hidden">
            <table className="w-full">
              <tbody>
                {detail.specTable.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-uk-line/20' : 'bg-white'}
                  >
                    <td className="px-4 py-3 text-sm font-cw-bold text-uk-navy w-1/3 border-r border-uk-line/50">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-sm text-uk-slate font-cw-regular">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-uk-slate font-cw-regular">
            Installation and warranty details:{' '}
            <TbdText text="Approved NG installation scope and warranty terms" inline />
          </p>
        </div>
      </section>

      {/* Box contents */}
      <section className="relative py-12 lg:py-16 bg-uk-line/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <SectionEyebrow>IN THE PACKAGE</SectionEyebrow>
          </div>
          <h2 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy leading-tight text-center">
            What's in the package
          </h2>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {detail.boxContents.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-uk-navy">
                <Check className="w-4 h-4 text-uk-emerald flex-shrink-0 mt-0.5" strokeWidth={3} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery (placeholders) */}
      <section className="relative py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <SectionEyebrow>LIFESTYLE GALLERY</SectionEyebrow>
          </div>
          <h2 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy leading-tight text-center">
            Lifestyle gallery
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {detail.lifestyleGallery.map((image, idx) => (
              <ImagePlaceholder
                key={idx}
                description={`${detail.title} — ${image.label ?? 'lifestyle visual'}`}
                aspectRatio="4/3"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar (TBD line) */}
      <TrustBar />

      {/* FAQ */}
      <FaqSection items={detail.faqs} tierTitle={detail.title} />

      {/* Final CTA */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-uk-teal/5 to-uk-emerald/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Ready for {detail.title} on{' '}
            <span className="text-gradient">your home?</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Tell us about your home, your appliances and your backup
            requirements and we will put together a tailored
            recommendation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={openFormModal}
              className="btn-gradient px-6 py-3 rounded-full text-sm font-cw-bold text-white"
            >
              Get Free Quote →
            </button>
            <a
              href="/contact-us"
              className="px-6 py-3 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-white transition-colors"
            >
              Talk to Our Team
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function HighlightsRow({ highlights }: { highlights: string[] }) {
  if (highlights.length === 0) return null
  return (
    <section className="relative py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {highlights.map((h, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-uk-line bg-white p-5 lg:p-6 flex items-start gap-3 hover:border-uk-teal/40 transition-colors"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-uk-emerald/15 flex items-center justify-center">
                <Check className="w-4 h-4 text-uk-emerald" strokeWidth={3} />
              </span>
              <span className="text-sm lg:text-base font-cw-regular text-uk-navy leading-snug">
                {h}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection({
  items,
  tierTitle,
}: {
  items: { q: string; a: string }[]
  tierTitle: string
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section id="faq" className="relative py-12 lg:py-16 bg-sv-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <SectionEyebrow>FAQ</SectionEyebrow>
        </div>
        <h2 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy leading-tight text-center">
          {tierTitle} — Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-3">
          {items.map((item, idx) => {
            const open = openIdx === idx
            const tbdMatch = item.a.match(/TBD — (.+)/)
            return (
              <div
                key={idx}
                className="rounded-2xl border border-uk-line bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  aria-expanded={open}
                >
                  <span className="text-sm md:text-base font-cw-bold text-uk-navy">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-uk-slate flex-shrink-0 transition-transform duration-200 ${
                      open ? 'rotate-180' : ''
                    }`}
                    strokeWidth={2}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm text-uk-slate font-cw-regular leading-relaxed">
                    {tbdMatch ? (
                      <TbdText text={tbdMatch[1]} />
                    ) : (
                      item.a
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * PageHeroForTier — per-tier page hero. Wraps the shared <PageHero> with
 * a tier-specific background image and a "Get Free Quote" CTA. Uses
 * the same dark-overlay + eyebrow pill pattern as every other hero on
 * the site so the page feels consistent with the rest of the NG
 * marketing surface.
 */
function PageHeroForTier({ detail }: { detail: SolutionDetail }) {
  return (
    <PageHero
      backgroundImage="/images/hero-solutions.webp"
      eyebrow={detail.eyebrow.toUpperCase()}
      title={`${detail.title}*`}
      body={detail.intro}
      primaryCta={{ label: 'Get Free Quote →', onClick: openFormModal }}
      secondaryCta={{ label: 'Talk to Our Team', href: '/contact-us' }}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Solutions', href: '/solutions/' },
        { label: detail.title },
      ]}
    />
  )
}
