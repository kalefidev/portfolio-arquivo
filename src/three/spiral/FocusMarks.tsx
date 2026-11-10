import { useRef, useState, type ComponentRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Line } from '@react-three/drei'
import type { Group } from 'three'
import { FOCUS_MARKS } from '@/config/spiral'
import { cssVar } from '@/lib/cssVar'
import { getItemTransform, newItemTransform, smoothstep } from './math'
import type { SpiralFrame } from './Spiral'

const { half, arm, lineWidth, ringRadius, ringY, fadeFrom, spread } = FOCUS_MARKS
const RING_SEGMENTS = 64

type Point = [number, number, number]

/** Four L-shaped registration marks on the corners of a square, as line segments. */
const CORNERS = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
].flatMap(([sx, sy]): Point[] => {
  const x = sx * half
  const y = sy * half
  return [
    [x - sx * arm, y, 0],
    [x, y, 0],
    [x, y, 0],
    [x, y - sy * arm, 0],
  ]
})

const RING = Array.from({ length: RING_SEGMENTS + 1 }, (_, k): Point => {
  const angle = (k / RING_SEGMENTS) * 2 * Math.PI
  return [Math.cos(angle) * ringRadius, ringY, Math.sin(angle) * ringRadius]
})

const target = newItemTransform() // scratch

/** Signal registration marks around the active piece + a thin ring under it (DESIGN.md §3).
 *  One set for the whole spiral: it sits on whichever piece is nearest and is fully faded by the
 *  time the next one takes over, so the jump between pieces is never seen. */
export default function FocusMarks({ frame, count }: { frame: RefObject<SpiralFrame>; count: number }) {
  const marks = useRef<Group>(null!)
  const corners = useRef<ComponentRef<typeof Line>>(null!)
  const ring = useRef<ComponentRef<typeof Line>>(null!)
  const [signal] = useState(() => cssVar('--color-signal'))

  useFrame(() => {
    const { cfg, p, exit, extra } = frame.current
    const index = Math.min(Math.max(Math.round(p), 0), count - 1)
    const { position, scale, d } = getItemTransform(index, p, cfg, extra, target)
    const on = (1 - smoothstep(fadeFrom, 0.5, Math.abs(d))) * (1 - exit)

    marks.current.visible = on > 0
    marks.current.position.copy(position)
    marks.current.scale.setScalar(scale)
    corners.current.scale.setScalar(1 + spread * (1 - on))
    corners.current.material.opacity = on
    ring.current.material.opacity = on
  })

  // toneMapped off: the same orange as the CSS token
  const look = { color: signal, transparent: true, depthWrite: false, toneMapped: false }

  return (
    <group ref={marks} visible={false}>
      <Billboard>
        <Line ref={corners} points={CORNERS} segments lineWidth={lineWidth} {...look} />
      </Billboard>
      <Line ref={ring} points={RING} lineWidth={1} {...look} />
    </group>
  )
}
