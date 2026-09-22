// Dynamic robots.txt - Next.js App Router convention. Allows public
// crawlers into the storefront and blog, blocks the admin surface and
// any draft URLs. Sitemap URL is published so crawlers can find it.
//
// AI-crawler policy (2026 GEO stance):
// We opt OUT of LLM training corpora by default. The three groups below
// are the canonical "AI training" agents that respect robots.txt - if
// business later wants to license content for training, flip each rule
// to `allow: ['/']` instead of removing the entry, so the opt-out is
// auditable in git history.
//
// IMPORTANT: This does NOT block Googlebot / Bingbot from using our
// pages in Google AI Overviews / Bing Copilot. Those crawlers ship as
// their own user-agents (`Googlebot`, not `GPTBot`) and still index
// the storefront - which is exactly what we want for answer-engine
// citations. To opt out of those too, add `User-agent: Google-Extended`
// with `Disallow: /` (blocks Google AI training only - not Search).

import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI training corpora - opt out. Each entry is the canonical
      // user-agent string as published by the operator (2026-Q3).
      { userAgent: 'GPTBot', disallow: ['/'] },
      { userAgent: 'ChatGPT-User', disallow: ['/'] },
      { userAgent: 'ClaudeBot', disallow: ['/'] },
      { userAgent: 'Claude-Web', disallow: ['/'] },
      { userAgent: 'CCBot', disallow: ['/'] },
      { userAgent: 'anthropic-ai', disallow: ['/'] },
      { userAgent: 'PerplexityBot', disallow: ['/'] },
      { userAgent: 'Bytespider', disallow: ['/'] },
      // Google-Extended is the SEPARATE signal Google added in 2023
      // for "use my content for Gemini training". Blocking it does
      // NOT block Google Search or AI Overviews - those still work.
      { userAgent: 'Google-Extended', disallow: ['/'] },
      {
        userAgent: '*',
        // Admin surface, internal API, dynamic my-plan tokens, and
        // cookie-management endpoints must never be crawled or indexed.
        // `Allow: /` is omitted on purpose - Google and Bing treat
        // absence of `Disallow` as allow by default.
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