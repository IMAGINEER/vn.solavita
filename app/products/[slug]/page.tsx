import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductDetail from '@/components/products/ProductDetail'
import JsonLd from '@/components/seo/JsonLd'
import { allProductSlugs, getProduct, getProductOgImage } from '@/lib/data/products'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld'

/** Pre-render every product detail page. */
export function generateStaticParams() {
  return allProductSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params
  const product = getProduct(slug)
  if (!product) {
    return { title: 'Không tìm thấy sản phẩm' }
  }
  return buildPageMetadata({
    title: `${product.name} — Thông số kỹ thuật & ưu điểm`,
    path: `/products/${product.slug}`,
    description: product.description,
    ogImage: getProductOgImage(product),
    ogImageAlt: `${product.name} của Solavita`,
  })
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const product = getProduct(slug)
  if (!product) notFound()

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: `/products/${product.slug}`,
            name: `${product.name} | Solavita Việt Nam`,
            description: product.description,
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: product.name, url: `/products/${product.slug}` },
          ]),
        ]}
      />
      <ProductDetail product={product} />
    </>
  )
}
