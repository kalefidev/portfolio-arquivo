'use client'

import { lazy, Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { cssVar } from '@/lib/cssVar'
import { activePreset, usePreset } from '@/lib/viewport'
import { disposeMaterials } from './archetypes/materials'
import Lights from './Lights'
import Spiral from './spiral/Spiral'

const DebugPanel = lazy(() => import('./debug/DebugPanel'))

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
        eventPrefix="client"
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
      {/* Readability (DESIGN.md §3): paper behind the left column; behind the lower strip on portrait.
          Lives here, not in the UI, so the technical grid of the grain stays on top of it. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-paper/85 from-20% to-transparent to-50% wide:bg-linear-to-r wide:from-25% wide:to-50%" />
    </div>
  )
}
