'use client'

import gear from '@phosphor-icons/core/assets/regular/gear.svg'
import Icon from '@/components/ui/Icon'
import { site } from '@/content/site'
import { scrollToTop } from '@/lib/scroll'
import { useStore } from '@/lib/store'
import { resetPositions } from '@/three/spiral/drag'

const { buttons, settingsLabel, settings } = site.spiral
const ID = 'settings-panel'

// the popover clips: the focus ring goes inside the row
const row = 'label flex min-h-11 w-full cursor-pointer items-center justify-between gap-8 px-4 py-2 text-left -outline-offset-2 has-focus-visible:outline-2 has-focus-visible:outline-signal transition-colors duration-(--duration-micro) hover:bg-paper'

/** AJUSTES button + its panel (DESIGN.md §8), a native popover like the index. Both preferences
 *  are remembered (store → localStorage). This panel only exists with the 3D on: the way back from
 *  "Ver sem 3D" is the button on top of the grid (StaticCourses). */
export default function SettingsPanel({ className }: { className: string }) {
  const ambientMotion = useStore((s) => s.ambientMotion)

  return (
    <>
      <button type="button" popoverTarget={ID} className={className}>
        <Icon svg={gear} />
        {buttons.settings}
      </button>

      <div id={ID} popover="auto" role="group" aria-label={settingsLabel} className="bar-popover divide-y divide-line">
        <label className={row}>
          {settings.ambient}
          <input
            type="checkbox"
            className="size-4 accent-ink outline-none"
            checked={ambientMotion}
            onChange={(event) => useStore.getState().setAmbientMotion(event.target.checked)}
          />
        </label>
        <button type="button" className={row} onClick={resetPositions}>
          {settings.reset}
          <span aria-hidden>↺</span>
        </button>
        <button
          type="button"
          className={row}
          onClick={() => {
            useStore.getState().setStaticMode(true)
            scrollToTop()
          }}
        >
          {settings.static}
          <span aria-hidden>→</span>
        </button>
      </div>
    </>
  )
}
