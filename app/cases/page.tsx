import CasesPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  // No brand suffix here — the root layout's title template appends
  // ` | Solavita Việt Nam` exactly once. Hardcoding it produced
  // `... | Solavita Việt Nam | Solavita Việt Nam` in <title>.
  title: 'Giải pháp điện mặt trời trong thực tế',
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
            // JSON-LD `name` is a page/entity name, not a <title> — it
            // never took the template suffix, so the brand belongs in
            // the Organization/WebPage graph, not here.
            name: 'Giải pháp điện mặt trời trong thực tế',
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