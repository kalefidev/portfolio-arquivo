import { BoxGeometry, Group, Mesh, Vector3 } from 'three'
import { expect, test } from 'vitest'
import { normalize } from './normalize'

test('normalize centres the group and fits it in the unit sphere', () => {
  const group = new Group()
  const a = new Mesh(new BoxGeometry(4, 2, 2))
  a.position.set(10, 3, 0)
  const b = new Mesh(new BoxGeometry(1, 1, 1))
  b.position.set(14, 3, 0)
  b.rotation.z = 0.7
  group.add(a, b)

  normalize(group)
  group.updateWorldMatrix(true, true)

  let radius = 0
  const p = new Vector3()
  for (const mesh of [a, b]) {
    const positions = mesh.geometry.attributes.position
    for (let i = 0; i < positions.count; i++) {
      radius = Math.max(radius, p.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld).length())
    }
  }
  expect(radius).toBeCloseTo(1, 5)
})
