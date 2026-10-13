import ContactUsPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  contactPageJsonLd,
  breadcrumbJsonLd,
  localBusinessJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Contact Solavita Nigeria | Solar System Enquiries',
  path: '/contact-us',
  description:
    'Contact Solavita about residential solar solutions, battery storage, small business systems and partnership opportunities in Nigeria.',
  ogImage: '/images/hero-contact.webp',
  ogImageAlt:
    'Contact Solavita Nigeria - solar system enquiries and partnership opportunities',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          contactPageJsonLd({
            path: '/contact-us',
            name: 'Contact Solavita Nigeria',
            description:
              'Contact Solavita about residential solar solutions, battery storage, small business systems and partnership opportunities in Nigeria.',
          }),
          localBusinessJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Contact Us', url: '/contact-us' },
          ]),
        ]}
      />
      <ContactUsPage />
    </>
  )
}
