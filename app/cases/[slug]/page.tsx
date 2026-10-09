import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  allCaseSlugs,
  caseStudies,
  getCaseBySlug,
} from '@/lib/data/uk-cases'
import { buildPageMetadata } from '@/lib/seo/metadata'
import {
  breadcrumbJsonLd,
  webPageJsonLd,
} from '@/lib/seo/jsonld'
import JsonLd from '@/components/seo/JsonLd'
import CaseDetailClient from '@/components/cases/CaseDetailClient'

/**
 * /cases/[slug] - Single UK case study detail page.
 *
 * Server wrapper that:
 *   1. Resolves the slug → CaseStudy (notFound() on miss)
 *   2. Emits per-page metadata via buildPageMetadata()
 *   3. Injects WebPage + BreadcrumbList JSON-LD so Google can show
 *      this URL as a rich result.
 *
 * The visual markup lives in CaseDetailClient ('use client') so the
 * GSAP entry animation + Lucide icons stay client-side. Other public
 * detail pages (/blog/[category]/[slug], /solutions, ...) follow the
 * same server-thin / client-fat pattern.
 *
 * All 13 slugs are pre-generated at build time via generateStaticParams
 * so the sitemap/Google never sees a 404 from this route.
 */

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allCaseSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const c = getCaseBySlug(slug)
  if (!c) {
    return {
      ...buildPageMetadata({
        title: 'Case study not found',
        path: `/cases/${slug}/`,
      }),
      robots: { index: false, follow: true },
    }
  }
  const title = `Solavita installation in ${c.city} · ${c.systemLabel}`
  const description = `${c.description} ${c.annualGeneration ? `Annual generation ${c.annualGeneration}.` : ''} ${c.annualSavingGbp ?? c.annualSaving ? `Annual saving ${c.annualSavingGbp ?? c.annualSaving}.` : ''}`.trim()
  // SEO (2026-09): the 13 IT/DE reference cases duplicate content that
  // lives canonically on it.solavita.com / de.solavita.com. Marking
  // these detail pages `noindex, follow` stops Google from treating
  // the UK copies as duplicates competing for the same ranking, while
  // `follow` still passes equity through the sibling rail for users
  // who land here from /cases/. Also see app/sitemap.ts - the matching
  // entries are intentionally absent there so the two signals don't
  // contradict each other.
  return {
    ...buildPageMetadata({
      title,
      description,
      path: `/cases/${c.slug}/`,
      ogImage: c.imagePath,
      ogImageAlt: `${c.city} Solavita installation`,
    }),
    robots: { index: false, follow: true },
  }
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { slug } = await params
  const c = getCaseBySlug(slug)
  if (!c) notFound()

  // Sibling cases for "more installations" rail (skip the current one).
  const siblings = caseStudies.filter((x) => x.slug !== c.slug).slice(0, 3)

  const schemas = [
    webPageJsonLd({
      path: `/cases/${c.slug}/`,
      name: `${c.city} · ${c.systemLabel} — Solavita case study`,
      description: c.description,
    }),
    breadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Case Studies', url: '/cases/' },
      { name: c.city, url: `/cases/${c.slug}/` },
    ]),
  ]

  return (
    <>
      <JsonLd data={schemas} />
      <CaseDetailClient caseStudy={c} siblings={siblings} />
    </>
  )
}
