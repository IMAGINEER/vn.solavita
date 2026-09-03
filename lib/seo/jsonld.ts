// JSON-LD builders for the blog surface. Output matches schema.org
// 2024 expectations - see https://schema.org/Article and BreadcrumbList.
//
// The renderers in app/blog/**/page.tsx inject the serialized JSON
// into a `<script type="application/ld+json">` block. Never embed
// unsanitized HTML in these - the inputs are always our own server
// data, but we still go through JSON.stringify for safety.

import type { BlogPostFull } from '@/lib/types/blog'
import { SITE_NAME, absoluteUrl } from './site'

export interface BreadcrumbItem {
  name: string
  url: string
}

/** Schema.org BreadcrumbList. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}

/** Schema.org Article - covers blog posts. Includes publisher logo. */
export function articleJsonLd(
  post: BlogPostFull,
  categorySlug: string,
): Record<string, unknown> {
  const canonical = `/blog/${categorySlug}/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    image: post.cover_image_url ? [absoluteUrl(post.cover_image_url)] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    inLanguage: 'en-GB',
    author: {
      '@type': 'Person',
      name: post.author.display_name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/static/images/a1logo02.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(canonical),
    },
    articleSection: post.category.name_en,
    keywords: post.tags.map((t) => t.name_en).join(', ') || undefined,
  }
}

/** Convenience: serialize for inlining into a `<script>`. */
export function jsonLdScript(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}