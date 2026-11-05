import SolaMatePage from '@/components/solutions/SolaMatePage'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  serviceListJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'
import {
  solaMateFaqs,
  solaMatePackages,
} from '@/lib/data/solamate'

const PATH = '/solutions/solamate'

const TITLE = 'SolaMate — Điện mặt trời ban công cho căn hộ tại Việt Nam'

const DESCRIPTION =
  'SolaMate là trạm điện mặt trời all-in-one cho ban công, cửa sổ và sân thượng: lắp trong 15 phút, không cần xin phép điện lưới, có Zero-export trên mọi model. Hai mức công suất 800 W và 1600 W.'

export const metadata = buildPageMetadata({
  title: TITLE,
  path: PATH,
  description: DESCRIPTION,
  ogImage: '/images/og-solutions.jpg',
  ogImageAlt: 'SolaMate — điện mặt trời ban công cho căn hộ Việt Nam',
})

export default function Page() {
  // One `Service` per power rating; the three mounting scenarios become
  // the offer catalogue of the 800 W package.
  const serviceSpecs = solaMatePackages.map((p) => ({
    id: p.id,
    eyebrow: `Gói ${p.power}`,
    title: p.name,
    intro: p.summary,
    bullets: [
      `Cấu hình: ${p.panels}, công suất hệ thống ${p.systemPower}`,
      `Micro-inverter: ${p.inverter}`,
      `Sản lượng trung bình: ${p.dailyOutput}`,
      `Tiết kiệm ước tính: ${p.monthlySaving}`,
      `Ban công: ${p.models.balcony} · Che nắng: ${p.models.awning} · Mặt đất: ${p.models.ground}`,
    ],
    imagePath: '/images/product-module-2.webp',
    imageAlt: 'Tấm pin mặt trời màu đen của SolaMate lắp trên khung kiến trúc',
  }))

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Giải pháp', url: '/solutions/solahome/' },
            { name: 'SolaMate', url: PATH },
          ]),
          serviceListJsonLd(serviceSpecs, PATH),
          ...serviceSpecs.map((s) => serviceJsonLd(s, PATH)),
          faqPageJsonLd({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            faqs: solaMateFaqs.map((f) => ({
              question: f.q,
              answer: f.a,
            })),
          }),
        ]}
      />
      <SolaMatePage />
    </>
  )
}
