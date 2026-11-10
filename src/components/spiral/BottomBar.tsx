'use client'

import gear from '@phosphor-icons/core/assets/regular/gear.svg'
import list from '@phosphor-icons/core/assets/regular/list.svg'
import { featuredCourses, pieceNo } from '@/content/courses'
import { site } from '@/content/site'
import { useStore } from '@/lib/store'

const count = featuredCourses().length
const { hintsDesktop, hintsMobile, buttons } = site.spiral

const segment = 'label flex h-10 items-center gap-2 px-3 wide:px-4 transition-colors duration-(--duration-micro) hover:bg-paper-2'

/** Phosphor SVG source, inlined (`regular` rule in next.config.ts) so it takes `currentColor`. */
const Icon = ({ svg }: { svg: string }) => (
  <span aria-hidden className="size-4 [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
)

/** Bottom bar (DESIGN.md §3): hints · ÍNDICE | AJUSTES · counter. The two panels come in etapa 05. */
export default function BottomBar() {
  const activeIndex = useStore((s) => s.activeIndex)

  return (
    <div className="absolute inset-x-0 bottom-0 grid h-22 grid-cols-2 content-center items-center gap-y-2 px-gutter wide:h-16 wide:grid-cols-[1fr_auto_1fr]">
      <p className="label col-span-2 text-ink-2 wide:col-span-1">
        <span className="wide:hidden">{hintsMobile}</span>
        <span className="hidden wide:inline">{hintsDesktop}</span>
      </p>

      <div className="pointer-events-auto flex divide-x divide-line justify-self-start border border-line">
        <button type="button" className={segment}>
          <Icon svg={list} />
          {buttons.index}
        </button>
        <button type="button" className={segment}>
          <Icon svg={gear} />
          {buttons.settings}
        </button>
      </div>

      <div className="flex items-center gap-3 justify-self-end">
        <span className="label tabular-nums">
          {pieceNo(activeIndex)} / {pieceNo(count - 1)}
        </span>
        <span aria-hidden className="h-0.5 w-8 bg-line wide:w-16">
          <span
            className="block h-full origin-left bg-ink transition-transform duration-(--duration-ui) ease-enter"
            style={{ transform: `scaleX(${(activeIndex + 1) / count})` }}
          />
        </span>
      </div>
    </div>
  )
}
