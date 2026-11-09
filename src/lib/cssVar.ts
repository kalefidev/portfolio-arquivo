/** Reads a design token from :root (globals.css), e.g. cssVar('--color-paper'). Client only. */
export const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()
