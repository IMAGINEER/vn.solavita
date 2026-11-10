'use client'

import {
  Activity,
  Coins,
  ShieldCheck,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero, { HeroPillsRow } from '@/components/ui/page-hero'
import FaqSection from '@/components/solutions/FaqSection'
import CTA from '@/components/solutions/CTA'
import BusinessTypeSelector from '@/components/solutions/cni/BusinessTypeSelector'
import SystemPackages from '@/components/solutions/cni/SystemPackages'
import BusinessApplications from '@/components/solutions/cni/BusinessApplications'
import TechnologySection from '@/components/solutions/cni/TechnologySection'
import BusinessBenefits from '@/components/solutions/cni/BusinessBenefits'
import TailoredAssessment from '@/components/solutions/cni/TailoredAssessment'
import RoiEstimator from '@/components/solutions/cni/RoiEstimator'
import DeliverySupport from '@/components/solutions/cni/DeliverySupport'
import RealProjects from '@/components/solutions/cni/RealProjects'
import EnergyManagement from '@/components/solutions/cni/EnergyManagement'
import { openFormModal } from '@/lib/form-modal'
import { cniFaqs } from '@/lib/data/cni'

/**
 * /solutions/business-solar — the Commercial & Industrial page.
 *
 * Rebuilt in Nov 2026 from a product catalogue into a selling page for
 * businesses. The old page led with three package cards and a brand
 * promise; the new one walks the buying order a business actually
 * follows:
 *
 *   1. Hero                     — what the business gets
 *   2. Solutions by business type — "which one is mine?"
 *   3. System packages          — the configurations, with capacities
 *   4. Business applications    — the four industry scenarios
 *   5. System architecture      — the components + the product tabs
 *   6. Business benefits        — resilience / cost / reliable design
 *   7. Tailored solution        — the five-question energy profile
 *   8. Investment & ROI         — the savings estimator
 *   9. Project delivery         — how it is delivered and supported
 *  10. Real projects            — what has actually been built
 *  11. Smart energy management  — dashboard + app
 *  12. FAQ + final CTA
 *
 * The copy is English — this page is the last English page on the
 * Vietnam site and its Vietnamese pass is still open.
 */

export default function BusinessSolarPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* ① Hero — business value, not a product line */}
      <PageHero
        backgroundImage="/images/business_solar_1600x856.webp"
        eyebrow="COMMERCIAL & INDUSTRIAL SOLAR"
        title="Smarter Energy. Stronger Business."
        body="Integrated solar and energy storage solutions designed to reduce operating costs, improve energy resilience and support your business growth."
        primaryCta={{
          label: 'Get a Free Energy Assessment',
          onClick: () => openFormModal({ solutionType: 'business' }),
        }}
        secondaryCta={{
          label: 'Explore Our Solutions',
          href: '#solutions-by-business-type',
        }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'For Business' },
        ]}
        /* The retail-building photo is bright (sky, white facade, pale
           pavement), so the copy column needs a heavier mask than the
           default plus a soft darkening along the bottom edge. */
        overlay="linear-gradient(to right, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.74) 32%, rgba(15,23,42,0.3) 60%, rgba(15,23,42,0) 80%), linear-gradient(to top, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0) 40%)"
        compact
      >
        <HeroPillsRow
          pills={[
            {
              icon: <Coins className="w-4 h-4 text-uk-emerald" strokeWidth={2} />,
              text: 'Lower operating costs',
            },
            {
              icon: (
                <ShieldCheck className="w-4 h-4 text-uk-emerald" strokeWidth={2} />
              ),
              text: 'Reliable power supply',
            },
            {
              icon: (
                <Activity className="w-4 h-4 text-uk-emerald" strokeWidth={2} />
              ),
              text: 'Intelligent energy management',
            },
          ]}
        />
      </PageHero>

      {/* ② Solutions by business type */}
      <BusinessTypeSelector />

      {/* ③ System packages */}
      <SystemPackages />

      {/* ④ Business applications */}
      <BusinessApplications />

      {/* ⑤ System architecture + ⑩ product details */}
      <TechnologySection />

      {/* ⑥ Business benefits */}
      <BusinessBenefits />

      {/* ⑦ Tailored solution — the five-question energy profile */}
      <TailoredAssessment />

      {/* ⑧ Investment & ROI */}
      <RoiEstimator />

      {/* ⑨ Project delivery & local support */}
      <DeliverySupport />

      {/* ⑩ Real projects */}
      <RealProjects />

      {/* ⑪ Smart energy management */}
      <EnergyManagement />

      {/* ⑫ FAQ */}
      <FaqSection
        faqs={cniFaqs}
        title={
          <>
            Business Solar <span className="text-gradient">Questions</span>
          </>
        }
      />

      {/* Final CTA */}
      <CTA
        eyebrow="START THE ASSESSMENT"
        title={
          <>
            Let&apos;s size the system for{' '}
            <span className="text-gradient">your business</span>
          </>
        }
        description="Send us the bill and the site details, and we will come back with a configuration, an expected output and a price — based on your load, not on a catalogue."
        primaryLabel="Request a tailored proposal"
        secondaryLabel="See the savings estimate"
        secondaryHref="#investment"
        className="bg-white"
      />

      <Footer />
    </main>
  )
}
