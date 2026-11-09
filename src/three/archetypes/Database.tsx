import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector2, type Group } from 'three'
import { clay, ink, signal } from './materials'
import { REDUCED_HOVER_SCALE, step, useDampedFlag } from './motion'
import { normalize } from './normalize'
import type { ArchetypeProps } from './types'

// DESIGN.md §5 `database` — three stacked discs with a gap, an ink band and a status light each.
const DISC = { radius: 0.72, height: 0.36, corner: 0.06 }
const GAP = { rest: 0.1, hover: 0.2 } // between discs, and how much it grows on hover
const BAND_TUBE = 0.028
const LIGHT = { width: 0.14, height: 0.06, depth: 0.04, y: 0.1 }
const DISC_SPEEDS = [1.3, -0.9, 1.9] // rad/s on hover — the lights are what makes the turn visible
const TILT = 0.3 // rad toward the camera, so the top faces read
const SPIN = 0.4 // rad/s while active

/** Half-section of a disc with rounded edges, bottom → top, for LatheGeometry. */
function discProfile(cornerSteps: number) {
  const { radius, height, corner } = DISC
  const points = [new Vector2(0, -height / 2)]
  for (const top of [false, true]) {
    for (let i = 0; i <= cornerSteps; i++) {
      const a = (i / cornerSteps) * (Math.PI / 2) + (top ? 0 : -Math.PI / 2)
      const y = top ? height / 2 - corner : -height / 2 + corner
      points.push(new Vector2(radius - corner + Math.cos(a) * corner, y + Math.sin(a) * corner))
    }
  }
  points.push(new Vector2(0, height / 2))
  return points
}

export default function Database({ tint, hovered, active, reducedMotion, detail }: ArchetypeProps) {
  const root = useRef<Group>(null!)
  const turn = useRef<Group>(null!)
  const fit = useRef<Group>(null!)
  const discs = useRef<Group>(null!)
  const spinTime = useRef(0)
  const hover = useDampedFlag(hovered)
  const on = useDampedFlag(active)

  const high = detail === 'high'
  const segments = high ? 48 : 24
  const latheArgs = useMemo(() => [discProfile(high ? 4 : 2), segments] as const, [high, segments])

  useLayoutEffect(() => normalize(fit.current), [detail])

  useFrame((_, delta) => {
    const dt = step(delta)
    const h = reducedMotion ? 0 : hover.current
    root.current.scale.setScalar(reducedMotion ? 1 + REDUCED_HOVER_SCALE * hover.current : 1)
    if (!reducedMotion) turn.current.rotation.y += dt * SPIN * on.current

    spinTime.current += dt * h
    discs.current.children.forEach((disc, i) => {
      disc.position.y = (i - 1) * (DISC.height + GAP.rest + GAP.hover * h)
      disc.rotation.y = spinTime.current * DISC_SPEEDS[i]
    })
  })

  return (
    <group ref={root} rotation-x={TILT}>
      <group ref={turn}>
        <group ref={fit}>
          <group ref={discs}>
            {DISC_SPEEDS.map((_, i) => (
              <group key={i} position-y={(i - 1) * (DISC.height + GAP.rest)}>
                <mesh material={clay(tint)}>
                  <latheGeometry args={latheArgs} />
                </mesh>
                <mesh rotation-x={Math.PI / 2} material={ink()}>
                  <torusGeometry args={[DISC.radius, BAND_TUBE, 8, segments]} />
                </mesh>
                <mesh position={[0, LIGHT.y, DISC.radius]} material={signal()}>
                  <boxGeometry args={[LIGHT.width, LIGHT.height, LIGHT.depth]} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
}
