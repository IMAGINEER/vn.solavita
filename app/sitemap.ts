// Dynamic sitemap - Next.js App Router convention. Re-generated on
// every request (it reads fresh from Supabase; the call is cheap and
// cached at the CDN edge for short TTLs).
//
// Public read paths only: only `status='published'` blog posts show up
// here, and category landing pages only when they have at least one
// published post.

import type { MetadataRoute } from 'next'
import { listAllPublishedForSitemap, getCategories } from '@/lib/data/blog'
import { SITE_URL, absoluteUrl } from '@/lib/seo/site'

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
    { path: '/solutions', priority: 0.9 },
    { path: '/cases', priority: 0.8 },
    { path: '/about-us', priority: 0.7 },
    { path: '/hems', priority: 0.7 },
    { path: '/support', priority: 0.7 },
    { path: '/for-partners', priority: 0.6 },
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

  try {
    const [categories, posts] = await Promise.all([
      getCategories(),
      listAllPublishedForSitemap(),
    ])

    // Category landing pages.
    for (const cat of categories) {
      const hasPost = posts.some((p) => p.categorySlug === cat.slug)
      if (!hasPost) continue
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
    // routes still serve.
    console.error('sitemap blog fetch failed:', err)
  }

  return entries
}