import { beforeEach, describe, expect, it } from 'vitest'
import { dragBy, resetPositions, spinOf, spiral, SPIRAL, stepDrag } from './drag'

const DT = 1 / 60
const run = (seconds: number, dragReturn = 0.6, reducedMotion = false) => {
  for (let t = 0; t < seconds; t += DT) stepDrag(DT, dragReturn, reducedMotion)
}

beforeEach(() => {
  resetPositions()
  run(1, 0.6, true) // reduced motion: the reset lands at once
})

describe('drag', () => {
  it('a throw keeps turning the piece, slower and slower, and the piece stays turned', () => {
    dragBy('a', 20, 0, DT)
    const released = spinOf('a').y
    stepDrag(DT, 0.6)
    const first = spinOf('a').y - released
    stepDrag(DT, 0.6)
    const second = spinOf('a').y - released - first
    expect(first).toBeGreaterThan(0)
    expect(second).toBeLessThan(first)

    run(10)
    expect(spinOf('a').vy).toBeCloseTo(0, 4)
    expect(spinOf('a').y).toBeGreaterThan(released) // persists: nothing pulls it back
  })

  it('the helix returns to 0 on its own', () => {
    dragBy(SPIRAL, 200, 0, DT)
    expect(spiral.offset).toBeGreaterThan(0)
    run(20)
    expect(spiral.offset).toBeCloseTo(0, 3)
  })

  it('a piece never tips past the tilt limit', () => {
    dragBy('a', 0, 10_000, DT)
    run(1)
    expect(Math.abs(spinOf('a').x)).toBeLessThanOrEqual(1.2)
  })

  it('reduced motion: no inertia', () => {
    dragBy('a', 20, 0, DT)
    const released = spinOf('a').y
    run(1, 0.6, true)
    expect(spinOf('a').y).toBe(released)
  })

  it('reset brings the helix and every piece back to 0', () => {
    dragBy(SPIRAL, 200, 0, DT)
    dragBy('a', 900, 40, DT) // more than a full turn
    dragBy('b', -30, -10, DT)
    resetPositions()
    run(5)
    expect(spiral.offset).toBeCloseTo(0, 3)
    for (const slug of ['a', 'b']) {
      expect(spinOf(slug).x).toBeCloseTo(0, 3)
      expect(spinOf(slug).y).toBeCloseTo(0, 3)
    }
  })
})
