import type { Course, Project } from '@/types'
import { courseBySlug, courses } from './courses'

// Source: docs/CONTEUDO.md › Projetos. Client work only goes public with authorization and no real data.
// Status "?" in the doc → 'conceito' until Kaique confirms. Stack left empty where the doc doesn't say.
export const projects: Project[] = [
  {
    slug: 'suntech',
    title: 'SunTech',
    kind: 'Site 3D de produto',
    description: 'Carregador solar que se abre no scroll e mostra os componentes',
    status: 'em-desenvolvimento',
    stack: [],
    isClientWork: false,
  },
  {
    slug: 'casa-smell',
    title: 'Casa Smell',
    kind: 'Catálogo + automação',
    description: 'Catálogo de perfumes com estoque via bot de WhatsApp e quiz olfativo',
    status: 'conceito', // TODO: confirmar status
    stack: [],
    isClientWork: true,
  },
  {
    slug: 'jarvis',
    title: 'J.A.R.V.I.S',
    kind: 'Automação (n8n)',
    description: 'Assistente pessoal que conversa pelo Telegram',
    status: 'em-desenvolvimento',
    stack: ['n8n'],
    courses: ['automacao-n8n'],
    isClientWork: false,
  },
  {
    slug: 'neovian-os',
    title: 'NeoVian OS',
    kind: 'Sistema (front-end)',
    description: 'CRM com hierarquia de permissões e login',
    status: 'conceito', // TODO: confirmar status
    stack: [],
    isClientWork: true,
  },
  {
    slug: 'cardapio-ar',
    title: 'Cardápio AR',
    kind: 'Produto',
    description: 'Cardápio digital com o prato em 3D e em tamanho real na mesa',
    status: 'em-desenvolvimento',
    stack: [],
    isClientWork: false,
  },
  {
    slug: 'bot-ofertas',
    title: 'Bot de ofertas',
    kind: 'Automação',
    description: 'Grupo de WhatsApp que divulga ofertas do Mercado Livre e da Shopee sozinho',
    status: 'em-desenvolvimento',
    stack: [],
    isClientWork: false,
  },
  {
    slug: 'site-imobiliario-ia',
    title: 'Site imobiliário com IA',
    kind: 'Site',
    description: 'Apartamento apresentado com transições em vídeo geradas por IA',
    status: 'em-desenvolvimento',
    stack: [],
    // TODO: confirmar se é projeto de cliente (isClientWork)
  },
]

// The link can be declared on either side (Course.projects or Project.courses).
export const projectsForCourse = (courseSlug: string): Project[] => {
  const fromCourse = courseBySlug(courseSlug)?.projects ?? []
  return projects.filter((p) => fromCourse.includes(p.slug) || p.courses?.includes(courseSlug))
}

export const coursesForProject = (projectSlug: string): Course[] => {
  const fromProject = projects.find((p) => p.slug === projectSlug)?.courses ?? []
  return courses.filter((c) => fromProject.includes(c.slug) || c.projects?.includes(projectSlug))
}
