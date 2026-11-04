import Home from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Điện mặt trời & pin lưu trữ cho hộ gia đình Việt Nam',
  path: '/',
  description:
    'Khám phá giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp nhỏ tại Việt Nam. So sánh cấu hình hệ thống và tìm giải pháp giúp nguồn điện ổn định hơn.',
  ogImage: '/images/og-home.jpg',
  ogImageAlt:
    'Solavita Việt Nam - tấm quang năng và pin lưu trữ cho hộ gia đình và doanh nghiệp nhỏ',
})

const HOME_FAQS = [
  {
    question: 'Hệ thống điện mặt trời có thực sự giúp tiết kiệm không?',
    answer:
      'Có. Bạn sẽ dùng ít điện lưới hơn vào giờ cao điểm và tận dụng nguồn điện tự sản xuất vào ban ngày. Phần lớn hộ gia đình thấy hoá đơn điện giảm rõ rệt qua từng tháng.',
  },
  {
    question: 'Điều gì xảy ra khi mất điện lưới?',
    answer:
      'Đèn, tủ lạnh và Wi-Fi của bạn vẫn hoạt động. Hệ thống tự động chuyển sang pin lưu trữ gần như tức thì, giúp gia đình giữ sinh hoạt ổn định cả ngày lẫn đêm.',
  },
  {
    question: 'Pin lưu trữ dùng được bao lâu?',
    answer:
      'Pin được thiết kế để vận hành bền bỉ. Với bảo hành 5 năm và 6.000 chu kỳ sạc xả, pin có thể đồng hành cùng gia đình bạn hơn 10 năm, kể cả khi sử dụng hằng ngày.',
  },
  {
    question: 'Hệ thống có khó bảo trì không?',
    answer:
      'Không. Bạn chỉ cần giữ tấm quang năng sạch. Chúng tôi giám sát hệ thống từ xa và đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ khi bạn cần.',
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
              'Khám phá giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp nhỏ tại Việt Nam.',
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