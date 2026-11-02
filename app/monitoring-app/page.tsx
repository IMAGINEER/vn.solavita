import HemsPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/lib/seo/jsonld'
import { hemsFeatures } from '@/lib/data/hems'

export const metadata = buildPageMetadata({
  title: 'HEMS App · Smart Home Energy',
  path: '/hems',
  description:
    'The Solavita HEMS app puts your solar, battery and home energy in one place — generation, consumption, scheduling and alerts.',
  ogImage: '/images/hero-hems.webp',
  ogImageAlt:
    'Solavita HEMS app - generation, consumption, scheduling and alerts for solar and battery storage',
})

export default function Page() {
  // Pull feature titles straight from `lib/data/hems` so the schema
  // stays in lockstep with `components/hems/FeaturesGrid.tsx`. HEMS
  // ships bundled with every Solavita system - no separate price.
  const featureTitles = hemsFeatures.map((f) => f.title)

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/hems',
            name: 'Solavita HEMS App',
            description:
              'The Solavita HEMS app puts your solar, battery and home energy in one place - generation, consumption, scheduling and alerts.',
          }),
          softwareApplicationJsonLd({
            name: 'Solavita HEMS',
            featureList: featureTitles,
            free: true,
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'HEMS App', url: '/hems' },
          ]),
        ]}
      />
      <HemsPage />
    </>
  )
}