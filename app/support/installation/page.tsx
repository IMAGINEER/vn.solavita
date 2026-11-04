import type { Metadata } from 'next'
import SupportInstallationPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd, breadcrumbJsonLd, faqPageJsonLd } from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Cách lắp đặt — Quy trình lắp đặt điện mặt trời & pin lưu trữ',
  path: '/support/installation',
  description:
    'Quy trình lắp đặt hệ thống Solavita: khảo sát miễn phí, thiết kế và báo giá riêng, đội ngũ lắp đặt và nghiệm thu đầy đủ — kèm giải đáp các câu hỏi thường gặp về lắp đặt.',
  ogImage: '/images/og-solutions.jpg',
  ogImageAlt: 'Lắp đặt điện mặt trời và pin lưu trữ của Solavita',
})

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'Lắp đặt mất bao lâu?',
    answer: 'TBD — Thời gian lắp đặt chính thức (chờ xác nhận).',
  },
  {
    question: 'Tôi có cần chuẩn bị gì trước khi lắp đặt không?',
    answer: 'Không. Đội ngũ của chúng tôi lo khảo sát mái nhà, xin phép và thiết lập.',
  },
  {
    question: 'Nguồn điện của tôi có bị gián đoạn trong quá trình lắp đặt không?',
    answer: 'Không, chúng tôi lắp đặt mà không làm gián đoạn sinh hoạt của hộ gia đình hay doanh nghiệp.',
  },
  {
    question: 'Ai là người lắp đặt hệ thống?',
    answer:
      'TBD — Thông tin chứng nhận của đơn vị lắp đặt (chờ xác nhận).',
  },
]

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/support/installation',
            name: 'Cách lắp đặt | Solavita',
            description:
              'Quy trình lắp đặt 4 bước của Solavita cho hệ thống điện mặt trời và pin lưu trữ.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Hỗ trợ', url: '/support' },
            { name: 'Lắp đặt', url: '/support/installation' },
          ]),
          faqPageJsonLd({
            path: '/support/installation',
            name: 'Câu hỏi thường gặp về lắp đặt Solavita',
            description:
              'Các câu hỏi phổ biến về quy trình lắp đặt điện mặt trời và pin lưu trữ của Solavita.',
            faqs: FAQS,
          }),
        ]}
      />
      <SupportInstallationPage />
    </>
  )
}
