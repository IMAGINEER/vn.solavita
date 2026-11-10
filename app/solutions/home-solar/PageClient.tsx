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
      body: 'Fewer blackouts, fewer top-up runs. From essential backup to full-home control, Solavita delivers clean, dependable energy — so you can worry less and live more.',
      backgroundImage: '/images/home_solar_1600x856.webp',
      primaryCta: {
        label: 'Get Free Quote',
        onClick: () => openFormModal({ solutionType: 'home' }),
      },
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'For Home' },
      ],
    },
    contextCopy: {
      heading: 'Cut your energy bill, own your power, stay lit through any outage',
      body: 'A Solavita home-solar solution addresses all three: lower monthly energy costs, energy independence, and reliable power through any power crisis. The three solutions below are sized for different household sizes and backup priorities - from a compact essential-backup system to a higher-capacity configuration for larger residences. Final system suitability is confirmed by a proper load assessment and site evaluation.',
    },
    solutions: homeSolutions,
    tailoredCta: {
      eyebrow: "DON'T SEE YOUR FIT?",
      title: <>Let's Tailor <span className="text-gradient">a Solution.</span></>,
      body: 'If your appliances, roof layout or backup requirements sit outside the three packages above, request a tailored recommendation. A Solavita representative will follow up with a configuration that matches your home.',
      primaryCta: {
        label: 'Request a Tailored Quote',
        onClick: () => openFormModal({ solutionType: 'home' }),
      },
    },
    // ②优势-品牌赋能 — "VITAL ENERGY. VITAL TRUST."
    showBrandAdvantage: true,
    // ②优势-解决方案整体优势 — "POWERED BY VITAL LIFE."
    solutionAdvantage: {
      eyebrow: 'POWERED BY VITAL LIFE.',
      heading: (
        <>
          Power That <span className="text-gradient">Doesn't Sleep</span>
        </>
      ),
      intro:
        'Generation, storage and control have to work as one system. Here is what each of them does.',
      items: [
        {
          title: 'ENERGY COSTS, STEP DOWN.',
          body: 'Solar by day, battery by night. Grid as backup.',
          // The docx marks this row "需要一张背景图" — no image supplied
          // yet, so the neutral placeholder is used until one arrives.
          imageDescription:
            'Solar array on a home roof during the day with a battery cabinet beside the house',
        },
        {
          title: 'BLACKOUT-PROOF NIGHTS.',
          body: 'Lights on, freezer cold. Seamless switchover.',
          imagePath: '/images/solutions/blackout-proof-nights.webp',
          imageDescription:
            'Home lit by battery backup during a storm at night',
        },
        {
          title: 'ONE SCREEN. FULL CONTROL.',
          body: 'Smart Monitoring App control. Track and save energy anytime.',
          imagePath: '/images/solutions/one-screen-full-control.webp',
          imageDescription:
            'Cutaway view of a home running on solar and battery storage',
        },
      ],
    },
    // ③产品简介 — Module / Inverter / Battery + "View More Products"
    showcaseProducts: [
      {
        title: 'Module',
        tagline: 'Power your world reliably.',
        href: '/products/module',
        imagePath: '/images/product-module-1.webp',
        imageDescription: 'Solavita 620 W TOPCon solar module',
      },
      {
        title: 'Inverter',
        tagline: 'Intelligent control.',
        href: '/products/inverter',
        imagePath: '/images/product-inverter-card.webp',
        imageDescription: 'Solavita hybrid inverter unit',
      },
      {
        title: 'Battery',
        tagline: 'Reliable backup.',
        href: '/products/battery',
        imagePath: '/images/product-battery-card.webp',
        imageDescription: 'Solavita LiFePO₄ battery cabinet',
      },
    ],
    faqs: homeSolutionFaqs,
  }
  return <CollectionPage {...props} />
}
