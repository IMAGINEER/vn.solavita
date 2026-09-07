import SolutionsPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { solutionDetails } from '@/lib/data/solutions'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  serviceJsonLd,
  serviceListJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Solar & Battery Solutions',
  path: '/solutions',
  description:
    'Four tiers of solar and battery solutions for UK homes — from solar-only to whole-home energy with HEMS, EV charging and heat pump support.',
  ogImage: '/images/hero-solutions.webp',
  ogImageAlt:
    'Four tiers of solar and battery solutions for UK homes - solar only, solar plus storage, solar plus storage plus EV, and whole-home energy',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/solutions',
            name: 'Solar & Battery Solutions',
            description:
              'Four tiers of solar and battery solutions for UK homes - from solar-only to whole-home energy with HEMS, EV charging and heat pump support.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Solutions', url: '/solutions' },
          ]),
          serviceListJsonLd(solutionDetails),
          ...solutionDetails.map((s) => serviceJsonLd(s)),
        ]}
      />
      <SolutionsPage />
    </>
  )
}