/** Primary CTA — DESIGN.md §8: signal rectangle, ink mono caps + ↗ (the arrow nudges on hover). */
export default function PrimaryCta({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className="label group pointer-events-auto inline-flex h-10 items-center gap-2 bg-signal px-4 font-medium text-ink transition-colors duration-(--duration-micro) hover:bg-[color-mix(in_srgb,var(--color-signal),black_6%)]"
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-(--duration-micro) ease-enter group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        ↗
      </span>
    </a>
  )
}
