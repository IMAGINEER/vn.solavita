'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import GetQuoteButton from '@/components/ui/get-quote-button'
import { openFormModal } from '@/lib/form-modal'
import { caseStudies } from '@/lib/data/uk-cases'
import CaseStudyCard from '@/components/cases/CaseStudyCard'

/**
 * /cases - Case studies index.
 *
 * The NG site has no verified Nigerian cases yet. Per the user's
 * directive, this page surfaces the 13 reference installations from
 * the previous UK site (Italian + German) so the consumer surface
 * still has real install imagery and system configurations. Prices
 * are not shown. Each card is linked to its detail page (noindex).
 *
 * Copy: hero is "Solar Solutions in Practice" with a global reference
 * framing; the section below introduces the installs as global project
 * references. The closing line in both blocks notes that verified
 * Nigerian installations will be added when local projects become
 * available — per NG content strategy we don't repurpose the UK cases
 * as if they were Nigerian.
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
        body="Explore solar installations and system configurations from across our global markets. See how Solavita systems are configured for different energy needs, with verified Nigerian customer projects to be added as they become available."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cases' },
        ]}
      />

      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>GLOBAL PROJECT REFERENCES</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Solar Installations <span className="text-gradient">Across Different Markets</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
              Discover reference installations featuring Solavita
              products, system components and installation approaches.
              These examples offer practical insights into solar and
              battery storage configurations for different applications.
            </p>
            <p className="mt-3 text-sm text-uk-slate font-cw-regular">
              Verified Nigerian installations will be added as local
              projects become available.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((c) => (
              <CaseStudyCard key={c.slug} caseStudy={c} linked={false} />
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
              className="px-6 py-3 rounded-full text-sm font-cw-bold bg-white text-uk-navy border border-white hover:bg-uk-teal hover:text-white hover:border-uk-teal transition-colors"
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
