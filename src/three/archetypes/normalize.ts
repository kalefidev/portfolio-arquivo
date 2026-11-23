import { Box3, Matrix4, Vector3, type Mesh, type Object3D } from 'three'

const box = new Box3()
const center = new Vector3()
const point = new Vector3()
const toGroup = new Matrix4()

// Chains the local matrices up to `group` instead of inverting its matrixWorld: a hidden piece has a
// parent at scale 0, and that inverse would collapse every vertex onto the origin.
function eachVertex(group: Object3D, visit: (p: Vector3) => void) {
  group.traverse((child) => {
    const positions = (child as Mesh).geometry?.attributes.position
    if (!positions) return
    toGroup.identity()
    for (let node = child; node !== group; node = node.parent!) toGroup.premultiply(node.matrix)
    for (let i = 0; i < positions.count; i++) {
      visit(point.fromBufferAttribute(positions, i).applyMatrix4(toGroup))
    }
  })
}

/** Centres `group` on the origin and scales it to fit exactly in the sphere r = 1 (DESIGN.md §5).
 *  Measures the pose the group is in when called: run it once, at rest. */
export function normalize(group: Object3D) {
  group.position.set(0, 0, 0)
  group.scale.setScalar(1)
  group.updateWorldMatrix(false, true) // refreshes the local matrices of the children

  box.makeEmpty()
  eachVertex(group, (p) => box.expandByPoint(p))
  if (box.isEmpty()) return
  box.getCenter(center)

  let radiusSq = 0
  eachVertex(group, (p) => {
    radiusSq = Math.max(radiusSq, p.distanceToSquared(center))
  })
  if (radiusSq === 0) return

  const scale = 1 / Math.sqrt(radiusSq)
  group.scale.setScalar(scale)
  group.position.copy(center).multiplyScalar(-scale)
}
