'use client'

import { lazy, Suspense, useEffect, useState } from 'react'
import { Canvas, events as createPointerEvents, type CanvasProps } from '@react-three/fiber'
import { cssVar } from '@/lib/cssVar'
import { activePreset, reaches3d, usePreset } from '@/lib/viewport'
import { disposeMaterials } from './archetypes/materials'
import Lights from './Lights'
import Spiral from './spiral/Spiral'

const DebugPanel = lazy(() => import('./debug/DebugPanel'))

const OFF_SCREEN = 5 // in NDC (the screen is −1 … 1): a ray from there hits nothing

/** R3F's pointer events, with our own `compute`. The canvas listens on <body> (the page sits on
 *  top of it), so: client coordinates, and a pointer that is over a control or outside `#cursos`
 *  counts as off screen — R3F then fires the `pointerout` of whatever was hovered by itself. */
const pointerEvents: CanvasProps['events'] = (store) => ({
  ...createPointerEvents(store),
  compute: (event, state) => {
    if (reaches3d(event.target)) {
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
  // read once: the camera and fog are eased toward the active preset every frame by <Spiral>
  const [initial] = useState(() => ({
    preset: activePreset(),
    paper: cssVar('--color-paper'),
    debug: new URLSearchParams(window.location.search).has('debug'),
  }))
  const { preset, paper, debug } = initial
  useEffect(() => disposeMaterials, [])

  return (
    // 100lvh: does not resize when the mobile browser bar collapses
    <div aria-hidden className="fixed inset-0 z-[var(--z-canvas)] h-lvh">
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
        <Lights />
        <Spiral />
        {debug && (
          <Suspense fallback={null}>
            <DebugPanel />
          </Suspense>
        )}
      </Canvas>
      {/* Readability gradients (`.spiral-fade`, globals.css). Here, not in the UI, so the technical
          grid of the grain stays on top of them. Gone while a piece is open: the stage is right there. */}
      <div className="spiral-fade fades-in-focus pointer-events-none absolute inset-0 z-10" />
    </div>
  )
}
