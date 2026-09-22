// JSON-LD builders for the whole site. Every page-level Schema (Article,
// BreadcrumbList, WebPage, AboutPage, ContactPage, Service, FAQPage, etc.)
// is built here so a future tweak (e.g. locale flip, new field) lands in
// one place.
//
// Output is consumed by the `JsonLd` server component which serializes
// the object into a `<script type="application/ld+json">` block. Never
// embed the returned objects unsanitized in HTML - they always go through
// `withContext` → `JSON.stringify` for safety.

import type { BlogCategory, BlogPostFull } from '@/lib/types/blog'
import type { SolutionDetail } from '@/lib/data/solutions'
import {
  SITE_LOCALE,
  SITE_NAME,
  SITE_LEGAL_NAME,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from './site'

/* ────────────────────────────────────────────────────────────────────────
   Stable entity IDs.

   The `@id` fields below are used by every other Schema in the codebase
   (Article.publisher, WebPage.isPartOf, BreadcrumbList.item, ...) so all
   references resolve to the same nodes. Don't change them without
   auditing every consumer - existing crawlers won't migrate.

   Hashed only by URL fragment, not by anything that might drift
   (version numbers, A/B variants, env vars). If we ever need to rename,
   keep both old and new ids and 301.
   ──────────────────────────────────────────────────────────────────────── */

export const ORG_ID = `${absoluteUrl('/')}#organization`
export const SITE_ID = `${absoluteUrl('/')}#website`
export const PARENT_ORG_ID = 'https://www.skyworth-pv.com/#organization'

/* ────────────────────────────────────────────────────────────────────────
   Output wrappers
   ──────────────────────────────────────────────────────────────────────── */

/** Inject the schema.org context + an optional `@id`. */
export function withContext<T extends Record<string, unknown>>(
  node: T,
  id?: string,
): T & { '@context': 'https://schema.org'; '@id'?: string } {
  const out: T & { '@context': 'https://schema.org'; '@id'?: string } = {
    '@context': 'https://schema.org',
    ...node,
  }
  if (id) out['@id'] = id
  return out
}

/** Convenience: serialize for inlining into a `<script>`. */
export function jsonLdScript(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

/* ────────────────────────────────────────────────────────────────────────
   Brand-defining entities (Organization / WebSite)

   Lives in the root layout via `<JsonLd>`. Every page that mentions
   Solavita UK can `@id`-reference these instead of duplicating them.

   Fields are limited to values that exist in the codebase - no
   invented phone, company number, founding year, or social handles.
   When business confirms those, add them in one place here.
   ──────────────────────────────────────────────────────────────────────── */

export function organizationJsonLd() {
  return withContext(
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      legalName: SITE_LEGAL_NAME,
      url: absoluteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/a1logo02.svg'),
      },
      // Registered office from app/terms/PageClient.tsx.
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'C/O Buzzacott LLP, 130 Wood Street',
        addressLocality: 'London',
        postalCode: 'EC2V 6DL',
        addressCountry: 'GB',
      },
      // Contact point: only fields that exist in the codebase. Telephone
      // is intentionally omitted until business supplies a real UK number.
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'mailto:uk@solavita.com',
          areaServed: 'GB',
          availableLanguage: ['en-GB'],
        },
      ],
      // Parent brand. Public URL from the SKYWORTH corporate site -
      // footer link target. The parent itself is NOT described here;
      // we only declare the relationship.
      parentOrganization: {
        '@type': 'Organization',
        '@id': PARENT_ORG_ID,
        name: 'SKYWORTH Group',
        url: 'https://www.skyworth-pv.com',
      },
      // Headquarters location - only declared because `lib/data/about.ts`
      // lists "London · United Kingdom" as the UK office. Do NOT add
      // foundingDate / sameAs / knowsAbout / award here until business
      // supplies verifiable values - the brand-defining entity is the
      // single source of truth used by every other page's schema.
      location: {
        '@type': 'Place',
        name: 'London, United Kingdom',
      },
    },
    ORG_ID,
  )
}

