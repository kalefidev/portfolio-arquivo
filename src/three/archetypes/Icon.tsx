import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ExtrudeGeometry, type Group } from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { clay, ink } from './materials'
import { REDUCED_HOVER_SCALE, useDampedFlag, useIdleTime } from './motion'
import { normalize } from './normalize'
import { roundedRect } from './shapes'
import { DEFAULT_ICON, icons } from './icons'
import type { ArchetypeProps } from './types'

// DESIGN.md §5 `icon` — a Phosphor `fill` icon extruded on both faces of a bevelled plate.
const PLATE = { size: 1.5, corner: 0.24, depth: 0.14, bevel: 0.04 }
const PLATE_FACE = PLATE.depth / 2 + PLATE.bevel // z of the front face
const ICON = { size: 1.05, depth: 0.07 }
const VIEWBOX = 256 // Phosphor icons are drawn on a 256 × 256 grid
const SPIN = 0.35 // rad/s
const JUMP = 0.22

const plate = roundedRect(PLATE.size, PLATE.size, PLATE.corner)

/** Icon centred on the origin, facing +z, with its back on z = 0. */
function iconGeometry(svg: string, curveSegments: number) {
  // `currentColor` is not a colour three can parse, and the fill is not used anyway
  const { paths } = new SVGLoader().parse(svg.replace('currentColor', '#000'))
  const shapes = paths.flatMap((path) => path.toShapes())
  const scale = ICON.size / VIEWBOX
  return new ExtrudeGeometry(shapes, { depth: ICON.depth / scale, bevelEnabled: false, curveSegments })
    .translate(-VIEWBOX / 2, -VIEWBOX / 2, 0)
    .rotateX(Math.PI) // SVG y points down; a turn (not a mirror) keeps the faces outward
    .scale(scale, scale, scale)
    .translate(0, 0, ICON.depth)
}

export default function Icon({ tint, hovered, reducedMotion, detail, icon }: ArchetypeProps) {
  const root = useRef<Group>(null!)
  const fit = useRef<Group>(null!)
  const hover = useDampedFlag(hovered)
  const idle = useIdleTime(reducedMotion)

  const high = detail === 'high'
  const name = icon && icons[icon] ? icon : DEFAULT_ICON
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && icon && icon !== name) {
      console.warn(`[archetypes] icon "${icon}" is not registered in icons.ts — using "${name}"`)
    }
  }, [icon, name])

  const glyph = useMemo(() => iconGeometry(icons[name], high ? 8 : 3), [name, high])
  useEffect(() => () => glyph.dispose(), [glyph])
  const plateArgs = useMemo(
    () =>
      [
        plate,
        {
          depth: PLATE.depth,
          bevelThickness: PLATE.bevel,
          bevelSize: PLATE.bevel,
          bevelSegments: high ? 3 : 1,
          curveSegments: high ? 8 : 3,
        },
      ] as const,
    [high],
  )

  useLayoutEffect(() => normalize(fit.current), [glyph])

  useFrame(() => {
    const h = reducedMotion ? 0 : hover.current
    root.current.scale.setScalar(reducedMotion ? 1 + REDUCED_HOVER_SCALE * hover.current : 1)
    root.current.rotation.y = idle.current * SPIN + h * Math.PI * 2
    root.current.position.y = Math.sin(Math.PI * h) * JUMP
  })

  return (
    <group ref={root}>
      <group ref={fit}>
        <mesh position-z={-PLATE.depth / 2} material={clay(tint)}>
          <extrudeGeometry args={plateArgs} />
        </mesh>
        <mesh geometry={glyph} position-z={PLATE_FACE} material={ink()} />
        <mesh geometry={glyph} position-z={-PLATE_FACE} rotation-y={Math.PI} material={ink()} />
      </group>
    </group>
  )
}
