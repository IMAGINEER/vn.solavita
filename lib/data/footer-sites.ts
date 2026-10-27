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
export const COMING_SOON_LABEL = 'Coming soon'

/** Shown next to the row of the site the visitor is currently on. */
export const CURRENT_SITE_LABEL = 'Sei qui'

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
 * (flag + label) and the "Sei qui" marker in the menu.
 */
export const currentSite: FooterSite = site(
  'Nigeria · English',
  'ng',
  'https://ng.solavita.com/',
  true
)

export const footerSiteGroups: FooterSiteGroup[] = [
  {
    title: 'Solavita',
    sites: [
      site('Global', 'globe', 'https://www.solavita.com/'),
      site('Germany', 'de', 'https://de.solavita.com/'),
      site('Italy', 'it', 'https://it.solavita.com/'),
      site('United Kingdom', 'gb', 'https://uk.solavita.com/'),
      site('Nigeria', 'ng', 'https://ng.solavita.com/'),
      site('Vietnam', 'vn', null),
      site('Malaysia', 'my', null),
      site('Indonesia', 'id', null),
      site('South Africa', 'za', null),
    ],
  },
  {
    title: 'SKYWORTH Solar',
    sites: [
      site('Thailand', 'th', 'https://th.skyworth-pv.com/'),
      site('Brazil', 'br', 'https://br.skyworth-pv.com/'),
      site('Global', 'globe', 'https://www.skyworth-pv.com/'),
      site('Germany', 'de', 'https://de.skyworth-pv.com/'),
      site('Italy', 'it', 'https://it.skyworth-pv.com/'),
    ],
  },
]
