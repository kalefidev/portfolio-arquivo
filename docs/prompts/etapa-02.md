# Etapa 02 — Espiral 3D (mecânica)

Leia: `docs/PROGRESS.md`, `DESIGN.md` §4 e §6, `docs/REFERENCIA.md` (Seção da espiral), `src/config/spiral.ts`, `src/types.ts`. Modo plano recomendado.

## Objetivo
A espiral funcionando com placeholders: rolar a página faz as peças subirem e girarem em volta do eixo, com a peça ativa sempre à frente. Parâmetros calibráveis ao vivo.

## Faça
1. `src/lib/store.ts` (zustand): `progress`, `activeIndex`, `exitProgress`, `hoveredSlug`, `focusSlug`, `dragOffset`, `ambientMotion`, `staticMode` + actions. `progress` é escrito a cada frame de scroll e **nunca** assinado por componente React (lido com `getState()` no `useFrame`). `activeIndex = round(progress)` só é setado quando muda.
2. `src/three/spiral/math.ts`: função pura `getItemTransform(i, progress, cfg, extra)` → `{ position, scale, focus, visibility, d }` exatamente como o DESIGN.md §4, mais `sectionHeight(n, cfg)`.
   `math.test.ts` (vitest): ativa em `(axisX, 0, 0)`; a seguinte abaixo (`y = -pitch`) e atrás (`z < 0`); simetria esquerda/direita para `d = ±1`; `visibility = 0` além de `visibleRange`.
3. `src/three/Scene.tsx`: `<Canvas>` fixo atrás da página, carregado em `page.tsx` com `next/dynamic` (`ssr: false`). Container `position: fixed; inset: 0; height: 100lvh` (não redimensiona quando a barra do Chrome Android some). `dpr` máx 1.75 (1.5 no mobile), câmera do preset, `scene.background` = paper lido do CSS (`src/lib/cssVar.ts`), fog na mesma cor (ajuste se não casar). Eventos: `eventSource={document.body}` + `eventPrefix="client"` para o canvas receber ponteiro mesmo com HTML por cima.
4. `Lights.tsx` conforme DESIGN.md §6.
5. `src/components/spiral/SpiralSection.tsx`: seção `#cursos` com a altura de `sectionHeight()` e um stage `sticky` de 100svh (substitui as seções provisórias do topo; mantenha uma seção alta depois para testar a saída). ScrollTrigger (`start: 'top top'`, `end: 'bottom bottom'`) converte o scroll em `progress` 0…N−1; nos últimos 60svh o `progress` trava em N−1 e `exitProgress` vai de 0 a 1.
6. `Spiral.tsx` + `SpiralItem.tsx`: um item por curso `featured`. Por frame: lê o store, calcula o alvo com `getItemTransform` e aplica com damping. Item = arquétipo `placeholder` (DESIGN.md §5, cor da categoria) + hit area invisível r = 1; `visible = false` quando `visibility ≈ 0`.
7. `Axis.tsx`: eixo tracejado com tiques a cada `pitch` + trilho pontilhado da hélice (DESIGN.md §4 › Desenho), andando junto com o progresso.
8. `ambientSway`: oscilação suave (~0.06 rad, período ~10s) quando `ambientMotion` estiver ligado e sem reduced motion.
9. Responsivo: `pickPreset(aspect)` reavaliado no resize, com transição suave entre presets.
10. Performance: render pausado (`frameloop` `'never'` + um `invalidate` final) quando `#cursos` sai da tela; pausa também com `document.hidden`.
11. Debug em `/?debug` (import dinâmico, fora do bundle normal): lil-gui com todos os parâmetros do preset ativo (limites sensatos), toggle de ambiente, botão **"Copiar config"** (JSON do preset no clipboard) e drei `<Stats />`.

## Pronto quando
- [ ] Rolar move a espiral suave nos dois sentidos; peça ativa à frente e maior; `activeIndex` correto.
- [ ] No `?debug`: subir `radiusX` abre a espiral pros lados; baixar `scrollPerItem` faz andar mais por rolagem.
- [ ] Em 390×844 a espiral cabe sem cortes feios.
- [ ] Testes da math passam; nenhum re-render React por frame.
- [ ] Ritual de fim de etapa.

## Não faça
Textos e painéis de UI (etapa 04), objetos finais (etapa 03), hover/clique (etapa 05).
