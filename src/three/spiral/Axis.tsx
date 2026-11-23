import { useMemo, useRef, useState, type ComponentRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { MathUtils, type BufferAttribute, type BufferGeometry, type Group, type Points, type PointsMaterial } from 'three'
import { EXIT } from '@/config/spiral'
import { cssVar } from '@/lib/cssVar'
import { getItemTransform, newItemTransform, smoothstep } from './math'
import type { SpiralFrame } from './Spiral'

// DESIGN.md §4 › Desenho
const AXIS_OPACITY = 0.3
const AXIS_HALF_SPAN = 8 // pitches drawn above and below the active piece (covers the view in any preset)
const DASHES_PER_PITCH = 8
const TICK = 0.18 // world units
const RAIL_OPACITY = 0.18
const RAIL_DOTS_PER_PIECE = 36
const RAIL_GAP = 0.3 // fraction of a step left empty on each side of a piece: the rail never crosses an object
const RAIL_DOT = 2 // px

const { clamp, degToRad, lerp } = MathUtils
const target = newItemTransform() // scratch

/** The axis in "pitch units": dashes along y and a ruler tick on every integer. Periodic in 1. */
const AXIS_SEGMENTS = (() => {
  const points: [number, number, number][] = []
  for (let k = -AXIS_HALF_SPAN; k < AXIS_HALF_SPAN; k++) {
    points.push([-TICK / 2, k, 0], [TICK / 2, k, 0])
    for (let j = 0; j < DASHES_PER_PITCH; j++) {
      // offset by a quarter so each tick crosses the middle of a dash
      points.push(
        [0, k + (j - 0.25) / DASHES_PER_PITCH, 0],
        [0, k + (j + 0.25) / DASHES_PER_PITCH, 0],
      )
    }
  }
  return points
})()

/** Dashed vertical axis with a tick per piece + the dotted rail of the helix through the pieces.
 *  On the way out the axis lies down and becomes the line of the next section (DESIGN.md §7): it
 *  waits at `EXIT.restY` of the screen until the HTML line (`#linha`) gets there, follows it, and
 *  hands over to it. Both sides read the real position of the DOM line, so nothing is hard-coded.
 *  Reduced motion: the axis just fades. */
export default function Axis({
  frame,
  count,
  reducedMotion,
}: {
  frame: RefObject<SpiralFrame>
  count: number
  reducedMotion: boolean
}) {
  const axis = useRef<Group>(null!)
  const line = useRef<ComponentRef<typeof Line>>(null!)
  const rail = useRef<Points<BufferGeometry, PointsMaterial>>(null!)
  const [ink] = useState(() => cssVar('--color-ink'))
  // where each dot sits along the helix, in pieces (0 … N−1), skipping the gap around every piece
  const stops = useMemo(() => {
    const total = Math.max(count - 1, 0) * RAIL_DOTS_PER_PIECE + 1
    return Array.from({ length: total }, (_, k) => k / RAIL_DOTS_PER_PIECE).filter(
      (t) => Math.abs(t - Math.round(t)) >= RAIL_GAP,
    )
  }, [count])
  const dots = useMemo(() => new Float32Array(stops.length * 3), [stops])

  useFrame((state) => {
    const { cfg, p, exit, focus, extra } = frame.current

    // Ticks sit at the height of the pieces: the pattern repeats every pitch, so it only has to
    // slide by the distance to the nearest piece (0 at the end, where the pivot is the screen centre).
    const phase = (p - Math.round(p)) * cfg.pitch
    const lie = reducedMotion ? 0 : smoothstep(EXIT.lieFrom, 1, exit)
    let y = phase
    let visible = reducedMotion ? 1 - exit : 1
    if (lie > 0) {
      // where the HTML line is (it is below the screen until the exit is over)
      const top = document.getElementById(EXIT.lineId)?.getBoundingClientRect().top ?? Infinity
      const rest = EXIT.restY * window.innerHeight
      const depth = cfg.camera.z + cfg.radiusZ // the axis sits at z = −radiusZ
      const worldHeight = 2 * Math.tan(degToRad(cfg.camera.fov) / 2) * depth
      y = lerp(phase, (0.5 - Math.min(rest, top) / state.size.height) * worldHeight, lie)
      visible = 1 - clamp((rest - top) / (EXIT.handoff * window.innerHeight), 0, 1) // the HTML line fades in as this fades out
    }
    axis.current.position.set(cfg.axisX, y, -cfg.radiusZ)
    axis.current.rotation.z = lie * (Math.PI / 2)
    axis.current.scale.y = cfg.pitch
    line.current.material.opacity = AXIS_OPACITY * visible * (1 - focus)
    // the rail stays where it is and fades before the active piece leaves
    rail.current.material.opacity = RAIL_OPACITY * (1 - focus) * (1 - smoothstep(0, EXIT.stagger, exit))

    const position = rail.current.geometry.attributes.position as BufferAttribute
    for (let k = 0; k < stops.length; k++) {
      const { x, y, z } = getItemTransform(stops[k], p, cfg, extra, target).position
      position.setXYZ(k, x, y, z)
    }
    position.needsUpdate = true
  })

  return (
    <>
      <group ref={axis}>
        <Line ref={line} points={AXIS_SEGMENTS} segments color={ink} lineWidth={1} transparent opacity={AXIS_OPACITY} />
      </group>
      <points ref={rail} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dots, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={ink}
          size={RAIL_DOT}
          sizeAttenuation={false}
          transparent
          opacity={RAIL_OPACITY}
          depthWrite={false}
        />
      </points>
    </>
  )
}
