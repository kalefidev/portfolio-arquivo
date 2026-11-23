'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { site } from '@/content/site'
import { cssSeconds } from '@/lib/cssVar'
import { useStore } from '@/lib/store'
import { prefersReducedMotion } from '@/lib/viewport'

const STEPS = 3 // the page's JS ran · fonts ready · the canvas drew its first frame (or there is no 3D)
const pad = (n: number) => String(Math.round(n)).padStart(3, '0')

/** "CATALOGANDO O ARQUIVO 064" — DESIGN.md §8. Server-rendered, so it covers the page from the first
 *  paint; the counter is real progress (no fake time) and the screen fades out once everything is
 *  ready. Shown once per page load. Decorative for assistive tech: the page under it is already there. */
export default function Loader() {
  const [fonts, setFonts] = useState(false)
  const [gone, setGone] = useState(false)
  const hydrated = useStore((s) => s.prefsLoaded)
  const drawn = useStore((s) => s.prefsLoaded && (s.staticMode || s.sceneReady))
  const counter = useRef<HTMLSpanElement>(null)
  const shown = useRef({ n: 0 })

  const done = Number(hydrated) + Number(fonts) + Number(drawn)
  const ready = done === STEPS

  useEffect(() => {
    document.fonts.ready.then(() => setFonts(true))
  }, [])

  useEffect(() => {
    const write = () => {
      if (counter.current) counter.current.textContent = pad(shown.current.n)
    }
    const n = (done / STEPS) * 100
    if (prefersReducedMotion()) {
      shown.current.n = n
      write()
      return
    }
    const tween = gsap.to(shown.current, {
      n,
      duration: cssSeconds('--duration-ui'),
      ease: 'expo.out',
      onUpdate: write,
    })
    return () => {
      tween.kill()
    }
  }, [done])

  if (gone) return null

  return (
    <div
      aria-hidden
      className={`loader fixed inset-0 z-[var(--z-loader)] flex items-center justify-center bg-paper transition-opacity duration-(--duration-overlay) ease-exit ${
        ready ? 'pointer-events-none opacity-0' : ''
      }`}
      onTransitionEnd={() => setGone(true)}
    >
      <noscript>
        <style>{'.loader{display:none}'}</style>
      </noscript>
      <div className="grain" />
      <p className="label relative z-[var(--z-ui)] flex items-baseline gap-3">
        <span className="text-signal">■</span>
        {site.spiral.loader}
        <span ref={counter} className="tabular-nums">
          000
        </span>
      </p>
    </div>
  )
}
