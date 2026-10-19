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
    question: 'Will this really save me money?',
    answer:
      "Yes. You'll use less expensive grid power and buy far less diesel for your generator. Most families see their monthly bills drop significantly, making it a smart investment.",
  },
  {
    question: 'What happens when the power goes out?',
    answer:
      'Your lights, fridge, and Wi-Fi stay on. The system automatically switches to battery power instantly, so your family stays comfortable and safe, day or night.',
  },
  {
    question: 'How long will the battery last?',
    answer:
      "It's built to last. With a 5-year warranty and 6,000 cycles, this battery can power your home for over 10 years-even with daily use.",
  },
  {
    question: 'Is it hard to maintain?',
    answer:
      'Not at all. Just keep the panels clean. We monitor your system remotely and have local experts ready to help if you need us.',
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
