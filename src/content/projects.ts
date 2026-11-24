import type { Course, Project } from '@/types'
import { courseBySlug, courses } from './courses'

// Source: docs/CONTEUDO.md › Projetos. Client work only goes public with authorization and no real data.
export const projects: Project[] = [
  {
    slug: 'casa-smell',
    title: 'Casa Smell',
    kind: 'Catálogo + automação',
    description: 'Catálogo de perfumes com estoque via bot de WhatsApp e quiz olfativo',
    status: 'no-ar',
    url: 'https://casa-smell.casa-smell.workers.dev',
    stack: [],
    isClientWork: true,
  },
  {
    slug: 'neovian-os',
    title: 'NeoVian OS',
    kind: 'Sistema (front-end)',
    description: 'CRM com hierarquia de permissões e login',
    status: 'no-ar',
    url: 'https://neovian-os-kaiquecalefi-8397s-projects.vercel.app',
    stack: [],
    isClientWork: true,
  },
  {
    slug: 'site-imobiliario-ia',
    title: 'Site imobiliário com IA',
    kind: 'Site',
    description: 'Apartamento apresentado com transições em vídeo geradas por IA',
    status: 'no-ar',
    url: 'https://site-ap-alpha.vercel.app',
    stack: [],
    isClientWork: false,
  },
]

export const projectStatusLabels: Record<Project['status'], string> = {
  'no-ar': 'No ar',
  'em-desenvolvimento': 'Em desenvolvimento',
  conceito: 'Conceito',
}

/** `projeto-<slug>`: id of the row in the projects list (the chips of the piece overlay point to it). */
export const projectId = (slug: string) => `projeto-${slug}`

// The link can be declared on either side (Course.projects or Project.courses).
export const projectsForCourse = (courseSlug: string): Project[] => {
  const fromCourse = courseBySlug(courseSlug)?.projects ?? []
  return projects.filter((p) => fromCourse.includes(p.slug) || p.courses?.includes(courseSlug))
}

export const coursesForProject = (projectSlug: string): Course[] => {
  const fromProject = projects.find((p) => p.slug === projectSlug)?.courses ?? []
  return courses.filter((c) => fromProject.includes(c.slug) || c.projects?.includes(projectSlug))
}
