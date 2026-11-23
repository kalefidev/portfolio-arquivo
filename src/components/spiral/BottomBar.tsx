'use client'

import { featuredCourses, pieceNo } from '@/content/courses'
import { site } from '@/content/site'
import { useStore } from '@/lib/store'
import IndexMenu from './IndexMenu'
import SettingsPanel from './SettingsPanel'

const count = featuredCourses().length
const { hintsDesktop, hintsMobile } = site.spiral

const segment =
  'label flex h-10 items-center gap-2 px-3 wide:px-4 transition-colors duration-(--duration-micro) hover:bg-paper-2 active:bg-paper-2'

/** Bottom bar (DESIGN.md §3): hints · ÍNDICE | AJUSTES · counter. Takes the pointer (`data-ui`): a tap
 *  on it is never a tap on a piece passing underneath. On portrait the rows sit at the bottom, so the
 *  controls stay put when the hints go. */
export default function BottomBar() {
  const activeIndex = useStore((s) => s.activeIndex)
  const pastHero = useStore((s) => s.pastHero)

  return (
    <div
      data-ui
      className="pointer-events-auto absolute inset-x-0 bottom-0 grid h-bar grid-cols-2 content-end items-center gap-y-2 px-gutter pb-3 wide:h-bar-wide wide:grid-cols-[1fr_auto_1fr] wide:content-center wide:pb-0"
    >
      {/* Chosen by the input, not the shape of the screen: dragging the helix is mouse-only. Past the
          hero they stay only where they fit (`wide`, not `short`): on portrait the panel takes their room. */}
      <p
        className={`label col-span-2 text-ink-2 transition-opacity duration-(--duration-ui) wide:col-span-1 ${
          pastHero ? 'opacity-0 wide:opacity-100 short:opacity-0' : ''
        }`}
      >
        <span className="pointer-fine:hidden">{hintsMobile}</span>
        <span className="hidden pointer-fine:inline">{hintsDesktop}</span>
      </p>

      {/* each one brings its popover along */}
      <div className="flex justify-self-start border border-line">
        <IndexMenu className={segment} />
        <SettingsPanel className={`${segment} border-l border-line`} />
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
