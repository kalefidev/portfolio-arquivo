import { useState } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import { cssVar } from '@/lib/cssVar'

/** DESIGN.md §6 — procedural environment (no HDR file): top softbox, warm key on the left,
 *  cool rim behind-right, plus one weak directional. No real-time shadows. */
export default function Lights() {
  const [colors] = useState(() => ({
    paper: cssVar('--color-paper'),
    key: cssVar('--color-light-key'),
    rim: cssVar('--color-light-rim'),
  }))

  return (
    <>
      <Environment resolution={128}>
        {/* the room is paper: a dim bounce from every direction, so no facet goes black */}
        <Lightformer form="box" target={false} color={colors.paper} intensity={0.25} scale={40} />
        <Lightformer form="rect" intensity={2} position={[0, 8, 2]} scale={[14, 10]} />
        <Lightformer form="rect" color={colors.key} intensity={3} position={[-8, 2, 5]} scale={[8, 8]} />
        <Lightformer form="rect" color={colors.rim} intensity={3} position={[7, 3, -7]} scale={[6, 8]} />
      </Environment>
      <directionalLight color={colors.key} position={[-4, 6, 8]} intensity={0.8} />
    </>
  )
}
