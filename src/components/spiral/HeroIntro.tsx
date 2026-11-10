'use client'

import { site } from '@/content/site'
import { scrollToCourse } from '@/lib/scroll'
import { pastHero, useStore } from '@/lib/store'

const { eyebrow, h1, sub, cta } = site.hero

/** Hero over the first piece. Gives way to <ActivePanel> past HERO_UNTIL and comes back on the way up.
 *  Portrait: title above the piece, text + button below it, so nothing sits on top of the object. */
export default function HeroIntro() {
  const gone = useStore(pastHero)

  return (
    <div
      inert={gone}
      className={`absolute inset-0 flex flex-col justify-between px-gutter pt-24 pb-28 transition-[opacity,translate] duration-(--duration-ui) wide:justify-center wide:gap-6 wide:py-0 ${
        gone ? '-translate-y-3 opacity-0 ease-exit motion-reduce:translate-y-0' : 'ease-enter'
      }`}
    >
      <div className="flex flex-col gap-4 wide:w-5/12 wide:gap-6">
        <p className="label text-ink-2">{eyebrow}</p>
        <h1 className="max-w-[14ch] text-display">{h1}</h1>
      </div>
      <div className="flex flex-col items-start gap-5 wide:w-5/12 wide:gap-6">
        <p className="max-w-[48ch] text-ink-2">{sub}</p>
        <button
          type="button"
          className="label pointer-events-auto border-b border-ink pb-1 transition-colors duration-(--duration-micro) hover:border-signal"
          onClick={() => scrollToCourse(1)}
        >
          {cta}
        </button>
      </div>
    </div>
  )
}
