// Source: docs/CONTEUDO.md. "TODO: …" strings are intentionally visible on the site until filled in.
// Placeholders in {braces} are filled at render time (counts come from courses/projects).

export const site = {
  name: 'Kaique Calefi',
  wordmark: 'kaique calefi', // followed by a ■ in signal color
  role: 'Desenvolvedor · Sites, automações e sistemas',
  domain: 'site.kaiquecalefi.online', // canonical, sitemap, robots, Open Graph
  email: 'kaiquecalefi.dev@gmail.com',
  whatsapp: '5561994028229', // 55 + DDD + número, só dígitos

  seo: {
    title: 'Kaique Calefi — Desenvolvedor de sites, automações e sistemas',
    description:
      'Desenvolvedor em Brasília: sites, automações e sistemas para empresas ganharem mais tempo e mais visibilidade. Veja os projetos e o que estudei.',
    ogAlt: 'Kaique Calefi — Estudo, construo e entrego. Sites, automações e sistemas.',
    locality: { city: 'Brasília', region: 'DF', country: 'BR' },
  },

  notFound: {
    title: 'Página não encontrada',
    label: 'ERRO 404 · PEÇA NÃO CATALOGADA',
    h1: 'Esta página não está no arquivo.',
    text: 'O endereço pode ter mudado ou nunca ter existido. O resto do arquivo continua no lugar.',
    back: 'Voltar ao arquivo →',
  },

  header: {
    nav: [
      { label: 'Cursos', href: '#cursos' },
      { label: 'Projetos', href: '#projetos' },
      { label: 'Sobre', href: '#sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    navLabel: 'Principal',
    cta: 'Vamos conversar', // the ↗ comes from <PrimaryCta>
    menu: { open: 'Menu', close: 'Fechar' },
  },

  hero: {
    eyebrow: 'DESENVOLVEDOR · SITES, AUTOMAÇÕES E SISTEMAS',
    h1: 'Estudo, construo e entrego.',
    sub: 'Sites, automações e sistemas sob medida. Cada peça deste arquivo é um curso que virou ferramenta de trabalho.',
    cta: 'Explorar o arquivo ↓',
  },

  skipLink: 'Pular para o índice',

  spiral: {
    verticalLabel: 'ARQUIVO DE ESTUDOS',
    panelLabel: 'PEÇA Nº {n} / {total}',
    railLabel: 'Peças do arquivo',
    goTo: 'Ir para a peça {n}: {title}',
    open: 'Abrir a peça {n}: {title}',
    hintsDesktop: 'Role para explorar · Arraste para girar · Clique para abrir',
    hintsMobile: 'Deslize para navegar · Toque numa peça',
    buttons: { index: 'ÍNDICE', settings: 'AJUSTES' },
    indexLabel: 'Índice das peças',
    settingsLabel: 'Ajustes',
    settings: { ambient: 'Movimento ambiente', reset: 'Resetar posições', static: 'Ver sem 3D' },
    static: { eyebrow: 'O ARQUIVO · {N} PEÇAS', back: 'Ver em 3D' },
    loader: 'CATALOGANDO O ARQUIVO',
    overlay: {
      learned: 'O que aprendi',
      projects: 'Projetos com isso',
      certificate: 'Ver certificado ↗',
      previous: 'Anterior',
      next: 'Próxima',
      close: 'Fechar',
      stage: 'Arraste para girar',
    },
  },

  brasilia: {
    eyebrow: 'DE ÁGUAS CLARAS PARA ONDE PRECISAR',
    h2: 'Feito em Brasília. Entregue em qualquer lugar.',
    points: ['Águas Claras', 'Brasília', 'Brasil', 'Remoto'],
    text: 'Atendo negócios daqui olho no olho e projetos remotos com o mesmo cuidado. Tem uma ideia? A gente tira do papel.',
    here: 'você está aqui', // under the first point
    ctas: { primary: 'Começar um projeto', secondary: 'Ver projetos →' }, // the ↗ of the primary comes from <PrimaryCta>
  },

  index: {
    eyebrow: 'O ARQUIVO · {N} PEÇAS',
    h2: 'Tudo o que já estudei.',
    sub: 'Os destaques estão na espiral. Aqui está a lista inteira.',
    all: 'Todos',
    filterLabel: 'Filtrar por categoria',
    open: 'Abrir {title}',
  },

  projects: {
    eyebrow: 'PROJETOS · 01',
    h2: 'O que saiu do papel.',
    sub: 'Cada projeto aponta de volta para os cursos que o tornaram possível.',
    visit: 'Ver {title}',
    openCourse: 'Abrir a peça {n}: {title}',
  },

  services: {
    eyebrow: 'O QUE EU FAÇO · 02',
    h2: 'Escolha por onde começar.',
    text: 'Entendo o negócio, desenho a solução e construo — do site que vende ao atendimento que funciona sozinho no WhatsApp.',
    pillars: [
      { n: '01', title: 'Sites', text: 'Rápidos, bonitos e feitos pra converter.' },
      { n: '02', title: 'Automações', text: 'Atendimento e tarefas repetitivas no automático, 24h.' },
      { n: '03', title: 'Sistemas', text: 'Ferramentas sob medida pro jeito que o seu negócio trabalha.' },
    ],
    summary: '{N} cursos viraram {M} projetos. E contando.',
  },

  about: {
    eyebrow: 'QUEM CONSTRÓI · 03',
    photoPlaceholder: 'FOTO',
    figure: 'FIG. {n}',
    // one entry per person; a link whose href starts with "TODO" is shown as plain text
    people: [
      {
        name: 'Kaique Calefi',
        role: 'Desenvolvedor · Sites, automações e sistemas',
        photo: 'TODO: /images/kaique.webp',
        bullets: ['Sites e landing pages', 'Automação de atendimento (WhatsApp)', 'Sistemas sob medida'],
        bio: 'Aprendo rápido e vou atrás do que não sei. Hoje não construo somente sites e sistemas bonitos, mas soluções que fazem seu negócio ganhar mais tempo.',
        links: [
          { label: 'GitHub', href: 'https://github.com/kalefidev' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kaiquecalefi/' },
          { label: 'Instagram', href: 'https://www.instagram.com/kalefi.dev' },
        ],
      },
    ],
  },

  process: {
    eyebrow: 'COMO EU TRABALHO · 04',
    h2: 'Do primeiro papo ao sistema no ar.',
    steps: [
      { n: '01', title: 'Entender', text: 'Primeiro o problema, depois o código. Conversa, diagnóstico e escopo claro antes de começar.' },
      { n: '02', title: 'Construir', text: 'Entregas curtas que você vê funcionando, sem sumir por semanas.' },
      { n: '03', title: 'Acompanhar', text: 'Depois do lançamento eu continuo por perto, ajustando com base no uso real.' },
    ],
  },

  contact: {
    eyebrow: 'VAMOS CONVERSAR · 05',
    h2: 'Tem uma ideia ou um problema pra resolver?',
    sub: 'Me conta. Eu respondo rápido.',
    ctas: { whatsapp: 'Chamar no WhatsApp', email: 'e-mail' }, // the ↗ comes from <PrimaryCta>
    dialog: {
      title: 'Me conta o que você precisa.',
      fields: { name: 'Nome', type: 'Tipo', message: 'Mensagem' },
      types: ['Site', 'Automação', 'Sistema', 'Outro'],
      submit: 'Enviar pelo WhatsApp',
      close: 'Fechar',
      notReady: 'WhatsApp ainda não configurado',
      template: 'Olá, Kaique! Sou {nome}. Assunto: {tipo}.\n\n{mensagem}', // {tipo} as it is in `types`
    },
  },

  footer: {
    copyright: '© 2026 Kaique Calefi',
    backToTop: 'Voltar ao topo ↑',
  },
}
