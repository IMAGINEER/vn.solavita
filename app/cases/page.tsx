import CasesPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  creativeWorkListJsonLd,
} from '@/lib/seo/jsonld'
import { caseStudies } from '@/lib/data/uk-cases'
import { absoluteUrl } from '@/lib/seo/site'

export const metadata = buildPageMetadata({
  title: 'Case Studies',
  path: '/cases',
  description:
    'Real Solavita installations across Italy and Germany. See how solar and battery systems perform on homes like yours.',
  ogImage: '/images/hero-cases.webp',
  ogImageAlt:
    'Solavita case studies - real installations of solar and battery systems across Europe',
})

export default function Page() {
  // Project each `CaseStudy` into the schema-friendly shape. The detail
  // pages themselves stay `noindex` (see app/cases/[slug]/page.tsx) so
  // we deliberately emit CreativeWork stubs here - not Article nodes.
  const list = caseStudies.map((c) => ({
    name: `${c.city} · ${c.systemLabel}`,
    url: absoluteUrl(`/cases/${c.slug}/`),
    image: absoluteUrl(c.imagePath),
    description: c.description.slice(0, 200),
  }))

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/cases',
            name: 'Case Studies',
            description:
              'Real Solavita installations across Italy and Germany. See how solar and battery systems perform on homes like yours.',
          }),
          creativeWorkListJsonLd(list),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Case Studies', url: '/cases' },
          ]),
        ]}
      />
      <CasesPage />
    </>
  )
}