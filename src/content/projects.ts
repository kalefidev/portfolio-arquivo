import type { Course, Project } from '@/types'
import { courseBySlug, courses } from './courses'

// Source: docs/CONTEUDO.md › Projetos. Client work only goes public with authorization and no real data.
export const projects: Project[] = [
  {
    slug: 'casa-smell',
    title: 'Casa Smell',
    kind: 'Catálogo + automação',
    description:
      'Catálogo de perfumes com estoque via bot de WhatsApp e quiz olfativo',
    status: 'no-ar',
    url: 'https://casa-smell.casa-smell.workers.dev',
    stack: [],
    courses: ['automacao-n8n'],
    isClientWork: true,
  },
  {
    slug: 'neovian-os',
    title: 'NeoVian OS',
    kind: 'Sistema (CRM com IA)',
    description:
      'CRM com hierarquia de permissões e login',
    status: 'no-ar',
    url: 'https://neovian-os-kaiquecalefi-8397s-projects.vercel.app',
    stack: [],
    courses: ['sql-e-banco-de-dados'],
    isClientWork: true,
  },
  {
    slug: 'site-imobiliario-ia',
    title: 'Site imobiliário com IA (Residencial Aurora)',
    kind: 'Site',
    description:
      'Fachada interativa: escolhe o andar, a câmera voa até a maquete da unidade e entra em cada ambiente, com transições em vídeo e visita agendada pelo WhatsApp.',
    status: 'no-ar',
    url: 'https://site-ap-alpha.vercel.app',
    stack: [],
    isClientWork: false,
  },
  {
    slug: 'dev-tools-library',
    title: 'Dev Tools Library',
    kind: 'Catálogo para devs',
    description:
      '300 ferramentas de programação em 8 áreas, com métricas reais do GitHub e do npm, busca, comparação e um mapa em pixel art pra explorar. Em português e inglês.',
    status: 'no-ar',
    url: 'https://biblioteca.kaiquecalefi.online',
    stack: [],
    isClientWork: false,
  },
  {
    slug: 'chamusco',
    title: 'Chamusco',
    kind: 'Site de restaurante (demo)',
    description:
      'Site de um bistrô de brasa (restaurante fictício, feito pra demonstração): destaques com preço, cardápio, galeria e reserva de mesa que chega pronta no WhatsApp.',
    status: 'no-ar',
    url: 'https://chamusco-demo.vercel.app',
    stack: [],
    courses: ['html-e-css'],
    isClientWork: false,
  },
  {
    slug: 'cardapio-comanda',
    title: 'Cardápio-comanda',
    kind: 'Cardápio digital (demo)',
    description:
      'Cardápio no celular em que cada prato tem uma pilha de fotos pra folhear. O cliente monta a comanda e o garçom lê um QR que manda o pedido pra cozinha pelo WhatsApp.',
    status: 'no-ar',
    url: 'https://cardapio-comanda.vercel.app/r/demo',
    stack: [],
    courses: ['html-e-css'],
    isClientWork: false,
  },
  {
    slug: 'site-barbearia',
    title: 'Site de barbearia',
    kind: 'Site completo',
    description:
      'Site premium com serviços, preços, unidades, equipe e pedido de agendamento direto pelo WhatsApp, com SEO local e dados estruturados.',
    status: 'no-ar',
    url: 'https://base-barbearias.vercel.app',
    stack: [],
    courses: ['html-e-css'],
    isClientWork: false,
  },
  {
    slug: 'neofy',
    title: 'Neofy',
    kind: 'SaaS de prospecção',
    description:
      'Acha negócios da cidade que só têm Instagram, iFood ou nada no Google e entrega o lead com a mensagem pronta, pra quem vende site. A lista de espera está no ar; o app, em construção.',
    status: 'em-desenvolvimento',
    url: 'https://neofy.pages.dev',
    stack: [],
    courses: ['sql-e-banco-de-dados'],
    isClientWork: false,
  },
  {
    slug: 'prospector-automatico',
    title: 'Prospector automático',
    kind: 'Automação (n8n + IA)',
    description:
      'Prospecção no WhatsApp com IA: leads do Google Maps conferidos antes de entrar na fila, disparo com limite diário, a IA conversa e eu assumo pelo Telegram quando o lead esquenta.',
    status: 'no-ar',
    stack: [],
    courses: ['automacao-n8n'],
    isClientWork: false,
  },
  {
    slug: 'atendimento-clinica',
    title: 'Atendimento de Clínica',
    kind: 'Bot de WhatsApp',
    description:
      'Menu de exames, coleta de dados, consulta de horários em tempo real e confirmação automática no Google Calendar, sem aumentar a equipe.',
    status: 'no-ar',
    stack: [],
    courses: ['automacao-n8n'],
    isClientWork: false,
  },
  {
    slug: 'biblioteca-de-conteudos',
    title: 'Biblioteca de conteúdos',
    kind: 'Biblioteca via API',
    description: 'Biblioteca de conteúdos própria, acessada via API.',
    status: 'em-desenvolvimento',
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
