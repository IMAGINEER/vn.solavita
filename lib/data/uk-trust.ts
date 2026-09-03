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
    label: 'UK Support',
    sublabel: 'Passionate & Local',
    icon: 'users',
  },
]