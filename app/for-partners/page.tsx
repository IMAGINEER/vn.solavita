import ForPartnersPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  partnerProgramJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Partner Programmes',
  path: '/for-partners',
  description:
    'Become a Solavita partner. Installer, energy and business programmes for UK solar and storage projects.',
  ogImage: '/images/hero-partners.webp',
  ogImageAlt:
    'Solavita UK Partner Programmes - installer, energy and business programmes',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/for-partners',
            name: 'Partner Programmes',
            description:
              'Become a Solavita partner. Installer, energy and business programmes for UK solar and storage projects.',
          }),
          partnerProgramJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Partner Programmes', url: '/for-partners' },
          ]),
        ]}
      />
      <ForPartnersPage />
    </>
  )
}