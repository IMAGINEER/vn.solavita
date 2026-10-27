'use client'

import CollectionPage, {
  type CollectionPageProps,
} from '@/components/solutions/CollectionPage'
import { solutionDetails, homeSolutionFaqs } from '@/lib/data/solutions'
import { openFormModal } from '@/lib/form-modal'

/**
 * /solutions/home-solar — three home-solar solutions from
 * `content/nigeria/products.md`:
 *   - LITE Essential Backup
 *   - HOME Standard
 *   - HOME High-spec
 *
 * Composition: <CollectionPage> with home-specific hero, scenario
 * copy, solution cards, tailored CTA and FAQs.
 */

const homeSolutions = solutionDetails.filter((p) => p.segment === 'homes')

export default function HomeSolarPage() {
  const props: CollectionPageProps = {
    scenario: 'home',
    heroProps: {
      eyebrow: 'HOME SOLAR SOLUTIONS',
      title: 'Power Your Home. Stay In Control.',
      body: 'Fewer blackouts, lower fuel runs. From essential backup to full-home control, Solavita delivers clean, dependable energy — so you can worry less and live more.',
      backgroundImage: '/images/nigerian_home_1600x856.webp',
      primaryCta: { label: 'Get Free Quote', onClick: openFormModal },
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'For Home' },
      ],
    },
    contextCopy: {
      heading: 'Cut your fuel bill, own your power, stay lit through any outage',
      body: 'A Solavita home-solar solution addresses all three: lower monthly fuel costs, energy independence, and reliable power through any power crisis. The three solutions below are sized for different household sizes and backup priorities - from a compact essential-backup system to a higher-capacity configuration for larger residences. Final system suitability is confirmed by a proper load assessment and site evaluation.',
    },
    solutions: homeSolutions,
    tailoredCta: {
      eyebrow: 'NOT A STANDARD FIT',
      title: <>Your home doesn't fit <span className="text-gradient">a standard solution?</span></>,
      body: 'If your appliances, roof layout or backup requirements are outside what the home-solar solutions cover, request a tailored recommendation. A Solavita representative will follow up with a configuration that matches your home.',
      primaryCta: { label: 'Request a tailored quote', href: '/contact-us' },
    },
    faqs: homeSolutionFaqs,
  }
  return <CollectionPage {...props} />
}
