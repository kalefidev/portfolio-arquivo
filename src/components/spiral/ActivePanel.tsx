'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { categoryLabels, featuredCourses, pieceNo } from '@/content/courses'
import { site } from '@/content/site'
import { cssSeconds } from '@/lib/cssVar'
import { pastHero, useStore } from '@/lib/store'
import { prefersReducedMotion } from '@/lib/viewport'

const courses = featuredCourses()
const total = pieceNo(courses.length - 1)
const { panelLabel, open } = site.spiral

// DESIGN.md §7 — "troca de peça ativa". expo.out / expo.in are --ease-enter / --ease-exit.
const LINE_STAGGER = 0.06 // s between the lines of the title
const META_DELAY = 0.2 // s the metadata waits after the title starts
const NONE = -1

/** "PEÇA Nº 03 / 12" panel (DESIGN.md §3). There is only ever one title in the DOM: the old one
 *  leaves first, then the piece that is active *by then* enters — so fast scrolling can skip
 *  pieces but can never stack two titles. */
export default function ActivePanel() {
  const activeIndex = useStore((s) => s.activeIndex)
  const visible = useStore(pastHero)
  const target = visible ? activeIndex : NONE
  const [shown, setShown] = useState(NONE) // piece whose title is in the DOM
  const leaving = shown !== target
  const course = shown === NONE ? null : courses[shown]

  const content = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const meta = useRef<HTMLDivElement>(null)
  const split = useRef<SplitText>(null)

  // Leave: title up behind its mask, metadata fades, then swap.
  useEffect(() => {
    if (!leaving) return
    const duration = cssSeconds('--duration-ui')
    const timeline = gsap.timeline({
      onComplete: () => {
        const state = useStore.getState()
        setShown(pastHero(state) ? state.activeIndex : NONE)
      },
    })
    if (shown === NONE) {
      // nothing to take out: the (empty) timeline completes on the next tick
    } else if (split.current) {
      timeline
        .to(split.current.lines, { yPercent: -100, duration, ease: 'expo.in', stagger: LINE_STAGGER / 2, overwrite: true })
        .to(meta.current, { opacity: 0, duration: duration / 2, overwrite: true }, 0)
    } else {
      timeline.to(content.current, { opacity: 0, duration: duration / 2, overwrite: true }) // reduced motion
    }
    return () => {
      timeline.kill()
    }
    // `shown` matters: if the scroll moved on while the swap was rendering, the piece that just
    // came in is already stale and has to leave too — `leaving` alone would stay true and stall.
  }, [leaving, shown])

  // Enter: runs before paint, on the fresh nodes (`key={shown}` below).
  useLayoutEffect(() => {
    if (!title.current) return
    const duration = cssSeconds('--duration-ui')
    const context = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.from(content.current, { opacity: 0, duration })
        return
      }
      gsap.registerPlugin(SplitText)
      split.current = SplitText.create(title.current, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true, // re-splits when the fonts land or the column changes width
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            duration: cssSeconds('--duration-title'),
            ease: 'expo.out',
            stagger: LINE_STAGGER,
          }),
      })
      gsap.from(meta.current, { opacity: 0, duration, delay: META_DELAY })
    })
    return () => {
      context.revert()
      split.current = null
    }
  }, [shown])

  const active = courses[activeIndex]
  const fill = (text: string) =>
    text.replace('{n}', pieceNo(activeIndex)).replace('{total}', total).replace('{title}', active.title)

  return (
    <div
      inert={!visible}
      className={`absolute inset-x-gutter bottom-22 h-36 transition-opacity duration-(--duration-ui) wide:top-[34%] wide:bottom-auto wide:h-auto ${
        visible ? '' : 'opacity-0'
      }`}
    >
      <div className="wide:w-5/12">
        <p className="label flex items-center gap-3 text-ink-2 tabular-nums">
          {fill(panelLabel)}
          <span aria-hidden className="h-px flex-1 bg-line" />
        </p>

        <div className="mt-3 flex items-start justify-between gap-4 wide:mt-5">
          {/* keyed: SplitText rewrites the title's children, so every piece gets nodes of its own */}
          <div key={shown} ref={content} className="min-w-0">
            {course && (
              <>
                <h2 ref={title} className="text-h3 wide:text-h2 wide:leading-[1.08]">
                  {course.title}
                </h2>
                <div ref={meta} className="mt-2 wide:mt-4">
                  <p className="text-small text-ink-2">
                    {[course.institution, course.year, course.hours && `${course.hours}h`].filter(Boolean).join(' · ')}
                  </p>
                  <p className="label mt-2 flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2 rounded-full outline outline-line"
                      style={{ background: `var(--color-cat-${course.category})` }}
                    />
                    {categoryLabels[course.category]}
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={fill(open)}
            className="pointer-events-auto flex size-10 shrink-0 items-center justify-center border border-ink text-h3 transition-colors duration-(--duration-micro) hover:bg-ink hover:text-paper"
            onClick={() => useStore.getState().setFocus(active.slug)} // the overlay comes in etapa 05
          >
            ↗
          </button>
        </div>
      </div>
    </div>
  )
}
