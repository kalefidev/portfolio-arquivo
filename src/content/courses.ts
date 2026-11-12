import type { Category, Course } from '@/types'

// Source: docs/CURSOS.md (only 2 draft rows so far). Order = order in the spiral.
// Rows marked EXEMPLO are placeholders — replace with the real list before etapa 06.
export const courses: Course[] = [
  {
    slug: 'aws-cloud',
    title: 'AWS Cloud', // TODO: confirmar nome exato
    institution: 'TODO: instituição',
    category: 'cloud',
    archetype: 'cloud',
    status: 'concluido',
    featured: true,
  },
  {
    slug: 'ciberseguranca',
    title: 'Cyber / Segurança', // TODO: confirmar nome exato
    institution: 'TODO: instituição',
    category: 'security',
    archetype: 'shield',
    status: 'concluido',
    featured: true,
  },
  // EXEMPLO — trocar
  {
    slug: 'logica-de-programacao',
    title: 'Lógica de Programação',
    institution: 'Alura',
    category: 'fundamentals',
    archetype: 'brackets',
    status: 'concluido',
    featured: true,
  },
  // EXEMPLO — trocar
  {
    slug: 'html-e-css',
    title: 'HTML e CSS',
    institution: 'Alura',
    category: 'frontend',
    archetype: 'browser',
    icon: 'browser', // drawn while the `browser` object does not exist (etapa 06)
    status: 'concluido',
    featured: true,
  },
  // EXEMPLO — trocar
  {
    slug: 'sql-e-banco-de-dados',
    title: 'SQL e Banco de Dados',
    institution: 'Alura',
    category: 'data',
    archetype: 'database',
    status: 'concluido',
    featured: true,
  },
  // EXEMPLO — trocar
  {
    slug: 'automacao-n8n',
    title: 'Automação com n8n',
    institution: 'RicNeves',
    category: 'automation',
    archetype: 'gears',
    icon: 'gear', // drawn while the `gears` object does not exist (etapa 06)
    status: 'concluido',
    featured: true,
    projects: ['jarvis'],
  },
]

export const categoryLabels: Record<Category, string> = {
  cloud: 'Cloud',
  security: 'Segurança',
  frontend: 'Front-end',
  backend: 'Back-end',
  data: 'Dados',
  automation: 'Automação',
  ai: 'IA',
  devops: 'DevOps',
  design: 'Design',
  fundamentals: 'Fundamentos',
  hardware: 'Hardware',
}

export const statusLabels: Record<Course['status'], string> = {
  concluido: 'Concluído',
  'em-andamento': 'Em andamento',
}

/** Catalogue number of a piece, from its index in the spiral: 2 → "03". */
export const pieceNo = (index: number) => String(index + 1).padStart(2, '0')

export const featuredCourses = () => courses.filter((c) => c.featured)

export const courseBySlug = (slug: string) => courses.find((c) => c.slug === slug)