export function websiteJsonLd() {
  return withContext(
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      name: SITE_NAME,
      url: absoluteUrl('/'),
      inLanguage: SITE_LOCALE,
      publisher: { '@id': ORG_ID },
    },
    SITE_ID,
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Page-level Schemas
   ──────────────────────────────────────────────────────────────────────── */

export interface BreadcrumbItem {
  name: string
  url: string
}

/** Schema.org BreadcrumbList. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return withContext({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  })
}

/**
 * Generic WebPage shell. Most pages use this with `isPartOf: WebSite`
 * + `publisher: Organization` so Google sees the page as part of the
 * site / brand. Page-type-specific schemas (AboutPage, ContactPage,
 * FAQPage, ...) extend / replace `WebPage` on the page that fits.
 */
export function webPageJsonLd(opts: {
  path: string
  name: string
  description?: string
  inLanguage?: string
}) {
  const url = absoluteUrl(opts.path)
  return withContext({
    '@type': 'WebPage',
    '@id': url,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.inLanguage ?? SITE_LOCALE,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
  })
}

/** AboutPage - extends WebPage, used on `/about-us`.
 *
 * `mainEntity` makes Google's entity graph treat the page as the canonical
 * Solavita UK Organization landing page - useful when an entity exists in
 * Google's KB but no dedicated `/about` URL has been claimed yet.
 * `significantLink` points crawlers at the two highest-traffic surfaces
 * so they get crawled when the about page lands (Hub-and-spoke). */
export function aboutPageJsonLd(opts: {
  path: string
  name: string
  description?: string
}) {
  const url = absoluteUrl(opts.path)
  return withContext({
    '@type': 'AboutPage',
    '@id': url,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: SITE_LOCALE,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
    about: { '@id': ORG_ID },
    mainEntity: { '@id': ORG_ID },
    significantLink: [absoluteUrl('/'), absoluteUrl('/solutions/')],
  })
}

/** ContactPage - used on `/contact-us`. */
export function contactPageJsonLd(opts: {
  path: string
  name: string
  description?: string
}) {
  const url = absoluteUrl(opts.path)
  return withContext({
    '@type': 'ContactPage',
    '@id': url,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: SITE_LOCALE,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
    about: { '@id': ORG_ID },
  })
}

/** Blog index - emitted on `/blog`. */
export function blogJsonLd(opts: {
  path: string
  name: string
  description?: string
}) {
  const url = absoluteUrl(opts.path)
  return withContext({
    '@type': 'Blog',
    '@id': url,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: SITE_LOCALE,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
  })
}

/** CollectionPage - emitted on `/blog/category/[slug]`. */
export function collectionPageJsonLd(opts: {
  path: string
  name: string
  description?: string
}) {
  const url = absoluteUrl(opts.path)
  return withContext({
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: SITE_LOCALE,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
  })
}

/* ────────────────────────────────────────────────────────────────────────
   Service - emitted as a `Service` ItemList on `/solutions`.

   We use `Service` (not `Product`) because each tier is a delivered
   installation package (panels + battery + install + warranty), not a
   stand-alone SKU on a shelf. `Product.offers.price` would be
   misleading and would also need a price we don't have.
   ──────────────────────────────────────────────────────────────────────── */

export interface ServiceSpec {
  id: string
  eyebrow: string
  title: string
  intro: string
  bullets: string[]
  imagePath: string
  imageAlt: string
}

export function serviceJsonLd(spec: ServiceSpec) {
  const path = `/solutions#${spec.id}`
  const url = absoluteUrl(path)
  return withContext({
    '@type': 'Service',
    '@id': url,
    name: spec.title,
    description: spec.intro,
    serviceType: spec.eyebrow,
    url,
    image: absoluteUrl(spec.imagePath),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    // Feature list rendered from `bullets` so we don't hard-code the same
    // strings twice (page copy vs. Schema).
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${spec.title} inclusions`,
      itemListElement: spec.bullets.map((b, idx) => ({
        '@type': 'Offer',
        position: idx + 1,
        itemOffered: {
          '@type': 'Service',
          name: b,
        },
      })),
    },
  })
}

export function serviceListJsonLd(services: ServiceSpec[]) {
  return withContext({
    '@type': 'ItemList',
    itemListElement: services.map((s, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: { '@id': absoluteUrl(`/solutions#${s.id}`) },
    })),
  })
}

