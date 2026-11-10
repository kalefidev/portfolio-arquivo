import { describe, expect, it } from 'vitest'
import { spiralPresets } from '../../config/spiral'
import { courseScroll, getItemTransform, scrollToProgress, sectionHeight } from './math'

const N = 6

describe.each(Object.entries(spiralPresets))('spiral math (%s)', (_name, cfg) => {
  it('puts the active piece at (axisX, 0, 0), full size', () => {
    const t = getItemTransform(2, 2, cfg)
    expect(t.position.x).toBe(cfg.axisX)
    expect(t.position.y).toBeCloseTo(0)
    expect(t.position.z).toBeCloseTo(0)
    expect(t.d).toBe(0)
    expect(t.focus).toBe(1)
    expect(t.visibility).toBe(1)
    expect(t.scale).toBeCloseTo(cfg.activeScale)
  })

  it('puts the next piece one pitch below and behind', () => {
    const t = getItemTransform(3, 2, cfg)
    expect(t.position.y).toBeCloseTo(-cfg.pitch)
    expect(t.position.z).toBeLessThan(0)
    expect(t.focus).toBe(0)
    expect(t.scale).toBeCloseTo(cfg.baseScale)
  })

  it('mirrors d = +1 and d = −1 around the axis', () => {
    const next = getItemTransform(3, 2, cfg)
    const prev = getItemTransform(1, 2, cfg)
    expect(next.position.x - cfg.axisX).toBeCloseTo(-(prev.position.x - cfg.axisX))
    expect(next.position.y).toBeCloseTo(-prev.position.y)
    expect(next.position.z).toBeCloseTo(prev.position.z)
    expect(next.scale).toBeCloseTo(prev.scale)
  })

  it('hides pieces beyond visibleRange', () => {
    for (const d of [cfg.visibleRange, cfg.visibleRange + 2, -cfg.visibleRange - 0.5]) {
      const t = getItemTransform(d, 0, cfg)
      expect(t.visibility).toBe(0)
      expect(t.scale).toBe(0)
    }
    expect(getItemTransform(cfg.visibleRange - 1, 0, cfg).visibility).toBe(1)
  })

  it('adds drag and sway to the angle without moving the piece vertically', () => {
    const t = getItemTransform(0, 0, cfg, { dragOffset: 0.2, ambientSway: 0.1 })
    expect(t.position.x).toBeCloseTo(cfg.axisX + cfg.radiusX * Math.sin(0.3))
    expect(t.position.y).toBeCloseTo(0)
  })

  it('maps scroll to progress: still through the hero zone, holding at N−1 while the exit runs 0 → 1', () => {
    expect(sectionHeight(N, cfg)).toBeCloseTo(1 + cfg.heroZone + (N - 1) * cfg.scrollPerItem + cfg.exitZone)

    const total = sectionHeight(N, cfg) - 1
    const at = (viewportHeights: number) => scrollToProgress(viewportHeights / total, N, cfg)

    expect(at(0)).toEqual({ heroProgress: 0, progress: 0, exitProgress: 0 })
    expect(at(cfg.heroZone / 2).heroProgress).toBeCloseTo(0.5)
    expect(at(cfg.heroZone / 2).progress).toBe(0) // the spiral waits for the hero
    expect(at(courseScroll(0, cfg)).heroProgress).toBeCloseTo(1)
    expect(at(courseScroll(0, cfg)).progress).toBeCloseTo(0)
    expect(at(courseScroll(1, cfg)).progress).toBeCloseTo(1)
    expect(at(courseScroll(1, cfg)).exitProgress).toBe(0)

    const exitStart = courseScroll(N - 1, cfg)
    expect(at(exitStart).progress).toBeCloseTo(N - 1)
    expect(at(exitStart).exitProgress).toBeCloseTo(0)
    expect(at(exitStart + cfg.exitZone / 2).progress).toBe(N - 1)
    expect(at(exitStart + cfg.exitZone / 2).exitProgress).toBeCloseTo(0.5)
    expect(scrollToProgress(1, N, cfg)).toEqual({ heroProgress: 1, progress: N - 1, exitProgress: 1 })
  })
})
