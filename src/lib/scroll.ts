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
const scrollToY = (y: number, immediate: boolean) => {
  if (instance) instance.scrollTo(y, { immediate, force: true })
  else window.scrollTo(0, y) // reduced motion: no Lenis, jump
}

/** Scrolls until piece `index` of the spiral is the centred one (for piece 0: just past the hero).
 *  Without 3D there is no spiral: brings the card of the piece into view instead. */
export function scrollToCourse(index: number, { immediate = false } = {}) {
  if (useStore.getState().staticMode) {
    document.getElementById(pieceId(featuredCourses()[index].slug))?.scrollIntoView({ block: 'center' })
    return
  }
  const section = document.getElementById('cursos')
  if (!section) return
  // As a fraction of the scroll range ScrollTrigger measures (offsetHeight − innerHeight): the
  // section is sized in svh, and on mobile innerHeight is not 1svh while the browser bar is hidden.
  const preset = activePreset()
  const t01 = courseScroll(index, preset) / (sectionHeight(featuredCourses().length, preset) - 1)
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
