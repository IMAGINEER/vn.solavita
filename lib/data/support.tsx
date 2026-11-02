/**
 * Support page data.
 *
 * Categories drive the clickable cards on /support. FAQ items drive
 * the accordion. All copy placeholder - designed to be the single edit
 * point when the support team fills in final wording.
 */

import type { ReactNode } from 'react'

export type SupportCategoryId =
  | 'installation'
  | 'product'
  | 'monitoring'
  | 'warranty'
  | 'troubleshooting'

export interface SupportCategory {
  id: SupportCategoryId
  title: string
  description: string
  icon:
    | 'wrench'
    | 'package'
    | 'monitor'
    | 'shield'
    | 'life-buoy'
  /**
   * Label of the card's call-to-action. Per `docs/修改建议.docx`
   * "Support页面修改" (Oct 2026) the four visible cards no longer all
   * read "View FAQs".
   */
  ctaLabel: string
  /**
   * Where the CTA goes. A `#`-prefixed value is an on-page anchor to
   * the matching FAQ group; an absolute path is a route.
   */
  ctaHref: string
  /**
   * Set to false to hide the card from the grid while keeping the
   * category's FAQ group on the page. The Monitoring card was removed
   * per `docs/修改建议.docx` (Oct 2026) but its FAQ content stays.
   */
  card?: boolean
}

export const supportCategories: SupportCategory[] = [
  {
    id: 'installation',
    title: 'Installation',
    description:
      'Survey, install day, what to expect and how to prepare your home.',
    icon: 'wrench',
    ctaLabel: 'How to Install',
    ctaHref: '/support/installation',
  },
  {
    id: 'product',
    title: 'Product',
    description:
      'Specs, manuals and downloads for panels, batteries and inverters.',
    icon: 'package',
    ctaLabel: 'Download',
    ctaHref: '#download',
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    description:
      'Monitoring App setup, alerts, reports and sharing access with family.',
    icon: 'monitor',
    ctaLabel: 'View FAQs',
    ctaHref: '#faq-monitoring',
    card: false,
  },
  {
    id: 'warranty',
    title: 'Warranty',
    description:
      'Coverage, claims, transfer of ownership and what is included.',
    icon: 'shield',
    ctaLabel: 'Download',
    ctaHref: '#download',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description:
      'Common issues, error codes and what to do before booking a visit.',
    icon: 'life-buoy',
    ctaLabel: 'Contact Us',
    ctaHref: '/contact-us',
  },
]

export interface FaqItem {
  category: SupportCategoryId
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    category: 'installation',
    question: 'How long does installation take?',
    answer:
      'Most installs are completed in a single day, with the full journey from signed contract to commissioned system taking around two weeks.',
  },
  {
    category: 'installation',
    question: 'Do I need to be at home for the survey?',
    answer:
      'Yes - the survey is on-site so our engineer can inspect the roof, the consumer unit and the loft. It usually takes 60-90 minutes.',
  },
  {
    category: 'installation',
    question: 'Will installation cause disruption?',
    answer:
      'We lift tiles to mount the rails, drill fixings into the rafters and run a cable to your consumer unit. Most homes are back to normal the same day.',
  },
  {
    category: 'product',
    question: 'Where can I find the manuals?',
    answer:
      'Product manuals are available in the Downloads section of your Monitoring App, and on request from our service team.',
  },
  {
    category: 'product',
    question: 'Are Solavita panels Tier-1?',
    answer:
      'TBD — Verified panel tier and BloombergNEF ranking.',
  },
  {
    category: 'monitoring',
    question: 'How do I get the Monitoring App?',
    answer:
      'Once your system is commissioned we create your Monitoring App account and email the download link. The app is available on iOS and Android.',
  },
  {
    category: 'monitoring',
    question: 'Can I share access with my family?',
    answer:
      'Yes. From the app you can invite additional household members - they will get their own login and the same view of generation and consumption.',
  },
  {
    category: 'warranty',
    question: 'What is covered by the 10-year warranty?',
    answer:
      'Product defects, performance (modules) and workmanship for the full 10 years. Batteries carry a separate cycle-based warranty - see your handover pack.',
  },
  {
    category: 'warranty',
    question: 'Does the warranty transfer if I sell my home?',
    answer:
      'Yes. The warranty stays with the system. Please notify us of the change of ownership so we can update our records.',
  },
  {
    category: 'troubleshooting',
    question: 'My system has stopped generating - what should I check?',
    answer:
      'First check the Monitoring App for an alert, then verify the inverter display is on. If both look normal, submit a service ticket and we will respond within one working day.',
  },
]

export interface SupportContactChannel {
  label: string
  value: string
  href: string
  description?: ReactNode
}

export const supportContactChannels: SupportContactChannel[] = [
  {
    label: 'Email',
    value: 'ng@solavita.com',
    href: 'mailto:ng@solavita.com',
    description: 'Reply within one working day.',
  },
  {
    label: 'WhatsApp',
    // Visible label hides the digits until business supplies a
    // verified Nigerian number; the `wa.me` link carries the user-
    // provided handoff number so the click target still routes
    // correctly. Same convention as components/Footer.tsx + lib/data/contact.tsx.
    value: 'WhatsApp',
    href: 'https://wa.me/8618500875025',
    description: (
      <>
        Tap to chat · Mon-Fri · 09:00-18:00 · NG hours.
        <br />
        No WhatsApp?{' '}
        <a
          href="tel:+8618500875025"
          className="underline underline-offset-2 hover:text-uk-teal-dark font-cw-bold"
        >
          Call the team
        </a>
        .
      </>
    ),
  },
]
