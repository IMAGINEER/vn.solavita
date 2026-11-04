'use client'

import CollectionPage, {
  type CollectionPageProps,
} from '@/components/solutions/CollectionPage'
import { solutionDetails, businessSolutionFaqs } from '@/lib/data/solutions'
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
 *
 * The FAQ copy lives in `lib/data/solutions.ts` so it can be shared
 * can reuse the same set, as `docs/修改建议.docx` asks.
 */

const businessSolutions = solutionDetails.filter(
  (p) => p.segment === 'businesses',
)

export default function BusinessSolarPage() {
  const props: CollectionPageProps = {
    scenario: 'business',
    heroProps: {
      eyebrow: 'BUSINESS SOLAR SOLUTIONS',
      title: 'Power Your Business. Stay In Control.',
      body: 'Slash energy bills and stay ahead of outages. Solavita’s solar and battery systems deliver reliable, round-the-clock energy — sized for your business, built to keep you moving.',
      backgroundImage: '/images/business_solar_1600x856.webp',
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
    // ①套餐 — one equal-width 3-up row. The docx's two categories are
    //   carried by the cards themselves: 分类1 (VITAL BUSINESS) folds
    //   into the Entry/Standard intros, and 分类2 (HEAVY DEMAND) into
    //   Flagship, which gets the featured teal outline.
    solutionGroups: [
      {
        solutions: businessSolutions.filter(
          (s) =>
            s.id === 'business-entry-3-phase' ||
            s.id === 'business-standard-3-phase',
        ),
      },
      {
        solutions: businessSolutions.filter(
          (s) => s.id === 'business-flagship-3-phase',
        ),
        featured: true,
        highlight: {
          title: 'INDUSTRIAL POWER, SIMPLIFIED.',
          spec: '125kW / 261kWh All-in-One ESS.',
          body: 'One cabinet that carries a factory, a supermarket or a community mini-grid — with no separate inverter, no container stacking and no on-site equipment logistics.',
          href: '/products/all-in-one-ess',
          ctaLabel: 'All-in-One ESS details',
          // 工商业光伏背景图 per `docs/修改建议(2).docx`.
          backgroundImage: '/images/solutions/industrial-pv-background.webp',
        },
      },
    ],
    tailoredCta: {
      eyebrow: "DON'T SEE YOUR FIT?",
      title: <>Let's Tailor <span className="text-gradient">a Solution.</span></>,
      body: 'If your loads, operating hours or site conditions sit outside the packages above, request a tailored recommendation. A Solavita representative will follow up with a configuration that matches your business.',
      primaryCta: { label: 'Request a Tailored Quote', href: '/contact-us' },
    },
    // ②优势-品牌赋能 — "VITAL ENERGY. VITAL TRUST."
    showBrandAdvantage: true,
    // ②优势-解决方案优势 — scenario-specific rows.
    solutionAdvantage: {
      eyebrow: 'POWERED BY VITAL LIFE.',
      heading: (
        <>
          Built for Business <span className="text-gradient">That Can&apos;t Stop</span>
        </>
      ),
      intro:
        'Uptime, energy cost and a cabinet that survives the site — three reasons a commercial system earns its keep.',
      items: [
        {
          title: 'Zero Downtime',
          body: 'Uninterrupted power for continuous operations.',
          imageDescription:
            'Supermarket interior lit and running during a grid outage',
        },
        {
          title: 'Cut Energy Costs',
          body: 'Eliminate energy costs. Maximize your energy ROI.',
          imageDescription:
            'Commercial rooftop solar and battery array',
        },
        {
          title: 'Built Tough',
          body: 'Engineered for extreme heat, sand, and wind.',
          imageDescription:
            'All-in-One ESS cabinet standing outdoors in a dusty industrial yard',
        },
      ],
    },
    // ③产品简介 — Module / Inverter / Battery / C&I ESS + "View More Products"
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
      {
        title: 'C&I Energy Storage System',
        tagline: 'One Cabinet. Real Returns.',
        href: '/products/all-in-one-ess',
        imageDescription:
          'Solavita 125 kW / 261 kWh All-in-One ESS cabinet',
      },
    ],
    faqs: businessSolutionFaqs,
  }
  return <CollectionPage {...props} />
}
