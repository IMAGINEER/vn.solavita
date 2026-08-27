export interface UkCase {
  city: string
  region: string // e.g. "England" or "Wales"
  postcode: string
  systemLabel: string // e.g. "7.8kWp + 10kWh"
  annualGeneration: string // e.g. "8,310 kWh"
  annualSaving: string // e.g. "£1,180"
  imagePath: string
}

export const ukCases: UkCase[] = [
  {
    city: 'Leeds',
    region: 'England',
    postcode: 'LS6',
    systemLabel: '7.8kWp + 10kWh',
    annualGeneration: '8,310 kWh',
    annualSaving: '£1,180',
    imagePath: '/images/banner_uk.webp',
  },
  {
    city: 'Manchester',
    region: 'England',
    postcode: 'M14',
    systemLabel: '6.2kWp + 5kWh',
    annualGeneration: '6,480 kWh',
    annualSaving: '£910',
    imagePath: '/images/banner_uk.webp',
  },
  {
    city: 'Bristol',
    region: 'England',
    postcode: 'BS8',
    systemLabel: '9.6kWp + 10kWh',
    annualGeneration: '10,560 kWh',
    annualSaving: '£1,520',
    imagePath: '/images/banner_uk.webp',
  },
]

export interface UkTestimonial {
  quote: string
  author: string
  rating: number // 1–5
}

export const ukTestimonial: UkTestimonial = {
  quote:
    'From consultation to installation, the whole experience was fantastic. Our bills dropped significantly.',
  author: '— Sarah M.',
  rating: 5,
}
