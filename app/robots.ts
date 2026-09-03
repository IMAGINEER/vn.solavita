// Dynamic robots.txt - Next.js App Router convention. Allows public
// crawlers into the storefront and blog, blocks the admin surface and
// any draft URLs. Sitemap URL is published so crawlers can find it.

import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        // Admin surface, internal API, dynamic my-plan tokens, and
        // cookie-management endpoints must never be crawled or indexed.
        disallow: [
          '/admin',
          '/admin/*',
          '/api',
          '/api/*',
          '/my-plan/*', // every /my-plan/[token] is private
          '/*/draft*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}