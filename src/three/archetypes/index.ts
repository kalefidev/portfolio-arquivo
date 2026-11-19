import { createElement, type ComponentType } from 'react'
import type { Archetype } from '@/types'
import Brackets from './Brackets'
import Browser from './Browser'
import Cloud from './Cloud'
import Database from './Database'
import Gears from './Gears'
import Icon from './Icon'
import Shield from './Shield'
import type { ArchetypeProps } from './types'

// Only the DESIGN.md §5 objects some course uses get built; any other key draws as `icon`.
const registry: Partial<Record<Archetype, ComponentType<ArchetypeProps>>> = {
  cloud: Cloud,
  shield: Shield,
  brackets: Brackets,
  browser: Browser,
  database: Database,
  gears: Gears,
  icon: Icon,
}

/** Archetypes that have their own object, in catalogue order. */
export const implemented = Object.keys(registry) as Archetype[]

const warned = new Set<Archetype>()

/** Draws the object of an archetype. */
export default function ArchetypeObject({
  archetype,
  ...props
}: ArchetypeProps & { archetype: Archetype }) {
  const component = registry[archetype]
  if (!component && process.env.NODE_ENV === 'development' && !warned.has(archetype)) {
    warned.add(archetype)
    console.warn(`[archetypes] "${archetype}" has no object yet — drawing "icon" instead`)
  }
  return createElement(component ?? Icon, props)
}
