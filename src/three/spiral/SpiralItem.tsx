import { useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { CALLOUT } from '@/config/spiral'
import { pieceNo } from '@/content/courses'
import { cssVar } from '@/lib/cssVar'
import { useStore } from '@/lib/store'
import type { Course } from '@/types'
import ArchetypeObject from '../archetypes'
import type { ArchetypeProps } from '../archetypes/types'
import Callout from './Callout'
import { getItemTransform, newItemTransform, smoothstep } from './math'
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
  const anchor = useRef<Group>(null!) // where the callout's leader line starts
  const callout = useRef<HTMLDivElement>(null)
  const [tint] = useState(() => cssVar(`--color-cat-${course.category}`))
  const active = useStore((s) => s.activeIndex === index)

  // Priority −1: after <Spiral> (−2) wrote the frame, before drei's <Html> (0) projects the callout
  // to the screen — at the same priority the label would trail the piece by one frame.
  useFrame(() => {
    const { cfg, p, exit, extra } = frame.current
    const { position, scale, visibility, d } = getItemTransform(index, p, cfg, extra, target)

    // The label hangs off the top right of the piece; on the right of the helix (the pieces below
    // the active one) it flips to the bottom left, so it never runs off the screen nor into the
    // focus marks. It fades out around the flip instead of jumping.
    const side = (position.x - cfg.axisX) / cfg.radiusX // sin θ: −1 left … 1 right
    const left = side > CALLOUT.flipAt
    if (callout.current) {
      callout.current.dataset.side = left ? 'left' : 'right'
      callout.current.style.opacity = String(
        (1 - smoothstep(CALLOUT.fadeFrom, CALLOUT.hideAt, Math.abs(d))) *
          smoothstep(0, CALLOUT.flipFade, Math.abs(side - CALLOUT.flipAt)) *
          (1 - exit),
      )
    }

    piece.current.visible = visibility > HIDDEN_BELOW
    if (!piece.current.visible) return
    piece.current.position.copy(position)
    piece.current.scale.setScalar(scale)
    anchor.current.position.setScalar(left ? -CALLOUT.anchor : CALLOUT.anchor).setZ(0)
  }, -1)

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
      <group ref={anchor} position={[CALLOUT.anchor, CALLOUT.anchor, 0]}>
        <Callout ref={callout} no={pieceNo(index)} title={course.title} active={active} />
      </group>
      {/* hit area: cheap raycast target for hover / click (etapa 05) */}
      <mesh visible={false}>
        <sphereGeometry args={[1, 12, 8]} />
      </mesh>
    </group>
  )
}
