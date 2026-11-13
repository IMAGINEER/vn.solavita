import SolaHomePage from '@/components/solutions/SolaHomePage'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  serviceListJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'
import { solaHomeFaqs, solaHomePackages } from '@/lib/data/solahome'

const PATH = '/solutions/solahome'

const TITLE = 'SolaHome — Điện mặt trời mái nhà cho biệt thự & nhà phố'

const DESCRIPTION =
  'SolaHome — điện mặt trời cho biệt thự và nhà phố: chọn cách lắp theo mái ngói, mái tôn hay mái bằng; chọn gói 5 / 10 / 15 kWp theo hóa đơn điện và diện tích mái; pin lưu trữ tùy chọn. Báo giá theo cấu hình sau khảo sát.'

export const metadata = buildPageMetadata({
  title: TITLE,
  path: PATH,
  description: DESCRIPTION,
  ogImage: '/images/og-solahome.jpg',
  ogImageAlt: 'SolaHome — hệ điện mặt trời mái nhà cho biệt thự Việt Nam',
})

export default function Page() {
  const serviceSpecs = solaHomePackages.map((p) => ({
    id: p.id,
    eyebrow: `${p.capacity} · Biến tần hybrid ${p.phase}`,
    title: `${p.name} ${p.capacity}`,
    intro: p.summary,
    bullets: [
      `Diện tích mái: ${p.roofArea}`,
      `Tấm pin: ${p.panels}`,
      `Sản lượng tham chiếu: ${p.dailyOutput}`,
      `Biến tần hybrid: ${p.inverter}`,
      `Phù hợp với: ${p.fits}`,
    ],
    imagePath: '/images/solahome/hero.webp',
    imageAlt: 'Biệt thự có hệ điện mặt trời SolaHome lắp trên mái nhà',
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
            { name: 'SolaHome', url: PATH },
          ]),
          serviceListJsonLd(serviceSpecs, PATH),
          ...serviceSpecs.map((s) => serviceJsonLd(s, PATH)),
          faqPageJsonLd({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            faqs: solaHomeFaqs.map((f) => ({
              question: f.q,
              answer: f.a,
            })),
          }),
        ]}
      />
      <SolaHomePage />
    </>
  )
}
