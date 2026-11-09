export type Category =
  | 'cloud'
  | 'security'
  | 'frontend'
  | 'backend'
  | 'data'
  | 'automation'
  | 'ai'
  | 'devops'
  | 'design'
  | 'fundamentals'
  | 'hardware'

export type Archetype =
  | 'cloud'
  | 'shield'
  | 'lock'
  | 'brackets'
  | 'browser'
  | 'database'
  | 'gears'
  | 'neural'
  | 'terminal'
  | 'containers'
  | 'server'
  | 'chart'
  | 'git-branch'
  | 'chip'
  | 'palette'
  | 'bulb'
  | 'icon'
  | 'placeholder'

export interface Course {
  slug: string
  title: string
  institution: string
  year?: number
  hours?: number
  category: Category
  archetype: Archetype
  variant?: string
  icon?: string // Phosphor icon name when archetype = 'icon'
  status: 'concluido' | 'em-andamento'
  featured: boolean
  certificateUrl?: string
  summary?: string
  learned?: string[]
  projects?: string[] // slugs from projects.ts
}

export interface Project {
  slug: string
  title: string
  kind: string
  description: string
  status: 'no-ar' | 'em-desenvolvimento' | 'conceito'
  year?: number
  url?: string
  repo?: string
  stack: string[]
  courses?: string[] // slugs from courses.ts
  isClientWork?: boolean
}
