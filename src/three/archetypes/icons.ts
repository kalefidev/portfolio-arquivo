// Raw SVG of the Phosphor `fill` icons the content uses, inlined as text
// (`*-fill.svg` rule in next.config.ts).
// To use a new `icon` name in courses.ts, add its import here (one line) and to `icons`.
import browser from '@phosphor-icons/core/assets/fill/browser-fill.svg'
import certificate from '@phosphor-icons/core/assets/fill/certificate-fill.svg'
import gear from '@phosphor-icons/core/assets/fill/gear-fill.svg'

export const DEFAULT_ICON = 'certificate'

export const icons: Record<string, string> = { browser, certificate, gear }
