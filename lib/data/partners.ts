/**
 * For Partners page data.
 *
 * B2B partner recruitment page - two partner types, partner benefits,
 * and a four-step partnership process. All copy placeholder.
 */

export type PartnerTypeId = 'installer' | 'business'

export interface PartnerType {
  id: PartnerTypeId
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  icon: 'wrench' | 'handshake'
}

export const partnerTypes: PartnerType[] = [
  {
    id: 'installer',
    eyebrow: 'Solar installer',
    title: 'Installer',
    description:
      'UK MCS-certified installers who deliver Solavita systems to homeowners.',
    bullets: [
      'Tier-1 product catalogue',
      'Two-week install training',
      'UK design support team',
      'Lead generation in your region',
    ],
    icon: 'wrench',
  },
  {
    id: 'business',
    eyebrow: 'Energy · Business',
    title: 'Energy / Business Partner',
    description:
      'Heat pump installers, EV charger networks, energy suppliers and utilities.',
    bullets: [
      'Co-marketing programmes',
      'API access to HEMS data',
      'Joint go-to-market',
      'White-label options',
    ],
    icon: 'handshake',
  },
]

export interface PartnerBenefit {
  title: string
  description: string
}

export const partnerBenefits: PartnerBenefit[] = [
  {
    title: 'Group supply-chain scale',
    description:
      'Backed by SKYWORTH - reliable stock, predictable lead times and competitive pricing.',
  },
  {
    title: 'UK engineering support',
    description:
      'Design reviews, system sizing and on-site technical back-up from our UK team.',
  },
  {
    title: 'Co-marketing & leads',
    description:
      'Joint campaigns, regional lead sharing and a partner directory on solavita.uk.',
  },
  {
    title: '15-year warranty programme',
    description:
      'A single UK-backed warranty that covers product, performance and workmanship.',
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
      'First joint project kicks off with full support from the UK partner team.',
  },
]
