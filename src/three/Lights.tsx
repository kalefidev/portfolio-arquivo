import { useLayoutEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import {
  BoxGeometry,
  CubeCamera,
  DoubleSide,
  HalfFloatType,
  LightProbe,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  WebGLCubeRenderTarget,
  type BufferGeometry,
} from 'three'
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js'
import { cssVar } from '@/lib/cssVar'
import { useStore } from '@/lib/store'

const PROBE_SIZE = 16 // px per cube face: the probe only keeps the low frequencies anyway

type Vec3 = [number, number, number]

/** A light-emitting card, like drei's <Lightformer>: color × intensity, both faces, facing the origin. */
function lightformer(geometry: BufferGeometry, color: string, intensity: number, scale: Vec3, position?: Vec3) {
  const material = new MeshBasicMaterial({ color, side: DoubleSide })
  material.color.multiplyScalar(intensity)
  const mesh = new Mesh(geometry, material)
  mesh.scale.set(...scale)
  if (position) {
    mesh.position.set(...position)
    mesh.lookAt(0, 0, 0)
  }
  return mesh
}

/** DESIGN.md §6 — a paper room: top softbox, warm key on the left, cool rim behind-right, plus one
 *  weak directional. The room is drawn once into a small cube and kept as a light probe (spherical
 *  harmonics: its diffuse light, which is what matte clay shows). No environment map: prefiltering
 *  one (PMREM) cost ~0.6 s of main thread on Lighthouse's mid phone, for highlights the clay barely has.
 *  The scene counts as ready once it is lit. */
export default function Lights() {
  const gl = useThree((state) => state.gl)
  const invalidate = useThree((state) => state.invalidate)
  const [colors] = useState(() => ({
    paper: cssVar('--color-paper'),
    key: cssVar('--color-light-key'),
    rim: cssVar('--color-light-rim'),
  }))
  // In the scene from the first frame, empty: the shaders are compiled once, with the probe in them.
  const [probe] = useState(() => new LightProbe())

  useLayoutEffect(() => {
    const room = new Scene().add(
      // the room is paper: a dim bounce from every direction, so no facet goes black
      lightformer(new BoxGeometry(), colors.paper, 0.25, [40, 40, 40]),
      lightformer(new PlaneGeometry(), '#ffffff', 2, [14, 10, 1], [0, 8, 2]),
      lightformer(new PlaneGeometry(), colors.key, 3, [8, 8, 1], [-8, 2, 5]),
      lightformer(new PlaneGeometry(), colors.rim, 3, [6, 8, 1], [7, 3, -7]),
    )
    const target = new WebGLCubeRenderTarget(PROBE_SIZE, { type: HalfFloatType })
    new CubeCamera(0.1, 100, target).update(gl, room)

    let live = true
    LightProbeGenerator.fromCubeRenderTarget(gl, target)
      .then((measured) => live && probe.sh.copy(measured.sh))
      .catch(() => {}) // no probe: lit by the directional light alone, still readable
      .finally(() => {
        target.dispose()
        room.traverse((object) => {
          if (object instanceof Mesh) {
            object.geometry.dispose()
            object.material.dispose()
          }
        })
        if (!live) return
        invalidate()
        requestAnimationFrame(() => useStore.setState({ sceneReady: true })) // after the lit frame
      })
    return () => {
      live = false
    }
  }, [gl, colors, probe, invalidate])

  return (
    <>
      <primitive object={probe} />
      <directionalLight color={colors.key} position={[-4, 6, 8]} intensity={0.8} />
    </>
  )
}
