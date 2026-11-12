import { create } from 'zustand'
import { HERO_UNTIL } from '@/config/spiral'

const PREFS_KEY = 'arquivo:prefs'

interface SpiralState {
  /** Continuous position in the spiral (0 … N−1). Written on every scroll frame:
   *  never subscribe a React component to it — read `useStore.getState()` inside `useFrame`. */
  progress: number
  activeIndex: number // round(progress)
  exitProgress: number // 0 … 1 through the exit zone after the last piece
  pastHero: boolean // the hero has given way to the active-piece panel (discrete: fine to subscribe)
  hoveredSlug: string | null
  focusSlug: string | null // piece open in the overlay
  ambientMotion: boolean
  staticMode: boolean // "ver sem 3D"
  prefsLoaded: boolean // false on the server and until `loadPrefs()` ran

  setScroll: (progress: number, exitProgress: number, heroProgress: number) => void
  setHovered: (slug: string | null) => void
  setFocus: (slug: string | null) => void
  setAmbientMotion: (on: boolean) => void
  setStaticMode: (on: boolean) => void
  loadPrefs: () => void
}

export const useStore = create<SpiralState>((set, get) => {
  // Private mode / blocked storage: the preference just does not survive the reload.
  const save = () => {
    try {
      const { ambientMotion, staticMode } = get()
      localStorage.setItem(PREFS_KEY, JSON.stringify({ ambientMotion, staticMode }))
    } catch {}
  }

  return {
    progress: 0,
    activeIndex: 0,
    exitProgress: 0,
    pastHero: false,
    hoveredSlug: null,
    focusSlug: null,
    ambientMotion: true,
    staticMode: false,
    prefsLoaded: false,

    setScroll: (progress, exitProgress, heroProgress) => {
      const activeIndex = Math.round(progress)
      const pastHero = heroProgress > HERO_UNTIL
      const now = get()
      set(
        activeIndex === now.activeIndex && pastHero === now.pastHero
          ? { progress, exitProgress }
          : { progress, exitProgress, activeIndex, pastHero },
      )
    },
    setHovered: (hoveredSlug) => set({ hoveredSlug }),
    // opening a piece ends the hover: the pointer is over the overlay from now on
    setFocus: (focusSlug) => set(focusSlug ? { focusSlug, hoveredSlug: null } : { focusSlug }),
    setAmbientMotion: (ambientMotion) => {
      set({ ambientMotion })
      save()
    },
    setStaticMode: (staticMode) => {
      set({ staticMode })
      save()
    },
    /** Call from an effect, never while creating the store: the server render has no storage. */
    loadPrefs: () => {
      let saved: { ambientMotion?: unknown; staticMode?: unknown } = {}
      try {
        saved = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}') ?? {}
      } catch {}
      set({
        ambientMotion: saved.ambientMotion !== false,
        staticMode: saved.staticMode === true,
        prefsLoaded: true,
      })
    },
  }
})
