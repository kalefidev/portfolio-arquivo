'use client'

import { useState } from 'react'
import Dot from '@/components/ui/Dot'
import ProjectPreview, { type PreviewTarget } from '@/components/ui/ProjectPreview'
import SectionHead from '@/components/ui/SectionHead'
import { archiveCourses, pieceNo } from '@/content/courses'
import {
  coursesForProject,
  projectId,
  projects,
  projectStatusLabels,
} from '@/content/projects'
import { site } from '@/content/site'
import { useStore } from '@/lib/store'

const archive = archiveCourses()
const { eyebrow, h2, sub, visit, openCourse } = site.projects

const previews = projects.flatMap((p) => (p.image ? [{ slug: p.slug, image: p.image }] : []))

const statusTone = { 'no-ar': 'var(--color-signal)', 'em-desenvolvimento': 'var(--color-ink)', conceito: 'transparent' }

// The hover of a line says "this goes somewhere": only on a project with a link (DESIGN.md §8).
const linkedRow = 'transition-colors duration-(--duration-micro) focus-within:bg-paper-2 hover:bg-paper-2'
const linkedTitle = 'transition-transform duration-(--duration-ui) ease-enter group-hover:translate-x-2 motion-reduce:transform-none'

/** Projects in lines (DESIGN.md §8). The related courses are buttons that take you back to the piece. */
export default function Projects() {
  const [active, setActive] = useState<PreviewTarget | null>(null)

  // The floating print (DESIGN.md §8): follows the mouse; with the keyboard it stays on the focused row.
  const previewHandlers = (slug: string) => ({
    onPointerEnter: (e: React.PointerEvent) =>
      e.pointerType === 'mouse' && setActive({ slug, x: e.clientX, y: e.clientY, follow: true }),
    onPointerLeave: () => setActive(null),
    onFocus: (e: React.FocusEvent<HTMLLIElement>) => {
      if (!e.target.matches(':focus-visible')) return
      const rect = e.currentTarget.getBoundingClientRect()
      setActive({ slug, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, follow: false })
    },
    onBlur: () => setActive(null),
  })

  return (
    <section id="projetos" className="scroll-mt-16 px-gutter pt-section">
      <SectionHead eyebrow={eyebrow} title={h2} sub={sub} />

      <ol data-reveal="stagger" className="mt-8 border-t border-line">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            id={projectId(project.slug)}
            className={`group relative scroll-mt-20 border-b border-line ${project.url ? linkedRow : ''}`}
            {...(project.image && previewHandlers(project.slug))}
          >
            <div className="grid grid-cols-[3rem_minmax(0,1fr)_1.5rem] items-center gap-x-4 gap-y-3 px-2 py-4 md:grid-cols-[4rem_minmax(0,1fr)_13rem_11rem_minmax(0,1fr)_1.5rem]">
              <span className="label text-ink-2 tabular-nums">Nº {pieceNo(index)}</span>
              <h3 className={`text-h3 ${project.url ? linkedTitle : ''}`}>{project.title}</h3>
              <span className="col-start-2 row-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-2 md:contents">
                <span>{project.kind}</span>
                <span className="label flex items-center gap-2 text-ink">
                  <Dot tone={statusTone[project.status]} />
                  {projectStatusLabels[project.status]}
                </span>
              </span>

              <ul className="col-start-2 row-start-3 flex flex-col items-start gap-1 md:col-start-auto md:row-start-auto">
                {coursesForProject(project.slug).map((course) => (
                  <li key={course.slug}>
                    <button
                      type="button"
                      aria-label={openCourse.replace('{n}', pieceNo(archive.indexOf(course))).replace('{title}', course.title)}
                      className="label relative z-10 cursor-pointer text-left text-ink-2 underline decoration-line underline-offset-4 transition-colors duration-(--duration-micro) hover:text-ink hover:decoration-ink active:text-ink active:decoration-ink"
                      onClick={() => useStore.getState().setFocus(course.slug)}
                    >
                      Nº {pieceNo(archive.indexOf(course))} · {course.title}
                    </button>
                  </li>
                ))}
              </ul>

              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={visit.replace('{title}', project.title)}
                  className="col-start-3 row-start-1 justify-self-end text-h3 after:absolute after:inset-0 md:col-start-auto md:row-start-auto"
                >
                  ↗
                </a>
              ) : (
                <span aria-hidden className="col-start-3 row-start-1 md:col-start-auto md:row-start-auto" />
              )}
            </div>
          </li>
        ))}
      </ol>
      <ProjectPreview items={previews} active={active} />
    </section>
  )
}
