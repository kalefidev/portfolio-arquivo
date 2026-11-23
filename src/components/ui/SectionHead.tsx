/** Eyebrow with a rule + h2 + optional sub: the head of every section below the spiral.
 *  `data-reveal="lines"` on the h2: <Reveals> animates it line by line. */
export default function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <header>
      <p className="label flex items-center gap-3 text-ink-2 tabular-nums">
        {eyebrow}
        <span aria-hidden className="h-px flex-1 bg-line" />
      </p>
      <h2 data-reveal="lines" className="mt-6 max-w-[18ch] text-h2">
        {title}
      </h2>
      {sub && <p className="mt-6 max-w-[52ch] text-ink-2">{sub}</p>}
    </header>
  )
}
