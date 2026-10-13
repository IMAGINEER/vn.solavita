import ForPartnersPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  partnerProgramJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Solar Installer & Business Partnerships | Solavita Nigeria',
  path: '/for-partners',
  description:
    'Explore partnership opportunities with Solavita for solar customer referrals, installation services and local energy solutions in Nigeria.',
  ogImage: '/images/hero-partners.webp',
  ogImageAlt:
    'Solavita Nigeria partnerships - installer, distribution and referral programmes',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/for-partners',
            name: 'Solar Installer & Business Partnerships | Solavita Nigeria',
            description:
              'Explore partnership opportunities with Solavita for solar customer referrals, installation services and local energy solutions in Nigeria.',
          }),
          partnerProgramJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'For Partners', url: '/for-partners' },
          ]),
        ]}
      />
      <ForPartnersPage />
    </>
  )
}
