import Home from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Solar Panels & Battery Storage for UK Homes',
  path: '/',
  description:
    'Solavita delivers premium solar panels and battery storage for UK homes. Two-week installation. MCS-certified. UK-wide support.',
  ogImage: '/static/images/hero-system-render.webp',
  ogImageAlt: 'Solavita UK - solar panels and battery storage for UK homes',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/',
            name: 'Solavita UK - Solar Panels & Battery Storage for UK Homes',
            description:
              'Premium solar panels and battery storage for UK homes. MCS-certified. Two-week installation. UK-wide support.',
          }),
          breadcrumbJsonLd([{ name: 'Home', url: '/' }]),
        ]}
      />
      <Home />
    </>
  )
}