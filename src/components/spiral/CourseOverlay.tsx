'use client'

import { useEffect, useRef, useState } from 'react'
import SecondaryCta from '@/components/ui/SecondaryCta'
import { archiveCourses, categoryLabels, featuredCourses, pieceNo, statusLabels } from '@/content/courses'
import { projectId, projectsForCourse } from '@/content/projects'
import { site } from '@/content/site'
import { getLenis, pieceId, scrollToCourse, scrollToId, scrollToY } from '@/lib/scroll'
import { useStore } from '@/lib/store'
import { startDrag } from '@/three/spiral/drag'

const featured = featuredCourses() // the pieces of the spiral
const archive = archiveCourses() // …and the rest of the archive, after them
const rest = archive.filter((course) => !course.featured)
const { panelLabel, overlay } = site.spiral

const STEP: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 } // previous / next from the keyboard

const heading = 'label text-ink-2'
const step = 'label flex h-14 items-center gap-2 px-6 transition-colors duration-(--duration-micro) hover:bg-paper active:bg-paper aria-disabled:cursor-default aria-disabled:bg-transparent aria-disabled:text-ink-3'
const pressable = 'transition-[color,background-color,scale] duration-(--duration-micro) hover:bg-paper active:scale-[0.97] active:bg-paper'

/** Overlay of the open piece (DESIGN.md §8): a full-screen modal <dialog> with nothing painted on
 *  its "stage" half, where the 3D piece shows through, and the panel on the other — to the right
 *  on `wide`, a bottom sheet on portrait. The browser gives the focus trap, Esc and the focus
 *  going back to whoever opened it. Looks and motion: `dialog.piece` in globals.css. */
export default function CourseOverlay() {
  const focusSlug = useStore((s) => s.focusSlug)
  const staticMode = useStore((s) => s.staticMode)
  const dialog = useRef<HTMLDialogElement>(null)
  const focused = archive.find((course) => course.slug === focusSlug) ?? null
  const open = focused !== null

  // the last piece stays in the panel while it slides out
  const [shown, setShown] = useState(focused)
  if (focused && shown !== focused) setShown(focused)
  const course = shown

  // A piece of the spiral keeps everything as it was: Nº and total of the spiral, previous / next
  // along the spiral, the piece on the 3D stage. Any other course of the archive has no piece:
  // veil stage, Nº and total of the archive, previous / next among the others.
  const inSpiral = course?.featured ?? false
  const group = inSpiral ? featured : rest
  const position = course ? group.indexOf(course) : -1
  const number = course ? pieceNo(inSpiral ? position : archive.indexOf(course)) : pieceNo(0)
  const total = pieceNo((inSpiral ? featured : archive).length - 1)

  // `#peca-<slug>` in the URL opens that piece (on load and when the hash changes).
  useEffect(() => {
    const openFromHash = () => {
      const match = archive.find((c) => location.hash === `#${pieceId(c.slug)}`)
      if (match) useStore.getState().setFocus(match.slug)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  // Opening a piece of the spiral from below it (the index, a project) makes the page jump up to the
  // piece underneath the overlay. Closing takes the user back to where they were — unless they opened
  // it from the stage itself, or a chip below is taking them somewhere else (null: stay).
  const comeBack = useRef<number | null>(null)

  // The dialog and the scroll lock follow `focusSlug`.
  useEffect(() => {
    if (!open) return
    const element = dialog.current!
    const { top = 0, bottom = 0 } = document.getElementById('cursos')?.getBoundingClientRect() ?? {}
    const fromStage = !useStore.getState().staticMode && top <= 0 && bottom >= window.innerHeight
    comeBack.current = fromStage ? null : window.scrollY
    element.showModal()
    element.focus() // the dialog itself (its title is read), not "Fechar" with a ring every time it opens
    getLenis()?.stop() // without Lenis (reduced motion) the lock is CSS: `html:has(dialog.piece[open])`
    return () => {
      element.close()
      getLenis()?.start()
      if (comeBack.current !== null) scrollToY(comeBack.current, true)
      history.replaceState(null, '', location.pathname + location.search)
    }
  }, [open])

  // The open piece of the spiral is always the active one: "next" turns the spiral under the
  // overlay, and when it closes everything is already in place.
  useEffect(() => {
    if (!focused) return
    if (focused.featured) scrollToCourse(featured.indexOf(focused), { immediate: true })
    history.replaceState(null, '', `#${pieceId(focused.slug)}`)
  }, [focused])

  const close = () => dialog.current?.close()
  // at either end the button is `aria-disabled`, not `disabled`: a disabled button drops the keyboard focus
  const go = (to: number) => group[to] && useStore.getState().setFocus(group[to].slug)
  const projects = course ? projectsForCourse(course.slug) : []

  return (
    <dialog
      ref={dialog}
      aria-labelledby="piece-title"
      tabIndex={-1}
      className="piece"
      onClose={() => useStore.getState().setFocus(null)}
      onKeyDown={(event) => {
        const to = STEP[event.key]
        if (!to || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
        event.preventDefault()
        go(position + to)
      }}
    >
      {staticMode || !inSpiral ? (
        // no 3D, or a course that is not a piece of the spiral: a veil of paper over the page instead of the stage; a click on it closes
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
            {panelLabel.replace('{n}', number).replace('{total}', total)}
          </p>
          <button type="button" className={`label flex h-10 items-center gap-3 px-3 ${pressable}`} onClick={close}>
            {overlay.close}
            <kbd aria-hidden className="border border-line px-1.5 py-0.5 font-mono text-ink-2 pointer-coarse:hidden">
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
                      {/* closes first, then scrolls ourselves: Lenis is stopped while the overlay is open */}
                      <a
                        href={`#${projectId(project.slug)}`}
                        className={`label flex h-9 items-center border border-line px-3 ${pressable}`}
                        onClick={(event) => {
                          event.preventDefault()
                          comeBack.current = null // this one goes to the project, not back
                          close()
                          scrollToId(projectId(project.slug))
                        }}
                      >
                        {project.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.certificateUrl && (
              <p className="mt-10">
                <SecondaryCta href={course.certificateUrl}>{overlay.certificate}</SecondaryCta>
              </p>
            )}
          </div>
        )}

        <div className="grid shrink-0 grid-cols-2 divide-x divide-line border-t border-line">
          <button type="button" className={step} aria-disabled={position <= 0} onClick={() => go(position - 1)}>
            <span aria-hidden>←</span>
            {overlay.previous}
          </button>
          <button
            type="button"
            className={`${step} justify-end`}
            aria-disabled={position >= group.length - 1}
            onClick={() => go(position + 1)}
          >
            {overlay.next}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}
