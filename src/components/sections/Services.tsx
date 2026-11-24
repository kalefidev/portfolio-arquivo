import SectionHead from '@/components/ui/SectionHead'
import { courses } from '@/content/courses'
import { projects } from '@/content/projects'
import { site } from '@/content/site'

const { eyebrow, h2, text, pillars, summary } = site.services

/** "O que eu faço" — three pillars and a summary whose numbers come from the data. */
export default function Services() {
  return (
    <section id="servicos" className="scroll-mt-16 px-gutter pt-section">
      <SectionHead eyebrow={eyebrow} title={h2} sub={text} />

      <ol data-reveal="stagger" className="mt-8 grid border-t border-line md:grid-cols-3 md:border-l">
        {pillars.map((pillar) => (
          <li key={pillar.n} className="flex flex-col gap-6 border-b border-line py-5 md:border-r md:px-6">
            <span className="label text-ink-2 tabular-nums">{pillar.n}</span>
            <div>
              <h3 className="text-h3">{pillar.title}</h3>
              <p className="mt-3 max-w-[32ch] text-ink-2">{pillar.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="label mt-8 text-ink-2 tabular-nums">
        {summary.replace('{N}', String(courses.length)).replace('{M}', String(projects.length))}
      </p>
    </section>
  )
}
