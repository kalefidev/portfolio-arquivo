const look =
  'label pointer-events-auto inline-flex h-10 items-center bg-[linear-gradient(var(--color-ink),var(--color-ink))] bg-[length:100%_1px] bg-bottom bg-no-repeat transition-[background-size] duration-(--duration-ui) ease-enter hover:bg-[length:100%_2px] active:bg-[length:100%_2px] motion-reduce:transition-none'

type Props = { children: React.ReactNode } & ({ href: string } | { href?: undefined; onClick: () => void })

/** Secondary CTA — DESIGN.md §8: text with a hairline underline that grows on hover (and on press, for
 *  touch). A link with `href` (a new tab when it leaves the site), a button without. */
export default function SecondaryCta({ children, ...props }: Props) {
  if (props.href === undefined) {
    return (
      <button type="button" onClick={props.onClick} className={look}>
        {children}
      </button>
    )
  }
  return (
    <a
      href={props.href}
      {...(props.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
      className={look}
    >
      {children}
    </a>
  )
}
