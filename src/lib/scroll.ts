import type Lenis from 'lenis'

let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis
}

/** Lenis instance, or null before mount / with prefers-reduced-motion. */
export const getLenis = () => instance
