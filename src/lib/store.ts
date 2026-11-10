import { create } from 'zustand'
import { HERO_UNTIL } from '@/config/spiral'

interface SpiralState {
  /** Continuous position in the spiral (0 … N−1). Written on every scroll frame:
   *  never subscribe a React component to it — read `useStore.getState()` inside `useFrame`. */
  progress: number
  activeIndex: number // round(progress)
  exitProgress: number // 0 … 1 through the exit zone after the last piece
  pastHero: boolean // the hero has given way to the active-piece panel (discrete: fine to subscribe)
  hoveredSlug: string | null
  focusSlug: string | null // piece open in the overlay
  dragOffset: number // rad added to the helix angle while dragging
  ambientMotion: boolean
  staticMode: boolean // "ver sem 3D"

  setScroll: (progress: number, exitProgress: number, heroProgress: number) => void
  setHovered: (slug: string | null) => void
  setFocus: (slug: string | null) => void
  setDragOffset: (dragOffset: number) => void
  setAmbientMotion: (on: boolean) => void
  setStaticMode: (on: boolean) => void
}

export const useStore = create<SpiralState>((set, get) => ({
  progress: 0,
  activeIndex: 0,
  exitProgress: 0,
  pastHero: false,
  hoveredSlug: null,
  focusSlug: null,
  dragOffset: 0,
  ambientMotion: true,
  staticMode: false,

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
  setFocus: (focusSlug) => set({ focusSlug }),
  setDragOffset: (dragOffset) => set({ dragOffset }),
  setAmbientMotion: (ambientMotion) => set({ ambientMotion }),
  setStaticMode: (staticMode) => set({ staticMode }),
}))
