import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Path, Shape, type Group } from 'three'
import { clay, ink } from './materials'
import { REDUCED_HOVER_SCALE, step, useDampedFlag, useIdleTime } from './motion'
import { normalize } from './normalize'
import type { ArchetypeProps } from './types'

// DESIGN.md §5 `gears` — two meshed gears (toothed outline → Extrude), an ink axle through each.
const MODULE = 0.1 // pitch diameter / teeth — the same on both gears, or the teeth don't mesh
const ADDENDUM = 0.9 * MODULE // pitch circle → tip
const DEDENDUM = 1.1 * MODULE // pitch circle → root (deeper than the addendum: tip clearance)
const TOOTH_WIDTH = { root: 0.56, tip: 0.36 } // fraction of a tooth period (≈ 0.45 at the pitch circle)
const BIG = { teeth: 12, hole: 0.14 }
const SMALL = { teeth: 8, hole: 0.1 }
const ANGLE = 0.6 // rad — direction from the big gear to the small one
const BODY = { depth: 0.16, bevel: 0.03 }
const AXLE = { ratio: 0.7, overhang: 0.08 } // radius = hole × ratio; sticks out of both faces
const IDLE = 0.3 // rad/s of the big gear; hover makes it 3×, active 2×
const TILT = { x: 0.35, y: -0.3 } // rad, so the thickness of the teeth reads

const pitch = (teeth: number) => (teeth * MODULE) / 2

/** Gear outline with trapezoid teeth (tooth 0 points along +x) and a round hole in the middle. */
function gearShape(teeth: number, hole: number) {
  const radius = pitch(teeth)
  const period = (Math.PI * 2) / teeth
  const shape = new Shape()
  for (let i = 0; i < teeth; i++) {
    const corners: [r: number, halfWidth: number][] = [
      [radius - DEDENDUM, -TOOTH_WIDTH.root / 2],
      [radius + ADDENDUM, -TOOTH_WIDTH.tip / 2],
      [radius + ADDENDUM, TOOTH_WIDTH.tip / 2],
      [radius - DEDENDUM, TOOTH_WIDTH.root / 2],
    ]
    corners.forEach(([r, halfWidth], k) => {
      const a = (i + halfWidth) * period
      if (i === 0 && k === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r)
      else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    })
  }
  shape.closePath()
  shape.holes.push(new Path().absarc(0, 0, hole, 0, Math.PI * 2, true))
  return shape
}

// The small gear turns N1/N2 as fast the other way, and starts half a tooth off so that a gap
// faces the big gear's tooth 0 (which points at it).
const DISTANCE = pitch(BIG.teeth) + pitch(SMALL.teeth)
const GEARS = [
  { ...BIG, x: 0, y: 0, rest: ANGLE, ratio: 1 },
  {
    ...SMALL,
    x: Math.cos(ANGLE) * DISTANCE,
    y: Math.sin(ANGLE) * DISTANCE,
    rest: ANGLE + Math.PI + Math.PI / SMALL.teeth,
    ratio: -BIG.teeth / SMALL.teeth,
  },
].map((gear) => ({ ...gear, shape: gearShape(gear.teeth, gear.hole) }))

export default function Gears({ tint, hovered, active, reducedMotion, detail }: ArchetypeProps) {
  const root = useRef<Group>(null!)
  const fit = useRef<Group>(null!)
  const wheels = useRef<Group>(null!)
  const boosted = useRef(0) // extra turn from hover / active, on top of the idle one
  const hover = useDampedFlag(hovered)
  const on = useDampedFlag(active)
  const idle = useIdleTime(reducedMotion)

  const high = detail === 'high'
  const args = useMemo(() => {
    const extrude = {
      depth: BODY.depth,
      bevelThickness: BODY.bevel,
      bevelSize: BODY.bevel,
      bevelOffset: -BODY.bevel, // bevel inward: teeth keep their width and still mesh
      bevelSegments: high ? 3 : 1,
      curveSegments: high ? 12 : 4,
    }
    return GEARS.map((gear) => [gear.shape, extrude] as const)
  }, [high])
  const axleSegments = high ? 24 : 10
  const axleLength = BODY.depth + 2 * (BODY.bevel + AXLE.overhang)

  useLayoutEffect(() => normalize(fit.current), [detail])

  useFrame((_, delta) => {
    root.current.scale.setScalar(reducedMotion ? 1 + REDUCED_HOVER_SCALE * hover.current : 1)
    const boost = reducedMotion ? 0 : Math.max(2 * hover.current, on.current)
    boosted.current += step(delta) * IDLE * boost
    const turn = idle.current * IDLE + boosted.current
    wheels.current.children.forEach((wheel, i) => {
      wheel.rotation.z = GEARS[i].rest + turn * GEARS[i].ratio
    })
  })

  return (
    <group ref={root} rotation={[TILT.x, TILT.y, 0]}>
      <group ref={fit}>
        <group ref={wheels}>
          {GEARS.map((gear, i) => (
            <group key={i} position={[gear.x, gear.y, 0]} rotation-z={gear.rest}>
              <mesh position-z={-BODY.depth / 2} material={clay(tint)}>
                <extrudeGeometry args={args[i]} />
              </mesh>
              <mesh rotation-x={Math.PI / 2} material={ink()}>
                <cylinderGeometry
                  args={[gear.hole * AXLE.ratio, gear.hole * AXLE.ratio, axleLength, axleSegments]}
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}
