# Etapa 03 — Objetos 3D (parte 1) + laboratório

Leia: `docs/PROGRESS.md`, `DESIGN.md` §5 e §6, `src/types.ts`, `src/three/spiral/SpiralItem.tsx`. Modo plano recomendado.

## Objetivo
Infra dos arquétipos, a página `/lab` para criar e ajustar objetos isolados, e os 5 primeiros objetos.

## Faça
1. `src/three/archetypes/types.ts`: `ArchetypeProps { tint: string; hovered: boolean; active: boolean; reducedMotion: boolean; detail: 'low' | 'high'; variant?: string; icon?: string }`.
2. `materials.ts`: cache de materiais (argila por cor, ink, signal emissivo), reaproveitado entre objetos; dispose central.
3. `useDampedFlag(flag, lambda)` → ref 0…1 amortecida para hover/ativo; helper de tempo de idle que respeita reduced motion.
4. `normalize.ts`: centraliza e escala um grupo para caber na esfera r = 1 (bounding sphere calculada uma vez).
5. `index.ts`: registro `Record<Archetype, ComponentType<ArchetypeProps>>`; chave sem implementação cai em `icon` (aviso no console só em dev).
6. Objetos, um arquivo cada, com receita e animações do DESIGN.md §5: `Cloud`, `Shield`, `Brackets`, `Database`, `Icon`.
   `Icon`: SVG cru do Phosphor peso `fill` de `@phosphor-icons/core` (confira o caminho real no `node_modules`) → `SVGLoader` → `ExtrudeGeometry` sobre placa chanfrada; prop `icon` com o nome do ícone.
7. `SpiralItem` passa a renderizar o arquétipo do curso. Por enquanto `active` vem do `activeIndex` e `hovered = false` (hover real na etapa 05).
8. `/lab` (`src/app/lab/page.tsx`): só em dev ou com `NEXT_PUBLIC_LAB=1` (senão `notFound()`). Grade com todos os arquétipos registrados usando drei `<View>` (um canvas só) + `OrbitControls` por célula. Por célula: toggles hovered / active / reducedMotion / detail, seletor de tom por categoria, contagem de triângulos.
9. `detail = 'low'` no mobile (menos segmentos).

## Pronto quando
- [ ] `/lab` mostra os 5 objetos; os toggles disparam as animações de hover e ativo de cada um.
- [ ] Cada objeto ≤ 15k triângulos, cabe na esfera r = 1 e usa o cache de materiais.
- [ ] Na espiral, AWS = nuvem e Cyber = escudo; cursos sem objeto pronto caem em `icon`.
- [ ] Ritual de fim de etapa.

## Não faça
Arquétipos além dos 5 (etapa 06). Postprocessing.
