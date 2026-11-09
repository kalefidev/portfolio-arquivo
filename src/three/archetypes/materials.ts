import { MeshStandardMaterial } from 'three'
import { cssVar } from '@/lib/cssVar'

// DESIGN.md §5 — every object is matte clay in its category colour, with ink / signal details.
// One material per look, shared by every object. Client only (reads the tokens).

export const CLAY = { roughness: 0.82, metalness: 0 }
const INK_ROUGHNESS = 0.6
const SIGNAL_EMISSIVE = 0.45

const cache = new Map<string, MeshStandardMaterial>()

function cached(key: string, make: () => MeshStandardMaterial) {
  let material = cache.get(key)
  if (!material) cache.set(key, (material = make()))
  return material
}

export const clay = (tint: string) =>
  cached(`clay:${tint}`, () => new MeshStandardMaterial({ ...CLAY, color: tint }))

export const ink = () =>
  cached(
    'ink',
    () => new MeshStandardMaterial({ color: cssVar('--color-ink'), roughness: INK_ROUGHNESS }),
  )

export const signal = () =>
  cached('signal', () => {
    const color = cssVar('--color-signal')
    return new MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: SIGNAL_EMISSIVE,
      roughness: INK_ROUGHNESS,
    })
  })

/** Frees every cached material. Call when the canvas goes away. */
export function disposeMaterials() {
  cache.forEach((material) => material.dispose())
  cache.clear()
}
