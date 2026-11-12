'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { featuredCourses } from '@/content/courses'
import { scrollToCourse } from '@/lib/scroll'
import { useStore } from '@/lib/store'
import { activePreset, usePreset } from '@/lib/viewport'
import { scrollToProgress, sectionHeight } from '@/three/spiral/math'
import StaticCourses from './StaticCourses'

const courses = featuredCourses()
const count = courses.length

const STEP: Record<string, number> = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }

/** `#cursos`: tall section that turns scroll into spiral progress. The 3D lives in the fixed
 *  canvas behind the page; `hero` and `children` are the spiral UI, on a sticky stage that lets
 *  the pointer through (each control turns `pointer-events` back on for itself).
 *  "Ver sem 3D": no spiral, no tall section — the hero, then the pieces as a grid of cards. */
export default function SpiralSection({ hero, children }: { hero: React.ReactNode; children?: React.ReactNode }) {
  const section = useRef<HTMLElement>(null)
  const height = usePreset((preset) => sectionHeight(count, preset)) // in viewport heights
  const staticMode = useStore((s) => s.staticMode)

  useEffect(() => {
    if (staticMode) {
      useStore.getState().setScroll(0, 0, 0)
      return
    }
    gsap.registerPlugin(ScrollTrigger) // SmoothScroll skips this with reduced motion

    const write = (self: ScrollTrigger) => {
      const { progress, exitProgress, heroProgress } = scrollToProgress(self.progress, count, activePreset())
      useStore.getState().setScroll(progress, exitProgress, heroProgress)
    }
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: write,
      onRefresh: write,
      // the bar scrolls away with the stage: its popovers (fixed, top layer) must not stay behind
      onLeave: () =>
        section.current?.querySelectorAll<HTMLElement>('[popover]').forEach((popover) => popover.hidePopover?.()),
    })
    return () => trigger.kill()
  }, [height, staticMode])

  // Keyboard (DESIGN.md §9): arrows go to the previous / next piece, Enter opens the active one.
  useEffect(() => {
    if (staticMode) return
    const onKey = (event: KeyboardEvent) => {
      const step = STEP[event.key]
      if ((!step && event.key !== 'Enter') || event.defaultPrevented) return
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      // only while the stage is pinned to the screen…
      const { top, bottom } = section.current!.getBoundingClientRect()
      if (top > 0 || bottom < window.innerHeight) return
      // …and the keys are not somebody else's: a field, a menu, a dialog
      const target = event.target as Element
      if (target.closest('input, textarea, select, [contenteditable], [popover], dialog')) return

      const { activeIndex, pastHero, focusSlug, setFocus } = useStore.getState()
      if (focusSlug) return
      if (!step) {
        if (target.closest('a, button')) return // Enter on a control is its own
        // without this the same key press goes on to "click" the close button the overlay focuses
        event.preventDefault()
        setFocus(courses[activeIndex].slug)
        return
      }
      // from the hero, "next" is piece 01 itself; past either end, the native scroll leaves the section
      const next = pastHero ? activeIndex + step : 0
      if (next < 0 || next >= count || (!pastHero && step < 0)) return
      event.preventDefault()
      scrollToCourse(next)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [staticMode])

  if (staticMode) {
    return (
      <section id="cursos" ref={section}>
        <div className="relative h-[80svh] min-h-120">{hero}</div>
        <StaticCourses />
      </section>
    )
  }

  return (
    <section id="cursos" ref={section} className="relative" style={{ height: `${height * 100}svh` }}>
      <div className="fades-in-focus pointer-events-none sticky top-0 h-svh">
        {hero}
        {children}
      </div>
    </section>
  )
}
