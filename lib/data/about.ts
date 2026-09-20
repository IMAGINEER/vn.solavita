/**
 * About Us page data.
 *
 * All copy placeholder for now - designed to be the single edit point
 * when the brand team fills in final wording.
 */

export interface AboutStat {
  value: string
  unit: string
  label: string
}

export const aboutStats: AboutStat[] = [
  {
    value: '80+',
    unit: 'Years',
    label: 'Of German engineering heritage (Metz)',
  },
  {
    value: '4',
    unit: 'Million',
    label: 'Households worldwide trust SKYWORTH',
  },
  {
    value: '£7.7bn',
    unit: 'Group',
    label: 'SKYWORTH Group annual revenue',
  },
  {
    value: '2',
    unit: 'Listed',
    label: 'Companies',
  },
]

export interface AboutApproach {
  title: string
  description: string
}

export const aboutApproach: AboutApproach[] = [
  {
    title: 'Designed for the UK',
    description:
      'Every component, mounting kit and installation method is specified for British roofs, weather and grid requirements - not adapted from elsewhere.',
  },
  {
    title: 'Engineered to last',
    description:
      'Tier-1 modules, premium lithium-iron-phosphate batteries, and inverters built for high cycle counts. 10-year warranty as standard.',
  },
  {
    title: 'One team, one journey',
    description:
      'A single Solavita project manager owns your install from survey to commissioning. No sub-contractors, no finger-pointing.',
  },
  {
    title: 'Lifetime UK service',
    description:
      'Our UK-based service team supports you for the lifetime of your system - monitoring, warranty and any question in between.',
  },
]

export interface AboutCertification {
  label: string
  description: string
}

export const aboutCertifications: AboutCertification[] = [
  {
    label: 'MCS Certified',
    description: 'Approved for the Smart Export Guarantee (SEG).',
  },
  {
    label: 'G98 / G99',
    description: 'Compliant with UK grid connection standards.',
  },
  {
    label: 'TÜV · CE · RoHS',
    description: 'European safety, health and environmental standards.',
  },
  {
    label: 'ISO 9001 · ISO 14001',
    description: 'Quality management and environmental management.',
  },
]

export interface AboutRegion {
  city: string
  country: string
  role: string
}

export const aboutRegions: AboutRegion[] = [
  { city: 'London', country: 'United Kingdom', role: 'Registered Office · Service & Support' },
  { city: 'Manchester', country: 'United Kingdom', role: 'UK Installations North' },
  { city: 'Shenzhen', country: 'China', role: 'Group HQ · SKYWORTH R&D' },
  { city: 'Stuttgart', country: 'Germany', role: 'European Engineering' },
  { city: 'Munich', country: 'Germany', role: 'EU Distribution' },
]
