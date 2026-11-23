'use client'

import SecondaryCta from '@/components/ui/SecondaryCta'
import { site } from '@/content/site'
import { scrollToCourse } from '@/lib/scroll'
import { useStore } from '@/lib/store'

const { eyebrow, h1, sub, cta } = site.hero

/** Hero over the first piece. Gives way to <ActivePanel> part-way through the hero zone (HERO_UNTIL),
 *  before the spiral starts turning, and comes back on the way up.
 *  Portrait: title above the piece, text + button below it, so nothing sits on top of the object. */
export default function HeroIntro() {
  const gone = useStore((s) => s.pastHero)

  return (
    <div
      inert={gone}
      className={`absolute inset-0 flex flex-col justify-between px-gutter pt-24 pb-24 transition-[opacity,translate] duration-(--duration-ui) wide:justify-center wide:gap-6 wide:py-0 short:gap-3 ${
        gone ? '-translate-y-3 opacity-0 ease-exit motion-reduce:translate-y-0' : 'ease-enter'
      }`}
    >
      {/* `data-ui`: the text takes the pointer, so a tap on it never opens the piece behind */}
      <div data-ui className="pointer-events-auto flex flex-col gap-4 wide:w-5/12 wide:gap-6">
        <p className="label text-ink-2 short:hidden">{eyebrow}</p>
        <h1 className="max-w-[14ch] text-display">{h1}</h1>
      </div>
      <div data-ui className="pointer-events-auto flex flex-col items-start gap-5 wide:w-5/12 wide:gap-6 short:gap-3">
        <p className="max-w-[48ch] text-ink-2 short:text-small">{sub}</p>
        <SecondaryCta onClick={() => scrollToCourse(0)}>{cta}</SecondaryCta>
      </div>
    </div>
  )
}
