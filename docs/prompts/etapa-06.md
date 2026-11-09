# Etapa 06 — Objetos 3D (parte 2)

Leia: `docs/PROGRESS.md`, `docs/CURSOS.md`, `DESIGN.md` §5, `src/three/archetypes/index.ts` e **um** arquétipo pronto (ex.: `Cloud.tsx`) como modelo.

## Faça
1. Atualize `src/content/courses.ts` com a lista real do `docs/CURSOS.md` (remova os exemplos). Curso sem objeto definido: escolha pelo tema (tabela do DESIGN.md §5) e me liste as escolhas.
2. Implemente **só** os arquétipos que a lista real usa e que ainda não existem, com receita e idle/hover/ativo do DESIGN.md §5. Dois cursos da espiral no mesmo arquétipo → crie `variant` para não repetir igual.
3. Tema sem arquétipo no catálogo: proponha 2 ideias de objeto (1 linha cada) e pergunte antes de construir; enquanto isso use `icon` com o ícone Phosphor mais próximo.
4. Todo objeto novo aparece no `/lab`, ≤ 15k triângulos, materiais do cache, `detail` low/high.
5. Revise o conjunto na espiral: tamanhos aparentes parecidos, nenhum tom de categoria brigando com outro.

## Pronto quando
- [ ] Todo curso da espiral tem objeto próprio com animações de hover e ativo.
- [ ] Tabela "Curso → objeto" preenchida no PROGRESS.md.
- [ ] FPS dentro do orçamento (PLAN.md) com a espiral cheia.
- [ ] Ritual de fim de etapa.
