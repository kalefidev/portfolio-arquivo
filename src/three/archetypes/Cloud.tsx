import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { clay, signal } from './materials'
import { REDUCED_HOVER_SCALE, step, useDampedFlag, useIdleTime } from './motion'
import { normalize } from './normalize'
import type { ArchetypeProps } from './types'

// DESIGN.md §5 `cloud` — puffs flattened in Y; "packets" rise out of it and vanish (upload).
const PUFFS: [x: number, y: number, z: number, radius: number][] = [
  [0, 0.05, 0, 0.62],
  [-0.55, -0.1, 0.05, 0.45],
  [0.58, -0.08, 0, 0.5],
  [-0.2, 0.38, -0.1, 0.42],
  [0.3, 0.32, 0.1, 0.4],
  [-0.95, -0.2, 0, 0.3],
  [1, -0.2, 0.05, 0.32],
]
const FLATTEN = 0.75
const SEGMENTS = { high: [32, 20], low: [16, 10] } as const

const PACKET_X = [-0.38, 0.04, 0.42]
const PACKET_SIZE = 0.17
const PACKET_FROM = 0.15 // y inside the cloud
const PACKET_TO = 1.25
const PACKET_RATE = 0.55 // loops per second

const FLOAT = { speed: 1.3, height: 0.05 }
const SPIN = 0.35 // rad/s while active

export default function Cloud({ tint, hovered, active, reducedMotion, detail }: ArchetypeProps) {
  const root = useRef<Group>(null!)
  const fit = useRef<Group>(null!)
  const packets = useRef<Group>(null!)
  const flowTime = useRef(0)
  const hover = useDampedFlag(hovered)
  const on = useDampedFlag(active)
  const idle = useIdleTime(reducedMotion)

  useLayoutEffect(() => normalize(fit.current), [detail])

  useFrame((_, delta) => {
    const dt = step(delta)
    const flow = reducedMotion ? 0 : Math.max(hover.current, on.current)
    root.current.scale.setScalar(reducedMotion ? 1 + REDUCED_HOVER_SCALE * hover.current : 1)
    root.current.position.y = Math.sin(idle.current * FLOAT.speed) * FLOAT.height
    if (!reducedMotion) root.current.rotation.y += dt * SPIN * on.current

    flowTime.current += dt * flow
    packets.current.children.forEach((packet, i) => {
      const phase = (flowTime.current * PACKET_RATE + i / PACKET_X.length) % 1
      packet.position.y = MathUtils.lerp(PACKET_FROM, PACKET_TO, phase)
      packet.rotation.y = phase * Math.PI
      packet.scale.setScalar(Math.sin(Math.PI * phase) * flow)
    })
  })

  return (
    <group ref={root}>
      <group ref={fit}>
        <group scale={[1, FLATTEN, 1]}>
          {PUFFS.map(([x, y, z, radius], i) => (
            <mesh key={i} position={[x, y, z]} scale={radius} material={clay(tint)}>
              <sphereGeometry args={[1, ...SEGMENTS[detail]]} />
            </mesh>
          ))}
        </group>
        <group ref={packets}>
          {PACKET_X.map((x) => (
            <mesh key={x} position={[x, PACKET_FROM, 0.2]} scale={0} material={signal()}>
              <boxGeometry args={[PACKET_SIZE, PACKET_SIZE, PACKET_SIZE]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}
