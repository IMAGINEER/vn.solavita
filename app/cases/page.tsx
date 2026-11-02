import CasesPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Solar Solutions in Practice | Solavita Nigeria',
  path: '/cases',
  description:
    'Explore solar installations and system configurations in different scenarios.',
  ogImage: '/images/hero-cases.webp',
  ogImageAlt:
    'Solar installations and system configurations from across our global markets',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/cases',
            name: 'Solar Solutions in Practice | Solavita Nigeria',
            description:
              'Explore solar installations and system configurations in different scenarios.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Cases', url: '/cases' },
          ]),
        ]}
      />
      <CasesPage />
    </>
  )
}
