import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  allSolutionSlugs,
  getSolutionBySlug,
  type SolutionSlug,
} from '@/lib/data/solutions'
import { buildPageMetadata } from '@/lib/seo/metadata'
import {
  breadcrumbJsonLd,
  productJsonLd,
  webPageJsonLd,
  faqPageJsonLd,
} from '@/lib/seo/jsonld'
import JsonLd from '@/components/seo/JsonLd'
import SolutionDetailPage from './PageClient'

/**
 * Visibility switch for `/solutions/[slug]/` Amazon-style detail pages.
 *
 * The route + all components are built and the build emits the four slugs
 * as prerendered static pages, but the public surface still treats every
 * slug as a 404 until marketing confirms launch. Flip this to `false` to
 * ship the detail pages - nothing else needs to change.
 */
const HIDE_DETAIL_PAGES = true

/**
 * /solutions/[slug] - Amazon-style detail page for one of the four
 * Home Energy tiers (one | pro | max | ultra).
 *
 * Server thin / client fat split (mirrors `app/cases/[slug]/page.tsx`):
 *   - This file: resolve slug → SolutionDetail, emit JSON-LD, return
 *     metadata, hand off to the client composition.
 *   - `PageClient.tsx`: GSAP, scroll-triggers, lucide icons and the
 *     whole page composition.
 *
 * All four slugs are pre-generated at build time via
 * `generateStaticParams`, so the sitemap / Google never sees a 404
 * from this route for an unknown-but-valid slug. Genuinely unknown
 * slugs fall through to `notFound()`.
 *
 * JSON-LD emitted on every page:
 *   - WebPage (page-level metadata)
 *   - BreadcrumbList (3 levels: Home → Solutions → tier title)
 *   - Product (per-tier schema with brand, manufacturer, gallery,
 *     additionalProperty spec rows)
 *   - FAQPage (per-tier Q&A mainEntity)
 */

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: SolutionSlug }[]> {
  return allSolutionSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  if (HIDE_DETAIL_PAGES) {
    return {
      ...buildPageMetadata({
        title: 'Not found',
        path: '/solutions/',
      }),
      robots: { index: false, follow: false },
    }
  }

  const { slug } = await params
  const detail = getSolutionBySlug(slug)
  if (!detail) {
    return {
      ...buildPageMetadata({
        title: 'Solution not found',
        path: `/solutions/${slug}/`,
      }),
      robots: { index: false, follow: true },
    }
  }

  const title = `${detail.title} – ${detail.eyebrow}`
  const description = `${detail.intro} ${detail.metric ?? ''}`.trim()

  return buildPageMetadata({
    title,
    description,
    path: `/solutions/${detail.slug}/`,
    ogImage: detail.imagePath,
    ogImageAlt: detail.imageAlt,
  })
}

export default async function SolutionDetailPageRoute({
  params,
}: PageProps) {
  if (HIDE_DETAIL_PAGES) notFound()

  const { slug } = await params
  const detail = getSolutionBySlug(slug)
  if (!detail) notFound()

  const schemas = [
    webPageJsonLd({
      path: `/solutions/${detail.slug}/`,
      name: `${detail.title} – ${detail.eyebrow}`,
      description: detail.intro,
    }),
    breadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Solutions', url: '/solutions/' },
      { name: detail.title, url: `/solutions/${detail.slug}/` },
    ]),
    productJsonLd(detail),
    faqPageJsonLd({
      path: `/solutions/${detail.slug}/`,
      name: `${detail.title} – FAQs`,
      description: `Common questions about ${detail.title}.`,
      // SolutionFaq uses compact q/a; FaqItemForSchema wants question/answer.
      faqs: detail.faqs.map((f) => ({ question: f.q, answer: f.a })),
    }),
  ]

  return (
    <>
      <JsonLd data={schemas} />
      <SolutionDetailPage detail={detail} />
    </>
  )
}
