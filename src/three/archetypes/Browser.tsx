import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { clay, ink, paleClay, signal } from './materials'
import { REDUCED_HOVER_SCALE, step, useDampedFlag } from './motion'
import { normalize } from './normalize'
import { roundedRect } from './shapes'
import type { ArchetypeProps } from './types'

// DESIGN.md §5 `browser` — bevelled window, top bar with 3 dots, layout blocks in relief (pale
// clay: in the window's own tone they vanish) that reflow from a desktop grid into a mobile column.
const WINDOW = { width: 2, height: 1.4, corner: 0.12, depth: 0.08, bevel: 0.03 }
const FACE = WINDOW.depth / 2 + WINDOW.bevel // z of the front face
const RELIEF = 0.07 // depth of the bar and the blocks — their shaded undersides are what reads
const BAR = { y: 0.55, width: 1.84, height: 0.16 }
const DOT = { x: -0.8, gap: 0.12, radius: 0.04, depth: 0.03 }

type Block = [x: number, y: number, width: number, height: number]
// nav, hero, CTA, 3 cards — same order in both layouts
const DESKTOP: Block[] = [
  [0, 0.36, 1.84, 0.08],
  [-0.33, 0.08, 1.18, 0.3],
  [0.63, 0.08, 0.58, 0.14],
  [-0.64, -0.38, 0.56, 0.34],
  [0, -0.38, 0.56, 0.34],
  [0.64, -0.38, 0.56, 0.34],
]
const MOBILE: Block[] = [
  [0, 0.36, 0.6, 0.08],
  [0, 0.16, 0.6, 0.2],
  [0, -0.02, 0.36, 0.1],
  [0, -0.19, 0.6, 0.12],
  [0, -0.37, 0.6, 0.12],
  [0, -0.55, 0.6, 0.12],
]
const CTA = 2

const STAGGER = 0.08 // of the morph, between one block and the next
const SPAN = 1 - STAGGER * (DESKTOP.length - 1) // of the morph, for one block to move
const MORPH_LAMBDA = 4 // slower than the other flags, so the reflow reads
const LOOP_SPEED = 0.9 // rad/s — one desktop → mobile → desktop cycle every ~7 s while active
const TILT = { x: -0.15, y: 0.35 } // rad, so the thickness and the relief read

const outline = roundedRect(WINDOW.width, WINDOW.height, WINDOW.corner)

export default function Browser({ tint, hovered, active, reducedMotion, detail }: ArchetypeProps) {
  const root = useRef<Group>(null!)
  const fit = useRef<Group>(null!)
  const blocks = useRef<Group>(null!)
  const loopTime = useRef(0)
  const hover = useDampedFlag(hovered, MORPH_LAMBDA)
  const on = useDampedFlag(active)

  const high = detail === 'high'
  const windowArgs = useMemo(
    () =>
      [
        outline,
        {
          depth: WINDOW.depth,
          bevelThickness: WINDOW.bevel,
          bevelSize: WINDOW.bevel,
          bevelSegments: high ? 3 : 1,
          curveSegments: high ? 12 : 4,
        },
      ] as const,
    [high],
  )
  const dotArgs = [DOT.radius, DOT.radius, DOT.depth, high ? 16 : 8] as const

  useLayoutEffect(() => normalize(fit.current), [detail])

  useFrame((_, delta) => {
    root.current.scale.setScalar(reducedMotion ? 1 + REDUCED_HOVER_SCALE * hover.current : 1)
    loopTime.current += step(delta) * on.current
    const loop = (0.5 - 0.5 * Math.cos(loopTime.current * LOOP_SPEED)) * on.current
    const morph = reducedMotion ? 0 : Math.max(hover.current, loop)

    blocks.current.children.forEach((block, i) => {
      const t = MathUtils.smoothstep(morph, i * STAGGER, i * STAGGER + SPAN)
      const [x0, y0, w0, h0] = DESKTOP[i]
      const [x1, y1, w1, h1] = MOBILE[i]
      block.position.x = MathUtils.lerp(x0, x1, t)
      block.position.y = MathUtils.lerp(y0, y1, t)
      block.scale.x = MathUtils.lerp(w0, w1, t)
      block.scale.y = MathUtils.lerp(h0, h1, t)
    })
  })

  return (
    <group ref={root} rotation={[TILT.x, TILT.y, 0]}>
      <group ref={fit}>
        <mesh position-z={-WINDOW.depth / 2} material={clay(tint)}>
          <extrudeGeometry args={windowArgs} />
        </mesh>
        <mesh
          position={[0, BAR.y, FACE + RELIEF / 2]}
          scale={[BAR.width, BAR.height, RELIEF]}
          material={clay(tint)}
        >
          <boxGeometry />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[DOT.x + i * DOT.gap, BAR.y, FACE + RELIEF + DOT.depth / 2]}
            rotation-x={Math.PI / 2}
            material={ink()}
          >
            <cylinderGeometry args={dotArgs} />
          </mesh>
        ))}
        <group ref={blocks} position-z={FACE + RELIEF / 2}>
          {DESKTOP.map(([x, y, width, height], i) => (
            <mesh
              key={i}
              position={[x, y, 0]}
              scale={[width, height, RELIEF]}
              material={i === CTA ? signal() : paleClay(tint)}
            >
              <boxGeometry />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}
