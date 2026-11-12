import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { useStore } from '@/lib/store'

export const FLAG_LAMBDA = 7 // hover / active settle in ~0.5 s
export const REDUCED_HOVER_SCALE = 0.06 // reduced motion: hover is only this much extra scale
const MAX_STEP = 0.1 // s — a stalled frame never makes an animation jump

/** 0 … 1 ref that eases toward `flag`. Read `.current` inside `useFrame`. */
export function useDampedFlag(flag: boolean, lambda = FLAG_LAMBDA) {
  const value = useRef(flag ? 1 : 0)
  useFrame((_, delta) => {
    value.current = MathUtils.damp(value.current, flag ? 1 : 0, lambda, delta)
  })
  return value
}

/** Seconds of idle animation. Stays at 0 under reduced motion, so the idle pose is the rest pose.
 *  "Movimento ambiente" off (Ajustes) freezes it where it is; hover and active still animate. */
export function useIdleTime(reducedMotion: boolean) {
  const time = useRef(0)
  useFrame((_, delta) => {
    if (!useStore.getState().ambientMotion) return
    time.current = reducedMotion ? 0 : time.current + Math.min(delta, MAX_STEP)
  })
  return time
}

/** Frame step for animations an object drives itself (same clamp as the idle time). */
export const step = (delta: number) => Math.min(delta, MAX_STEP)
