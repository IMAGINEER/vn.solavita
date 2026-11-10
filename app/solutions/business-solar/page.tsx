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
  title:
    'Commercial & Industrial Solar Solutions in Vietnam | Solavita Việt Nam',
  path: '/solutions/business-solar',
  description:
    'Solar and energy storage systems sized for factories, hotels, retail and processing plants in Vietnam — system configurations, industry scenarios, delivery capability and a savings estimator built on your own electricity bill.',
  ogImage: '/images/og-solutions.jpg',
  ogImageAlt:
    'Commercial and industrial solar and energy storage solutions for Vietnamese businesses',
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
            name:
              'Commercial & Industrial Solar Solutions in Vietnam | Solavita Việt Nam',
            description:
              'Solar and energy storage systems sized for factories, hotels, retail and processing plants in Vietnam — system configurations, industry scenarios, delivery capability and a savings estimator.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'For Business', url: '/solutions/business-solar' },
          ]),
          serviceListJsonLd(serviceSpecs, '/solutions/business-solar'),
          ...serviceSpecs.map((s) =>
            serviceJsonLd(s, '/solutions/business-solar'),
          ),
          faqPageJsonLd({
            path: '/solutions/business-solar',
            name: 'Business solar questions — Solavita Việt Nam',
            description:
              'How a Solavita commercial and industrial solar system is sized, what it can cover and how it is delivered.',
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
