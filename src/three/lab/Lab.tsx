'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, View } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import { cssVar } from '@/lib/cssVar'
import type { Archetype, Category } from '@/types'
import ArchetypeObject, { implemented } from '../archetypes'
import { icons } from '../archetypes/icons'
import { disposeMaterials } from '../archetypes/materials'
import Lights from '../Lights'

const CATEGORIES: Category[] = [
  'cloud',
  'security',
  'frontend',
  'backend',
  'data',
  'automation',
  'ai',
  'devops',
  'design',
  'fundamentals',
  'hardware',
]

// tone each object opens with (any archetype not listed starts on the first category)
const DEFAULT_TONE: Partial<Record<Archetype, Category>> = {
  shield: 'security',
  brackets: 'fundamentals',
  browser: 'frontend',
  database: 'data',
  gears: 'automation',
  icon: 'devops',
}

const CAMERA = { fov: 35, z: 4.6 } // same lens as the desktop spiral, framing the r = 1 sphere

/** Reports the triangle count of whatever it wraps, after every render. */
function Counted({ onCount, children }: { onCount: (triangles: number) => void; children: ReactNode }) {
  const group = useRef<Group>(null!)
  useEffect(() => {
    let triangles = 0
    group.current.traverse((child) => {
      const geometry = (child as Mesh).geometry
      if (geometry) triangles += (geometry.index ?? geometry.attributes.position).count / 3
    })
    onCount(triangles)
  })
  return <group ref={group}>{children}</group>
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        className="accent-ink"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}

function Cell({ archetype }: { archetype: Archetype }) {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [low, setLow] = useState(false)
  const [tone, setTone] = useState<Category>(DEFAULT_TONE[archetype] ?? CATEGORIES[0])
  const [icon, setIcon] = useState<string>()
  const [triangles, setTriangles] = useState(0)

  return (
    <article className="border border-line">
      <View className="aspect-square cursor-grab touch-none active:cursor-grabbing">
        <PerspectiveCamera makeDefault fov={CAMERA.fov} position={[0, 0, CAMERA.z]} />
        <Lights />
        <Counted onCount={setTriangles}>
          <ArchetypeObject
            archetype={archetype}
            tint={cssVar(`--color-cat-${tone}`)}
            hovered={hovered}
            active={active}
            reducedMotion={reducedMotion}
            detail={low ? 'low' : 'high'}
            icon={icon}
          />
        </Counted>
        {/* no zoom: the wheel keeps scrolling the page */}
        <OrbitControls makeDefault enableZoom={false} enablePan={false} />
      </View>

      <div className="label flex flex-col gap-3 border-t border-line p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-medium">{archetype}</h2>
          <span className="text-ink-2">{triangles.toLocaleString('pt-BR')} triângulos</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <Toggle label="hovered" checked={hovered} onChange={setHovered} />
          <Toggle label="active" checked={active} onChange={setActive} />
          <Toggle label="reducedMotion" checked={reducedMotion} onChange={setReducedMotion} />
          <Toggle label="detail low" checked={low} onChange={setLow} />
        </div>
        <label className="flex items-center justify-between gap-2">
          tom
          <select
            className="border border-line bg-paper px-2 py-1"
            value={tone}
            onChange={(e) => setTone(e.target.value as Category)}
          >
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        {archetype === 'icon' && (
          <label className="flex items-center justify-between gap-2">
            ícone
            <select
              className="border border-line bg-paper px-2 py-1"
              value={icon ?? ''}
              onChange={(e) => setIcon(e.target.value || undefined)}
            >
              <option value="">padrão</option>
              {Object.keys(icons).map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        )}
      </div>
    </article>
  )
}

/** /lab — every registered object on its own, in one canvas (drei <View>). Dev tool. */
export default function Lab() {
  const page = useRef<HTMLElement>(null!)
  useEffect(() => disposeMaterials, [])

  return (
    <main ref={page} className="relative z-[var(--z-ui)] min-h-svh px-gutter py-10">
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="text-h3 font-bold tracking-title">Laboratório de objetos</h1>
        <p className="label text-ink-2">arraste para girar · {implemented.length} arquétipos</p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {implemented.map((archetype) => (
          <Cell key={archetype} archetype={archetype} />
        ))}
      </div>

      <Canvas
        eventSource={page}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
        dpr={[1, 2]}
      >
        <View.Port />
      </Canvas>
    </main>
  )
}
