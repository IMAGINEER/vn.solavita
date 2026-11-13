import Home from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  // `title.template` from app/layout.tsx does NOT apply to a page that
  // lives in the same segment as the layout, so the homepage — the one
  // title that must carry the brand — was shipping brandless. Put the
  // brand in explicitly here.
  title: 'Solavita Việt Nam — Điện mặt trời & pin lưu trữ cho gia đình',
  path: '/',
  description:
    'Điện mặt trời kèm pin lưu trữ cho hộ gia đình và doanh nghiệp tại Việt Nam. Chọn giải pháp theo hóa đơn điện và nhu cầu dự phòng; khảo sát miễn phí, báo giá theo cấu hình.',
  ogImage: '/images/og-home.jpg',
  ogImageAlt:
    'Solavita Việt Nam - tấm pin mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp',
})

const HOME_FAQS = [
  {
    question: 'Hệ thống điện mặt trời có thực sự giúp tiết kiệm không?',
    answer:
      'Có. Điện mặt trời được dùng ngay khi phát sinh, nên lượng điện mua từ lưới vào ban ngày giảm. Mức tiết kiệm phụ thuộc sản lượng, hóa đơn và cách dùng điện của từng gia đình.',
  },
  {
    question: 'Điều gì xảy ra khi mất điện lưới?',
    answer:
      'Đèn, tủ lạnh và Wi-Fi của bạn vẫn hoạt động. Hệ thống tự động chuyển sang pin lưu trữ gần như tức thì, giúp gia đình giữ sinh hoạt ổn định cả ngày lẫn đêm.',
  },
  {
    question: 'Pin lưu trữ dùng được bao lâu?',
    answer:
      'Pin LiFePO₄ được bảo hành 10 năm và vượt 8.000 chu kỳ sạc xả — đủ bền cho nhu cầu dùng điện hằng ngày của gia đình.',
  },
  {
    question: 'Hệ thống có khó bảo trì không?',
    answer:
      'Không. Bạn chỉ cần giữ tấm pin sạch. Chúng tôi giám sát hệ thống từ xa và đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ khi bạn cần.',
  },
]

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/',
            name: 'Solavita Việt Nam - Điện mặt trời & pin lưu trữ cho hộ gia đình',
            description:
              'Khám phá giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp tại Việt Nam.',
          }),
          faqPageJsonLd({
            path: '/#faq',
            name: 'Solavita Việt Nam - Câu hỏi thường gặp',
            description:
              'Những câu hỏi thường gặp về điện mặt trời và pin lưu trữ: chi phí, thời gian hoạt động của pin, bảo trì và phạm vi lắp đặt tại Việt Nam.',
            faqs: HOME_FAQS,
          }),
          breadcrumbJsonLd([{ name: 'Trang chủ', url: '/' }]),
        ]}
      />
      <Home />
    </>
  )
}