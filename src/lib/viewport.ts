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

let webgl: boolean | undefined

/** Whether the browser can draw the 3D scene (three needs WebGL 2). Checked once. Client only. */
export function hasWebGL() {
  if (webgl === undefined) {
    try {
      webgl = !!document.createElement('canvas').getContext('webgl2')
    } catch {
      webgl = false
    }
  }
  return webgl
}

/** The canvas listens on <body> (the page sits on top of it), so every pointer event gets there.
 *  Only the ones on the spiral itself are meant for the 3D: inside `#cursos`, not on a control nor
 *  on the text of the stage (`data-ui`: a tap on the panel must not open the piece fading behind it). */
export const reaches3d = (target: EventTarget | null) =>
  target instanceof Element &&
  target.closest('#cursos') !== null &&
  target.closest('a, button, input, label, dialog, [popover], [data-ui]') === null
