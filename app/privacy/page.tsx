import PrivacyPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  path: '/privacy',
  description:
    'How Solavita collects, uses, stores and shares personal information, in accordance with applicable data protection laws.',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/privacy',
            name: 'Solavita Privacy Policy',
            description:
              'How Solavita collects, uses, stores and shares personal information, in accordance with applicable data protection laws.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Privacy Policy', url: '/privacy' },
          ]),
        ]}
      />
      <PrivacyPage />
    </>
  )
}