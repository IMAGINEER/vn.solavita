// Dynamic sitemap - Next.js App Router convention. Re-generated on
// every request (it reads fresh from Supabase; the call is cheap and
// cached at the CDN edge for short TTLs).
//
// Public read paths only: only `status='published'` blog posts show up
// here, and category landing pages only when they have at least one
// published post.

import type { MetadataRoute } from 'next'
import { listAllPublishedForSitemap, getCategories } from '@/lib/data/blog'
import { absoluteUrl } from '@/lib/seo/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages - the project's full public surface. Kept here so the
  // sitemap is the single source of truth for "what Google should see".
  //
  // URLs are built with `absoluteUrl()` so they pick up the trailing
  // slash the rest of the site (canonical / JSON-LD) uses, matching
  // next.config.js#trailingSlash.
  const staticPaths: Array<{ path: string; priority: number }> = [
    { path: '/', priority: 1.0 },
    // The three solution lines replace the legacy /solutions overview.
    // SolaMate (balcony & mobile) and SolaHome (rooftop) both sit at the
    // same 0.9 priority as the old overview did.
    { path: '/solutions/solamate', priority: 0.9 },
    { path: '/solutions/solahome', priority: 0.9 },
    { path: '/solutions/business-solar', priority: 0.9 },
    // Products — the four detail pages only. The /products hub was
    // removed (Oct 2026); the nav links straight to each product and
    // /products redirects to /products/module (next.config.js).
    // The 125 kW / 261 kWh All-in-One ESS lives here as a PRODUCT
    // (/products/all-in-one-ess), not as a third solutions page.
    { path: '/products/module', priority: 0.7 },
    { path: '/products/inverter', priority: 0.7 },
    { path: '/products/battery', priority: 0.7 },
    { path: '/products/all-in-one-ess', priority: 0.7 },
    { path: '/cases', priority: 0.8 },
    { path: '/about-us', priority: 0.7 },
    { path: '/monitoring-app', priority: 0.6 },
    { path: '/support', priority: 0.7 },
    // "How to Install" page — the target of the Support page's
    // Installation card CTA.
    { path: '/support/installation', priority: 0.6 },
    { path: '/for-partners', priority: 0.6 },
    // "Chương trình Đối tác Vàng" — the standalone recruitment campaign
    // page (standee 20/09/2026). Split out of /for-partners on
    // 2026-11-05; it carries the URL printed on the roll-up and behind
    // the QR code, so it is a landing page in its own right.
    { path: '/for-partners/gold-partner', priority: 0.7 },
    { path: '/contact-us', priority: 0.6 },
    { path: '/blog', priority: 0.8 },
    { path: '/terms', priority: 0.3 },
    { path: '/privacy', priority: 0.3 },
    { path: '/cookies', priority: 0.3 },
  ]

  const entries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: absoluteUrl(s.path),
    lastModified: now,
    changeFrequency: s.path === '/' ? 'weekly' : 'monthly',
    priority: s.priority,
  }))

  // No per-tier /solutions/[slug]/ detail pages. The three solution
  // pages (/solutions/solamate, /solutions/solahome and
  // /solutions/business-solar) are the only entry points for the VN
  // packages - the comparison tables, FAQs and tailored CTA on each
  // page surface the tier-level content directly. Per-tier Product
  // schema and SEO live on the page itself.

  try {
    const [categories, posts] = await Promise.all([
      // Only emit category landing pages that have at least one
      // published VN post — matches the public page rule (the dynamic
      // route also 404s empty categories via `onlyWithPublishedPosts`).
      getCategories({ onlyWithPublishedPosts: true }),
      listAllPublishedForSitemap(),
    ])

    // Category landing pages.
    for (const cat of categories) {
      entries.push({
        url: absoluteUrl(`/blog/category/${cat.slug}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }

    // Individual posts.
    for (const post of posts) {
      const lastMod = new Date(post.updated_at || post.published_at || now.toISOString())
      entries.push({
        url: absoluteUrl(`/blog/${post.categorySlug}/${post.slug}`),
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch (err) {
    // Don't fail the whole sitemap if Supabase is hiccupping - static
    // routes still serve. Surface a clearly-tagged error so it can be
    // alerted on in Netlify build logs / log drain - the previous
    // bare `console.error` was easy to miss among build noise.
    const msg = err instanceof Error ? err.message : String(err)
    console.error(
      `[sitemap] blog fetch failed - serving ${entries.length} static + solution entries. Error: ${msg}`,
    )
  }

  // Case-study detail pages are intentionally NOT listed here. The
  // public surface is the /cases index only (`lib/data/vn-cases.ts`
  // holds the reference installations, none of which has a detail
  // page yet). When real VN cases are added, the detail route is
  // reintroduced behind a noindex meta so neither signal nor sitemap
  // list it - keeping the two signals in agreement.

  return entries
}