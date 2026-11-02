'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import GetQuoteButton from '@/components/ui/get-quote-button'
import { openFormModal } from '@/lib/form-modal'
import {
  ngResidentialCases,
  ngCommercialCases,
} from '@/lib/data/ng-cases'
import NgCaseCard from '@/components/cases/NgCaseCard'

/**
 * /cases - Case studies index.
 *
 * Rebuilt per `docs/修改建议(2).docx` §"Cases页面" (Oct 2026): the
 * 16 reference installations are now split into two bubble-box
 * categories —
 *
 *   Residential            → 12 installs
 *   Commercial & Industrial →  4 installs
 *
 * and every card uses the new format: type badge → capacity → place.
 * The case facts themselves now come from `docs/创维光伏海外案例2.0(1).pptx`
 * (Nov 2026), which supersedes the docx figures.
 *
 * Photos: all 16 cases now carry a photo taken from the case deck
 * (`docs/创维光伏海外案例2.0(1).pptx`).
 */
export default function CasesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* Hero */}
      <PageHero
        backgroundImage="/images/hero-cases.webp"
        eyebrow="CASES"
        title="Solar Solutions in Practice"
        body="Explore solar installations and system configurations in different scenarios."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cases' },
        ]}
      />

      {/* Residential */}
      <section
        id="residential-cases"
        className="relative py-16 md:py-20 bg-white scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>RESIDENTIAL</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Home Systems, <span className="text-gradient">Configured to the Roof</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
              Reference installations on homes across Asia, Europe and
              West Africa — showing the array size, the battery stack and
              the inverter rating each site runs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngResidentialCases.map((c) => (
              <NgCaseCard key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Commercial & Industrial */}
      <section
        id="commercial-cases"
        className="relative py-16 md:py-20 bg-uk-line/30 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>COMMERCIAL &amp; INDUSTRIAL</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Business Systems, <span className="text-gradient">Scaled to the Load</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
              Reference installations for schools, trading cities,
              commercial rooftops and utility-scale storage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ngCommercialCases.map((c) => (
              <NgCaseCard key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - mirrors the homepage Section9FinalCta visual treatment */}
      <section
        className="relative py-20 md:py-28 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: 'url(/images/banner_bottom.webp)' }}
      >
        {/* Directional overlay - keeps the copy column legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.55) 35%, rgba(15,23,42,0.2) 60%, rgba(15,23,42,0) 80%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <SectionEyebrow variant="dark">MAKE A DIFFERENCE</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-white leading-tight">
            Take the Next Step Towards <span className="text-gradient">Reliable Power</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/85 font-cw-light leading-relaxed">
            Whether for your home or business, Solavita helps you find
            the right solar and battery storage solution for your energy
            needs. Tell us what you need, and our team will help you get
            started.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <GetQuoteButton onClick={openFormModal} />
            <Link
              href="/solutions/home-solar"
              className="px-6 py-3 rounded-full text-sm font-cw-bold bg-white text-uk-navy border border-white hover:bg-uk-teal hover:text-uk-navy hover:border-uk-teal transition-colors"
            >
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
