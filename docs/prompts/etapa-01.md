# Etapa 01 — Fundação

Leia: `docs/PROGRESS.md`, `docs/PLAN.md` (Stack e Arquitetura), `DESIGN.md` §2, `docs/CURSOS.md`, `docs/CONTEUDO.md`. Nada além disso.

## Objetivo
Projeto Next.js rodando com tokens, fontes, scroll suave, dados tipados e config da espiral. Ainda sem 3D.

## Faça
1. Pré-checagem: `node -v` (precisa ≥ 20; se menor, pare e me avise) e `git --version`.
2. A pasta já tem o kit (CLAUDE.md, DESIGN.md, COMECE-AQUI.md, docs/, .claude/). **Não apague nem sobrescreva nada disso.**
   Crie o app numa pasta temporária e mova para a raiz:
   `npx create-next-app@latest _app --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --skip-install --disable-git --yes`
   (sem React Compiler; se alguma flag não existir na versão atual, consulte `--help` e use o equivalente não interativo). Mova o conteúdo de `_app/` para a raiz, incluindo dotfiles (menos `.git`, se aparecer), descarte o README do Next, apague `_app/` e rode `npm install` na raiz.
3. Instale: `three @react-three/fiber @react-three/drei gsap lenis zustand @phosphor-icons/core`; dev: `@types/three lil-gui vitest`. Versões estáveis atuais e compatíveis entre si (R3F compatível com o React instalado).
4. Scripts: `typecheck` (`tsc --noEmit`) e `test` (`vitest run --passWithNoTests`).
5. `.gitattributes` com `* text=auto eol=lf`; `git init` na branch `main`.
6. Pastas conforme PLAN.md › Arquitetura — crie só o que esta etapa usa (nada de arquivo vazio "pra depois").
7. Tokens: em `src/app/globals.css` (Tailwind v4 `@theme`) todas as cores, fontes e a escala do DESIGN.md §2. Fundo do body = paper.
8. Fontes via `next/font/google`: Archivo variável com eixo `wdth` e IBM Plex Mono (400, 500), expostas como variáveis CSS usadas no `@theme`.
9. `src/components/layout/SmoothScroll.tsx`: Lenis rodando no `gsap.ticker` (`lagSmoothing(0)`), sincronizado com ScrollTrigger, `syncTouch: false`; instância acessível por `getLenis()` em `src/lib/scroll.ts`. Com `prefers-reduced-motion`, sem smooth.
10. `src/components/layout/Grain.tsx`: grid técnico de 64px + grão SVG (DESIGN.md §2), fixo, `pointer-events: none`, z-index acima do futuro canvas e abaixo da UI.
11. Dados tipados:
    - `src/types.ts` com os tipos abaixo.
    - `src/content/courses.ts` a partir de `docs/CURSOS.md`. Se a tabela estiver incompleta, complete até **6 cursos de exemplo** marcados `// EXEMPLO — trocar`, mantendo AWS → `cloud` e Cyber → `shield`. Por enquanto todos com `archetype` real definido, mesmo que o objeto ainda não exista.
    - `src/content/projects.ts` e `src/content/site.ts` a partir de `docs/CONTEUDO.md` (TODOs viram strings visíveis `TODO: …`).
    - Helpers: `featuredCourses()`, `courseBySlug()`, `projectsForCourse()`, `coursesForProject()`.
12. `src/config/spiral.ts`: presets `desktop` e `mobile` com **todos** os parâmetros da tabela do DESIGN.md §4 (ângulos em radianos no código, comentário de 1 linha por campo) + `pickPreset(aspect)`.
13. `page.tsx` provisória: header simples com o wordmark, o H1 do hero e 3 seções altas vazias para testar o scroll.

```ts
type Category = 'cloud' | 'security' | 'frontend' | 'backend' | 'data' | 'automation' | 'ai' | 'devops' | 'design' | 'fundamentals' | 'hardware'
type Archetype = 'cloud' | 'shield' | 'lock' | 'brackets' | 'browser' | 'database' | 'gears' | 'neural' | 'terminal' | 'containers' | 'server' | 'chart' | 'git-branch' | 'chip' | 'palette' | 'bulb' | 'icon' | 'placeholder'
interface Course {
  slug: string; title: string; institution: string; year?: number; hours?: number
  category: Category; archetype: Archetype; variant?: string; icon?: string // nome Phosphor quando archetype = 'icon'
  status: 'concluido' | 'em-andamento'; featured: boolean; certificateUrl?: string
  summary?: string; learned?: string[]; projects?: string[] // slugs de projects.ts
}
interface Project {
  slug: string; title: string; kind: string; description: string
  status: 'no-ar' | 'em-desenvolvimento' | 'conceito'; year?: number; url?: string; repo?: string
  stack: string[]; courses?: string[]; isClientWork?: boolean
}
```

## Pronto quando
- [ ] `npm run dev` mostra papel + grid + grão, Archivo e Plex Mono carregadas, scroll suave.
- [ ] `src/content/*` e `src/config/spiral.ts` tipados, sem `any`.
- [ ] Ritual de fim de etapa do CLAUDE.md (tag `etapa-01`).

## Não faça
3D, animações de UI, seções finais, libs fora da lista.
