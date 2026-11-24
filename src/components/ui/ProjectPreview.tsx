'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { prefersReducedMotion } from '@/lib/viewport'

/** Max tilt, in degrees, when the cursor moves sideways fast. */
const MAX_TILT = 6
const OFFSET = 24
const EDGE = 8
// A preview that vanished less than this long ago keeps gliding instead of jumping to the cursor.
const GLIDE_MS = 250
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

export interface PreviewItem {
  slug: string
  image: string
}

/** `follow`: the card trails the mouse from (x, y). Otherwise (keyboard focus) it stays put at (x, y). */
export interface PreviewTarget {
  slug: string
  x: number
  y: number
  follow: boolean
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

/** One floating card with every project print stacked inside; only the opacity changes, so nothing
 *  flickers and the images are already loaded. Decorative (the row already says it all), fine pointer only. */
export default function ProjectPreview({ items, active }: { items: PreviewItem[]; active: PreviewTarget | null }) {
  const card = useRef<HTMLDivElement>(null)
  const move = useRef<{ x: (v: number) => void; y: (v: number) => void; rotation: (v: number) => void }>(null)
  const follow = useRef(false)
  const hiddenAt = useRef(0)
  const placed = useRef(false)

  // Where the card goes for a cursor at (x, y): beside it, flipped to the left near the right edge, kept inside the window.
  const target = (x: number, y: number) => {
    const { offsetWidth: w, offsetHeight: h } = card.current!
    const right = x + OFFSET + w > innerWidth - EDGE ? x - OFFSET - w : x + OFFSET
    return [clamp(right, EDGE, innerWidth - w - EDGE), clamp(y - h / 2, EDGE, innerHeight - h - EDGE)] as const
  }

  useEffect(() => {
    const el = card.current
    if (!el || !window.matchMedia(FINE_POINTER).matches) return
    move.current = {
      x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }),
      rotation: gsap.quickTo(el, 'rotation', { duration: 0.6, ease: 'power3.out' }),
    }
    let idle: ReturnType<typeof setTimeout>
    const onMove = (e: PointerEvent) => {
      if (!follow.current || e.pointerType !== 'mouse') return
      const [x, y] = target(e.clientX, e.clientY)
      if (prefersReducedMotion()) return void gsap.set(el, { x, y })
      move.current!.x(x)
      move.current!.y(y)
      move.current!.rotation(clamp(e.movementX * 0.4, -MAX_TILT, MAX_TILT))
      clearTimeout(idle)
      idle = setTimeout(() => move.current?.rotation(0), 80)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      clearTimeout(idle)
      gsap.killTweensOf(el)
      move.current = null
    }
  }, [])

  useEffect(() => {
    if (!move.current) return
    if (!active) {
      follow.current = false
      hiddenAt.current = performance.now()
      return
    }
    follow.current = active.follow
    const [x, y] = target(active.x, active.y)
    const glide = placed.current && performance.now() - hiddenAt.current < GLIDE_MS && !prefersReducedMotion()
    if (glide && active.follow) {
      move.current.x(x)
      move.current.y(y)
    } else {
      gsap.set(card.current, { x, y, rotation: 0 })
    }
    placed.current = true
  }, [active])

  return (
    <div ref={card} aria-hidden className="pointer-events-none fixed top-0 left-0 z-30 w-88 will-change-transform">
      <div
        className={`border border-ink bg-paper p-1 transition-[opacity,scale] motion-reduce:transition-none ${
          active ? 'scale-100 opacity-100 duration-(--duration-ui) ease-enter' : 'scale-[0.96] opacity-0 duration-(--duration-micro) ease-exit'
        }`}
      >
        <div className="relative aspect-[8/5] bg-paper-2">
          {items.map((item) => (
            <Image
              key={item.slug}
              src={item.image}
              alt=""
              fill
              unoptimized
              sizes="352px"
              className={`object-cover object-top transition-opacity duration-(--duration-micro) motion-reduce:transition-none ${
                active?.slug === item.slug ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
