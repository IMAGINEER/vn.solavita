import { notFound } from 'next/navigation'
import {
  allCaseSlugs,
  getCaseBySlug,
} from '@/lib/data/uk-cases'

/**
 * /cases/[slug] - Single Nigerian case study detail page.
 *
 * Until Nigerian case studies are verified, `caseStudies` is empty and
 * `allCaseSlugs()` returns an empty array — `generateStaticParams`
 * emits no slugs, so this route is effectively unreachable. Any direct
 * visit to `/cases/[slug]/` falls through to `notFound()`.
 *
 * When real NG cases are added (one entry in `lib/data/uk-cases.ts`),
 * the route becomes a server-thin wrapper:
 *   1. Resolve the slug → CaseStudy (notFound() on miss).
 *   2. Emit per-page metadata + JSON-LD.
 *   3. Hand off to the existing `<CaseDetailClient />` component
 *      (`components/cases/CaseDetailClient.tsx`).
 *
 * The component (`CaseDetailClient`) and the slug helper
 * (`allCaseSlugs`) are kept importable so the moment a case is added,
 * the route lights up by re-introducing the `default async function
 * CaseDetailPage` body that previously existed.
 */

export async function generateStaticParams() {
  return allCaseSlugs().map((slug) => ({ slug }))
}

export default function Page() {
  // No verified NG cases - 404. The cases index at /cases renders the
  // neutral empty state for users.
  notFound()
}
