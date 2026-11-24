'use client'

import { useState } from 'react'
import Dot from '@/components/ui/Dot'
import SectionHead from '@/components/ui/SectionHead'
import { archiveCourses, categoryLabels, pieceNo, statusLabels } from '@/content/courses'
import { site } from '@/content/site'
import { useStore } from '@/lib/store'
import type { Category } from '@/types'

const archive = archiveCourses()
const categories = [...new Set(archive.map((c) => c.category))] // only the ones that exist in the data
const { eyebrow, h2, sub, all, filterLabel, open } = site.index

const chip =
  'label flex h-9 items-center border border-line px-3 transition-[color,background-color,border-color,scale] duration-(--duration-micro) hover:bg-paper-2 active:scale-[0.97] active:bg-paper-2 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper'

/** Every course, in lines (DESIGN.md §8). A click opens the overlay: for a piece of the spiral it
 *  scrolls up to the piece first (the overlay does that); for the others it opens without 3D.
 *  It also takes the skip link (`#indice`). */
export default function CourseIndex() {
  const [filter, setFilter] = useState<Category | null>(null)

  return (
    <section id="indice" tabIndex={-1} className="scroll-mt-16 px-gutter pb-section shadow-none outline-none">
      <SectionHead eyebrow={eyebrow.replace('{N}', pieceNo(archive.length - 1))} title={h2} sub={sub} />

      <div role="group" aria-label={filterLabel} className="mt-12 flex flex-wrap gap-2">
        <button type="button" className={chip} aria-pressed={filter === null} onClick={() => setFilter(null)}>
          {all}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={chip}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <ol data-reveal="stagger" className="mt-6 border-t border-line">
        {archive.map((course, index) =>
          filter && course.category !== filter ? null : (
            <li key={course.slug} className="border-b border-line">
              <button
                type="button"
                aria-label={open.replace('{title}', course.title)}
                className="group grid w-full grid-cols-[3rem_minmax(0,1fr)_1.5rem] items-center gap-x-4 gap-y-2 px-2 py-4 text-left transition-colors duration-(--duration-micro) hover:bg-paper-2 active:bg-paper-2 md:grid-cols-[4rem_minmax(0,1fr)_14rem_4rem_10rem_1.5rem]"
                onClick={() => useStore.getState().setFocus(course.slug)}
              >
                <span className="label text-ink-2 tabular-nums">Nº {pieceNo(index)}</span>
                <span className="text-h3 font-bold tracking-title [font-stretch:118%] transition-transform duration-(--duration-ui) ease-enter group-hover:translate-x-2 motion-reduce:transform-none">
                  {course.title}
                </span>
                <span className="col-start-2 row-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-2 md:contents">
                  <span>{course.institution}</span>
                  <span className="tabular-nums">{course.year}</span>
                  <span className="label flex items-center gap-2 text-ink">
                    <Dot tone={`var(--color-cat-${course.category})`} />
                    {statusLabels[course.status]}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="col-start-3 row-start-1 justify-self-end text-h3 md:col-start-auto md:row-start-auto"
                >
                  ↗
                </span>
              </button>
            </li>
          ),
        )}
      </ol>
    </section>
  )
}
