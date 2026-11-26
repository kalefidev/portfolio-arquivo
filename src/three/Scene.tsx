'use client'

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, events as createPointerEvents, type CanvasProps } from '@react-three/fiber'
import { HERO_UNTIL } from '@/config/spiral'
import { cssVar } from '@/lib/cssVar'
import { useStore } from '@/lib/store'
import { activePreset, reaches3d, usePreset } from '@/lib/viewport'
import { disposeMaterials } from './archetypes/materials'
import Lights from './Lights'
import Spiral from './spiral/Spiral'

const DebugPanel = lazy(() => import('./debug/DebugPanel'))

const OFF_SCREEN = 5 // in NDC (the screen is −1 … 1): a ray from there hits nothing

/** How much of the spiral shows. Portrait: none while the hero is up (its text would sit on the
 *  first piece), then it fades in with the scroll, once the hero has left (HERO_UNTIL → end of the
 *  hero zone). On `wide` the hero text is beside the spiral: always 1. Same media query as `wide:`. */
const spiralOpacity = () =>
  window.matchMedia('(min-aspect-ratio: 4/5)').matches
    ? 1
    : Math.min(1, Math.max(0, (useStore.getState().heroProgress - HERO_UNTIL) / (1 - HERO_UNTIL)))

/** R3F's pointer events, with our own `compute`. The canvas listens on <body> (the page sits on
 *  top of it), so: client coordinates, and a pointer that is over a control or outside `#cursos`
 *  counts as off screen — R3F then fires the `pointerout` of whatever was hovered by itself. A
 *  spiral that is still hidden (portrait hero) can't be touched either. */
const pointerEvents: CanvasProps['events'] = (store) => ({
  ...createPointerEvents(store),
  compute: (event, state) => {
    if (reaches3d(event.target) && spiralOpacity() > 0.5) {
      state.pointer.set(
        (event.clientX / state.size.width) * 2 - 1,
        -(event.clientY / state.size.height) * 2 + 1,
      )
    } else {
      state.pointer.set(OFF_SCREEN, OFF_SCREEN)
    }
    state.raycaster.setFromCamera(state.pointer, state.camera)
  },
})

/** True while `#cursos` is on screen and the tab is visible. */
function useSpiralOnScreen() {
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const section = document.getElementById('cursos')
    if (!section) return

    let inView = true
    const update = () => setOnScreen(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    })
    observer.observe(section)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return onScreen
}

/** Fixed canvas behind the whole page. Client only (loaded through SceneLoader). */
export default function Scene() {
  const dpr = usePreset((preset) => preset.dpr)
  const onScreen = useSpiralOnScreen()
  const pastSpiral = useStore((s) => s.pastSpiral)
  // read once: the camera and fog are eased toward the active preset every frame by <Spiral>
  const [initial] = useState(() => ({
    preset: activePreset(),
    paper: cssVar('--color-paper'),
    debug: new URLSearchParams(window.location.search).has('debug'),
  }))
  const { preset, paper, debug } = initial
  useEffect(() => disposeMaterials, [])

  // Opacity follows the scroll (like the hero's), written straight to the style: no re-render per frame.
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const apply = () => {
      if (root.current) root.current.style.opacity = String(spiralOpacity())
    }
    apply()
    window.addEventListener('resize', apply) // rotating the phone changes the layout
    const unsubscribe = useStore.subscribe((s, prev) => {
      if (s.heroProgress !== prev.heroProgress) apply()
    })
    return () => {
      window.removeEventListener('resize', apply)
      unsubscribe()
    }
  }, [])

  return (
    // 100lvh: does not resize when the mobile browser bar collapses
    <div ref={root} aria-hidden className="fixed inset-0 z-[var(--z-canvas)] h-lvh">
      <Canvas
        dpr={[1, dpr]}
        camera={{ fov: preset.camera.fov, position: [0, 0, preset.camera.z] }}
        // 'demand' still redraws on resize; R3F renders one last frame when the mode changes
        frameloop={onScreen ? 'always' : 'demand'}
        // the page sits on top of the canvas: listen on <body> so the 3D still gets the pointer
        eventSource={document.body}
        events={pointerEvents}
      >
        <color attach="background" args={[paper]} />
        <fog attach="fog" args={[paper, preset.fogNear, preset.fogFar]} />
        {/* also tells the loader when the scene is lit and drawn (`sceneReady`) */}
        <Lights />
        <Spiral />
        {debug && (
          <Suspense fallback={null}>
            <DebugPanel />
          </Suspense>
        )}
      </Canvas>
      {/* Readability gradients (`.spiral-fade`, globals.css). Here, not in the UI, so the technical
          grid of the grain stays on top of them. Gone while a piece is open (the stage is right there) and
          past the spiral (the left veil would hide half of the line on its way to the next section). */}
      <div
        className={`spiral-fade fades-in-focus pointer-events-none absolute inset-0 z-10 ${pastSpiral ? 'opacity-0' : ''}`}
      />
    </div>
  )
}
