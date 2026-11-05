import { permanentRedirect } from 'next/navigation'

/**
 * /solutions/home-solar — the old "For Home" collection page.
 *
 * The home line is now branded SolaHome and moved to `/solutions/solahome`
 * (Oct–Nov 2026 restructure: SolaMate / SolaHome / small-business).
 * This route stays as a 308 so the old URL — and every link pointing at
 * it from outside the site — keeps working.
 */
export default function Page() {
  permanentRedirect('/solutions/solahome/')
}
