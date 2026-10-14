/**
 * For Partners page data - Nigeria.
 *
 * Text mirrors the UK base page with the 3 UK partner types re-cast
 * as 3 NG-specific tracks (installer, referral, community). The
 * previous "distribution" track has been removed from the partner
 * programme per the latest content direction - "Distributor" is no
 * longer offered as a partner track on the NG site. UK trust marks
 * (MCS, "UK-backed warranty", etc.) are dropped per NG content rules
 * - NG has no verified installer certifications, warranty periods, or
 * partner programme specifics, so unverified business claims are
 * marked TBD.
 */

export type PartnerTypeId =
  | 'installer'
  | 'referral'
  | 'community'

export interface PartnerType {
  id: PartnerTypeId
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  icon: 'wrench' | 'handshake' | 'users'
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
    id: 'community',
    eyebrow: 'Community . Business',
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
 * "Why partner" - six-reason block. UK-specific claims (UK engineering
 * support, MCS, 15-year UK-backed warranty, SKYWORTH academy) are
 * generalised or marked TBD per NG content rules until business
 * verifies each claim for the Nigerian market.
 */
export const partnerBenefits: PartnerBenefit[] = [
  {
    title: 'Group supply-chain scale',
    description:
      'Backed by SKYWORTH - reliable stock, predictable lead times and competitive pricing.',
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
    title: 'Warranty programme',
    description:
      'TBD - Verified Nigerian warranty period covering product, performance and workmanship.',
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
 * "How partnership works" - 4-step process.
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