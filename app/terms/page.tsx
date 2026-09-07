import TermsPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Terms of Use',
  path: '/terms',
  description:
    'Terms governing use of the Solavita UK website and related services.',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/terms',
            name: 'Solavita UK Terms of Use',
            description:
              'Terms governing use of the Solavita UK website and related services.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Terms of Use', url: '/terms' },
          ]),
        ]}
      />
      <TermsPage />
    </>
  )
}