import { useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { CALLOUT, DRAG, FOCUS_MODE } from '@/config/spiral'
import { pieceNo } from '@/content/courses'
import { cssVar } from '@/lib/cssVar'
import { useStore } from '@/lib/store'
import type { Course } from '@/types'
import ArchetypeObject from '../archetypes'
import type { ArchetypeProps } from '../archetypes/types'
import Callout from './Callout'
import { spinOf } from './drag'
import { getItemTransform, newItemTransform, smoothstep } from './math'
import type { SpiralFrame } from './Spiral'

const HIDDEN_BELOW = 1e-3 // visibility under this → not drawn

const { lerp } = MathUtils
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
  const spun = useRef<Group>(null!) // the object alone: the drag turns it, the callout stays put
  const anchor = useRef<Group>(null!) // where the callout's leader line starts
  const callout = useRef<HTMLDivElement>(null)
  const [tint] = useState(() => cssVar(`--color-cat-${course.category}`))
  const active = useStore((s) => s.activeIndex === index)
  const hovered = useStore((s) => s.hoveredSlug === course.slug)

  // Priority −1: after <Spiral> (−2) wrote the frame, before drei's <Html> (0) projects the callout
  // to the screen — at the same priority the label would trail the piece by one frame.
  useFrame(() => {
    const { cfg, p, exit, lift, focus, staged, stage, extra } = frame.current
    const { position, scale, visibility, d } = getItemTransform(index, p, cfg, extra, target)
    const onStage = staged[index]

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
          (1 - exit) *
          (1 - focus),
      )
    }

    piece.current.visible = visibility > HIDDEN_BELOW || onStage > HIDDEN_BELOW
    if (!piece.current.visible) {
      piece.current.scale.setScalar(0) // …which also takes the hit area out of the raycast
      return
    }
    // Focus mode: the open piece goes to the stage (the group it is in rises by `lift` on the way
    // out of the section — the stage does not); the others sink into the fog.
    piece.current.position.set(
      lerp(position.x, stage.x, onStage),
      lerp(position.y, stage.y - lift, onStage),
      lerp(position.z - FOCUS_MODE.recede * focus, 0, onStage),
    )
    piece.current.scale.setScalar(lerp(scale, cfg.stageScale, onStage))
    const spin = spinOf(course.slug)
    spun.current.rotation.set(spin.x, spin.y, 0)
    anchor.current.position.setScalar(left ? -CALLOUT.anchor : CALLOUT.anchor).setZ(0)
  }, -1)

  return (
    <group ref={piece} visible={false}>
      <group ref={spun}>
        <ArchetypeObject
          archetype={course.archetype}
          tint={tint}
          hovered={hovered}
          active={active}
          reducedMotion={reducedMotion}
          detail={detail}
          variant={course.variant}
          icon={course.icon}
        />
      </group>
      <group ref={anchor} position={[CALLOUT.anchor, CALLOUT.anchor, 0]}>
        <Callout ref={callout} no={pieceNo(index)} title={course.title} highlighted={active || hovered} />
      </group>
      {/* Hit area: cheap raycast target. `stopPropagation`: only the piece in front reacts. */}
      <mesh
        visible={false}
        onPointerOver={(event) => {
          if (event.pointerType !== 'mouse') return // a finger does not hover
          event.stopPropagation()
          useStore.getState().setHovered(course.slug)
        }}
        onPointerOut={() => {
          // R3F may send this *after* the `over` of the piece that took the pointer
          const { hoveredSlug, setHovered } = useStore.getState()
          if (hoveredSlug === course.slug) setHovered(null)
        }}
        onClick={(event) => {
          event.stopPropagation()
          // `delta`: px between pointer down and up — past the slop it was a drag
          if (event.delta < DRAG.clickSlop) useStore.getState().setFocus(course.slug)
        }}
      >
        <sphereGeometry args={[1, 12, 8]} />
      </mesh>
    </group>
  )
}
