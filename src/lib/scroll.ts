import type Lenis from 'lenis'
import { courseScroll } from '@/three/spiral/math'
import { activePreset } from './viewport'

let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis
}

/** Lenis instance, or null before mount / with prefers-reduced-motion. */
export const getLenis = () => instance

/** Scrolls until piece `index` of the spiral is the centred one (for piece 0: just past the hero). */
export function scrollToCourse(index: number) {
  const section = document.getElementById('cursos')
  if (!section) return
  const top = section.getBoundingClientRect().top + window.scrollY
  const y = top + courseScroll(index, activePreset()) * window.innerHeight
  if (instance) instance.scrollTo(y)
  else window.scrollTo(0, y) // reduced motion: no Lenis, jump
}
