'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useStore } from '@/lib/store'
import { hasWebGL } from '@/lib/viewport'

// `ssr: false` is only allowed inside a Client Component (Next 16).
const Scene = dynamic(() => import('./Scene'), { ssr: false })

/** Mounts the 3D scene — or not: with "Ver sem 3D" the canvas is gone (nothing renders), and a
 *  page that opens in that mode never downloads the three.js chunk. Without WebGL the mode turns
 *  itself on (not saved: it is not a choice). */
export default function SceneLoader() {
  const show = useStore((s) => s.prefsLoaded && !s.staticMode)

  useEffect(() => {
    useStore.getState().loadPrefs()
    if (!hasWebGL()) useStore.setState({ staticMode: true })
  }, [])

  return show ? <Scene /> : null
}
