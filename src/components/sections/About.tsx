import Image from 'next/image'
import SecondaryCta from '@/components/ui/SecondaryCta'
import { pieceNo } from '@/content/courses'
import { site } from '@/content/site'

const { eyebrow, people, photoPlaceholder } = site.about

const isTodo = (value: string) => value.startsWith('TODO')

const corner = 'absolute size-4 border-signal'

/** "Quem constrói": one block per person in `site.about.people`. The photo sits in a technical
 *  frame (corner marks, "FIG. 01"); until there is a photo, a "FOTO" placeholder. A link that is
 *  still a TODO is shown as plain text, never as a broken <a>. */
export default function About() {
  return (
    <section id="sobre" className="scroll-mt-16 px-gutter py-section">
      <p className="label flex items-center gap-3 text-ink-2 tabular-nums">
        {eyebrow}
        <span aria-hidden className="h-px flex-1 bg-line" />
      </p>

      {people.map((person) => (
        <article
          key={person.name}
          data-reveal="stagger"
          className="mt-10 grid gap-10 wide:grid-cols-12 wide:gap-x-6"
        >
          <figure className="wide:col-span-4">
            <div className="relative aspect-[4/5] w-full max-w-64 border border-line bg-paper-2">
              {isTodo(person.photo) ? (
                <span className="label absolute inset-0 flex items-center justify-center text-ink-2">
                  {photoPlaceholder}
                </span>
              ) : (
                <Image src={person.photo} alt={person.name} fill unoptimized sizes="256px" className="object-cover object-top" />
              )}
              <span aria-hidden className={`${corner} -top-px -left-px border-t-2 border-l-2`} />
              <span aria-hidden className={`${corner} -top-px -right-px border-t-2 border-r-2`} />
              <span aria-hidden className={`${corner} -bottom-px -left-px border-b-2 border-l-2`} />
              <span aria-hidden className={`${corner} -right-px -bottom-px border-r-2 border-b-2`} />
            </div>
          </figure>

          <div className="wide:col-span-7 wide:col-start-6">
            <h2 className="text-h2">{person.name}</h2>
            <p className="label mt-4 text-ink-2">{person.role}</p>

            <ul className="mt-8 border-t border-line">
              {person.bullets.map((bullet, i) => (
                <li key={bullet} className="flex gap-4 border-b border-line py-3">
                  <span aria-hidden className="label pt-1 text-ink-2">
                    {pieceNo(i)}
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-[56ch]">{person.bio}</p>

            <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
              {person.links.map((link) => (
                <li key={link.label} className="label">
                  {isTodo(link.href) ? (
                    <span className="text-ink-2">
                      {link.label} · {link.href}
                    </span>
                  ) : (
                    <SecondaryCta href={link.href}>{link.label} ↗</SecondaryCta>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  )
}
