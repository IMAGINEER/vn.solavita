import CasesPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Solar Installation Stories | Solavita Nigeria',
  path: '/cases',
  description:
    'Explore solar and battery system applications for homes and businesses. Nigerian customer cases will be added as verified projects become available.',
  ogImage: '/images/hero-cases.webp',
  ogImageAlt:
    'Reference solar and battery installations from across our global markets',
})

export default function Page() {
  // No NG case studies have been verified yet, so the creativeWorkList
  // is empty. The page renders a neutral empty state via the unified
  // ImagePlaceholder and a TBD message.
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/cases',
            name: 'Solar Installation Stories | Solavita Nigeria',
            description:
              'Explore solar and battery system applications for homes and businesses. Nigerian customer cases will be added as verified projects become available.',
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
