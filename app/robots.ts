// Dynamic robots.txt - Next.js App Router convention.
//
// ────────────────────────────────────────────────────────────────
// PRE-LAUNCH: THE WHOLE SITE IS CLOSED TO CRAWLERS.
//
// The Vietnam site is still being populated and its business facts
// (prices, addresses, phone numbers, the my-plan ROI figures) are
// not all confirmed yet, so nothing here is ready to be indexed.
// A single wildcard rule closes the entire site:
//
//     User-agent: *
//     Disallow: /
//
// That covers every crawler — Google, Bing, the AI training bots
// (GPTBot, ClaudeBot, PerplexityBot, Bytespider, Google-Extended)
// and every other agent that honours robots.txt. The per-agent
// opt-out list this file used to carry is therefore redundant: a
// `*` rule with `Disallow: /` already excludes them, and dropping
// them removes a maintenance surface where one entry could be
// forgotten.
//
// `sitemap:` and `host:` are intentionally omitted. Advertising a
// sitemap to crawlers we are asking not to crawl is contradictory,
// and `host` is a non-standard directive that only Yandex reads.
//
// NOTE — robots.txt alone does NOT de-index URLs that Google
// already knows about (it can still show them as bare links, and
// it cannot read a `noindex` on a page it is not allowed to fetch).
// The matching half of this change is the site-wide `noindex` meta
// tag in `lib/seo/site.ts` (`SITE_INDEXING_ENABLED`), which every
// page inherits. Both are driven from the same switch, so re-opening
// the site before launch is one edit.
//
// To reopen the site later:
//   1. set SITE_INDEXING_ENABLED = true in lib/seo/site.ts
//   2. restore the rules block below
//   3. re-publish the sitemap in the `sitemap:` field
// ────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everything, for everyone. No path is reachable.
      { userAgent: '*', disallow: ['/'] },
    ],
  }
}
