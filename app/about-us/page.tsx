import AboutPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  aboutPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  // Page-specific only — the root layout appends ` | Solavita Việt Nam`.
  // Including the brand here made the template double it.
  title: 'Về Solavita Việt Nam — thương hiệu điện mặt trời của SKYWORTH',
  path: '/about-us',
  description:
    'Solavita là thương hiệu điện mặt trời của Tập đoàn SKYWORTH tại Việt Nam. Tìm hiểu năng lực sản xuất, chứng nhận sản phẩm và cách đội ngũ Việt Nam triển khai hệ điện mặt trời kèm pin lưu trữ.',
  ogImage: '/images/og-about.jpg',
  ogImageAlt:
    'Solavita Việt Nam — điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          aboutPageJsonLd({
            path: '/about-us',
            name: 'Về Solavita Việt Nam',
            description:
              'Tìm hiểu cách Solavita Việt Nam tiếp cận giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp nhỏ, với sự hậu thuẫn của thương hiệu SKYWORTH.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Về chúng tôi', url: '/about-us' },
          ]),
        ]}
      />
      <AboutPage />
    </>
  )
}
