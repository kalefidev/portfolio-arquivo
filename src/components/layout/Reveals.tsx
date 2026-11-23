'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { cssSeconds } from '@/lib/cssVar'
import { LINE_SPLIT, MASK_TRAVEL } from '@/lib/split'
import { useStore } from '@/lib/store'
import { prefersReducedMotion } from '@/lib/viewport'

// Entrance reveals of the sections below the spiral (DESIGN.md §7). expo.out = --ease-enter.
const START = 'top 85%' // the reveal starts when the top of the element gets this far down the screen
const LINE_STAGGER = 0.06 // s between the lines of a title
const ITEM_STAGGER = 0.08 // s between the items of a list
const ITEM_Y = 16 // px the items rise from

/** `[data-reveal="lines"]`: title line by line, behind a mask. `[data-reveal="stagger"]`: its
 *  children fade in and rise, one after the other. Once each. Mounted once, in page.tsx; the
 *  sections only carry the attribute. Reduced motion: does nothing. */
export default function Reveals() {
  const staticMode = useStore((s) => s.staticMode)

  useEffect(() => {
    if (prefersReducedMotion()) return
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const once = (trigger: Element) => ({ trigger, start: START, once: true })

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((element) => {
        let played = false
        SplitText.create(element, {
          ...LINE_SPLIT,
          autoSplit: true, // re-splits when the fonts land or the width changes…
          // …and the animation has to come back from here (autoSplit does not repeat it on its own),
          // but only until it has played: a resize must not reveal a visible title again
          onSplit: (self) =>
            played
              ? undefined
              : gsap.from(self.lines, {
                  yPercent: MASK_TRAVEL,
                  duration: cssSeconds('--duration-title'),
                  ease: 'expo.out',
                  stagger: LINE_STAGGER,
                  scrollTrigger: once(element),
                  onComplete: () => {
                    played = true
                  },
                }),
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"]').forEach((element) => {
        gsap.from(element.children, {
          opacity: 0,
          y: ITEM_Y,
          duration: cssSeconds('--duration-ui'),
          ease: 'expo.out',
          stagger: ITEM_STAGGER,
          scrollTrigger: once(element),
        })
      })
    })
    return () => context.revert()
  }, [])

  // "Ver sem 3D" swaps the 3D section for a much shorter grid: every trigger below has moved.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [staticMode])

  return null
}
