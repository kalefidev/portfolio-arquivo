'use client'

import { featuredCourses, pieceNo } from '@/content/courses'
import { site } from '@/content/site'
import { scrollToCourse } from '@/lib/scroll'
import { useStore } from '@/lib/store'

const courses = featuredCourses()
const { railLabel, goTo, verticalLabel } = site.spiral

/** Ruler on the right edge (DESIGN.md §3): one tick per piece, the active one long and in signal. */
export default function RightRail() {
  const activeIndex = useStore((s) => s.activeIndex)

  return (
    <nav aria-label={railLabel} className="absolute top-1/2 right-gutter hidden -translate-y-1/2 items-center gap-3 wide:flex">
      <ol className="border-r border-line">
        {courses.map((course, index) => {
          const active = index === activeIndex
          return (
            <li key={course.slug}>
              <button
                type="button"
                aria-current={active || undefined}
                aria-label={goTo.replace('{n}', pieceNo(index)).replace('{title}', course.title)}
                className="group pointer-events-auto flex h-7 w-24 items-center justify-end gap-2"
                onClick={() => scrollToCourse(index)}
              >
                <span className={`label transition-opacity duration-(--duration-micro) ${active ? '' : 'opacity-0'}`}>
                  Nº {pieceNo(index)}
                </span>
                <span
                  className={`h-0.5 w-6 origin-right transition-[scale,background-color] duration-(--duration-ui) ease-enter ${
                    active ? 'bg-signal' : 'scale-x-[0.33] scale-y-50 bg-ink-3 group-hover:scale-x-[0.66] group-hover:bg-ink'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ol>
      <p className="label text-ink-2 [writing-mode:vertical-rl]">{verticalLabel}</p>
    </nav>
  )
}
