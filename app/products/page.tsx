import type { Metadata } from 'next'
import ProductHub from '@/components/products/ProductHub'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Solar Products — Modules, Inverters, Batteries | Solavita',
  path: '/products',
  description:
    'Explore the Solavita product range: 620 W TOPCon solar modules, hybrid and off-grid inverters from 3.6 kW to 20 kW, modular LiFePO₄ batteries, and the 125 kW / 261 kWh All-in-One ESS.',
  ogImage: '/images/hero-solutions.webp',
  ogImageAlt: 'Solavita solar modules, inverters and batteries',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/products',
            name: 'Solar Products — Modules, Inverters, Batteries | Solavita',
            description:
              'Solavita solar modules, inverters, batteries and the All-in-One ESS.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Products', url: '/products' },
          ]),
        ]}
      />
      <ProductHub />
    </>
  )
}
