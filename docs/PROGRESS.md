# PROGRESS.md — estado e handoff entre sessões

> O Code lê isto no começo de toda sessão e atualiza no fim de toda etapa. Curto e factual.

## Estado atual
- Etapa atual: 03 — Objetos 3D (parte 1) + /lab
- Última tag: etapa-02
- Bloqueios / pendências do Kaique: preencher `docs/CURSOS.md` (até a etapa 06), revisar `docs/CONTEUDO.md`

## Etapas
- [x] 01 Fundação
- [x] 02 Espiral 3D
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

### Etapa 02 — 2026-11-09
Feito: `src/lib/store.ts` (zustand; `progress` só via `getState()`), `cssVar.ts`, `viewport.ts` (`usePreset`); `src/three/spiral/math.ts` + 12 testes; `SpiralSection` (`#cursos`, ScrollTrigger → `progress` / `activeIndex` / `exitProgress`); canvas fixo (`SceneLoader` → `Scene`), `Lights`, `Spiral` + `SpiralItem` (placeholder facetado na cor da categoria + hit area), `Axis` (eixo tracejado com tiques + trilho pontilhado), sway, troca suave de preset, pausa fora da tela / aba oculta, `DebugPanel` em `/?debug` (lil-gui + Stats + "Copiar config").
Decisões:
- `frameloop` `'demand'` em vez de `'never'`: no R3F `invalidate()` não faz nada em `'never'` e um resize deixaria o canvas em branco. Em `'demand'` o R3F já desenha o frame final sozinho; esse frame é desenhado "assentado" (sem damping), então pular direto para depois da seção não deixa peça congelada no meio da tela.
- Damping no **progresso** (uma vez por frame, em `Spiral`), não na posição de cada peça: as peças ficam sempre em cima do trilho. `Spiral` roda com prioridade −1 e entrega `{ cfg, p, exit, lift, extra }` por ref para `SpiralItem` / `Axis`.
- `math.ts` não importa `three` (smoothstep próprio; posição `{x, y, z}`): `SpiralSection` usa o arquivo e o import puxava a lib inteira (385 KB) para o bundle inicial. Agora three / R3F / drei só carregam no chunk da cena e o lil-gui só com `?debug`.
- Saída mínima já aqui: peças + trilho sobem uma tela com `exitProgress²`, eixo some por opacidade (o canvas é fixo: sem isso a última peça ficava atrás da seção seguinte). Coreografia de verdade = etapa 07.
- Novos no preset: `fogNear`, `fogFar`, `dpr`; constantes `AMBIENT_SWAY` e `PRESET_LAMBDA` em `spiral.ts`. Tokens `--color-light-key` / `--color-light-rim`.
- Hero provisório rola para fora por cima da espiral (bloco absoluto no topo de `#cursos`); header absoluto.
- "Copiar config" exporta `angleStepDeg` (graus) + `"preset"`; o código guarda `angleStep` em radianos.
- Trilho com 36 pontos por peça (8 ficava ralo demais para ler como linha).
Pendências:
- O texto do hero passa por cima da peça ativa (no mobile fica difícil de ler em alguns trechos) — resolve na etapa 04 (painel + gradiente de papel do DESIGN §3).
- Calibrar em `/?debug`: com `angleStep` 55° as vizinhas ±1 e ±2 caem quase no mesmo x e se sobrepõem na tela (testar ~75–90° ou `pitch` maior).
- Damping alto em reduced motion (DESIGN §7) fica para o passe de a11y; materiais em cache (`materials.ts`) na etapa 03.
- Aviso `THREE.Clock deprecated` no console vem de dentro do R3F 9 com three 0.187 (não é do nosso código).
Como testar: `npm run dev` → `http://localhost:3000/?debug`. Rolar nos dois sentidos (peça ativa à frente e maior; "Estado" no painel mostra `progress` / `activeIndex`); subir `radiusX` abre a espiral; baixar `scrollPerItem` encurta a seção; estreitar a janela até ficar retrato troca para o preset mobile; rolar até depois da seção → o FPS do Stats para de contar. `npm run test` roda a math. Screenshots em `artifacts/etapa-02-*.png` (não versionados).

<!-- modelo:
### Etapa NN — AAAA-MM-DD
Feito: …
Decisões: …
Pendências: …
Como testar: …
-->

## Ajustes
<!-- 1 linha por /ajuste: data — o que mudou — commit -->
