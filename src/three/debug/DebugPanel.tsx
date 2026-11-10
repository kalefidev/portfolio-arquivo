import { useEffect } from 'react'
import { Stats } from '@react-three/drei'
import GUI from 'lil-gui'
import { MathUtils } from 'three'
import { spiralPresets } from '@/config/spiral'
import { useStore } from '@/lib/store'
import { usePreset } from '@/lib/viewport'

/** `/?debug` only (lazy chunk, out of the normal bundle): live calibration of the active preset. */
export default function DebugPanel() {
  const preset = usePreset((p) => p)

  useEffect(() => {
    const name = preset === spiralPresets.mobile ? 'mobile' : 'desktop'
    const gui = new GUI({ title: `Espiral · ${name}` })

    // The sliders edit the preset in place: <Spiral> eases toward it every frame. What React
    // derives from it (section height, canvas dpr) is re-read on `resize`.
    const relayout = () => window.dispatchEvent(new Event('resize'))
    const angle = { angleStepDeg: Math.round(MathUtils.radToDeg(preset.angleStep) * 10) / 10 }

    gui.add(preset, 'radiusX', 0, 8, 0.05)
    gui.add(preset, 'radiusZ', 0, 6, 0.05)
    gui
      .add(angle, 'angleStepDeg', 10, 120, 1)
      .name('angleStep (°)')
      .onChange((deg: number) => (preset.angleStep = MathUtils.degToRad(deg)))
    gui.add(preset, 'pitch', 0.8, 4, 0.05)
    gui.add(preset, 'scrollPerItem', 0.2, 1.5, 0.05).onChange(relayout)
    gui.add(preset, 'axisX', -3, 3, 0.05)
    gui.add(preset, 'baseScale', 0.2, 1.5, 0.01)
    gui.add(preset, 'activeScale', 0.2, 2, 0.01)
    gui.add(preset, 'visibleRange', 1.5, 6, 0.1)
    gui.add(preset, 'damping', 1, 20, 0.5)
    gui.add(preset, 'dragReturn', 0.1, 5, 0.1)
    gui.add(preset, 'heroZone', 0, 1, 0.05).onChange(relayout)
    gui.add(preset, 'exitZone', 0.1, 1.5, 0.05).onChange(relayout)
    gui.add(preset, 'fogNear', 4, 20, 0.1)
    gui.add(preset, 'fogFar', 8, 40, 0.1)
    gui.add(preset, 'dpr', 1, 2, 0.25).onChange(relayout)
    gui.add(preset.camera, 'fov', 20, 60, 1).name('camera fov')
    gui.add(preset.camera, 'z', 6, 18, 0.1).name('camera z')

    gui
      .add({ ambientMotion: useStore.getState().ambientMotion }, 'ambientMotion')
      .name('movimento ambiente')
      .onChange(useStore.getState().setAmbientMotion)

    const copy = () => {
      // degrees instead of radians, so /ajuste cannot mix up the unit
      const json = JSON.stringify(
        { preset: name, ...preset, angleStep: undefined, angleStepDeg: angle.angleStepDeg },
        null,
        2,
      )
      console.info(json)
      navigator.clipboard.writeText(json)
    }
    gui.add({ copy }, 'copy').name('Copiar config')

    const read = { progress: 0, exitProgress: 0, activeIndex: 0 }
    const sync = (s = useStore.getState()) => {
      read.progress = Math.round(s.progress * 1000) / 1000
      read.exitProgress = Math.round(s.exitProgress * 1000) / 1000
      read.activeIndex = s.activeIndex
    }
    sync()
    const unsubscribe = useStore.subscribe(sync)
    const state = gui.addFolder('Estado')
    for (const key of Object.keys(read) as (keyof typeof read)[]) state.add(read, key).disable().listen()

    Object.assign(window, { __spiral: { store: useStore, presets: spiralPresets, gui } })

    return () => {
      unsubscribe()
      gui.destroy()
    }
  }, [preset])

  return <Stats />
}
