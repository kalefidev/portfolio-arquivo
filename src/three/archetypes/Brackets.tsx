import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Shape, Vector2, type Group, type Mesh } from 'three'
import { clay, signal } from './materials'
import { REDUCED_HOVER_SCALE, step, useDampedFlag, useIdleTime } from './motion'
import { normalize } from './normalize'
import type { ArchetypeProps } from './types'

// DESIGN.md §5 `brackets` — `<`, `/`, `>` as three bevelled extrusions, each centred on its origin.
const polygon = (points: [number, number][]) => new Shape(points.map(([x, y]) => new Vector2(x, y)))

const chevron = polygon([
  [0.17, 0.6],
  [-0.43, 0],
  [0.17, -0.6],
  [0.43, -0.6],
  [-0.17, 0],
  [0.43, 0.6],
]) // `<` — the `>` is the same shape turned 180°
const slash = polygon([
  [-0.26, -0.72],
  [-0.04, -0.72],
  [0.26, 0.72],
  [0.04, 0.72],
])

const DEPTH = 0.28
const BEVEL = 0.035
const SPREAD = { rest: 0.85, hover: 0.22 } // x of the chevrons, and how far they move apart
const CURSOR = { x: 0.48, width: 0.09, height: 1, blink: 1.6 } // blinks per second
const SWAY = { speed: 0.5, angle: 0.45 } // rad
const PULSE = { speed: 4, amount: 0.05 }

export default function Brackets({ tint, hovered, active, reducedMotion, detail }: ArchetypeProps) {
  const root = useRef<Group>(null!)
  const fit = useRef<Group>(null!)
  const open = useRef<Mesh>(null!)
  const close = useRef<Mesh>(null!)
  const bar = useRef<Group>(null!)
  const cursor = useRef<Mesh>(null!)
  const blink = useRef(0)
  const hover = useDampedFlag(hovered)
  const on = useDampedFlag(active)
  const idle = useIdleTime(reducedMotion)

  const extrude = useMemo(
    () => ({
      depth: DEPTH,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: detail === 'high' ? 3 : 1,
    }),
    [detail],
  )
  const chevronArgs = useMemo(() => [chevron, extrude] as const, [extrude])
  const slashArgs = useMemo(() => [slash, extrude] as const, [extrude])

  useLayoutEffect(() => normalize(fit.current), [detail])

  useFrame((_, delta) => {
    const h = reducedMotion ? 0 : hover.current
    root.current.scale.setScalar(
      1 +
        (reducedMotion
          ? REDUCED_HOVER_SCALE * hover.current
          : PULSE.amount * on.current * Math.sin(idle.current * PULSE.speed)),
    )
    root.current.rotation.y = Math.sin(idle.current * SWAY.speed) * SWAY.angle

    open.current.position.x = -SPREAD.rest - SPREAD.hover * h
    close.current.position.x = SPREAD.rest + SPREAD.hover * h
    bar.current.rotation.y = h * Math.PI * 2

    blink.current += step(delta)
    cursor.current.scale.setScalar((blink.current * CURSOR.blink) % 1 < 0.5 ? h : 0)
  })

  return (
    <group ref={root}>
      <group ref={fit}>
        <mesh ref={open} position-x={-SPREAD.rest} material={clay(tint)}>
          <extrudeGeometry args={chevronArgs} />
        </mesh>
        {/* pivot on the middle of the extrusion, so the `/` turns in place */}
        <group ref={bar} position-z={DEPTH / 2}>
          <mesh position-z={-DEPTH / 2} material={clay(tint)}>
            <extrudeGeometry args={slashArgs} />
          </mesh>
        </group>
        <mesh ref={close} position-x={SPREAD.rest} rotation-z={Math.PI} material={clay(tint)}>
          <extrudeGeometry args={chevronArgs} />
        </mesh>
        <mesh ref={cursor} position={[CURSOR.x, 0, DEPTH / 2]} scale={0} material={signal()}>
          <boxGeometry args={[CURSOR.width, CURSOR.height, CURSOR.width]} />
        </mesh>
      </group>
    </group>
  )
}
