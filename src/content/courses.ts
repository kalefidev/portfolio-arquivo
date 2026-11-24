import type { Category, Course } from '@/types'

// Source: docs/CURSOS.md + lista do Kaique (2026-11-24). Order = order in the spiral.
export const courses: Course[] = [
  {
    slug: 'aws-cloud',
    title: 'AWS Cloud Practitioner (Domains 1 e 2)',
    institution: 'Alura',
    year: 2026,
    hours: 8,
    category: 'cloud',
    archetype: 'cloud',
    status: 'em-andamento',
    featured: true,
  },
  {
    slug: 'ciberseguranca',
    title: 'Firewall ASA: configuração de segurança',
    institution: 'Alura',
    year: 2026,
    hours: 10,
    category: 'security',
    archetype: 'shield',
    status: 'em-andamento',
    featured: true,
  },
  {
    slug: 'logica-de-programacao',
    title: 'Lógica de programação: mergulhe em programação com JavaScript',
    institution: 'Alura',
    year: 2026,
    hours: 1,
    category: 'fundamentals',
    archetype: 'brackets',
    status: 'concluido',
    featured: true,
  },
  {
    slug: 'html-e-css',
    title: 'HTML e CSS',
    institution: 'Alura',
    year: 2026,
    category: 'frontend',
    archetype: 'browser',
    status: 'em-andamento',
    featured: true,
  },
  {
    slug: 'sql-e-banco-de-dados',
    title: 'SQL e Banco de Dados',
    institution: 'Alura',
    category: 'data',
    archetype: 'database',
    status: 'em-andamento',
    featured: true,
  },
  {
    slug: 'automacao-n8n',
    title: 'Automação com n8n',
    institution: 'Rick Neves',
    category: 'automation',
    archetype: 'gears',
    status: 'concluido',
    featured: true,
  },
  {
    slug: 'trilha-full-stack-typescript',
    title: 'Trilha Full Stack TypeScript',
    institution: 'Alura',
    category: 'backend',
    archetype: 'icon',
    icon: 'terminal-window',
    status: 'em-andamento',
    featured: true,
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

/** The whole archive: the spiral's pieces first (same order and Nº as in the spiral), then the rest. */
export const archiveCourses = () => [...featuredCourses(), ...courses.filter((c) => !c.featured)]

export const courseBySlug = (slug: string) => courses.find((c) => c.slug === slug)
