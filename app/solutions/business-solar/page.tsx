import BusinessSolarPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { solutionDetails } from '@/lib/data/solutions'
import { cniFaqs } from '@/lib/data/cni'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  serviceListJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'

/**
 * /solutions/business-solar — the Commercial & Industrial page.
 *
 * The metadata and the structured data were rewritten with the page
 * (Nov 2026): the old description still advertised "three business-solar
 * solutions for Vietnamese small businesses", which is no longer what
 * the page is. The schema now describes the three published business
 * configurations plus the FAQ set rendered on the page.
 */

export const metadata = buildPageMetadata({
  // Vietnamese, and WITHOUT a brand suffix — the root layout's title
  // template appends ` | Solavita Việt Nam` exactly once.
  title: 'Điện mặt trời & pin lưu trữ cho doanh nghiệp tại Việt Nam',
  path: '/solutions/business-solar',
  description:
    'Hệ thống điện mặt trời và pin lưu trữ thiết kế riêng cho nhà máy, khách sạn, cửa hàng bán lẻ và cơ sở chế biến tại Việt Nam — cấu hình hệ thống, kịch bản theo từng ngành, năng lực triển khai và công cụ ước tính tiết kiệm dựa trên hóa đơn điện thực tế của bạn.',
  ogImage: '/images/og-solutions.jpg',
  ogImageAlt:
    'Giải pháp điện mặt trời và pin lưu trữ cho doanh nghiệp tại Việt Nam',
})

export default function Page() {
  const businessSolutions = solutionDetails.filter(
    (p) => p.segment === 'businesses',
  )
  const serviceSpecs = businessSolutions.map((d) => ({
    id: d.id,
    eyebrow: d.eyebrow,
    title: d.title,
    intro: d.intro,
    bullets: d.bullets,
    imagePath: d.imagePath,
    imageAlt: d.imageAlt,
  }))

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/solutions/business-solar',
            name: 'Điện mặt trời & pin lưu trữ cho doanh nghiệp tại Việt Nam',
            description:
              'Hệ thống điện mặt trời và pin lưu trữ thiết kế cho nhà máy, khách sạn, cửa hàng bán lẻ và cơ sở chế biến tại Việt Nam — cấu hình hệ thống, kịch bản theo ngành và năng lực triển khai.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Doanh nghiệp', url: '/solutions/business-solar' },
          ]),
          serviceListJsonLd(serviceSpecs, '/solutions/business-solar'),
          ...serviceSpecs.map((s) =>
            serviceJsonLd(s, '/solutions/business-solar'),
          ),
          faqPageJsonLd({
            path: '/solutions/business-solar',
            name: 'Câu hỏi về điện mặt trời cho doanh nghiệp — Solavita Việt Nam',
            description:
              'Cách Solavita thiết kế hệ thống điện mặt trời cho doanh nghiệp, hệ thống đáp ứng được nhu cầu gì và quy trình triển khai ra sao.',
            faqs: cniFaqs.map((f) => ({
              question: f.q,
              answer: f.a,
            })),
          }),
        ]}
      />
      <BusinessSolarPage />
    </>
  )
}
