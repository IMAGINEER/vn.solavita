import SupportPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { faqItems } from '@/lib/data/support'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Support & FAQs',
  path: '/support',
  description:
    'FAQs, troubleshooting and downloads for Solavita solar, battery and monitoring systems. Speak to our NG support team.',
  ogImage: '/images/hero-support.webp',
  ogImageAlt:
    'Solavita NG support and FAQs - solar, battery and monitoring systems',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/support',
            name: 'Support & FAQs',
            description:
              'FAQs, troubleshooting and downloads for Solavita solar, battery and monitoring systems. Speak to our NG support team.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Support', url: '/support' },
          ]),
          faqPageJsonLd({
            path: '/support#faq',
            name: 'Solavita Support - Frequently Asked Questions',
            description:
              'Common questions about installation, product, monitoring, warranty and troubleshooting for Solavita solar, battery and monitoring systems.',
            faqs: faqItems,
          }),
        ]}
      />
      <SupportPage />
    </>
  )
}
