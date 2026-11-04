import HomeSolarPage from './PageClient'
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
  title: 'Home Solar Solutions in Vietnam | Solavita Việt Nam',
  path: '/solutions/home-solar',
  description:
    'Compare three home-solar solutions for Vietnamese households — LITE Essential Backup, HOME Standard, HOME High-spec. Sized for appliances, essential loads, comfort and backup priorities.',
  ogImage: '/images/og-solutions.jpg',
  ogImageAlt: 'Home Solar solutions for Vietnamese households',
})

export default function Page() {
  const homeSolutions = solutionDetails.filter((p) => p.segment === 'homes')
  const serviceSpecs = homeSolutions.map((d) => ({
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
            path: '/solutions/home-solar',
            name: 'Home Solar Solutions in Vietnam | Solavita Việt Nam',
            description:
              'Compare three home-solar solutions for Vietnamese households — LITE Essential Backup, HOME Standard, HOME High-spec.',
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'For Home', url: '/solutions/home-solar' },
          ]),
          serviceListJsonLd(serviceSpecs, '/solutions/home-solar'),
          ...serviceSpecs.map((s) => serviceJsonLd(s, '/solutions/home-solar')),
        ]}
      />
      <HomeSolarPage />
    </>
  )
}
