import CookiesPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Chính sách cookie',
  path: '/cookies',
  description:
    'Cách Solavita sử dụng cookie và các công nghệ tương tự trên trang web này.',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/cookies',
            name: 'Chính sách cookie Solavita',
            description:
              'Cách Solavita sử dụng cookie và các công nghệ tương tự trên trang web này.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Chính sách cookie', url: '/cookies' },
          ]),
        ]}
      />
      <CookiesPage />
    </>
  )
}