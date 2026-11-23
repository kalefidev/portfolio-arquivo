'use client'

import Icon from '@/components/ui/Icon'
import { categoryLabels, featuredCourses, pieceNo } from '@/content/courses'
import { site } from '@/content/site'
import { pieceId, scrollToTop } from '@/lib/scroll'
import { useStore } from '@/lib/store'
import { hasWebGL } from '@/lib/viewport'
import { archetypeIcons } from './archetypeIcons'

const courses = featuredCourses()
const { eyebrow, back } = site.spiral.static

/** "Ver sem 3D": the pieces of the spiral as a grid of cards that open the same overlay.
 *  Only ever rendered in the browser (the mode is switched on after mount), so it can ask for WebGL. */
export default function StaticCourses() {
  return (
    <div className="px-gutter pb-section">
      <div className="flex min-h-12 items-center justify-between gap-4 border-b border-ink">
        <p className="label text-ink-2">{eyebrow.replace('{N}', pieceNo(courses.length - 1))}</p>
        {hasWebGL() && (
          <button
            type="button"
            className="label flex h-10 items-center gap-2 px-3 transition-[color,background-color,scale] duration-(--duration-micro) hover:bg-paper-2 active:scale-[0.97] active:bg-paper-2"
            onClick={() => {
              useStore.getState().setStaticMode(false)
              scrollToTop()
            }}
          >
            {back}
            <span aria-hidden>→</span>
          </button>
        )}
      </div>

      <ol className="grid border-l border-line sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <li key={course.slug} className="border-r border-b border-line">
            <button
              id={pieceId(course.slug)}
              type="button"
              className="group flex size-full flex-col gap-10 p-5 text-left transition-colors duration-(--duration-micro) hover:bg-paper-2 active:bg-paper-2"
              onClick={() => useStore.getState().setFocus(course.slug)}
            >
              <span className="flex w-full items-start justify-between">
                <span className="label text-ink-2 tabular-nums">Nº {pieceNo(index)}</span>
                <Icon svg={archetypeIcons[course.archetype]} className="size-10" />
              </span>
              <span className="mt-auto block">
                <span className="block text-h3 font-bold tracking-title [font-stretch:118%] transition-transform duration-(--duration-ui) ease-enter group-hover:translate-x-2 motion-reduce:transform-none">
                  {course.title}
                </span>
                <span className="mt-2 block text-small text-ink-2">
                  {[course.institution, course.year].filter(Boolean).join(' · ')}
                </span>
              </span>
              <span className="label flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-2 rounded-full outline outline-line"
                  style={{ background: `var(--color-cat-${course.category})` }}
                />
                {categoryLabels[course.category]}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
