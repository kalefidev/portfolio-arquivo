/** Reads a design token from :root (globals.css), e.g. cssVar('--color-paper'). Client only. */
export const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/** A duration token in seconds, for GSAP: cssSeconds('--duration-title') → 0.64. */
export const cssSeconds = (name: string) => {
  const value = cssVar(name) // "640ms", or ".64s" once the CSS is minified
  return parseFloat(value) / (value.endsWith('ms') ? 1000 : 1)
}
