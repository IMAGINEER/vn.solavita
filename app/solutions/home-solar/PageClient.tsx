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
    faqs: homeFaqs,
  }
  return <CollectionPage {...props} />
}