/* ────────────────────────────────────────────────────────────────────────
   Product - emitted on `/solutions/[slug]/` Amazon-style detail pages.

   Each tier is sold as a delivered installation package, so structurally
   it would also be a valid `Service`. We emit `Product` here because:
     - the page is reachable as a deep link (Amazon-style buyable page),
     - the schema lets Google treat the URL as a stand-alone product
       entity it can show as a rich result, and
     - it composes cleanly with the existing `Service` node emitted from
       the /solutions overview (different @id, no conflict).

   Pricing is intentionally omitted: the marketing surface never shows a
   hard price. Google tolerates a Product node without `offers`; we let
   the lead-capture form surface the price after a consultation.
   ──────────────────────────────────────────────────────────────────────── */

export function productJsonLd(detail: SolutionDetail) {
  const path = `/solutions/${detail.slug}/`
  const url = absoluteUrl(path)
  const images = detail.galleryImages.map((g) => absoluteUrl(g.src))
  if (!images.includes(absoluteUrl(detail.imagePath))) {
    images.unshift(absoluteUrl(detail.imagePath))
  }
  return withContext(
    {
      '@type': 'Product',
      '@id': url,
      name: detail.title,
      description: detail.intro,
      category: detail.eyebrow,
      sku: detail.slug,
      url,
      image: images,
      brand: { '@id': ORG_ID },
      manufacturer: {
        '@type': 'Organization',
        name: 'SKYWORTH Group',
        url: 'https://www.skyworth-pv.com',
      },
      // Per-row spec table → schema.org PropertyValue so Google's
      // "About this product" / specification rich results can pick them up.
      additionalProperty: detail.specTable.map((row) => ({
        '@type': 'PropertyValue',
        name: row.label,
        value: row.value,
      })),
    },
    url,
  )
}

/* ────────────────────────────────────────────────────────────────────────
   FAQPage - emitted on `/support`.

   2026-05-07: Google retired FAQ rich results globally. We still emit
   the schema because (a) AI/LLM crawlers and answer-engine optimisers
   consume it directly and (b) it makes the page's question/answer
   structure machine-readable. Do not promise SERP-feature benefit.
   ──────────────────────────────────────────────────────────────────────── */

export interface FaqItemForSchema {
  question: string
  answer: string
}

export function faqPageJsonLd(opts: {
  path: string
  name: string
  description?: string
  faqs: FaqItemForSchema[]
}) {
  const url = absoluteUrl(opts.path)
  return withContext({
    '@type': 'FAQPage',
    '@id': url,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: SITE_LOCALE,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
    mainEntity: opts.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  })
}

/* ────────────────────────────────────────────────────────────────────────
   Article - emitted on blog post pages.

   `publisher` now `@id`-references the canonical Organization from the
   root layout, so a single Solavita UK entity is the publisher of
   every blog post and home page (was previously duplicated inline).
   ──────────────────────────────────────────────────────────────────────── */

export function articleJsonLd(
  post: BlogPostFull,
  categorySlug: string,
) {
  const canonical = `/blog/${categorySlug}/${post.slug}`
  return withContext({
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    image: post.cover_image_url ? [absoluteUrl(post.cover_image_url)] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    inLanguage: SITE_LOCALE,
    author: {
      '@type': 'Person',
      name: post.author.display_name,
    },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(canonical),
    },
    articleSection: post.category.name_en,
    keywords: post.tags.map((t) => t.name_en).join(', ') || undefined,
  })
}

/** Convenience for blog category landing pages that want a category node. */
export function categoryJsonLd(category: BlogCategory) {
  const path = `/blog/category/${category.slug}`
  const url = absoluteUrl(path)
  return withContext({
    '@type': 'DefinedTerm',
    '@id': url,
    name: category.name_en,
    description: category.description_en ?? undefined,
    inLanguage: SITE_LOCALE,
  })
}

/* ────────────────────────────────────────────────────────────────────────
   LocalBusiness - emitted alongside `ContactPage` on `/contact-us/`.

   UK Solavita is a Companies House-registered company (No. 17466951) with a
   real registered office, so it qualifies as a LocalBusiness entity per
   Google's entity guidelines. Fields are limited to facts that exist in
   the codebase - no fabricated geo coordinates, no fake opening hours,
   no invented telephone.

   `priceRange` is the schema.org token format ("££" = mid-range) and is
   the only rating-style field safe to emit without real review evidence.
   ──────────────────────────────────────────────────────────────────────── */

