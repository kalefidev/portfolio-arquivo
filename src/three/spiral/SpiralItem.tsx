import { useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { cssVar } from '@/lib/cssVar'
import type { Course } from '@/types'
import { getItemTransform, newItemTransform } from './math'
import type { SpiralFrame } from './Spiral'

const SPIN = 0.25 // rad/s — idle of the placeholder (DESIGN.md §5)
const TILT = 0.35 // rad
const HIDDEN_BELOW = 1e-3 // visibility under this → not drawn

const target = newItemTransform() // scratch, shared by every piece

interface Props {
  index: number
  course: Course
  frame: RefObject<SpiralFrame>
  reducedMotion: boolean
}

export default function SpiralItem({ index, course, frame, reducedMotion }: Props) {
  const piece = useRef<Group>(null!)
  const body = useRef<Mesh>(null!)
  const [tint] = useState(() => cssVar(`--color-cat-${course.category}`))

  useFrame((_, delta) => {
    const { cfg, p, extra } = frame.current
    const { position, scale, visibility } = getItemTransform(index, p, cfg, extra, target)

    piece.current.visible = visibility > HIDDEN_BELOW
    if (!piece.current.visible) return
    piece.current.position.copy(position)
    piece.current.scale.setScalar(scale)
    if (!reducedMotion) body.current.rotation.y += delta * SPIN
  })

  return (
    <group ref={piece} visible={false}>
      {/* `placeholder` archetype (DESIGN.md §5) — the real objects come in etapa 03 */}
      <mesh ref={body} rotation={[TILT, index, 0]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={tint} roughness={0.82} metalness={0} flatShading />
      </mesh>
      {/* hit area: cheap raycast target for hover / click (etapa 05) */}
      <mesh visible={false}>
        <sphereGeometry args={[1, 12, 8]} />
      </mesh>
    </group>
  )
}
