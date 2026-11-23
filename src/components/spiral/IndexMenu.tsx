'use client'

import { useRef } from 'react'
import list from '@phosphor-icons/core/assets/regular/list.svg'
import Icon from '@/components/ui/Icon'
import { featuredCourses, pieceNo } from '@/content/courses'
import { site } from '@/content/site'
import { scrollToCourse } from '@/lib/scroll'
import { useStore } from '@/lib/store'

const courses = featuredCourses()
const { buttons, indexLabel } = site.spiral
const ID = 'index-menu'

/** ÍNDICE button + its list of pieces (DESIGN.md §8). A native popover: Esc, click outside, the
 *  top layer and "opening AJUSTES closes this" come from the browser. Only the arrow keys are ours. */
export default function IndexMenu({ className }: { className: string }) {
  const activeIndex = useStore((s) => s.activeIndex)
  const items = useRef<HTMLOListElement>(null)

  const onKeyDown = (event: React.KeyboardEvent) => {
    const buttons = [...items.current!.querySelectorAll('button')]
    const at = buttons.findIndex((button) => button === document.activeElement)
    const to: Record<string, number> = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: buttons.length - 1 }
    if (!(event.key in to)) return
    event.preventDefault()
    buttons[Math.min(Math.max(to[event.key], 0), buttons.length - 1)].focus()
  }

  return (
    <>
      <button type="button" popoverTarget={ID} className={`needs-popover ${className}`}>
        <Icon svg={list} />
        {buttons.index}
      </button>

      <nav
        id={ID}
        popover="auto"
        aria-label={indexLabel}
        className="bar-popover"
        onKeyDown={onKeyDown}
        // start on the current piece, so the arrows go from there
        onToggle={(event) => {
          if (event.newState === 'open') items.current?.querySelector<HTMLElement>('[aria-current]')?.focus()
        }}
      >
        <ol ref={items} data-lenis-prevent className="max-h-[60svh] divide-y divide-line overflow-y-auto overscroll-contain">
          {courses.map((course, index) => {
            const current = index === activeIndex
            return (
              <li key={course.slug}>
                <button
                  type="button"
                  popoverTarget={ID}
                  popoverTargetAction="hide"
                  aria-current={current || undefined}
                  className="flex min-h-11 w-full items-center gap-4 px-4 py-2 text-left -outline-offset-2 focus-visible:shadow-none focus-visible:outline-ink transition-colors duration-(--duration-micro) hover:bg-paper"
                  onClick={() => scrollToCourse(index)}
                >
                  <span className="label text-ink-2 tabular-nums">Nº {pieceNo(index)}</span>
                  <span className={`flex-1 text-small ${current ? 'font-bold' : ''}`}>{course.title}</span>
                  <span aria-hidden className={`size-2 ${current ? 'bg-signal' : ''}`} />
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
