import { ImageResponse } from 'next/og'
import { site } from '@/content/site'

// Generated once at build time (no request-time APIs). The hex values mirror the tokens of
// globals.css (paper, ink, ink-2, signal): the image is rendered outside the page's CSS.
export const alt = site.seo.ogAlt
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PAPER = '#ECE9E2'
const INK = '#151515'
const INK_2 = '#5E5B55'
const SIGNAL = '#FF4D1A'
const GRID = 'rgba(21, 21, 21, 0.06)'

const label = { top: site.spiral.verticalLabel, role: site.hero.eyebrow, url: site.domain.toUpperCase() }

/** A static TTF instance of a Google font, subset to `text` (satori reads neither woff2 nor variable fonts). */
async function googleFont(family: string, text: string) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`)
  ).text()
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
  if (!url) throw new Error(`no TTF for ${family}`)
  return (await fetch(url)).arrayBuffer()
}

export default async function OpengraphImage() {
  // Archivo at the titles' width (font-stretch 118%) and IBM Plex Mono 500. If the fonts cannot be
  // fetched the image still builds, with the default font.
  const fonts = await Promise.all([
    googleFont('Archivo:wdth,wght@118,700', `${site.wordmark}${site.hero.h1}`).then((data) => ({
      name: 'Archivo',
      data,
      weight: 700 as const,
    })),
    googleFont('IBM+Plex+Mono:wght@500', Object.values(label).join('')).then((data) => ({
      name: 'Plex Mono',
      data,
      weight: 500 as const,
    })),
  ]).catch(() => [])

  const mono = { fontFamily: 'Plex Mono', fontSize: 20, letterSpacing: '0.08em', color: INK_2 }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: PAPER,
          backgroundImage: `linear-gradient(to right, ${GRID} 1px, transparent 1px), linear-gradient(to bottom, ${GRID} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          color: INK,
          fontFamily: 'Archivo',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 36, letterSpacing: '-0.02em' }}>
            {site.wordmark}
            {/* the ■ as a box: the subset fonts do not carry the glyph */}
            <div style={{ width: 17, height: 17, marginLeft: 4, background: SIGNAL }} />
          </div>
          <div style={{ display: 'flex', ...mono }}>{label.top}</div>
        </div>

        <div style={{ display: 'flex', fontSize: 112, lineHeight: 0.92, letterSpacing: '-0.02em', maxWidth: 860 }}>
          {site.hero.h1}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono }}>
          <span>{label.role}</span>
          <span style={{ color: INK }}>{label.url}</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
