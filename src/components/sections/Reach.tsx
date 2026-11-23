'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PrimaryCta from '@/components/ui/PrimaryCta'
import SecondaryCta from '@/components/ui/SecondaryCta'
import { EXIT } from '@/config/spiral'
import { site } from '@/content/site'
import { useStore } from '@/lib/store'
import { prefersReducedMotion } from '@/lib/viewport'
import { whatsappUrl } from '@/lib/whatsapp'

const { eyebrow, h2, points, here, text, ctas } = site.brasilia

// Where each point sits along the line, in % of its length: spaced like the real distances.
const STOPS = [0, 18, 52, 100]

/** "Feito em Brasília…": a line edge to edge with four points, its caption, then the text and the two
 *  CTAs. The line is where the axis of the spiral ends up: the 3D axis lies down and waits at
 *  `EXIT.restY` of the screen; when this line gets there it takes over (the 3D side lives in `Axis`,
 *  reading the position of `#linha`). Here the HTML side fades in over the same stretch, scrubbed.
 *  Nothing sits above the line: whatever scrolled up ahead of it would cross the waiting axis — so the
 *  section starts on the line, and "DE ÁGUAS CLARAS PARA ONDE PRECISAR" is its caption, below it.
 *  Reduced motion and "ver sem 3D": the line is simply there. */
export default function Reach() {
  const rule = useRef<HTMLDivElement>(null)
  const staticMode = useStore((s) => s.staticMode)

  useEffect(() => {
    if (staticMode || prefersReducedMotion()) return
    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      gsap.fromTo(
        rule.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: `#${EXIT.lineId}`,
            start: `top ${EXIT.restY * 100}%`,
            end: `top ${(EXIT.restY - EXIT.handoff) * 100}%`,
            scrub: true,
          },
        },
      )
    })
    return () => context.revert()
  }, [staticMode])

  return (
    <section className="pb-section">
      <figure>
        <div ref={rule} className="relative h-32">
          <div id={EXIT.lineId} className="absolute inset-x-0 top-1/2 h-px bg-ink/30" />
          <ol className="absolute inset-x-gutter inset-y-0">
            {points.map((label, index) => {
              const first = index === 0
              const last = index === points.length - 1
              return (
                <li key={label} className="absolute top-1/2" style={{ left: `${STOPS[index]}%` }}>
                  <span
                    aria-hidden
                    className={`absolute size-2.5 -translate-1/2 border ${
                      first ? 'border-signal bg-signal' : 'border-ink bg-paper'
                    }`}
                  />
                  <span
                    className={`label absolute whitespace-nowrap ${index % 2 === 0 ? 'bottom-4' : 'top-4'} ${
                      first ? 'left-0' : last ? 'right-0 text-right' : '-translate-x-1/2'
                    }`}
                  >
                    {label}
                    {first && <span className="block text-ink-2">{here}</span>}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
        {/* the caption of the line (like "FIG. 01" in Sobre): close to it, well clear of the heading */}
        <figcaption className="label mt-2 px-gutter text-ink-2">{eyebrow}</figcaption>
      </figure>

      <div className="mt-16 px-gutter wide:grid wide:grid-cols-12 wide:gap-x-6">
        <h2 data-reveal="lines" className="max-w-[18ch] text-h2 wide:col-span-7">
          {h2}
        </h2>
        <div className="mt-8 wide:col-span-4 wide:col-start-9 wide:mt-0">
          <p className="max-w-[44ch] text-ink-2">{text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <PrimaryCta href={whatsappUrl()}>{ctas.primary}</PrimaryCta>
            <SecondaryCta href="#projetos">{ctas.secondary}</SecondaryCta>
          </div>
        </div>
      </div>
    </section>
  )
}
