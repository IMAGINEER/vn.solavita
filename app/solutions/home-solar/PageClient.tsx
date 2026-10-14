'use client'

import CollectionPage, {
  type CollectionFaq,
  type CollectionPageProps,
} from '@/components/solutions/CollectionPage'
import { solutionDetails } from '@/lib/data/solutions'
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

const homeFaqs: CollectionFaq[] = [
  {
    q: 'Which solution is right for me?',
    a: 'It depends on your appliances, their rated power, how long you use them and how much backup time you need. The solution descriptions are a starting point; a load assessment should confirm the final system.',
  },
  {
    q: 'Is a larger inverter always better?',
    a: 'Not necessarily. The inverter must support the combined running demand and starting demand of the appliances you intend to operate. Battery capacity and solar generation must also match your requirements.',
  },
  {
    q: 'How much electricity will the system generate?',
    a: 'The figures shown on this page are solution-level estimates. Actual output depends on location, solar conditions, shading, installation design and system losses.',
  },
  {
    q: 'Will the system work on cloudy days?',
    a: 'Solar generation varies with sunlight conditions. Battery storage provides energy when solar generation is insufficient, but available backup depends on stored energy and the connected load.',
  },
  {
    q: 'How long will the battery last during an outage?',
    a: 'Backup duration depends on usable battery capacity and the appliances drawing power. A larger load uses stored energy more quickly. A site-specific assessment is required for a reliable estimate.',
  },
  {
    q: 'How much does a system cost?',
    a: 'Approved Nigerian solution pricing is not yet published. Request a tailored quote and a Solavita representative will follow up with pricing for the configuration that matches your home.',
  },
  {
    q: 'Is installation available in my area?',
    a: 'TBD — Confirmed Nigeria service coverage.',
  },
]

export default function HomeSolarPage() {
  const props: CollectionPageProps = {
    scenario: 'home',
    heroProps: {
      eyebrow: 'HOME SOLAR SOLUTIONS',
      title: 'Power your home. Take control of your energy.',
      body: "From essential backup to higher-capacity home systems, Solavita combines solar panels, single-phase hybrid inverters and battery storage to meet your household's energy needs.",
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
    faqs: homeFaqs,
  }
  return <CollectionPage {...props} />
}
