import SupportPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { faqItems } from '@/lib/data/support'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Hỗ trợ & Câu hỏi thường gặp',
  path: '/support',
  description:
    'Câu hỏi thường gặp, hướng dẫn xử lý sự cố và tài liệu tải về cho hệ thống điện mặt trời, pin lưu trữ và giám sát của Solavita. Liên hệ đội ngũ hỗ trợ Solavita Việt Nam.',
  ogImage: '/images/og-support.jpg',
  ogImageAlt:
    'Hỗ trợ và Câu hỏi thường gặp của Solavita Việt Nam - hệ thống điện mặt trời, pin lưu trữ và giám sát',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/support',
            name: 'Hỗ trợ & Câu hỏi thường gặp',
            description:
              'Câu hỏi thường gặp, hướng dẫn xử lý sự cố và tài liệu tải về cho hệ thống điện mặt trời, pin lưu trữ và giám sát của Solavita. Liên hệ đội ngũ hỗ trợ Solavita Việt Nam.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Hỗ trợ', url: '/support' },
          ]),
          faqPageJsonLd({
            path: '/support#faq',
            name: 'Solavita Hỗ trợ - Câu hỏi thường gặp',
            description:
              'Các câu hỏi phổ biến về lắp đặt, sản phẩm, giám sát, bảo hành và xử lý sự cố cho hệ thống điện mặt trời, pin lưu trữ và giám sát của Solavita.',
            faqs: faqItems,
          }),
        ]}
      />
      <SupportPage />
    </>
  )
}
