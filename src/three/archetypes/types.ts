/** Contract of every 3D object in the spiral (DESIGN.md §5). */
export interface ArchetypeProps {
  tint: string // category colour (CSS colour string)
  hovered: boolean
  active: boolean
  reducedMotion: boolean
  detail: 'low' | 'high'
  variant?: string
  icon?: string // Phosphor icon name (used by the `icon` archetype)
}
