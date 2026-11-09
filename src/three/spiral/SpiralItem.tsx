import { useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { cssVar } from '@/lib/cssVar'
import { useStore } from '@/lib/store'
import type { Course } from '@/types'
import ArchetypeObject from '../archetypes'
import type { ArchetypeProps } from '../archetypes/types'
import { getItemTransform, newItemTransform } from './math'
import type { SpiralFrame } from './Spiral'

const HIDDEN_BELOW = 1e-3 // visibility under this → not drawn

const target = newItemTransform() // scratch, shared by every piece

interface Props {
  index: number
  course: Course
  frame: RefObject<SpiralFrame>
  reducedMotion: boolean
  detail: ArchetypeProps['detail']
}

export default function SpiralItem({ index, course, frame, reducedMotion, detail }: Props) {
  const piece = useRef<Group>(null!)
  const [tint] = useState(() => cssVar(`--color-cat-${course.category}`))
  const active = useStore((s) => s.activeIndex === index)

  useFrame(() => {
    const { cfg, p, extra } = frame.current
    const { position, scale, visibility } = getItemTransform(index, p, cfg, extra, target)

    piece.current.visible = visibility > HIDDEN_BELOW
    if (!piece.current.visible) return
    piece.current.position.copy(position)
    piece.current.scale.setScalar(scale)
  })

  return (
    <group ref={piece} visible={false}>
      <ArchetypeObject
        archetype={course.archetype}
        tint={tint}
        hovered={false} // real hover comes in etapa 05
        active={active}
        reducedMotion={reducedMotion}
        detail={detail}
        variant={course.variant}
        icon={course.icon}
      />
      {/* hit area: cheap raycast target for hover / click (etapa 05) */}
      <mesh visible={false}>
        <sphereGeometry args={[1, 12, 8]} />
      </mesh>
    </group>
  )
}