export function localBusinessJsonLd() {
  const url = `${absoluteUrl('/contact-us/')}#localbusiness`
  return withContext(
    {
      '@type': 'LocalBusiness',
      '@id': url,
      name: SITE_LEGAL_NAME,
      url: absoluteUrl('/'),
      email: 'mailto:uk@solavita.com',
      image: absoluteUrl(DEFAULT_OG_IMAGE),
      priceRange: '££',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'C/O Buzzacott LLP, 130 Wood Street',
        addressLocality: 'London',
        postalCode: 'EC2V 6DL',
        addressCountry: 'GB',
      },
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
      parentOrganization: { '@id': PARENT_ORG_ID },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'mailto:uk@solavita.com',
        areaServed: 'GB',
        availableLanguage: ['en-GB'],
      },
    },
    url,
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ItemList of CreativeWork - emitted on `/cases/`.

   Each case is a CreativeWork stub (NOT Article - the detail page is
   `noindex` so giving it a deep Article node would create a dangling
   entity). The list helps Google's "site links" panel discover the
   case studies and gives AI crawlers (Perplexity, ChatGPT) a structured
   picture of the install portfolio.

   Field budget:
     - name       : city + system label  (e.g. "London · 4-bedroom")
     - url        : absolute case URL    (matches sitemap entry)
     - image      : case thumbnail
     - encodingFormat on video + text: NO (case detail pages noindex -
                                         do not create article entities)
   ──────────────────────────────────────────────────────────────────────── */

export interface CreativeWorkListItem {
  name: string
  url: string
  image: string
  description: string
}

export function creativeWorkListJsonLd(items: CreativeWorkListItem[]) {
  return withContext({
    '@type': 'ItemList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      url: it.url,
      image: it.image,
      description: it.description,
    })),
  })
}

/* ────────────────────────────────────────────────────────────────────────
   SoftwareApplication - emitted on `/hems/`.

   HEMS (Home Energy Management System) is Solavita's mobile/web app for
   monitoring solar + battery + EV charging. Schema.org's SoftwareApplication
   is the right fit: it composes with the existing `Service` node (different
   @id) and lets Google's app panels recognise the product.

   Pricing: HEMS is bundled free with every Solavita system. We emit
   `offers.price = 0` only when the codebase confirms "free" - otherwise
   the field is omitted to avoid fabricating a price.
   ──────────────────────────────────────────────────────────────────────── */

export interface SoftwareAppFeatures {
  name: string
  featureList: string[]
  /** Only pass when the codebase confirms the app is free. */
  free?: boolean
}

export function softwareApplicationJsonLd(opts: SoftwareAppFeatures) {
  const url = absoluteUrl('/hems/')
  const node: Record<string, unknown> = {
    '@type': 'SoftwareApplication',
    '@id': url,
    name: opts.name,
    url,
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'Home Energy Management System',
    operatingSystem: 'iOS, Android, Web',
    publisher: { '@id': ORG_ID },
    featureList: opts.featureList.join(', '),
  }
  if (opts.free) {
    node.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    }
  }
  return withContext(node, url)
}

/* ────────────────────────────────────────────────────────────────────────
   PartnerProgram - emitted on `/for-partners/`.

   Conservative WebPage extension - declares the page is the canonical
   place for B2B partnership information without fabricating specific
   JobPosting nodes (no concrete openings) or Organization.member
   relationships (no real partner registry in the codebase).
   ──────────────────────────────────────────────────────────────────────── */

export function partnerProgramJsonLd() {
  const url = absoluteUrl('/for-partners/')
  return withContext(
    {
      '@type': 'WebPage',
      '@id': url,
      url,
      name: 'For Partners · Solavita UK',
      description:
        'Installer, reseller and energy-partner programmes backed by the SKYWORTH Group.',
      inLanguage: SITE_LOCALE,
      isPartOf: { '@id': SITE_ID },
      publisher: { '@id': ORG_ID },
      mainEntity: {
        '@type': 'Service',
        name: 'Solavita Partner Programme',
        serviceType: 'B2B partnership',
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'United Kingdom' },
      },
      about: { '@id': ORG_ID },
    },
    url,
  )
}