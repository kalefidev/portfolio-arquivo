import { useMemo, useRef, useState, type ComponentRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import type { BufferAttribute, Group, Points } from 'three'
import { cssVar } from '@/lib/cssVar'
import { getItemTransform, newItemTransform } from './math'
import type { SpiralFrame } from './Spiral'

// DESIGN.md §4 › Desenho
const AXIS_OPACITY = 0.3
const AXIS_HALF_SPAN = 8 // pitches drawn above and below the active piece (covers the view in any preset)
const DASHES_PER_PITCH = 8
const TICK = 0.18 // world units
const RAIL_OPACITY = 0.18
const RAIL_DOTS_PER_PIECE = 36
const RAIL_DOT = 2 // px

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

/** Dashed vertical axis with a tick per piece + the dotted rail of the helix through the pieces. */
export default function Axis({ frame, count }: { frame: RefObject<SpiralFrame>; count: number }) {
  const axis = useRef<Group>(null!)
  const line = useRef<ComponentRef<typeof Line>>(null!)
  const rail = useRef<Points>(null!)
  const [ink] = useState(() => cssVar('--color-ink'))
  const dots = useMemo(
    () => new Float32Array((Math.max(count - 1, 0) * RAIL_DOTS_PER_PIECE + 1) * 3),
    [count],
  )

  useFrame(() => {
    const { cfg, p, exit, lift, extra } = frame.current

    // Ticks sit at the height of the pieces: the pattern repeats every pitch, so it only
    // has to slide by the fractional part of the progress.
    axis.current.position.set(cfg.axisX, (p % 1) * cfg.pitch, -cfg.radiusZ)
    axis.current.scale.y = cfg.pitch
    line.current.material.opacity = AXIS_OPACITY * (1 - exit)

    const position = rail.current.geometry.attributes.position as BufferAttribute
    for (let k = 0; k < position.count; k++) {
      const { x, y, z } = getItemTransform(k / RAIL_DOTS_PER_PIECE, p, cfg, extra, target).position
      position.setXYZ(k, x, y, z)
    }
    position.needsUpdate = true
    rail.current.position.y = lift
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
