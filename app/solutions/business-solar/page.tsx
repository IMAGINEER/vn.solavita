import BusinessSolarPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { solutionDetails, businessSolutionFaqs } from '@/lib/data/solutions'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  serviceListJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'

/**
 * /solutions/business-solar — trang Giải pháp Công nghiệp & Thương mại.
 *
 * Metadata và structured data mô tả ba cấu hình doanh nghiệp đang công bố
 * cùng bộ FAQ hiển thị trên trang.
 */

export const metadata = buildPageMetadata({
  // Vietnamese, and WITHOUT a brand suffix — the root layout's title
  // template appends ` | Solavita Việt Nam` exactly once.
  title: 'Điện mặt trời & pin lưu trữ cho doanh nghiệp tại Việt Nam',
  path: '/solutions/business-solar',
  description:
    'So sánh ba giải pháp điện mặt trời cho doanh nghiệp tại Việt Nam — BUSINESS Entry, BUSINESS Standard và BUSINESS Flagship 3-Phase. Cấu hình hệ thống, công suất và phạm vi cung cấp.',
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
              'So sánh ba giải pháp điện mặt trời cho doanh nghiệp tại Việt Nam — BUSINESS Entry 3-Phase, BUSINESS Standard 3-Phase và BUSINESS Flagship 3-Phase.',
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
            faqs: businessSolutionFaqs.map((f) => ({
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