/**
 * For Partners page data — Nigeria.
 *
 * Text mirrors the For-Partner 页面修改参考页 PPTX layout. Three
 * tracks (Core Service / Certified Installer / Lead Partner) replace
 * the previous UK/IT tracks (Installer / Referral / Community).
 * UK trust marks (MCS, "UK-backed warranty", etc.) are dropped per NG
 * content rules — NG has no verified installer certifications, warranty
 * periods, or partner programme specifics, so unverified business
 * claims stay as TBD or are replaced with the generic partner
 * programme framing the PPTX calls out.
 */

export type PartnerTypeId =
  | 'core-service'
  | 'certified-installer'
  | 'lead-partner'

export interface PartnerType {
  id: PartnerTypeId
  title: string
  /** Short "for whom" subtitle shown under the title. */
  description: string
  /** "What You Get" — bullets the partner receives from Solavita. */
  whatYouGet: string[]
  /** "Your Role" — bullets the partner is expected to do. */
  yourRole: string[]
  icon: 'wrench' | 'handshake' | 'users'
}

export const partnerTypes: PartnerType[] = [
  {
    id: 'core-service',
    title: 'Core Service Partner',
    description:
      'For businesses with local networks and storage capacity.',
    whatYouGet: [
      'Priority local inventory access',
      'Channel development & co-marketing',
      'Dedicated account manager',
    ],
    yourRole: [
      'Maintain local inventory',
      'Support sub-installers in your region',
    ],
    icon: 'wrench',
  },
  {
    id: 'certified-installer',
    title: 'Certified Installer',
    description:
      'For teams with electrical and solar installation skills.',
    whatYouGet: [
      'No full-container minimum',
      'Product & installation training',
      'Customer leads in your area',
    ],
    yourRole: [
      'Complete Solavita certification',
      'Deliver quality installation & after-sales',
    ],
    icon: 'handshake',
  },
  {
    id: 'lead-partner',
    title: 'Lead Partner',
    description:
      'For individuals or businesses focused on customer referral and lead generation.',
    whatYouGet: [
      'Commission per referral',
      'Free marketing materials',
      'No stock, no installation',
    ],
    yourRole: [
      'Share leads with us',
      'We visit and quote',
      'You collect commission',
    ],
    icon: 'users',
  },
]

/**
 * "Why partner" - per the For-Partner 页面修改参考页 PPTX layout:
 *   - 2 hero stats (800,000+ / 34.6GW) backed by the SKYWORTH Group's
 *     public global-deployment numbers
 *   - one body paragraph + a one-line tagline
 *   - 3 highlight cards (Local Warehouse / Full Warranty / Sales
 *     Support) each with an image and an overlay label
 *
 * The stats are real SKYWORTH Group numbers (verifiable from public
 * sources). The 3-card grid re-frames the "value of partnership" around
 * the PPTX's three pillars instead of the previous 6-reason block.
 */
export interface PartnerBenefit {
  /** Pill label rendered on top of the card image (e.g. "Local Warehouse"). */
  label: string
  /** One-line caption under the pill (e.g. "No full container needed"). */
  caption: string
  /** Short description used for the card placeholder. */
  description: string
  /** Path to the hero image under `public/`. Omit to render the
   *  neutral `ImagePlaceholder` instead (keeps the card visible until
   *  the partner photo / render is supplied). */
  image?: string
}

export const partnerBenefits: PartnerBenefit[] = [
  {
    label: 'Local Warehouse',
    caption: 'No full container needed',
    description:
      'Solavita local warehouse with pallet-level stock access — no full-container minimum order.',
    image: '/images/local_warehouse_card.webp',
  },
  {
    label: 'Full Warranty',
    caption: 'Local backup for claims',
    description:
      'Full-system warranty with local claims backup so you and your customers are never waiting on an overseas RMA.',
    image: '/images/full_warranty_card.webp',
  },
  {
    label: 'Sales Support',
    caption: 'Leads & tech backup',
    description:
      'Co-marketing programs, regional lead sharing, and on-call technical backup for sizing and design.',
    image: '/images/sales_support_card.webp',
  },
]

export interface PartnerStats {
  /** Large headline number, e.g. "800,000+". */
  value: string
  /** Caption rendered under the number. */
  caption: string
}

export const partnerStats: PartnerStats[] = [
  {
    value: '800,000+',
    caption: 'Solar Stations Installed Worldwide',
  },
  {
    value: '34.6GW',
    caption: 'Cumulative Installed Capacity',
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
      'First joint project kicks off with full support from the local partner team.',
  },
]