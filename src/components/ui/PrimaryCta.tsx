const look =
  'label group pointer-events-auto inline-flex h-10 items-center gap-2 bg-signal px-4 font-medium text-ink transition-[color,background-color,scale] duration-(--duration-micro) hover:bg-[color-mix(in_srgb,var(--color-signal),black_6%)] active:scale-[0.97] active:bg-[color-mix(in_srgb,var(--color-signal),black_6%)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-signal'

type Props = { children: React.ReactNode } & (
  | { href: string }
  | { href?: undefined; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }
)

/** Primary CTA — DESIGN.md §8: signal rectangle, ink mono caps + ↗ (the arrow nudges on hover; the
 *  button gives a little under the finger or the click). A link with `href`, a button without. */
export default function PrimaryCta({ children, ...props }: Props) {
  const content = (
    <>
      {children}
      <span
        aria-hidden
        className="transition-transform duration-(--duration-micro) ease-enter group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-disabled:transform-none"
      >
        ↗
      </span>
    </>
  )
  if (props.href === undefined) {
    const { onClick, type = 'button', disabled } = props
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={look}>
        {content}
      </button>
    )
  }
  return (
    <a
      href={props.href}
      {...(props.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
      className={look}
    >
      {content}
    </a>
  )
}
