/** Phosphor SVG source, inlined (`regular` rule in next.config.ts) so it takes `currentColor`. */
export default function Icon({ svg, className = 'size-4' }: { svg: string; className?: string }) {
  return <span aria-hidden className={`${className} shrink-0 [&>svg]:size-full`} dangerouslySetInnerHTML={{ __html: svg }} />
}
