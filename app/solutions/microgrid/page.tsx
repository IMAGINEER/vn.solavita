import type { Metadata } from 'next'
import MicrogridPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Microgrid Solutions — 125 kW / 261 kWh All-in-One ESS | Solavita',
  path: '/solutions/microgrid',
  description:
    'One 125 kW / 261 kWh all-in-one energy storage cabinet, run off-grid, hybrid or on-grid. Built for factories, supermarkets, community mini-grids and telecom sites.',
  ogImage: '/images/hero-solutions.webp',
  ogImageAlt: 'Solavita microgrid all-in-one energy storage system',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/solutions/microgrid',
            name: 'Microgrid Solutions | Solavita',
            description:
              'A 125 kW / 261 kWh all-in-one energy storage cabinet for off-grid, hybrid and on-grid operation.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Solutions', url: '/solutions/home-solar' },
            { name: 'For Microgrid', url: '/solutions/microgrid' },
          ]),
        ]}
      />
      <MicrogridPage />
    </>
  )
}
