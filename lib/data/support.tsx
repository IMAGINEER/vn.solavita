/**
 * Support page data.
 *
 * Categories drive the clickable cards on /support. FAQ items drive
 * the accordion. All copy placeholder - designed to be the single edit
 * point when the support team fills in final wording.
 */

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
}

export const supportCategories: SupportCategory[] = [
  {
    id: 'installation',
    title: 'Installation',
    description:
      'Survey, install day, what to expect and how to prepare your home.',
    icon: 'wrench',
  },
  {
    id: 'product',
    title: 'Product',
    description:
      'Specs, manuals and downloads for panels, batteries and inverters.',
    icon: 'package',
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    description:
      'HEMS app setup, alerts, reports and sharing access with family.',
    icon: 'monitor',
  },
  {
    id: 'warranty',
    title: 'Warranty',
    description:
      'Coverage, claims, transfer of ownership and what is included.',
    icon: 'shield',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description:
      'Common issues, error codes and what to do before booking a visit.',
    icon: 'life-buoy',
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
      'Product manuals are available in the Downloads section of your HEMS app, and on request from our service team.',
  },
  {
    category: 'product',
    question: 'Are Solavita panels Tier-1?',
    answer:
      'Yes. We only use Tier-1 monocrystalline modules from manufacturers in BloombergNEF&rsquo;s top tier.',
  },
  {
    category: 'monitoring',
    question: 'How do I get the HEMS app?',
    answer:
      'Once your system is commissioned we create your HEMS account and email the download link. The app is available on iOS and Android.',
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
      'First check the HEMS app for an alert, then verify the inverter display is on. If both look normal, submit a service ticket and we will respond within one working day.',
  },
  {
    category: 'troubleshooting',
    question: 'What does error code E-12 mean?',
    answer:
      'E-12 indicates a grid voltage transient - usually it clears within a few minutes. If it persists for more than 30 minutes, please contact support.',
  },
]

export interface SupportContactChannel {
  label: string
  value: string
  href: string
  description?: string
}

export const supportContactChannels: SupportContactChannel[] = [
  {
    label: 'Email',
    value: 'uk@solavita.com',
    href: 'mailto:uk@solavita.com',
    description: 'Reply within one working day.',
  },
  {
    label: 'Phone',
    value: 'Customer Service',
    href: '#',
    description: 'Mon-Fri · 09:00-18:00 · UK hours.',
  },
  {
    label: 'Live chat',
    value: 'Coming soon',
    href: '#',
    description: 'Real-time chat - in development.',
  },
]
