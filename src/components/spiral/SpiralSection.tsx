'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { featuredCourses } from '@/content/courses'
import { useStore } from '@/lib/store'
import { activePreset, usePreset } from '@/lib/viewport'
import { scrollToProgress, sectionHeight } from '@/three/spiral/math'

const count = featuredCourses().length

/** `#cursos`: tall section that turns scroll into spiral progress. The 3D lives in the fixed
 *  canvas behind the page; `children` are the spiral UI, on a sticky stage that lets the pointer
 *  through (each control turns `pointer-events` back on for itself). */
export default function SpiralSection({ children }: { children?: React.ReactNode }) {
  const section = useRef<HTMLElement>(null)
  const height = usePreset((preset) => sectionHeight(count, preset)) // in viewport heights

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger) // SmoothScroll skips this with reduced motion

    const write = (self: ScrollTrigger) => {
      const { progress, exitProgress, heroProgress } = scrollToProgress(self.progress, count, activePreset())
      useStore.getState().setScroll(progress, exitProgress, heroProgress)
    }
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: write,
      onRefresh: write,
    })
    return () => trigger.kill()
  }, [height])

  return (
    <section id="cursos" ref={section} className="relative" style={{ height: `${height * 100}svh` }}>
      <div className="pointer-events-none sticky top-0 h-svh">{children}</div>
    </section>
  )
}
