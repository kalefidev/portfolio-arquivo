// What the pointer drag turns: the helix (springs back) and each piece (stays where it was left).
// Per-frame values, read inside `useFrame` — kept out of the store so nothing re-renders.
// No `three` import, like math.ts: the overlay uses this file and it stays out of the 3D chunk.
import { DRAG } from '../../config/spiral'

export const SPIRAL = 'spiral' // drag target that is not a piece

export interface Spin {
  x: number // rad, tilt toward / away from the camera
  y: number // rad, turn around the vertical axis
  vx: number // rad / s
  vy: number
}

export const spiral = { offset: 0, velocity: 0 } // rad added to the helix angle, rad / s
const spins = new Map<string, Spin>()

let holding = false // a pointer is down: it sets the angles, inertia waits
let resetting = false

/** Rotation the drag has given to the piece `slug`. */
export function spinOf(slug: string): Spin {
  let spin = spins.get(slug)
  if (!spin) spins.set(slug, (spin = { x: 0, y: 0, vx: 0, vy: 0 }))
  return spin
}

const clampTilt = (x: number) => Math.min(Math.max(x, -DRAG.maxTilt), DRAG.maxTilt)

function stop() {
  spiral.velocity = 0
  for (const spin of spins.values()) spin.vx = spin.vy = 0
}

/** The pointer moved (dx, dy) px in `dt` seconds while dragging `target` (SPIRAL or a slug). */
export function dragBy(target: string, dx: number, dy: number, dt: number) {
  resetting = false
  if (target === SPIRAL) {
    const step = dx * DRAG.spiral
    spiral.offset += step
    spiral.velocity = step / dt
    return
  }
  const spin = spinOf(target)
  const x = clampTilt(spin.x + dy * DRAG.object)
  spin.vx = (x - spin.x) / dt
  spin.vy = (dx * DRAG.object) / dt
  spin.x = x
  spin.y += dx * DRAG.object
}

/** Once per frame: inertia, the helix easing back to 0 (`dragReturn`) and the animated reset. */
export function stepDrag(dt: number, dragReturn: number, reducedMotion = false) {
  if (holding) return
  if (reducedMotion) stop() // no inertia
  const friction = Math.exp(-DRAG.friction * dt)

  spiral.offset = (spiral.offset + spiral.velocity * dt) * Math.exp(-dragReturn * dt)
  spiral.velocity *= friction
  for (const spin of spins.values()) {
    spin.x = clampTilt(spin.x + spin.vx * dt)
    spin.y += spin.vy * dt
    spin.vx *= friction
    spin.vy *= friction
  }

  if (resetting) {
    const keep = reducedMotion ? 0 : Math.exp(-DRAG.resetLambda * dt)
    spiral.offset *= keep
    let left = Math.abs(spiral.offset)
    for (const spin of spins.values()) {
      spin.x *= keep
      spin.y *= keep
      left = Math.max(left, Math.abs(spin.x), Math.abs(spin.y))
    }
    if (left < 1e-4) resetting = false
  }
}

/** "Resetar posições": everything eases back to 0 over the next frames. */
export function resetPositions() {
  stop()
  // whole turns look the same: unwind only the remainder, the short way round
  for (const spin of spins.values()) spin.y = Math.atan2(Math.sin(spin.y), Math.cos(spin.y))
  resetting = true
}

/** Follows the pointer from this `pointerdown` until it is released, turning `target`. */
export function startDrag(down: PointerEvent, target: string) {
  holding = true
  stop()
  let { clientX: x, clientY: y, timeStamp: time } = down

  const move = (event: PointerEvent) => {
    if (event.pointerId !== down.pointerId) return
    const dt = Math.max(event.timeStamp - time, 1) / 1000
    dragBy(target, event.clientX - x, event.clientY - y, dt)
    ;({ clientX: x, clientY: y, timeStamp: time } = event)
  }
  const end = (event: PointerEvent) => {
    if (event.pointerId !== down.pointerId) return
    holding = false
    if (event.timeStamp - time > DRAG.stillMs) stop() // held still before letting go: not a throw
    document.body.classList.remove('dragging')
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)
  }
  document.body.classList.add('dragging') // cursor + no text selection (globals.css)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
}
