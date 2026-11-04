import ContactUsPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  contactPageJsonLd,
  breadcrumbJsonLd,
  localBusinessJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Liên hệ Solavita Việt Nam | Tư vấn hệ thống điện mặt trời',
  path: '/contact-us',
  description:
    'Liên hệ Solavita Việt Nam để được tư vấn giải pháp điện mặt trời cho hộ gia đình, pin lưu trữ, hệ thống cho doanh nghiệp nhỏ và cơ hội hợp tác.',
  ogImage: '/images/og-contact.jpg',
  ogImageAlt:
    'Liên hệ Solavita Việt Nam - tư vấn hệ thống điện mặt trời và cơ hội hợp tác',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          contactPageJsonLd({
            path: '/contact-us',
            name: 'Liên hệ Solavita Việt Nam',
            description:
              'Liên hệ Solavita Việt Nam để được tư vấn giải pháp điện mặt trời cho hộ gia đình, pin lưu trữ, hệ thống cho doanh nghiệp nhỏ và cơ hội hợp tác tại Việt Nam.',
          }),
          localBusinessJsonLd(),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Liên hệ', url: '/contact-us' },
          ]),
        ]}
      />
      <ContactUsPage />
    </>
  )
}
