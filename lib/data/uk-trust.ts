export interface UkTrustItem {
  label: string
  sublabel: string
  /** Key into the `TrustIcon` switch in `components/TrustBar.tsx`. */
  icon:
    | 'sun'
    | 'globe'
    | 'shield-check'
    | 'trophy'
    | 'users'
}

export const ukTrustItems: UkTrustItem[] = [
  {
    label: '10+ Years',
    sublabel: 'Solar Expertise',
    icon: 'sun',
  },
  {
    label: 'Global Certifications',
    sublabel: 'TÜV · CE · MCS · RoHS',
    icon: 'globe',
  },
  {
    label: 'European Standards',
    sublabel: 'Designed for Europe',
    icon: 'shield-check',
  },
  {
    label: 'Media & Awards',
    sublabel: 'Trusted Worldwide',
    icon: 'trophy',
  },
  {
    label: 'Our Team',
    sublabel: 'Passionate & Local',
    icon: 'users',
  },
]