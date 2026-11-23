import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Fog, type PerspectiveCamera } from 'three'
import {
  AMBIENT_SWAY,
  FOCUS_MODE,
  PRESET_LAMBDA,
  REDUCED_DAMPING,
  spiralPresets,
  type SpiralPreset,
} from '@/config/spiral'
import { featuredCourses } from '@/content/courses'
import { useStore } from '@/lib/store'
import { prefersReducedMotion, reaches3d, usePreset } from '@/lib/viewport'
import Axis from './Axis'
import { spiral, SPIRAL, startDrag, stepDrag } from './drag'
import FocusMarks from './FocusMarks'
import SpiralItem from './SpiralItem'

const { damp, degToRad } = MathUtils
const courses = featuredCourses()

const SETTLE = 1e3 // s — a delta this large makes damp() land on its target
const MAX_STEP = 0.1 // s — a stalled frame never makes the drag inertia jump

/** What every part of the spiral draws from on a given frame. Written by <Spiral> before its children run. */
export interface SpiralFrame {
  cfg: SpiralPreset // live parameters, eased toward the active preset
  p: number // damped progress
  exit: number // damped exitProgress
  viewHeight: number // world units of screen height at z = 0: how far a piece rises on the way out
  focus: number // 0 … 1, damped: 1 while a piece is open in the overlay (the rest of the spiral steps back)
  staged: number[] // per piece, 0 … 1, damped: how far it has travelled to the stage
  stage: { x: number; y: number } // where the stage is, in world units at z = 0
  extra: { dragOffset: number; ambientSway: number }
}

function easePreset(cur: SpiralPreset, to: SpiralPreset, dt: number) {
  for (const key of Object.keys(to) as (keyof SpiralPreset)[]) {
    if (key !== 'camera') cur[key] = damp(cur[key], to[key], PRESET_LAMBDA, dt)
  }
  cur.camera.fov = damp(cur.camera.fov, to.camera.fov, PRESET_LAMBDA, dt)
  cur.camera.z = damp(cur.camera.z, to.camera.z, PRESET_LAMBDA, dt)
}

export default function Spiral() {
  const preset = usePreset((p) => p) // changes identity only when the viewport crosses presets
  const [reducedMotion] = useState(prefersReducedMotion)
  const detail = preset === spiralPresets.mobile ? 'low' : 'high' // fewer segments on mobile
  const swayGain = useRef(0)
  const frame = useRef<SpiralFrame>(null!)
  if (frame.current === null) {
    const { progress, exitProgress } = useStore.getState()
    frame.current = {
      cfg: { ...preset, camera: { ...preset.camera } },
      p: progress,
      exit: exitProgress,
      viewHeight: 0,
      focus: 0,
      staged: courses.map(() => 0),
      stage: { x: 0, y: 0 },
      extra: { dragOffset: 0, ambientSway: 0 },
    }
  }

  // Mouse drag (touch scrolls): on a piece it turns the piece, anywhere else on the spiral, the helix.
  // The hover already says which one is under the pointer — no raycast of our own.
  useEffect(() => {
    const down = (event: PointerEvent) => {
      const { hoveredSlug, focusSlug } = useStore.getState()
      if (event.pointerType !== 'mouse' || event.button !== 0 || focusSlug || !reaches3d(event.target)) return
      startDrag(event, hoveredSlug ?? SPIRAL)
    }
    const hover = useStore.subscribe((state, before) => {
      if (state.hoveredSlug !== before.hoveredSlug) {
        document.body.classList.toggle('piece-hover', state.hoveredSlug !== null) // crosshair (globals.css)
      }
    })
    document.body.addEventListener('pointerdown', down)
    return () => {
      document.body.removeEventListener('pointerdown', down)
      hover()
      useStore.getState().setHovered(null)
    }
  }, [])

  // Priority −2: runs before the pieces (−1) and everything else, and (unlike a positive one) keeps R3F rendering.
  useFrame((state, delta) => {
    const f = frame.current
    const { progress, exitProgress, focusSlug, ambientMotion } = useStore.getState()
    // A 'demand' frame is a still (section off screen, hidden tab, resize): draw the settled state.
    const live = state.frameloop === 'always'
    const dt = live ? delta : SETTLE

    easePreset(f.cfg, preset, dt)
    // reduced motion: things land almost at once instead of gliding
    const lambda = reducedMotion ? REDUCED_DAMPING : f.cfg.damping
    f.p = damp(f.p, progress, lambda, dt)
    f.exit = damp(f.exit, exitProgress, lambda, dt)

    // Focus mode. Each piece has its own way to the stage, so "next" in the overlay swaps two
    // pieces in flight instead of popping one in.
    const focusLambda = reducedMotion ? REDUCED_DAMPING : FOCUS_MODE.lambda
    f.focus = damp(f.focus, focusSlug ? 1 : 0, focusLambda, dt)
    for (let i = 0; i < courses.length; i++) {
      f.staged[i] = damp(f.staged[i], courses[i].slug === focusSlug ? 1 : 0, focusLambda, dt)
    }

    // The clock restarts at 0 when the loop resumes, and sin(0) = 0: stills are drawn without sway.
    const swayOn = live && ambientMotion && !reducedMotion
    swayGain.current = damp(swayGain.current, swayOn ? AMBIENT_SWAY.amplitude : 0, PRESET_LAMBDA, dt)
    f.extra.ambientSway =
      swayGain.current * Math.sin((state.clock.elapsedTime * 2 * Math.PI) / AMBIENT_SWAY.period)
    stepDrag(live ? Math.min(delta, MAX_STEP) : 0, f.cfg.dragReturn, reducedMotion)
    f.extra.dragOffset = spiral.offset

    const camera = state.camera as PerspectiveCamera
    if (camera.fov !== f.cfg.camera.fov || camera.position.z !== f.cfg.camera.z) {
      camera.fov = f.cfg.camera.fov
      camera.position.z = f.cfg.camera.z
      camera.updateProjectionMatrix()
    }
    const fog = state.scene.fog as Fog
    fog.near = f.cfg.fogNear
    fog.far = f.cfg.fogFar

    f.viewHeight = 2 * Math.tan(degToRad(f.cfg.camera.fov) / 2) * f.cfg.camera.z
    f.stage.x = (f.cfg.stageX - 0.5) * f.viewHeight * state.viewport.aspect
    f.stage.y = (0.5 - f.cfg.stageY) * f.viewHeight
  }, -2)

  return (
    <>
      {courses.map((course, index) => (
        <SpiralItem
          key={course.slug}
          index={index}
          course={course}
          frame={frame}
          reducedMotion={reducedMotion}
          detail={detail}
        />
      ))}
      <FocusMarks frame={frame} count={courses.length} />
      <Axis frame={frame} count={courses.length} reducedMotion={reducedMotion} />
    </>
  )
}
