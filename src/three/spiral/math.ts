// Spiral math — DESIGN.md §4. Pure functions, covered by math.test.ts.
// No `three` import on purpose: SpiralSection uses this file, and it would pull the whole
// library into the first-load bundle (the 3D scene is a lazy chunk).
import type { SpiralPreset } from '../../config/spiral'

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

export interface ItemTransform {
  position: { x: number; y: number; z: number } // world units; feeds Vector3.copy()
  scale: number
  focus: number // 1 on the active piece, 0 from one piece away
  visibility: number // 0 beyond visibleRange
  d: number // i - progress: 0 = active, < 0 already passed (above), > 0 upcoming (below)
}

export interface SpiralExtra {
  dragOffset?: number // rad
  ambientSway?: number // rad
}

export const newItemTransform = (): ItemTransform => ({
  position: { x: 0, y: 0, z: 0 },
  scale: 1,
  focus: 0,
  visibility: 0,
  d: 0,
})

/** Where piece `i` sits for a continuous `progress` (0 … N−1). Pass `out` to avoid allocating per frame. */
export function getItemTransform(
  i: number,
  progress: number,
  cfg: SpiralPreset,
  extra: SpiralExtra = {},
  out: ItemTransform = newItemTransform(),
): ItemTransform {
  const d = i - progress
  const dist = Math.abs(d)
  const theta = d * cfg.angleStep + (extra.dragOffset ?? 0) + (extra.ambientSway ?? 0)

  out.d = d
  out.focus = 1 - smoothstep(0, 1, dist)
  out.visibility = 1 - smoothstep(cfg.visibleRange - 1, cfg.visibleRange, dist)
  out.scale = (cfg.baseScale + (cfg.activeScale - cfg.baseScale) * out.focus) * out.visibility
  out.position.x = cfg.axisX + cfg.radiusX * Math.sin(theta)
  out.position.y = -d * cfg.pitch
  out.position.z = cfg.radiusZ * (Math.cos(theta) - 1)
  return out
}

/** Exit progress (0 … 1) of the piece at offset `d` when the whole exit is at `exit`: the highest
 *  visible piece (d = −visibleRange) starts at once, the active one (d = 0) after `stagger`. */
export function exitStagger(exit: number, d: number, visibleRange: number, stagger: number) {
  const order = clamp01((d + visibleRange) / visibleRange) // 0 = highest, 1 = active (or below)
  return clamp01((exit - order * stagger) / (1 - stagger))
}

const steps = (n: number) => Math.max(n - 1, 0)

/** Height of the spiral section, in viewport heights: 1 + heroZone + (N − 1) × scrollPerItem + exitZone. */
export const sectionHeight = (n: number, cfg: SpiralPreset) =>
  1 + cfg.heroZone + steps(n) * cfg.scrollPerItem + cfg.exitZone

/** Scroll from the top of the section (in viewport heights) at which piece `i` is the centred one. */
export const courseScroll = (i: number, cfg: SpiralPreset) => cfg.heroZone + i * cfg.scrollPerItem

export interface ScrollState {
  progress: number
  exitProgress: number
  heroProgress: number
}

/** Inverse of scrollToProgress: how far through the section (0 … 1) a state is drawn. */
export function progressToScroll({ progress, exitProgress, heroProgress }: ScrollState, n: number, cfg: SpiralPreset) {
  const total = sectionHeight(n, cfg) - 1
  const scrolled =
    exitProgress > 0
      ? total - (1 - exitProgress) * cfg.exitZone
      : progress > 0
        ? cfg.heroZone + progress * cfg.scrollPerItem
        : heroProgress * cfg.heroZone
  return scrolled / total
}

/** Scroll through the section (0 … 1) → heroProgress (0 … 1 through the hero zone, the spiral still
 *  at piece 0) + progress (holds at N−1 in the exit zone) + exitProgress (0 … 1). */
export function scrollToProgress(t01: number, n: number, cfg: SpiralPreset) {
  const total = sectionHeight(n, cfg) - 1 // viewport heights
  const scrolled = t01 * total
  return {
    heroProgress: cfg.heroZone > 0 ? clamp01(scrolled / cfg.heroZone) : 1,
    progress: Math.min(Math.max(scrolled - cfg.heroZone, 0) / cfg.scrollPerItem, steps(n)),
    // measured from the end, so it lands on exactly 1 at the bottom
    exitProgress: 1 - clamp01((total - scrolled) / cfg.exitZone),
  }
}
