'use client'

import { useEffect, useRef } from 'react'
import SecondaryCta from '@/components/ui/SecondaryCta'
import { site } from '@/content/site'
import { HERO_FADE_FROM, HERO_UNTIL } from '@/config/spiral'
import { scrollToCourse, scrollToTop } from '@/lib/scroll'
import { useStore } from '@/lib/store'
import { hasWebGL, prefersReducedMotion } from '@/lib/viewport'

const LIFT = 12 // px the hero rises while it leaves

const { eyebrow, h1, sub, cta } = site.hero
const { back, noWebgl } = site.spiral.static

/** Hero over the first piece. Gives way to <ActivePanel> part-way through the hero zone (HERO_UNTIL),
 *  before the spiral starts turning, and comes back on the way up.
 *  Portrait: title above the piece, text + button below it, so nothing sits on top of the object. */
export default function HeroIntro() {
  const gone = useStore((s) => s.pastHero)
  const staticMode = useStore((s) => s.staticMode)
  const root = useRef<HTMLDivElement>(null)

  // Opacity and lift follow the scroll (HERO_FADE_FROM … HERO_UNTIL), written straight to the style:
  // no re-render per frame. Reduced motion keeps the timed fade of the classes below.
  useEffect(() => {
    if (staticMode || prefersReducedMotion()) return // no spiral, no scroll to follow
    const apply = (heroProgress: number) => {
      const t = Math.min(1, Math.max(0, (heroProgress - HERO_FADE_FROM) / (HERO_UNTIL - HERO_FADE_FROM)))
      if (!root.current) return
      root.current.style.opacity = String(1 - t)
      root.current.style.translate = `0 ${-t * LIFT}px`
    }
    apply(useStore.getState().heroProgress)
    return useStore.subscribe((s, prev) => {
      if (s.heroProgress !== prev.heroProgress) apply(s.heroProgress)
    })
  }, [staticMode])

  return (
    <div
      ref={root}
      inert={gone}
      className={`absolute inset-0 flex flex-col justify-between px-gutter pt-24 pb-24 motion-reduce:transition-[opacity] motion-reduce:duration-(--duration-ui) wide:justify-center wide:gap-6 wide:py-0 short:gap-3 ${
        gone ? 'motion-reduce:opacity-0 motion-reduce:ease-exit' : 'motion-reduce:ease-enter'
      }`}
    >
      {/* `data-ui`: the text takes the pointer, so a tap on it never opens the piece behind */}
      <div data-ui className="pointer-events-auto flex flex-col gap-4 wide:w-5/12 wide:gap-6">
        <p className="label text-ink-2 short:hidden">{eyebrow}</p>
        <h1 className="max-w-[14ch] text-display">{h1}</h1>
      </div>
      <div data-ui className="pointer-events-auto flex flex-col items-start gap-5 wide:w-5/12 wide:gap-6 short:gap-3">
        <p className="max-w-[48ch] text-ink-2 short:text-small">{sub}</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <SecondaryCta onClick={() => scrollToCourse(0)}>{cta}</SecondaryCta>
          {staticMode &&
            (hasWebGL() ? (
              <SecondaryCta
                onClick={() => {
                  useStore.getState().setStaticMode(false)
                  scrollToTop()
                }}
              >
                {back} →
              </SecondaryCta>
            ) : (
              <p className="label text-ink-2">{noWebgl}</p>
            ))}
        </div>
      </div>
    </div>
  )
}
