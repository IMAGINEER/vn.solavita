import AboutPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  aboutPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Về Solavita Việt Nam | Giải pháp điện mặt trời cho hộ gia đình',
  path: '/about-us',
  description:
    'Solavita Việt Nam thuộc thương hiệu điện mặt trời của Tập đoàn SKYWORTH. Điện mặt trời, pin lưu trữ và quản lý năng lượng thông minh cho hộ gia đình và doanh nghiệp nhỏ tại Việt Nam.',
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
