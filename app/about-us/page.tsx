import AboutPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  aboutPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'About Us',
  path: '/about-us',
  description:
    'Solavita UK is the residential solar brand of the SKYWORTH Group. We design, install and service MCS-certified solar and battery systems for UK homes.',
  ogImage: '/images/hero-about.webp',
  ogImageAlt:
    'Solavita UK - the residential solar brand of the SKYWORTH Group',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          aboutPageJsonLd({
            path: '/about-us',
            name: 'About Solavita UK',
            description:
              'Solavita UK is the residential solar brand of the SKYWORTH Group. We design, install and service MCS-certified solar and battery systems for UK homes.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'About Us', url: '/about-us' },
          ]),
        ]}
      />
      <AboutPage />
    </>
  )
}