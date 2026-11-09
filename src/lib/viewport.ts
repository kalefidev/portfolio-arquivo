import { useSyncExternalStore } from 'react'
import { pickPreset, spiralPresets, type SpiralPreset } from '@/config/spiral'

/** Spiral preset for the current viewport. Client only. */
export const activePreset = () => pickPreset(window.innerWidth / window.innerHeight)

const onResize = (cb: () => void) => {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}

/** Value derived from the active preset; re-renders only when it changes, re-checked on `resize`
 *  (the debug panel dispatches one after editing a preset). The server renders with desktop. */
export const usePreset = <T>(select: (preset: SpiralPreset) => T): T =>
  useSyncExternalStore(
    onResize,
    () => select(activePreset()),
    () => select(spiralPresets.desktop),
  )

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
