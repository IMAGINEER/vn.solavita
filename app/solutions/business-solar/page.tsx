import BusinessSolarPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { solutionDetails } from '@/lib/data/solutions'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  serviceListJsonLd,
  serviceJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Business Solar Solutions in Vietnam | Solavita Việt Nam',
  path: '/solutions/business-solar',
  description:
    'Compare three business-solar solutions for Vietnamese small businesses — BUSINESS Entry 3-Phase, BUSINESS Standard 3-Phase, BUSINESS Flagship 3-Phase. Sized for equipment loads, operating hours and critical-load priorities.',
  ogImage: '/images/og-solutions.jpg',
  ogImageAlt: 'Business Solar solutions for Vietnamese small businesses',
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
            name: 'Business Solar Solutions in Vietnam | Solavita Việt Nam',
            description:
              'Compare three business-solar solutions for Vietnamese small businesses — BUSINESS Entry 3-Phase, BUSINESS Standard 3-Phase, BUSINESS Flagship 3-Phase.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'For Business', url: '/solutions/business-solar' },
          ]),
          serviceListJsonLd(serviceSpecs, '/solutions/business-solar'),
          ...serviceSpecs.map((s) =>
            serviceJsonLd(s, '/solutions/business-solar'),
          ),
        ]}
      />
      <BusinessSolarPage />
    </>
  )
}
