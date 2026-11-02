/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // The /products aggregate page was removed — the nav links straight
  // to each product detail page. Old bookmarks, inbound links and the
  // previously-published sitemap entry still hit /products, so send
  // them to the first product rather than a 404.
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/products/module/',
        permanent: true,
      },
      // The Monitoring App page used to live at /hems. The acronym is
      // not used in any user-facing copy, so old links, bookmarks and
      // search results are sent to the readable URL instead.
      {
        source: '/hems',
        destination: '/monitoring-app/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig