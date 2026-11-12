'use client'

import { useEffect, useRef, useState } from 'react'
import { categoryLabels, featuredCourses, pieceNo, statusLabels } from '@/content/courses'
import { projectsForCourse } from '@/content/projects'
import { site } from '@/content/site'
import { getLenis, pieceId, scrollToCourse } from '@/lib/scroll'
import { useStore } from '@/lib/store'
import { startDrag } from '@/three/spiral/drag'

const courses = featuredCourses()
const total = pieceNo(courses.length - 1)
const { panelLabel, overlay } = site.spiral

const heading = 'label text-ink-2'
const step = 'label flex h-14 items-center gap-2 px-6 transition-colors duration-(--duration-micro) hover:bg-paper aria-disabled:cursor-default aria-disabled:bg-transparent aria-disabled:text-ink-3'

/** Overlay of the open piece (DESIGN.md §8): a full-screen modal <dialog> with nothing painted on
 *  its "stage" half, where the 3D piece shows through, and the panel on the other — to the right
 *  on `wide`, a bottom sheet on portrait. The browser gives the focus trap, Esc and the focus
 *  going back to whoever opened it. Looks and motion: `dialog.piece` in globals.css. */
export default function CourseOverlay() {
  const focusSlug = useStore((s) => s.focusSlug)
  const staticMode = useStore((s) => s.staticMode)
  const dialog = useRef<HTMLDialogElement>(null)
  const index = courses.findIndex((course) => course.slug === focusSlug)
  const open = index >= 0

  // the last piece stays in the panel while it slides out
  const [shown, setShown] = useState(index)
  if (open && shown !== index) setShown(index)
  const course = shown < 0 ? null : courses[shown]

  // `#peca-<slug>` in the URL opens that piece (on load and when the hash changes).
  useEffect(() => {
    const openFromHash = () => {
      const match = courses.find((c) => location.hash === `#${pieceId(c.slug)}`)
      if (match) useStore.getState().setFocus(match.slug)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  // The dialog and the scroll lock follow `focusSlug`.
  useEffect(() => {
    if (!open) return
    const element = dialog.current!
    element.showModal()
    getLenis()?.stop() // without Lenis (reduced motion) the lock is CSS: `html:has(dialog.piece[open])`
    return () => {
      element.close()
      getLenis()?.start()
      history.replaceState(null, '', location.pathname + location.search)
    }
  }, [open])

  // The open piece is always the active one: "next" turns the spiral under the overlay, and when
  // it closes everything is already in place.
  useEffect(() => {
    if (!focusSlug || index < 0) return
    scrollToCourse(index, { immediate: true })
    history.replaceState(null, '', `#${pieceId(focusSlug)}`)
  }, [focusSlug, index])

  const close = () => dialog.current?.close()
  // at either end the button is `aria-disabled`, not `disabled`: a disabled button drops the keyboard focus
  const go = (to: number) => courses[to] && useStore.getState().setFocus(courses[to].slug)
  const projects = course ? projectsForCourse(course.slug) : []

  return (
    <dialog
      ref={dialog}
      aria-labelledby="piece-title"
      className="piece"
      onClose={() => useStore.getState().setFocus(null)}
    >
      {staticMode ? (
        // no 3D: a veil of paper over the page instead of the stage; a click on it closes
        <div className="piece-stage bg-paper/85" onClick={close} />
      ) : (
        <div
          className="piece-stage cursor-grab touch-none"
          onPointerDown={(event) => {
            if (event.button === 0 && focusSlug) startDrag(event.nativeEvent, focusSlug)
          }}
        >
          <p className={`${heading} absolute inset-x-0 bottom-6 text-center`}>{overlay.stage}</p>
        </div>
      )}

      <div data-lenis-prevent className="piece-panel flex flex-col border-line bg-paper-2">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line pr-3 pl-6">
          <p className={`${heading} tabular-nums`}>
            {panelLabel.replace('{n}', pieceNo(Math.max(shown, 0))).replace('{total}', total)}
          </p>
          <button
            type="button"
            className="label flex h-10 items-center gap-3 px-3 transition-colors duration-(--duration-micro) hover:bg-paper"
            onClick={close}
          >
            {overlay.close}
            <kbd aria-hidden className="border border-line px-1.5 py-0.5 font-mono text-ink-2">
              Esc
            </kbd>
          </button>
        </div>

        {course && (
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 wide:py-12">
            <h2 id="piece-title" className="text-h2">
              {course.title}
            </h2>
            <p className="mt-4 text-small text-ink-2">
              {[course.institution, course.year, course.hours && `${course.hours}h`, statusLabels[course.status]]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <p className="label mt-3 flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 rounded-full outline outline-line"
                style={{ background: `var(--color-cat-${course.category})` }}
              />
              {categoryLabels[course.category]}
            </p>

            {course.summary && <p className="mt-8 max-w-[52ch]">{course.summary}</p>}

            {course.learned && course.learned.length > 0 && (
              <section className="mt-10">
                <h3 className={heading}>{overlay.learned}</h3>
                <ul className="mt-3 border-t border-line">
                  {course.learned.map((item, i) => (
                    <li key={item} className="flex gap-4 border-b border-line py-3">
                      <span aria-hidden className="label pt-1 text-ink-2">
                        {pieceNo(i)}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {projects.length > 0 && (
              <section className="mt-10">
                <h3 className={heading}>{overlay.projects}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {projects.map((project) => (
                    <li key={project.slug}>
                      {/* closes first: Lenis is stopped while the overlay is open */}
                      <a
                        href="#projetos"
                        className="label flex h-9 items-center border border-line px-3 transition-colors duration-(--duration-micro) hover:bg-paper"
                        onClick={close}
                      >
                        {project.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.certificateUrl && (
              <a
                href={course.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-10 inline-block border-b border-ink pb-1 transition-colors duration-(--duration-micro) hover:border-signal"
              >
                {overlay.certificate}
              </a>
            )}
          </div>
        )}

        <div className="grid shrink-0 grid-cols-2 divide-x divide-line border-t border-line">
          <button type="button" className={step} aria-disabled={shown <= 0} onClick={() => go(shown - 1)}>
            <span aria-hidden>←</span>
            {overlay.previous}
          </button>
          <button
            type="button"
            className={`${step} justify-end`}
            aria-disabled={shown >= courses.length - 1}
            onClick={() => go(shown + 1)}
          >
            {overlay.next}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}
