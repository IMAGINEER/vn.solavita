import ContactUsPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  contactPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Contact Us',
  path: '/contact-us',
  description:
    'Get in touch with Solavita UK. Speak to our team about solar, battery or whole-home energy systems for your home.',
  ogImage: '/images/hero-contact.webp',
  ogImageAlt: 'Contact Solavita UK - solar, battery and home energy team',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          contactPageJsonLd({
            path: '/contact-us',
            name: 'Contact Solavita UK',
            description:
              'Get in touch with Solavita UK. Speak to our team about solar, battery or whole-home energy systems for your home.',
          }),
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