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
    'How Solavita Energy UK Limited collects, uses and protects your personal data under UK GDPR.',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/privacy',
            name: 'Solavita UK Privacy Policy',
            description:
              'How Solavita Energy UK Limited collects, uses and protects your personal data under UK GDPR.',
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