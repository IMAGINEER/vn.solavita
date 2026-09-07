import CasesPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'UK Case Studies',
  path: '/cases',
  description:
    'Real Solavita installations across the UK. See how solar and battery systems perform on homes like yours.',
  ogImage: '/images/hero-cases.webp',
  ogImageAlt:
    'Solavita UK case studies - real installations of solar and battery systems across UK homes',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/cases',
            name: 'UK Case Studies',
            description:
              'Real Solavita installations across the UK. See how solar and battery systems perform on homes like yours.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Case Studies', url: '/cases' },
          ]),
        ]}
      />
      <CasesPage />
    </>
  )
}