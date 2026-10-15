'use client'

import CollectionPage, {
  type CollectionFaq,
  type CollectionPageProps,
} from '@/components/solutions/CollectionPage'
import { solutionDetails } from '@/lib/data/solutions'
import { openFormModal } from '@/lib/form-modal'

/**
 * /solutions/business-solar — three business-solar solutions:
 *   - BUSINESS Entry 3-Phase
 *   - BUSINESS Standard 3-Phase
 *   - BUSINESS Flagship 3-Phase
 *
 * Per the brief, the page does NOT imply that all businesses need
 * three-phase power. The page's FAQ makes the
 * "phase depends on site conditions" point explicitly.
 */

const businessSolutions = solutionDetails.filter(
  (p) => p.segment === 'businesses',
)

const businessFaqs: CollectionFaq[] = [
  {
    q: 'Do all businesses need three-phase power?',
    a: 'No. Whether a site needs single-phase or three-phase supply depends on actual site conditions, load profile and phase requirements. Many smaller businesses run on single-phase supply. A site-specific assessment determines the correct phase.',
  },
  {
    q: 'Which solution is right for me?',
    a: 'It depends on the equipment loads, operating hours, critical loads that must run during an outage, and your supply phase. The solution descriptions are a starting point; a load assessment should confirm the final system.',
  },
  {
    q: 'How much electricity will the system generate?',
    a: 'The figures shown on this page are solution-level estimates. Actual output depends on location, solar conditions, shading, installation design and system losses.',
  },
  {
    q: 'How long can the battery provide backup?',
    a: 'Runtime depends on usable battery capacity and the connected load. Do not infer runtime from battery capacity alone - confirm with a site-specific assessment.',
  },
  {
    q: 'Can I run all my equipment at once?',
    a: 'That depends on the inverter output rating, equipment starting demand, circuit design and available energy. A load assessment is required for a definitive answer.',
  },
  {
    q: 'How much does a system cost?',
    a: 'Approved Nigerian solution pricing is not yet published. Request a tailored quote and a Solavita representative will follow up with pricing for the configuration that matches your business.',
  },
  {
    q: 'Is installation available in my area?',
    a: 'TBD — Confirmed Nigeria service coverage.',
  },
]

export default function BusinessSolarPage() {
  const props: CollectionPageProps = {
    scenario: 'business',
    heroProps: {
      eyebrow: 'BUSINESS SOLAR SOLUTIONS',
      title: 'Cut costs. Keep business moving.',
      body: 'Reduce reliance on generator fuel and protect your operations from power-related downtime with solar and battery solutions sized for your business.\n10–20 kW three-phase inverters. 16–32 kWh battery storage.',
      backgroundImage: '/images/nigerian_business_solar_1600x856.webp',
      primaryCta: { label: 'Get Free Quote', onClick: openFormModal },
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'For Business' },
      ],
    },
    contextCopy: {
      heading: 'Cut your costs, stay open, lock in your energy budget',
      body: 'A Solavita business-solar solution delivers the same three values: lower operating costs, energy independence, and reliable power through any power crisis. The three solutions below are sized around equipment loads, operating hours, critical loads and phase requirements. Final system suitability is confirmed by a proper load assessment, site evaluation and phase-requirement review - not every business needs three-phase power.',
    },
    solutions: businessSolutions,
    tailoredCta: {
      eyebrow: 'NOT A STANDARD FIT',
      title: <>Your business doesn't fit <span className="text-gradient">a standard solution?</span></>,
      body: 'If your loads, operating hours or site conditions are outside what the business-solar solutions cover, request a tailored recommendation. A Solavita representative will follow up with a configuration that matches your business.',
      primaryCta: { label: 'Request a tailored quote', href: '/contact-us' },
    },
    faqs: businessFaqs,
  }
  return <CollectionPage {...props} />
}
