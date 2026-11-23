'use client'

import { useRef } from 'react'
import PrimaryCta from '@/components/ui/PrimaryCta'
import Wordmark from '@/components/ui/Wordmark'
import { pieceNo } from '@/content/courses'
import { site } from '@/content/site'
import { useStore } from '@/lib/store'
import { whatsappUrl } from '@/lib/whatsapp'

const { nav, navLabel, cta, menu } = site.header

const boxed = 'label flex h-10 items-center px-4 transition-colors duration-(--duration-micro) hover:bg-paper-2'

/** Fixed header (DESIGN.md §3). The #anchors scroll through Lenis (`anchors` in SmoothScroll).
 *  Below `md` the nav and the CTA live in a full-screen <dialog>: focus trap and Esc come free.
 *  Fades out while a piece is open (`.fades-in-focus`): the overlay would cut the nav in half.
 *  Transparent over the spiral; paper + hairline once the sections scroll under it (past the
 *  spiral, or without 3D, where the page is just a long document). */
export default function Header() {
  const dialog = useRef<HTMLDialogElement>(null)
  const solid = useStore((s) => s.pastSpiral || s.staticMode)

  return (
    <header className="fades-in-focus pointer-events-none fixed inset-x-0 top-0 z-10 flex h-16 items-center justify-between px-gutter md:grid md:grid-cols-[1fr_auto_1fr]">
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 border-b border-line bg-paper transition-opacity duration-(--duration-ui) motion-reduce:transition-none ${
          solid ? 'pointer-events-auto' : 'opacity-0'
        }`}
      />
      <Wordmark />

      <nav aria-label={navLabel} className="pointer-events-auto hidden divide-x divide-line border border-line md:flex">
        {nav.map((item) => (
          <a key={item.href} href={item.href} className={boxed}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="hidden justify-self-end md:block">
        <PrimaryCta href={whatsappUrl()}>{cta}</PrimaryCta>
      </div>

      <button
        type="button"
        aria-haspopup="dialog"
        className={`${boxed} pointer-events-auto border border-line md:hidden`}
        onClick={() => dialog.current?.showModal()}
      >
        {menu.open}
      </button>

      <dialog
        ref={dialog}
        aria-label={menu.open}
        data-lenis-prevent
        className="menu pointer-events-auto m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-paper text-ink"
        // any link closes the menu; the scroll itself is the link's own job
        onClick={(event) => {
          if ((event.target as Element).closest('a')) dialog.current?.close()
        }}
      >
        <div className="flex min-h-full flex-col px-gutter pb-8">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Wordmark />
            <button type="button" className={`${boxed} border border-line`} onClick={() => dialog.current?.close()}>
              {menu.close}
            </button>
          </div>

          <nav aria-label={navLabel} className="mt-8 mb-12 flex flex-col border-t border-line">
            {nav.map((item, index) => (
              <a key={item.href} href={item.href} className="flex items-baseline gap-4 border-b border-line py-5">
                <span className="label text-ink-2">{pieceNo(index)}</span>
                <span className="text-h2 font-bold tracking-tight [font-stretch:118%]">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto">
            <PrimaryCta href={whatsappUrl()}>{cta}</PrimaryCta>
          </div>
        </div>
      </dialog>
    </header>
  )
}
