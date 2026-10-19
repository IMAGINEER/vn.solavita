import AboutPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  aboutPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'About Solavita Nigeria | Solar Solutions for Nigerian Homes',
  path: '/about-us',
  description:
    'Solavita Nigeria is part of the SKYWORTH Group solar brand. Solar power, battery storage and smart energy management for Nigerian homes and small businesses — designed to reduce generator dependence.',
  ogImage: '/images/hero-about.webp',
  ogImageAlt:
    'Solavita Nigeria — solar and battery storage for Nigerian homes and businesses',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          aboutPageJsonLd({
            path: '/about-us',
            name: 'About Solavita Nigeria',
            description:
              "Discover Solavita Nigeria's approach to solar and battery storage for Nigerian homes and small businesses, supported by the SKYWORTH brand.",
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
