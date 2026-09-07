// Server component that emits one or more Schema.org JSON-LD
// `<script type="application/ld+json">` blocks.
//
// Use it once per page, passing either a single Schema object or an
// array (e.g. [WebPage, BreadcrumbList]). The component:
//   1. Wraps the payload in `https://schema.org` `@context` if absent
//      (every builder in lib/seo/jsonld already does this via
//      `withContext`, so this is defence in depth).
//   2. Serializes with `JSON.stringify`, escaping `<` so the JSON
//      can't break out of the script block.
//   3. Renders each entry as its own `<script>` tag - crawlers that
//      read only the first `application/ld+json` block still see the
//      most important node first; emitting them separately also keeps
//      the validator happy.
//
// This is a server component so there is zero client JS shipped for
// Schema - just static HTML in the initial response.

import { jsonLdScript } from '@/lib/seo/jsonld'

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export default function JsonLd({ data }: JsonLdProps) {
  const entries = Array.isArray(data) ? data : [data]
  return (
    <>
      {entries.map((entry, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdScript(entry) }}
        />
      ))}
    </>
  )
}