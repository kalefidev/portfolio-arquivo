# PROGRESS.md — estado e handoff entre sessões

> O Code lê isto no começo de toda sessão e atualiza no fim de toda etapa. Curto e factual.

## Estado atual
- Etapa atual: 02 — Espiral 3D (modo plano: Shift+Tab)
- Última tag: etapa-01
- Bloqueios / pendências do Kaique: preencher `docs/CURSOS.md` (até a etapa 06), revisar `docs/CONTEUDO.md`

## Etapas
- [x] 01 Fundação
- [ ] 02 Espiral 3D
- [ ] 03 Objetos 3D (parte 1) + /lab
- [ ] 04 Interface da espiral
- [ ] 05 Interações, overlay e modos
- [ ] 06 Objetos 3D (parte 2)
- [ ] 07 Seções + saída da espiral
- [ ] 08 Lançamento

## Parâmetros calibrados da espiral
<!-- cole aqui o JSON do botão "Copiar config" do /?debug e rode /ajuste para aplicar -->

## Curso → objeto
| curso | arquétipo | variação |
|---|---|---|
| AWS Cloud | cloud | — |
| Cyber / Segurança | shield | — |
| Lógica de Programação (EXEMPLO) | brackets | — |
| HTML e CSS (EXEMPLO) | browser | — |
| SQL e Banco de Dados (EXEMPLO) | database | — |
| Automação com n8n (EXEMPLO) | gears | — |

## Log
### Etapa 01 — 2026-11-09
Feito: Next 16.4.6 + React 19.3 + Tailwind 4.3 na raiz; deps da stack (three 0.187, R3F 9, drei 10, gsap, lenis, zustand, phosphor; dev: lil-gui, vitest 5, @types/three); tokens do DESIGN §2 em `globals.css` (`@theme static`, para o 3D poder ler as cores); Archivo (wdth) + IBM Plex Mono; Lenis no `gsap.ticker` (`src/lib/scroll.ts` → `getLenis()`); `Grain` (grid 64px + ruído SVG); `src/types.ts`, `src/content/{courses,projects,site}.ts` com helpers; `src/config/spiral.ts` (presets desktop/mobile + `pickPreset`); `page.tsx` provisória.
Decisões:
- Removi `cacheComponents` e `partialPrefetching` do `next.config.ts` (o scaffold ligou; fora da stack e arriscam a compatibilidade com `output: 'export'`). Mantive o loader `@tailwindcss/turbopack` do scaffold (sem postcss.config).
- `@types/node` subiu para ^24: vitest 5 exige ≥22 (o scaffold veio com ^20 e dava ERESOLVE).
- Layout usa `{ children: React.ReactNode }` em vez do global `LayoutProps` (esse só existe depois do 1º `next dev/build` e quebraria o `typecheck` num clone novo).
- `projectsForCourse` / `coursesForProject` ficam em `projects.ts` (courses.ts não importa projects → sem import circular); o vínculo vale se declarado em `Course.projects` **ou** `Project.courses`.
- `spiral.ts`: `scrollPerItem` é fração da altura da viewport (0.75 = 75vh); adicionei `exitZone` (0.6) para não deixar o "60svh" como número mágico; `dragReturn` mobile = 0.6 (sem uso: tabela diz "—").
- Cursos: só havia 2 linhas no CURSOS.md → AWS + Cyber (nomes/instituição com TODO) + 4 EXEMPLO. Projetos com status "?" no CONTEUDO.md viraram `conceito` com TODO.
Pendências: preencher CURSOS.md; confirmar status/cliente dos projetos "?"; WhatsApp, redes, foto, domínio, bio (strings `TODO:` visíveis em `site.ts`). Para a etapa 02: `next/dynamic` com `ssr:false` só funciona dentro de Client Component (Next 16) — o wrapper do `Scene` precisa ser `'use client'`.
Como testar: `npm run dev` → http://localhost:3000 (papel + grid + grão, Archivo/Plex Mono, scroll suave). Screenshots: `artifacts/etapa-01-desktop-1440.png`, `artifacts/etapa-01-mobile-390.png` (não versionados).

<!-- modelo:
### Etapa NN — AAAA-MM-DD
Feito: …
Decisões: …
Pendências: …
Como testar: …
-->

## Ajustes
<!-- 1 linha por /ajuste: data — o que mudou — commit -->
