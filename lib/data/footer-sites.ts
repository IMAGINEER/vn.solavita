/**
 * Footer locale menu data — the "Solavita / SKYWORTH Solar" site
 * directory shown in the footer's expandable country picker.
 *
 * Every flag is a hand-drawn SVG that ships with this repo in
 * `public/images/flags/` — nothing is hot-linked from another
 * property, so the menu renders identically on every Solavita site.
 *
 * `href: null` means the site does not exist yet: the row renders as
 * a disabled, non-clickable entry badged "Coming soon".
 */

export interface FooterSite {
  /** Display name, e.g. "Nigeria" or "Global". */
  label: string
  /** Path to the local flag SVG, e.g. "/images/flags/ng.svg". */
  icon: string
  /** Absolute URL of the site, or null when it is not live yet. */
  href: string | null
  /** True for the site the visitor is currently on. */
  current?: boolean
}

export interface FooterSiteGroup {
  /** Group heading, e.g. "Solavita" or "SKYWORTH Solar". */
  title: string
  sites: FooterSite[]
}

/** Badge shown on rows whose site is not live yet. */
export const COMING_SOON_LABEL = 'Sắp ra mắt'

/** Shown next to the row of the site the visitor is currently on. */
export const CURRENT_SITE_LABEL = 'Bạn đang ở đây'

/**
 * Build a site entry. `code` is the country code used to look up the
 * local flag SVG — "globe" for the global entries.
 */
function site(
  label: string,
  code: string,
  href: string | null,
  current = false
): FooterSite {
  return {
    label,
    icon: `/images/flags/${code}.svg`,
    href,
    current,
  }
}

/**
 * The site this build is deployed as. Drives the footer trigger
 * (flag + label) and the "Bạn đang ở đây" marker in the menu.
 */
export const currentSite: FooterSite = site(
  'Việt Nam · Tiếng Việt',
  'vn',
  'https://vn.solavita.com/',
  true
)

export const footerSiteGroups: FooterSiteGroup[] = [
  {
    title: 'Solavita',
    sites: [
      site('Toàn cầu', 'globe', 'https://www.solavita.com/'),
      site('Đức', 'de', 'https://de.solavita.com/'),
      site('Ý', 'it', 'https://it.solavita.com/'),
      site('Vương quốc Anh', 'gb', 'https://uk.solavita.com/'),
      site('Nigeria', 'ng', 'https://ng.solavita.com/'),
      site('Việt Nam', 'vn', 'https://vn.solavita.com/'),
      site('Malaysia', 'my', null),
      site('Indonesia', 'id', null),
      site('Nam Phi', 'za', null),
    ],
  },
  {
    title: 'SKYWORTH Solar',
    sites: [
      site('Toàn cầu', 'globe', 'https://www.skyworth-pv.com/'),
      site('Thái Lan', 'th', 'https://th.skyworth-pv.com/'),
      site('Brazil', 'br', 'https://br.skyworth-pv.com/'),
      site('Đức', 'de', 'https://de.skyworth-pv.com/'),
      site('Ý', 'it', 'https://it.skyworth-pv.com/'),
    ],
  },
]
