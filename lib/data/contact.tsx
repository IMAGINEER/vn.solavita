/**
 * Contact Us page data — Nigeria.
 *
 * Per `content/nigeria/contact-us.md`:
 *   - 6 selectable enquiry categories (Section 2)
 *   - All contact channels (phone, email, address, hours) are TBD until
 *     business supplies verified Nigerian contact details
 *
 * Every TBD is surfaced in red on the website through the
 * `components/ui/tbd-text.tsx` component.
 */

import type { ReactNode } from 'react'

export type ContactSubjectId =
  | 'residential'
  | 'small-commercial'
  | 'existing-system'
  | 'installer-partner'
  | 'other'

export interface ContactSubject {
  id: ContactSubjectId
  label: string
  description?: string
}

export const contactSubjects: ContactSubject[] = [
  {
    id: 'residential',
    label: 'Residential solar system',
    description:
      'A solar and battery package for your home — including essential circuits, ACs and everyday appliances.',
  },
  {
    id: 'small-commercial',
    label: 'Small commercial solar system',
    description:
      'Solar and storage for a shop, office, restaurant or other small commercial site.',
  },
  {
    id: 'existing-system',
    label: 'Existing system support',
    description:
      'You already have a Solavita system and need help with monitoring, batteries or service.',
  },
  {
    id: 'installer-partner',
    label: 'Installation partnership',
    description:
      'You are an installer or electrical service provider interested in working together.',
  },
  {
    id: 'other',
    label: 'Other enquiry',
    description: 'Tell us what you have in mind.',
  },
]

export interface ContactChannel {
  label: string
  value: string
  href: string
  description?: ReactNode
  icon: 'mail' | 'phone' | 'map-pin'
}

export const contactChannels: ContactChannel[] = [
  {
    label: 'Email',
    value: 'ng@solavita.com',
    href: 'mailto:ng@solavita.com',
    description: 'Reply within one working day.',
    icon: 'mail',
  },
  {
    label: 'WhatsApp',
    value: '+8618500875025',
    href: 'https://wa.me/8618500875025',
    description:
      'TBD — Confirmed Nigerian operating hours and WhatsApp availability.',
    icon: 'phone',
  },
  {
    label: 'Office',
    value: 'TBD — Verified Nigeria office address',
    href: 'https://maps.google.com/',
    description: 'TBD — Registered office and service area.',
    icon: 'map-pin',
  },
]

/** Salutation options - mirrors the existing Consultation form. */
export const contactSalutations = [
  { value: '', label: 'Salutation' },
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Other', label: 'Other' },
] as const
