'use client'

import { featuredCourses, pieceNo } from '@/content/courses'
import { site } from '@/content/site'
import { scrollToCourse } from '@/lib/scroll'
import { useStore } from '@/lib/store'

const courses = featuredCourses()
const { railLabel, goTo, verticalLabel } = site.spiral

/** Ruler on the right edge (DESIGN.md §3): one tick per piece, the active one long and in signal.
 *  Ticks point at the spiral; the "Nº 03" reading sits on the outer side of the line, where a
 *  callout of the 3D can never reach it. */
export default function RightRail() {
  const activeIndex = useStore((s) => s.activeIndex)

  return (
    <nav aria-label={railLabel} className="absolute top-1/2 right-gutter hidden -translate-y-1/2 flex-col wide:flex">
      {/* ticks are 1.75rem apart and squeeze together when the stage is not tall enough for all of them */}
      <ol className="flex max-h-[calc(100svh-20rem)] flex-col short:max-h-[calc(100svh-10rem)]">
        {courses.map((course, index) => {
          const active = index === activeIndex
          return (
            <li key={course.slug} className="flex min-h-0 basis-7">
              <button
                type="button"
                aria-current={active || undefined}
                aria-label={goTo.replace('{n}', pieceNo(index)).replace('{title}', course.title)}
                className="group pointer-events-auto flex items-center"
                onClick={() => scrollToCourse(index)}
              >
                <span
                  className={`h-0.5 w-6 origin-right transition-[scale,background-color] duration-(--duration-ui) ease-enter ${
                    active ? 'bg-signal' : 'scale-x-[0.33] scale-y-50 bg-ink-3 group-hover:scale-x-[0.66] group-hover:bg-ink'
                  }`}
                />
                <span
                  className={`label flex w-14 items-center self-stretch border-l border-line pl-2 transition-colors duration-(--duration-micro) ${
                    active ? '' : 'text-transparent'
                  }`}
                >
                  Nº {pieceNo(index)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      {/* centred on the line of the ruler (1.5rem = the width of a tick) */}
      <p className="label mt-3 ml-6 -translate-x-1/2 self-start text-ink-2 [writing-mode:vertical-rl] short:hidden">
        {verticalLabel}
      </p>
    </nav>
  )
}
