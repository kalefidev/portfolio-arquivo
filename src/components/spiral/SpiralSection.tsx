'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SNAP } from '@/config/spiral'
import { featuredCourses } from '@/content/courses'
import { scrollThroughSpiral, scrollToCourse } from '@/lib/scroll'
import { useStore } from '@/lib/store'
import { activePreset, prefersReducedMotion, usePreset } from '@/lib/viewport'
import { progressToScroll, scrollToProgress, sectionHeight, type ScrollState } from '@/three/spiral/math'
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
  const pastSpiral = useStore((s) => s.pastSpiral)
  const last = useRef<ScrollState>({ progress: 0, exitProgress: 0, heroProgress: 0 }) // last state written

  useEffect(() => {
    if (staticMode) {
      last.current = { progress: 0, exitProgress: 0, heroProgress: 0 } // back in 3D, start over from the top
      useStore.getState().setScroll(0, 0, 0)
      return
    }
    gsap.registerPlugin(ScrollTrigger) // SmoothScroll skips this with reduced motion

    const write = (self: ScrollTrigger) => {
      last.current = scrollToProgress(self.progress, count, activePreset())
      const { progress, exitProgress, heroProgress } = last.current
      useStore.getState().setScroll(progress, exitProgress, heroProgress)
    }

    // A resize (another preset, another svh) changes the height of the section while scrollY stays:
    // the same scrollY would land on another piece. Note where the spiral was before each refresh
    // and jump back there after it. Only from inside the section — above or below it, leave the page alone.
    // A trigger created here still measures with the viewport height ScrollTrigger cached before the
    // resize, so what it writes is off until a refresh: the state from before wins until then.
    let saved = last.current
    let pending = true
    const save = () => {
      if (!pending) saved = last.current
    }
    const restore = () => {
      pending = false
      const t01 = progressToScroll(saved, count, activePreset())
      if (t01 > 0 && t01 < 1) scrollThroughSpiral(t01, true)
    }

    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: write,
      onRefresh: write,
    })
    ScrollTrigger.addEventListener('refreshInit', save)
    ScrollTrigger.addEventListener('refresh', restore)
    ScrollTrigger.refresh()
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', save)
      ScrollTrigger.removeEventListener('refresh', restore)
      trigger.kill()
    }
  }, [height, staticMode])

  // Once the scroll stops between two pieces, glide to the nearest one: a piece always ends up framed
  // by its marks, with its own panel. In the hero zone and the exit `progress` is pinned (0 / N−1), so
  // this never acts there. Mouse / trackpad only, never with reduced motion (DESIGN.md §7).
  // ponytail: holding the scrollbar thumb still also counts as "stopped"; guard it if it bothers anyone.
  useEffect(() => {
    if (staticMode || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const settle = () => {
      const { progress, exitProgress, focusSlug } = useStore.getState()
      const nearest = Math.round(progress)
      if (focusSlug || exitProgress > 0 || Math.abs(progress - nearest) < SNAP.tolerance) return
      scrollToCourse(nearest)
    }
    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(settle, SNAP.idleMs)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [staticMode])

  // The stage fades out on the way out (`pastSpiral`): its popovers (fixed, top layer) must not stay behind.
  useEffect(() => {
    if (pastSpiral) section.current?.querySelectorAll<HTMLElement>('[popover]').forEach((p) => p.hidePopover?.())
  }, [pastSpiral])

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
      <div inert={pastSpiral} className={`fades-in-focus pointer-events-none sticky top-0 h-svh ${pastSpiral ? 'opacity-0' : ''}`}>
        {hero}
        {children}
      </div>
    </section>
  )
}
