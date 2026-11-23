'use client'

import { Component, useEffect, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { useStore } from '@/lib/store'
import { hasWebGL } from '@/lib/viewport'

const FIRST_PAINT_WAIT = 2000 // ms: most the 3D waits for the browser to report the first paint

// `ssr: false` is only allowed inside a Client Component (Next 16).
const Scene = dynamic(() => import('./Scene'), { ssr: false })

/** The 3D chunk failed to load, or the WebGL context could not be created: fall back to the
 *  no-3D mode (not saved: it is not a choice) instead of a blank page and a loader that never ends. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('3D scene unavailable, showing the page without it.', error)
    useStore.setState({ staticMode: true })
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** Mounts the 3D scene — or not: with "Ver sem 3D" the canvas is gone (nothing renders), and a
 *  page that opens in that mode never downloads the three.js chunk. Without WebGL the mode turns
 *  itself on (not saved: it is not a choice). */
export default function SceneLoader() {
  const [painted, setPainted] = useState(false)
  const show = useStore((s) => s.prefsLoaded && !s.staticMode) && painted

  useEffect(() => {
    useStore.getState().loadPrefs()
    // WebGL only once the page is on screen: while the browser is still bringing up its GPU process,
    // creating a context (the check, then the canvas) blocks for ~0.2 s and holds the first paint
    // back by up to a second. FIRST_PAINT_WAIT caps the wait where the browser never reports it.
    const start = () => {
      observer?.disconnect()
      clearTimeout(timer)
      if (!hasWebGL()) useStore.setState({ staticMode: true })
      setPainted(true)
    }
    const timer = setTimeout(start, FIRST_PAINT_WAIT)
    const observer = PerformanceObserver.supportedEntryTypes?.includes('paint')
      ? new PerformanceObserver((list) => {
          if (list.getEntriesByName('first-contentful-paint').length) start()
        })
      : null
    observer?.observe({ type: 'paint', buffered: true })
    return () => {
      observer?.disconnect()
      clearTimeout(timer)
    }
  }, [])

  return show ? (
    <SceneBoundary>
      <Scene />
    </SceneBoundary>
  ) : null
}
