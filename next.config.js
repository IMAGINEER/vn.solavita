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
      // The residential solution page used to live at /solutions/home-solar.
      // It is now branded SolaHome (2026-11-05), so old links, bookmarks
      // and the previously-published sitemap entry are sent to the new
      // URL. `app/solutions/home-solar/page.tsx` mirrors this redirect
      // as a fallback for anyone who reaches the route before this
      // config is applied.
      {
        source: '/solutions/home-solar',
        destination: '/solutions/solahome/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig