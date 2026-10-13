import Home from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Solar & Battery Systems for Nigerian Homes',
  path: '/',
  description:
    'Explore solar and battery solutions for Nigerian homes and small businesses. Compare home-solar and business-solar solutions designed for more reliable power and less generator dependence.',
  ogImage: '/images/hero-system-render.webp',
  ogImageAlt:
    'Solavita Nigeria - solar panels and battery storage for Nigerian homes and small businesses',
})

const HOME_FAQS = [
  {
    question: 'What size solar system do I need?',
    answer:
      'It depends on your appliances, simultaneous power demand, daily energy use and backup requirements. Start with a package and request a tailored recommendation.',
  },
  {
    question: 'Can solar replace my generator?',
    answer:
      'A suitably designed solar and battery system may reduce generator use substantially. Whether it can replace a generator completely depends on your loads, available solar energy and required backup duration.',
  },
  {
    question: 'Can I run an air conditioner?',
    answer:
      "Some solutions may support air conditioners, but compatibility depends on the unit's rated power, starting demand and the other appliances running at the same time.",
  },
  {
    question: 'How long will the battery last?',
    answer:
      'Runtime depends on usable battery capacity and the total load being supplied. A site-specific assessment is needed for a reliable estimate.',
  },
  {
    question: 'How much does a system cost?',
    answer:
      'TBD — Approved Nigerian solution pricing. Request a quote for a system based on your requirements.',
  },
  {
    question: 'Is installation available in my area?',
    answer:
      'TBD — Confirmed Nigeria service coverage.',
  },
]

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/',
            name: 'Solavita Nigeria - Solar & Battery Systems for Nigerian Homes',
            description:
              'Explore solar and battery solutions for Nigerian homes and small businesses.',
          }),
          faqPageJsonLd({
            path: '/#faq',
            name: 'Solavita Nigeria - Frequently Asked Questions',
            description:
              'Common questions about solar and battery solutions, generators, air conditioners, battery runtime, pricing and installation coverage in Nigeria.',
            faqs: HOME_FAQS,
          }),
          breadcrumbJsonLd([{ name: 'Home', url: '/' }]),
        ]}
      />
      <Home />
    </>
  )
}
