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
    'Terms of Use governing access to the Solavita website, including content, product information, enquiry forms and online tools.',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/terms',
            name: 'Solavita Terms of Use',
            description:
              'Terms of Use governing access to the Solavita website, including content, product information, enquiry forms and online tools.',
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