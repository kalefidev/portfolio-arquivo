/** Round marker: the clay tone of a category (pass `tone`), or a status (default: ink). */
export default function Dot({ tone = 'var(--color-ink)' }: { tone?: string }) {
  return (
    <span
      aria-hidden
      className="inline-block size-2 shrink-0 rounded-full outline outline-line"
      style={{ background: tone }}
    />
  )
}
