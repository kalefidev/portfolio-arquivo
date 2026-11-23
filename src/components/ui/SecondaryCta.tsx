/** Secondary CTA — DESIGN.md §8: text with a hairline underline that grows on hover. */
export default function SecondaryCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="label pointer-events-auto inline-flex h-10 items-center bg-[linear-gradient(var(--color-ink),var(--color-ink))] bg-[length:100%_1px] bg-bottom bg-no-repeat pb-0 transition-[background-size] duration-(--duration-ui) ease-enter hover:bg-[length:100%_2px] motion-reduce:transition-none"
    >
      {children}
    </a>
  )
}
