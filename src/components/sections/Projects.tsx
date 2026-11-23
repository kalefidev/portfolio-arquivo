'use client'

import Dot from '@/components/ui/Dot'
import SectionHead from '@/components/ui/SectionHead'
import { archiveCourses, pieceNo } from '@/content/courses'
import {
  coursesForProject,
  projectId,
  projects,
  projectStatusLabels,
  projectTone,
} from '@/content/projects'
import { site } from '@/content/site'
import { useStore } from '@/lib/store'

const archive = archiveCourses()
const { eyebrow, h2, sub, visit, openCourse } = site.projects

const statusTone = { 'no-ar': 'var(--color-signal)', 'em-desenvolvimento': 'var(--color-ink)', conceito: 'transparent' }

/** "JA" for J.A.R.V.I.S, "BD" for Bot de ofertas: what the preview shows until there is an image. */
const initials = (title: string) => {
  const words = title.match(/\p{L}+/gu) ?? [title]
  return (words.length > 1 ? words.slice(0, 2).map((w) => w[0]).join('') : words[0].slice(0, 2)).toUpperCase()
}

/** Projects in lines (DESIGN.md §8). Hover / focus on a line shows a CSS-only preview (tone of the
 *  category + initials + Nº — a placeholder until there is an image); not on screens without hover.
 *  The related courses are buttons that take you back to the piece. */
export default function Projects() {
  return (
    <section id="projetos" className="scroll-mt-16 px-gutter py-section">
      <SectionHead eyebrow={eyebrow} title={h2} sub={sub} />

      <ol data-reveal="stagger" className="mt-12 border-t border-line">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            id={projectId(project.slug)}
            className="group relative scroll-mt-20 border-b border-line transition-colors duration-(--duration-micro) focus-within:bg-paper-2 hover:bg-paper-2"
          >
            <div className="grid grid-cols-[3rem_minmax(0,1fr)_1.5rem] items-center gap-x-4 gap-y-3 px-2 py-5 md:grid-cols-[4rem_minmax(0,1fr)_13rem_11rem_minmax(0,1fr)_1.5rem]">
              <span className="label text-ink-2 tabular-nums">Nº {pieceNo(index)}</span>
              <h3 className="text-h3 transition-transform duration-(--duration-ui) ease-enter group-hover:translate-x-2 motion-reduce:transform-none">
                {project.title}
              </h3>
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
                      className="label text-left text-ink-2 underline decoration-line underline-offset-4 transition-colors duration-(--duration-micro) hover:text-ink hover:decoration-ink"
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
                  className="col-start-3 row-start-1 justify-self-end text-h3 md:col-start-auto md:row-start-auto"
                >
                  ↗
                </a>
              ) : (
                <span aria-hidden className="col-start-3 row-start-1 md:col-start-auto md:row-start-auto" />
              )}
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-12 z-10 hidden h-28 w-40 -translate-y-1/2 flex-col justify-between border border-line p-3 opacity-0 transition-opacity duration-(--duration-ui) group-focus-within:opacity-100 group-hover:opacity-100 md:flex [@media(hover:none)]:hidden"
              style={{ background: projectTone(project.slug) }}
            >
              <span className="label tabular-nums">Nº {pieceNo(index)}</span>
              <span className="text-h2 leading-none font-bold">{initials(project.title)}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
