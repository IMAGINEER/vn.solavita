import CookiesPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Cookie Policy',
  path: '/cookies',
  description:
    'How Solavita uses cookies and similar technologies on this website.',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/cookies',
            name: 'Solavita Cookie Policy',
            description:
              'How Solavita uses cookies and similar technologies on this website.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Cookie Policy', url: '/cookies' },
          ]),
        ]}
      />
      <CookiesPage />
    </>
  )
}