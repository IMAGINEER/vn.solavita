import type { Metadata } from 'next'
import SupportInstallationPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd, breadcrumbJsonLd, faqPageJsonLd } from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'How to Install — Solar & Battery Installation Process | Solavita',
  path: '/support/installation',
  description:
    'How your Solavita system gets installed: a free survey, a tailored design and quote, installation by our team, and full commissioning — plus answers to common installation questions.',
  ogImage: '/images/hero-solutions.webp',
  ogImageAlt: 'Solavita solar and battery installation',
})

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'How long does installation take?',
    answer: 'Usually 7 working days depending on system size.',
  },
  {
    question: 'Do I need to prepare anything before installation?',
    answer: 'No. Our team handles roof assessment, permits and setup.',
  },
  {
    question: 'Will my power be interrupted during installation?',
    answer: 'No, we install with zero downtime to your home or business.',
  },
  {
    question: 'Who installs the system?',
    answer:
      'All installations are carried out by Solavita-certified engineers.',
  },
]

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/support/installation',
            name: 'How to Install | Solavita',
            description:
              'The 4-step Solavita installation process for solar and battery systems.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Support', url: '/support' },
            { name: 'Installation', url: '/support/installation' },
          ]),
          faqPageJsonLd({
            path: '/support/installation',
            name: 'Solavita Installation FAQs',
            description:
              'Common questions about the Solavita solar and battery installation process.',
            faqs: FAQS,
          }),
        ]}
      />
      <SupportInstallationPage />
    </>
  )
}
