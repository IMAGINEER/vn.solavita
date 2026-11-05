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
  'SolaHome lắp điện mặt trời trực tiếp trên mái nhà với biến tần hybrid và pin lưu trữ: hai kiểu lắp SolaRoof và SolaLoft, bốn gói 5 / 10 / 10 ba pha / 15 kWp, hai phương án bổ sung pin dự phòng.'

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
      `Công suất DC: ${p.dcRange}`,
      `Biến tần hybrid: ${p.inverter}`,
      `Giá SolaRoof: ${p.priceRoof}`,
      `Giá SolaLoft: ${p.priceLoft}`,
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
            { name: 'Giải pháp', url: PATH },
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
