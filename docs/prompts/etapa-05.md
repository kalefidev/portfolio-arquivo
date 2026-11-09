# Etapa 05 — Interações, overlay da peça e modos

Leia: `docs/PROGRESS.md`, `DESIGN.md` §7, §8 (Overlay, Ajustes, Índice) e §9, `src/lib/store.ts`, `src/three/spiral/SpiralItem.tsx`. Modo plano recomendado.

## Faça
1. **Hover**: eventos R3F na hit area → `hoveredSlug`; cursor crosshair; callout destacado; `hovered` real no arquétipo. Ignore o evento quando o ponteiro estiver sobre um controle HTML.
2. **Clique** (movimento < 5px, senão é arraste) → `focusSlug` → **modo foco**: a peça vai para o palco (esquerda, maior), as demais recuam e desbotam; `CourseOverlay.tsx` abre à direita (bottom sheet no mobile) com o conteúdo do DESIGN.md §8. Lenis parado enquanto aberto. `role="dialog"`, `aria-modal`, foco preso, Esc fecha, foco volta para quem abriu. Anterior/próxima troca a peça sem fechar.
3. **Hash**: abrir uma peça grava `#peca-<slug>`; carregar a página com esse hash rola até a peça e abre.
4. **Arraste** (só mouse): no vazio gira a espiral (`dragOffset` com inércia, voltando devagar via `dragReturn`); sobre um objeto gira o objeto (inércia, persiste). No modo foco, arrastar gira a peça do palco (touch também).
5. **Teclado** (com `#cursos` na tela e sem overlay): ↑/↓ e ←/→ vão para a peça anterior/próxima (`scrollToCourse`), Enter abre a ativa. Skip link "Pular para o índice".
6. `IndexMenu.tsx` (botão ÍNDICE): lista Nº + nome das peças, atual destacada, clique rola até ela. Acessível (setas, Esc).
7. `SettingsPanel.tsx` (botão AJUSTES): Movimento ambiente · Resetar posições (zera `dragOffset` e giros dos objetos, animado) · Ver sem 3D. Preferências em localStorage dentro de try/catch.
8. **Modo sem 3D** (`StaticCourses.tsx`): esconde o canvas e para o render; `#cursos` vira grade HTML de cartões (Nº, nome, instituição, ano, categoria, ícone Phosphor 2D) que abrem o mesmo overlay, sem palco 3D. Ativa sozinho se não houver WebGL.
9. `prefers-reduced-motion`: comportamento do DESIGN.md §7.

## Pronto quando
- [ ] Dá para navegar tudo só com teclado (Tab, setas, Enter, Esc).
- [ ] Clique e arraste nunca se confundem; depois de fechar o overlay o scroll volta normal.
- [ ] Modo sem 3D funciona e é lembrado ao recarregar.
- [ ] Mobile: tocar numa peça abre; deslizar rola normalmente.
- [ ] Ritual de fim de etapa.
