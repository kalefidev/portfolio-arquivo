import type Lenis from 'lenis'
import { featuredCourses } from '@/content/courses'
import { courseScroll, sectionHeight } from '@/three/spiral/math'
import { useStore } from './store'
import { activePreset } from './viewport'

let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis
}

/** Lenis instance, or null before mount / with prefers-reduced-motion. */
export const getLenis = () => instance

/** Jumps or eases to `y`. `force`: also while Lenis is stopped (overlay open). */
export const scrollToY = (y: number, immediate: boolean) => {
  if (instance) instance.scrollTo(y, { immediate, force: true })
  else window.scrollTo(0, y) // reduced motion: no Lenis, jump
}

/** Scrolls until piece `index` of the spiral is the centred one (for piece 0: just past the hero).
 *  Without 3D there is no spiral: centres the card of the piece instead — through `scrollToY` as
 *  well, so Lenis always knows where the page is (a native jump behind its back left it stale, and
 *  its next `scrollTo` to the old spot did nothing). */
export function scrollToCourse(index: number, { immediate = false } = {}) {
  if (useStore.getState().staticMode) {
    const card = document.getElementById(pieceId(featuredCourses()[index].slug))
    if (card) scrollToY(card.getBoundingClientRect().top + window.scrollY - (window.innerHeight - card.offsetHeight) / 2, immediate)
    return
  }
  const preset = activePreset()
  scrollThroughSpiral(courseScroll(index, preset) / (sectionHeight(featuredCourses().length, preset) - 1), immediate)
}

/** Scrolls to `t01` (0 … 1) of the way through `#cursos` — as a fraction of the range ScrollTrigger
 *  measures (offsetHeight − innerHeight): the section is sized in svh, and on mobile innerHeight is
 *  not 1svh while the browser bar is hidden. */
export function scrollThroughSpiral(t01: number, immediate = false) {
  const section = document.getElementById('cursos')
  if (!section) return
  const top = section.getBoundingClientRect().top + window.scrollY
  scrollToY(top + t01 * (section.offsetHeight - window.innerHeight), immediate)
}

/** Switching 3D ↔ grid changes the height of `#cursos` (the first section): start over from the top. */
export const scrollToTop = () => scrollToY(0, true)

/** `peca-<slug>`: the URL hash of an open piece, and the id of its card in the grid without 3D. */
export const pieceId = (slug: string) => `peca-${slug}`

/** Scrolls to the element `id`, restarting Lenis first: the click that gets here may come from the
 *  overlay or the dialog, while Lenis is still stopped. Honours the element's `scroll-margin-top`
 *  (the header covers the top of the screen). */
export function scrollToId(id: string) {
  const element = document.getElementById(id)
  if (!element) return
  instance?.start()
  if (instance) instance.scrollTo(element, { offset: -parseFloat(getComputedStyle(element).scrollMarginTop), force: true })
  else element.scrollIntoView() // reduced motion: jump
}
