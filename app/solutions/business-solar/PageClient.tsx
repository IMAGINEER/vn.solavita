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
    q: 'Will this really save me money?',
    a: "Yes. You'll use less expensive grid power and buy far less diesel for your generator. Most families see their monthly bills drop significantly, making it a smart investment.",
  },
  {
    q: 'What happens when the power goes out?',
    a: 'Your lights, fridge, and Wi-Fi stay on. The system automatically switches to battery power instantly, so your family stays comfortable and safe, day or night.',
  },
  {
    q: 'How long will the battery last?',
    a: "It's built to last. With a 5-year warranty and 6,000 cycles, this battery can power your home for over 10 years-even with daily use.",
  },
  {
    q: 'Is it hard to maintain?',
    a: 'Not at all. Just keep the panels clean. We monitor your system remotely and have local experts ready to help if you need us.',
  },
]

export default function BusinessSolarPage() {
  const props: CollectionPageProps = {
    scenario: 'business',
    heroProps: {
      eyebrow: 'BUSINESS SOLAR SOLUTIONS',
      title: 'Power Your Business. Stay In Control.',
      body: 'Slash diesel bills and stay ahead of outages. Solavita’s solar and battery systems deliver reliable, round-the-clock energy — sized for your business, built to keep you moving.',
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
