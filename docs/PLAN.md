# PLAN.md — visão, stack e etapas

## Objetivo
Um portfólio que (1) prove habilidade técnica para recrutador e (2) passe confiança para cliente pequeno.
A espiral 3D de cursos é o "uau"; os projetos são a prova. Cada curso aponta para os projetos feitos com aquilo, e vice-versa.

## Referência → nosso
- Mecânica e ordem das seções: hamol.studio (detalhes em `docs/REFERENCIA.md`).
- Muda: estética (DESIGN.md), espiral mais larga e que anda mais por rolagem, esferas → objetos 3D por curso, textos e conteúdo próprios.

## Stack
| peça | escolha | por quê |
|---|---|---|
| framework | Next.js (App Router, TypeScript) | HTML real para SEO e acessibilidade, rotas (`/lab`), é o que as vagas pedem |
| 3D | three + @react-three/fiber + @react-three/drei | declarativo, eventos de ponteiro prontos, `View` / `Html` / `Lightformer` |
| scroll e animação | lenis + gsap (ScrollTrigger, SplitText) | padrão de site premiado; você já tem as skills do GSAP |
| estado | zustand | leitura fora do React no `useFrame` (sem re-render por frame) |
| estilo | Tailwind v4 + tokens `@theme` | tokens do DESIGN.md num lugar só |
| testes | vitest (math da espiral) | protege a parte em que você mais vai mexer |
| ícones | @phosphor-icons/core (MIT) | SVGs crus para extrudar em 3D e usar na UI |
| deploy | Vercel (grátis) | zero config; continua compatível com export estático |

Sem backend: o contato abre o WhatsApp com a mensagem montada.

## Arquitetura
```
src/
  app/
    layout.tsx           fontes, metadata, SmoothScroll, Grain
    page.tsx             Scene (dynamic, ssr:false) + seções em ordem
    globals.css          Tailwind v4 + tokens @theme
    lab/page.tsx         laboratório de objetos (só dev ou NEXT_PUBLIC_LAB=1)
  components/
    layout/              Header, Footer, SmoothScroll, Grain, Loader
    spiral/              SpiralSection, HeroIntro, ActivePanel, RightRail, BottomBar,
                         IndexMenu, SettingsPanel, CourseOverlay, StaticCourses
    sections/            Reach, CourseIndex, Projects, Services, About, Process, Contact, ContactDialog
    ui/                  Button, Eyebrow, Hairline…
  three/
    Scene.tsx  Lights.tsx
    spiral/              Spiral, SpiralItem, Axis, Callout, FocusMarks, math.ts, math.test.ts
    archetypes/          index.ts, types.ts, materials.ts, normalize.ts, useDampedFlag.ts, Cloud.tsx, Shield.tsx…
    debug/               DebugPanel.ts (lil-gui, só com ?debug)
  content/               courses.ts, projects.ts, site.ts
  config/                spiral.ts
  lib/                   store.ts, scroll.ts, cssVar.ts, whatsapp.ts, useReducedMotion.ts
  types.ts
public/images/           foto, prévias de projetos
```

## Como trabalhar com o Code
1. `/clear` → `/etapa NN` (ou cole `docs/prompts/etapa-NN.md`).
2. Revise no navegador. Ajuste pequeno na mesma sessão; mudou de assunto → `/salvar`, `/clear`, `/ajuste …`.
3. Etapas 02, 03 e 05: comece em modo plano (Shift+Tab) — são as que mais custam se saírem erradas.
4. Rollback: cada etapa vira tag (`git checkout etapa-03`).

## Etapas
| Nº | etapa | entrega | pronto quando |
|---|---|---|---|
| 01 | Fundação | Next + deps + tokens + fontes + Lenis + dados tipados + config | build ok; papel com grid/grão e fontes certas |
| 02 | Espiral 3D | canvas fixo, espiral com placeholders, scroll → progresso, `/?debug` | rolar move a espiral suave; parâmetros mudam ao vivo; testes passam |
| 03 | Objetos 3D (1) | infra de arquétipos, `/lab`, cloud, shield, brackets, database, icon | 5 objetos com idle/hover/ativo no /lab e na espiral |
| 04 | UI da espiral | header, hero, painel ativo, callouts, régua, barra inferior | troca de peça animada; layout ok em 1440 e 390 |
| 05 | Interações | hover, clique + overlay, arraste, teclado, índice, ajustes, sem 3D | tudo navegável só com teclado; overlay sem travar o scroll |
| 06 | Objetos 3D (2) | arquétipos que faltam para os cursos reais | todo curso da espiral com objeto próprio |
| 07 | Seções | saída da espiral, Brasília, índice, projetos, serviços, sobre, processo, contato, footer | página completa de ponta a ponta |
| 08 | Lançamento | loader, performance, a11y, SEO, deploy | Lighthouse desktop ≥ 90 / mobile ≥ 70; no ar |

## Decisões em aberto (Kaique)
- Lista de cursos em `docs/CURSOS.md` — necessária até a etapa 06. Recomendado 8–14 na espiral; o resto só no índice.
- Quais projetos podem aparecer (projeto de cliente pede autorização).
- Domínio: substituir `site.kaiquecalefi.online` (link atual da bio) ou usar outro?
- WhatsApp, GitHub, LinkedIn, Instagram, foto.

## Orçamento de performance
- FPS ≥ 55 em desktop médio, ≥ 30 em Android intermediário.
- Triângulos totais ≤ 200k; draw calls ≤ 150; DPR máx 1.75 (1.5 no mobile).
- 3D carregado depois do HTML (`next/dynamic`, `ssr:false`); LCP = texto do hero.
- Render pausado quando a espiral sai da tela ou a aba fica oculta.
