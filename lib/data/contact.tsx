/**
 * Contact Us page data.
 *
 * The enquiry subject list drives the dropdown on the form. The channel
 * list drives the three contact-method cards. All copy placeholder.
 */

import type { ReactNode } from 'react'

export type ContactSubjectId =
  | 'general'
  | 'sales'
  | 'support'
  | 'partner'
  | 'press'
  | 'other'

export interface ContactSubject {
  id: ContactSubjectId
  label: string
  description?: string
}

export const contactSubjects: ContactSubject[] = [
  {
    id: 'general',
    label: 'General enquiry',
    description: 'A general question about Solavita or our products.',
  },
  {
    id: 'sales',
    label: 'Sales · Get a quote',
    description: 'You would like a design, quote or pricing information.',
  },
  {
    id: 'support',
    label: 'Existing customer support',
    description: 'You already have a Solavita system and need help.',
  },
  {
    id: 'partner',
    label: 'Partnership · B2B',
    description: 'You would like to discuss installer or energy / business partner programmes.',
  },
  {
    id: 'press',
    label: 'Press · Media',
    description: 'Editorial, media kit or interview requests.',
  },
  {
    id: 'other',
    label: 'Something else',
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
    value: 'uk@solavita.com',
    href: 'mailto:uk@solavita.com',
    description: 'Reply within one working day.',
    icon: 'mail',
  },
  {
    label: 'WhatsApp',
    value: '+44 074 5494 5519',
    href: 'https://wa.me/4407454945519',
    description: (
      <>
        Tap to chat · Mon-Fri · 09:00-18:00 · UK hours.
        <br />
        No WhatsApp?{' '}
        <a
          href="tel:+4407454945519"
          className="underline underline-offset-2 hover:text-uk-teal-dark font-cw-bold"
        >
          Call directly
        </a>
        .
      </>
    ),
    icon: 'phone',
  },
  {
    label: 'Office',
    value: 'C/O Buzzacott LLP, 130 Wood Street, London EC2V 6DL, United Kingdom',
    href: 'https://maps.google.com/?q=130+Wood+Street+London+EC2V+6DL',
    description: 'Registered Office · Service & Support.',
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
