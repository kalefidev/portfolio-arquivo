import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Fog, type Group, type PerspectiveCamera } from 'three'
import { AMBIENT_SWAY, PRESET_LAMBDA, spiralPresets, type SpiralPreset } from '@/config/spiral'
import { featuredCourses } from '@/content/courses'
import { useStore } from '@/lib/store'
import { prefersReducedMotion, usePreset } from '@/lib/viewport'
import Axis from './Axis'
import SpiralItem from './SpiralItem'

const { damp, degToRad } = MathUtils
const courses = featuredCourses()

const SETTLE = 1e3 // s — a delta this large makes damp() land on its target

/** What every part of the spiral draws from on a given frame. Written by <Spiral> before its children run. */
export interface SpiralFrame {
  cfg: SpiralPreset // live parameters, eased toward the active preset
  p: number // damped progress
  exit: number // damped exitProgress
  lift: number // world units the pieces and the rail have risen on the way out
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
  const pieces = useRef<Group>(null!)
  const swayGain = useRef(0)
  const frame = useRef<SpiralFrame>(null!)
  if (frame.current === null) {
    const { progress, exitProgress } = useStore.getState()
    frame.current = {
      cfg: { ...preset, camera: { ...preset.camera } },
      p: progress,
      exit: exitProgress,
      lift: 0,
      extra: { dragOffset: 0, ambientSway: 0 },
    }
  }

  // Priority −1: runs before the pieces and the axis, and (unlike a positive one) keeps R3F rendering.
  useFrame((state, delta) => {
    const f = frame.current
    const { progress, exitProgress, dragOffset, ambientMotion } = useStore.getState()
    // A 'demand' frame is a still (section off screen, hidden tab, resize): draw the settled state.
    const live = state.frameloop === 'always'
    const dt = live ? delta : SETTLE

    easePreset(f.cfg, preset, dt)
    f.p = damp(f.p, progress, f.cfg.damping, dt)
    f.exit = damp(f.exit, exitProgress, f.cfg.damping, dt)

    // The clock restarts at 0 when the loop resumes, and sin(0) = 0: stills are drawn without sway.
    const swayOn = live && ambientMotion && !reducedMotion
    swayGain.current = damp(swayGain.current, swayOn ? AMBIENT_SWAY.amplitude : 0, PRESET_LAMBDA, dt)
    f.extra.ambientSway =
      swayGain.current * Math.sin((state.clock.elapsedTime * 2 * Math.PI) / AMBIENT_SWAY.period)
    f.extra.dragOffset = dragOffset

    const camera = state.camera as PerspectiveCamera
    if (camera.fov !== f.cfg.camera.fov || camera.position.z !== f.cfg.camera.z) {
      camera.fov = f.cfg.camera.fov
      camera.position.z = f.cfg.camera.z
      camera.updateProjectionMatrix()
    }
    const fog = state.scene.fog as Fog
    fog.near = f.cfg.fogNear
    fog.far = f.cfg.fogFar

    // Minimal exit (the real choreography is etapa 07): everything rises one screen, accelerating.
    const viewHeight = 2 * Math.tan(degToRad(f.cfg.camera.fov) / 2) * f.cfg.camera.z
    f.lift = f.exit * f.exit * viewHeight
    pieces.current.position.y = f.lift
  }, -1)

  return (
    <>
      <group ref={pieces}>
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
      </group>
      <Axis frame={frame} count={courses.length} />
    </>
  )
}
