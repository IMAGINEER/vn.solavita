import CasesPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Giải pháp điện mặt trời trong thực tế | Solavita Việt Nam',
  path: '/cases',
  description:
    'Khám phá các công trình điện mặt trời và cấu hình hệ thống trong từng bối cảnh sử dụng.',
  ogImage: '/images/og-cases.jpg',
  ogImageAlt:
    'Các công trình điện mặt trời và cấu hình hệ thống tại nhiều thị trường',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/cases',
            name: 'Giải pháp điện mặt trời trong thực tế | Solavita Việt Nam',
            description:
              'Khám phá các công trình điện mặt trời và cấu hình hệ thống trong từng bối cảnh sử dụng.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Dự án', url: '/cases' },
          ]),
        ]}
      />
      <CasesPage />
    </>
  )
}