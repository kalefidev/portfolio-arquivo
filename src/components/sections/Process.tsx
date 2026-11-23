import SectionHead from '@/components/ui/SectionHead'
import { site } from '@/content/site'

const { eyebrow, h2, steps } = site.process

/** "Como eu trabalho" — three numbered steps. */
export default function Process() {
  return (
    <section className="px-gutter py-section">
      <SectionHead eyebrow={eyebrow} title={h2} />

      <ol data-reveal="stagger" className="mt-12 grid border-t border-line md:grid-cols-3 md:border-l">
        {steps.map((step) => (
          <li key={step.n} className="flex flex-col gap-10 border-b border-line py-6 md:border-r md:px-6">
            <span className="label text-ink-2 tabular-nums">{step.n}</span>
            <div>
              <h3 className="text-h3">{step.title}</h3>
              <p className="mt-3 max-w-[36ch] text-ink-2">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
