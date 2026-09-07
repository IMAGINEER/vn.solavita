import HemsPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

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