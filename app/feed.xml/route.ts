/**
 * RSS 2.0 feed at /feed.xml.
 *
 * Source: published VN blog posts (same source as the dynamic sitemap
 * branch - `listAllPublishedForSitemap` under the hood, but reused so a
 * publish / unpublish flips both signals at once).
 *
 * Output: RSS 2.0 with `atom:link self` for feed-reader validation.
 * Domain is sourced from `SITE_URL` so the feed stays consistent with
 * the canonical / OG / Twitter metadata.
 *
 * `dynamic = 'force-dynamic'` so a fresh publish hits the feed
 * immediately on the next request - acceptable cost (the Supabase
 * `published` posts query is cheap and cached at the CDN edge).
 */

import { listAllPublishedForFeed } from '@/lib/data/blog'
import { SITE_URL, absoluteUrl } from '@/lib/seo/site'

export const dynamic = 'force-dynamic'

const SITE_TITLE = 'Blog Solavita Việt Nam'
const SITE_DESCRIPTION =
  'Hướng dẫn, cập nhật sản phẩm và câu chuyện từ đội ngũ Solavita Việt Nam. Nội dung do kỹ sư Solavita biên soạn để bạn tự tin lựa chọn.'
const FEED_LANG = 'vi-VN'

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function cdata(input: string): string {
  // Wrap content that may carry < or & so it survives the feed parser.
  return `<![CDATA[${input.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`
}

export async function GET(): Promise<Response> {
  let posts: Awaited<ReturnType<typeof listAllPublishedForFeed>> = []
  try {
    posts = await listAllPublishedForFeed()
  } catch (err) {
    // Surface a clearly-tagged error so empty-feed outages are
    // alerted on; an empty feed is worse than a logged miss because
    // readers silently treat the feed as dead.
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[feed.xml] blog fetch failed: ${msg}`)
  }

  const lastBuild = new Date().toUTCString()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.category.slug}/${post.slug}`)
      const pubDate = new Date(
        post.published_at ?? post.updated_at ?? Date.now(),
      ).toUTCString()
      const description = post.meta_description ?? post.excerpt ?? ''
      const cover = post.cover_image_url
        ? `${SITE_URL}${post.cover_image_url}`
        : ''
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${escapeXml(pubDate)}</pubDate>
      ${cover ? `<enclosure url="${escapeXml(cover)}" type="image/webp" />` : ''}
      <description>${cdata(description)}</description>
      <category>${escapeXml(post.category.name_en)}</category>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(absoluteUrl('/'))}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${escapeXml(FEED_LANG)}</language>
    <lastBuildDate>${escapeXml(lastBuild)}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // Short CDN cache; client caches longer.
      'Cache-Control': 'public, max-age=0, s-maxage=300',
    },
  })
}
