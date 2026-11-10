import { useState, type Ref } from 'react'
import { Html } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

interface Props {
  ref: Ref<HTMLDivElement> // the owner sets `style.opacity` and `data-side` on it every frame
  no: string
  title: string
  active: boolean
}

/** "Nº 03 — AWS CLOUD" + leader line (short diagonal, then a shelf) — DESIGN.md §3.
 *  The point it is placed at is where the leader starts: it goes up and to the right, or — with
 *  `data-side="left"` — down and to the left (the same "/" diagonal). Never takes the pointer. */
export default function Callout({ ref, no, title, active }: Props) {
  // drei appends to the canvas' event source, which here is <body> (see Scene) — the labels would
  // scroll away with the page. Keep them in the fixed box of the canvas.
  const box = useThree((state) => state.gl.domElement.parentElement!)
  const [portal] = useState(() => ({ current: box }))

  return (
    <Html
      ref={ref}
      portal={portal}
      zIndexRange={[1, 0]} // stay under the readability gradient (Scene)
      wrapperClass="pointer-events-none"
      className={`label group opacity-0 ${active ? 'text-ink' : 'text-ink-2'}`}
    >
      <div className="absolute bottom-0 left-0 flex items-start group-data-[side=left]:top-0 group-data-[side=left]:right-0 group-data-[side=left]:bottom-auto group-data-[side=left]:left-auto group-data-[side=left]:flex-row-reverse group-data-[side=left]:items-end">
        <svg viewBox="0 0 20 20" className="size-5 shrink-0 overflow-visible">
          <path d="M0 20 20 0" stroke="currentColor" fill="none" />
        </svg>
        <span className="h-px w-6 shrink-0 bg-current" />
        {/* the title only where there is room for it, and never as far as the ruler on the right */}
        <span className="-translate-y-1/2 truncate px-2 group-data-[side=left]:translate-y-1/2 xl:max-w-[calc(38vw-18rem)]">
          Nº {no}
          <span className="hidden wide:xl:inline"> — {title}</span>
        </span>
      </div>
    </Html>
  )
}
