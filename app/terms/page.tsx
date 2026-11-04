import TermsPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Điều khoản sử dụng',
  path: '/terms',
  description:
    'Điều khoản sử dụng điều chỉnh việc truy cập trang web Solavita, bao gồm nội dung, thông tin sản phẩm, biểu mẫu yêu cầu tư vấn và các công cụ trực tuyến.',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/terms',
            name: 'Điều khoản sử dụng Solavita',
            description:
              'Điều khoản sử dụng điều chỉnh việc truy cập trang web Solavita, bao gồm nội dung, thông tin sản phẩm, biểu mẫu yêu cầu tư vấn và các công cụ trực tuyến.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Điều khoản sử dụng', url: '/terms' },
          ]),
        ]}
      />
      <TermsPage />
    </>
  )
}