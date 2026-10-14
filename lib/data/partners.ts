/**
 * For Partners page data — Nigeria.
 *
 * Text is mirrored from the UK base page (`content/uk/parents.md`) per
 * project instruction, with the 3 UK partner types re-cast as the 4
 * NG-specific tracks (installer, referral, distribution, community)
 * below. The bullets per partner type and the 6 benefit / 4 process
 * entries use the UK wording so the NG page reads as a translation of
 * the UK partner offer rather than a different programme.
 *
 * `bullets` for the 4 NG tracks are TBD until each track's UK equivalent
 * is mapped to a confirmed NG programme. The page renders the bullets
 * list conditionally (only when `bullets.length > 0`) so an empty array
 * simply hides the section without an unsightly gap.
 */

export type PartnerTypeId =
  | 'installer'
  | 'referral'
  | 'distribution'
  | 'community'

export interface PartnerType {
  id: PartnerTypeId
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  icon: 'wrench' | 'handshake' | 'package' | 'users'
}

export const partnerTypes: PartnerType[] = [
  {
    id: 'installer',
    eyebrow: 'Solar installation',
    title: 'Installer',
    description:
      'Nigerian installers and electrical service providers who deliver Solavita systems to homeowners and small businesses.',
    bullets: [
      'Tier-1 product catalogue',
      'Two-week install training',
      'Nigerian design support team',
      'Lead generation in your region',
    ],
    icon: 'wrench',
  },
  {
    id: 'referral',
    eyebrow: 'Customer referral',
    title: 'Referral Partner',
    description:
      'Businesses or individuals who can refer potential residential or small commercial customers in their network.',
    bullets: [
      'Tier-1 product catalogue',
      'Two-week install training',
      'Nigerian design support team',
      'Lead generation in your region',
    ],
    icon: 'handshake',
  },
  {
    id: 'distribution',
    eyebrow: 'Retail · Distribution',
    title: 'Distributor',
    description:
      'Electrical wholesalers, roofing merchants and trade suppliers interested in discussing equipment distribution or customer access.',
    bullets: [
      'Stock & supply programmes',
      'Marketing & POS support',
      'Training for your counter staff',
      'Volume pricing',
    ],
    icon: 'package',
  },
  {
    id: 'community',
    eyebrow: 'Community · Business',
    title: 'Community / Business Partner',
    description:
      'Heat pump installers, EV charger networks, energy suppliers, utilities and community organisations interested in co-marketing or joint go-to-market programmes.',
    bullets: [
      'Co-marketing programmes',
      'API access to HEMS data',
      'Joint go-to-market',
      'White-label options',
    ],
    icon: 'users',
  },
]

export interface PartnerBenefit {
  title: string
  description: string
}

/**
 * "Why partner" — six-reason block, text copied verbatim from the UK
 * base page. UK-specific claims (UK engineering support, SKYWORTH
 * academy, 15-year warranty programme) are kept as authored; business
 * may adapt any that don't apply to the Nigerian market in a follow-up.
 */
export const partnerBenefits: PartnerBenefit[] = [
  {
    title: 'Group supply-chain scale',
    description:
      'Backed by SKYWORTH — reliable stock, predictable lead times and competitive pricing.',
  },
  {
    title: 'Nigerian engineering support',
    description:
      'Design reviews, system sizing and on-site technical back-up from our Nigerian team.',
  },
  {
    title: 'Co-marketing & leads',
    description:
      'Joint campaigns, regional lead sharing and a partner directory on solavita.com/ng.',
  },
  {
    title: '15-year warranty programme',
    description:
      'A single warranty that covers product, performance and workmanship.',
  },
  {
    title: 'Training & certification',
    description:
      'Installer training, product certification and access to the SKYWORTH academy.',
  },
  {
    title: 'Dedicated partner manager',
    description:
      'A single point of contact who knows your business and your region.',
  },
]

export interface PartnerProcessStep {
  step: string
  title: string
  description: string
}

/**
 * "How partnership works" — 4-step process, text copied verbatim from
 * the UK base page.
 */
export const partnerProcess: PartnerProcessStep[] = [
  {
    step: '01',
    title: 'Get in touch',
    description:
      'Tell us about your business and which partner track you are interested in.',
  },
  {
    step: '02',
    title: 'Discovery call',
    description:
      'A 30-minute call with our partner team to map fit and discuss your region.',
  },
  {
    step: '03',
    title: 'Onboarding & training',
    description:
      'Product training, certification (where applicable) and systems access.',
  },
  {
    step: '04',
    title: 'Go live',
    description:
      'First joint project kicks off with full support from the Nigerian partner team.',
  },
]