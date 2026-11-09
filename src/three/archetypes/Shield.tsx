import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Shape, type Group, type Mesh, type MeshStandardMaterial } from 'three'
import { CLAY, clay, ink, signal } from './materials'
import { REDUCED_HOVER_SCALE, step, useDampedFlag, useIdleTime } from './motion'
import { normalize } from './normalize'
import type { ArchetypeProps } from './types'

// DESIGN.md §5 `shield` — bevelled shield outline, raised panel, keyhole in relief.
const outline = new Shape()
  .moveTo(0, 1)
  .quadraticCurveTo(0.4, 0.82, 0.8, 0.8)
  .lineTo(0.8, 0.1)
  .bezierCurveTo(0.8, -0.5, 0.4, -0.85, 0, -1.05)
  .bezierCurveTo(-0.4, -0.85, -0.8, -0.5, -0.8, 0.1)
  .lineTo(-0.8, 0.8)
  .quadraticCurveTo(-0.4, 0.82, 0, 1)

const KEY = { y: 0.1, radius: 0.15, neck: 0.5, foot: 0.12, bottom: -0.3 } // neck: rad cut from the circle
const keyhole = new Shape()
  .absarc(0, KEY.y, KEY.radius, -Math.PI / 2 + KEY.neck, (3 * Math.PI) / 2 - KEY.neck, false)
  .lineTo(-KEY.foot, KEY.bottom)
  .lineTo(KEY.foot, KEY.bottom)
  .closePath()

const BODY = { depth: 0.16, bevel: 0.05 }
const PANEL = { depth: 0.03, bevel: 0.02, inset: 0.8 }
const KEY_DEPTH = 0.04
const PANEL_Z = BODY.depth + BODY.bevel
const KEY_Z = PANEL_Z + PANEL.depth + PANEL.bevel

const SWAY = { speed: 0.9, angle: MathUtils.degToRad(8) }
const RING = { radius: 1.05, tube: 0.025, depth: 0.5, top: 0.95, bottom: -1, period: 1.5, tip: 0.3 }
const RIM_GLOW = 0.3 // emissive intensity of the border while active

export default function Shield({ tint, hovered, active, reducedMotion, detail }: ArchetypeProps) {
  const root = useRef<Group>(null!)
  const fit = useRef<Group>(null!)
  const ring = useRef<Mesh>(null!)
  const rim = useRef<MeshStandardMaterial>(null!)
  const sweep = useRef(0)
  const wasHovered = useRef(false)
  const hover = useDampedFlag(hovered)
  const on = useDampedFlag(active)
  const idle = useIdleTime(reducedMotion)

  const high = detail === 'high'
  const args = useMemo(() => {
    const curveSegments = high ? 24 : 8
    const bevelSegments = high ? 3 : 1
    const extrude = (depth: number, bevel: number) => ({
      depth,
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments,
      curveSegments,
    })
    return {
      body: [outline, extrude(BODY.depth, BODY.bevel)] as const,
      panel: [outline, extrude(PANEL.depth, PANEL.bevel)] as const,
      key: [keyhole, extrude(KEY_DEPTH, 0)] as const,
    }
  }, [high])

  useLayoutEffect(() => normalize(fit.current), [detail])

  useFrame((_, delta) => {
    const h = reducedMotion ? 0 : hover.current
    root.current.scale.setScalar(reducedMotion ? 1 + REDUCED_HOVER_SCALE * hover.current : 1)
    root.current.rotation.y = Math.sin(idle.current * SWAY.speed) * SWAY.angle
    rim.current.emissiveIntensity = on.current * RIM_GLOW

    // scan ring: starts at the top on every hover, runs top → bottom while hovered
    if (hovered && !wasHovered.current) sweep.current = 0
    wasHovered.current = hovered
    sweep.current += step(delta)
    const phase = (sweep.current / RING.period) % 1
    const y = MathUtils.lerp(RING.top, RING.bottom, phase)
    const ends = MathUtils.smoothstep(phase, 0, 0.08) * (1 - MathUtils.smoothstep(phase, 0.92, 1))
    // follows the outline: full width on the straight sides, narrowing toward the tip
    const width = MathUtils.lerp(RING.tip, 1, MathUtils.smoothstep(y, RING.bottom, 0.1)) * ends * h
    ring.current.position.y = y
    ring.current.scale.set(width, width * RING.depth, width)
  })

  return (
    <group ref={root}>
      <group ref={fit}>
        <mesh>
          <extrudeGeometry args={args.body} />
          <meshStandardMaterial
            ref={rim}
            {...CLAY}
            color={tint}
            emissive={signal().color}
            emissiveIntensity={0}
          />
        </mesh>
        <mesh
          position-z={PANEL_Z}
          scale={[PANEL.inset, PANEL.inset, 1]}
          material={clay(tint)}
        >
          <extrudeGeometry args={args.panel} />
        </mesh>
        <mesh position-z={KEY_Z} material={ink()}>
          <extrudeGeometry args={args.key} />
        </mesh>
        {/* the torus is built in XY: once laid flat, its local Y is the ring's depth */}
        <mesh
          ref={ring}
          position-z={PANEL_Z / 2}
          rotation-x={Math.PI / 2}
          scale={0}
          material={signal()}
        >
          <torusGeometry args={[RING.radius, RING.tube, 8, high ? 64 : 32]} />
        </mesh>
      </group>
    </group>
  )
}
