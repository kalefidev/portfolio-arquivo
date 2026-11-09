# Etapa 04 — Interface da espiral

Leia: `docs/PROGRESS.md`, `DESIGN.md` §3, §7 e §8 (CTA), `src/content/site.ts`, `src/lib/store.ts`. Use as skills do GSAP para SplitText e ScrollTrigger.

## Objetivo
A camada HTML por cima da espiral: mesma estrutura da referência, nossa estética.

## Faça
1. `Header.tsx`: wordmark `kaique calefi■`, nav em mono com hairlines (âncoras `#cursos`, `#projetos`, `#sobre`, `#contato`, rolando via Lenis), CTA primário "VAMOS CONVERSAR ↗" (abre o WhatsApp de `site.ts`). Mobile: menu em tela cheia simples.
2. `HeroIntro.tsx`: eyebrow + H1 + sub + "Explorar o arquivo ↓" (textos de `site.ts`). Some quando `progress > 0.35` e volta ao subir — assine um booleano derivado, não o `progress`.
3. `ActivePanel.tsx`: painel "PEÇA Nº 03 / 12" (DESIGN.md §3), assinando só `activeIndex`. Troca com SplitText: título sai para cima com máscara, o novo entra de baixo, stagger 60ms; metadados em fade. A seta ↗ chama `setFocus(slug)` (o overlay vem na etapa 05).
4. `src/three/spiral/Callout.tsx` (drei `<Html>`): "Nº 03 — AWS CLOUD" + linha-guia em CSS; opacidade por |d| (some acima de 2); sem captar ponteiro.
5. `FocusMarks.tsx`: cantoneiras de registro em signal em volta da peça ativa (Billboard + Line) + anel fino.
6. `RightRail.tsx`: régua vertical com um tique por peça, ativa destacada + "Nº 03", rótulo vertical "ARQUIVO DE ESTUDOS"; clique no tique → `scrollToCourse(i)` (novo helper em `src/lib/scroll.ts`, calculado com o topo da seção e o `scrollPerItem` em px).
7. `BottomBar.tsx`: dicas (desktop/mobile), controle segmentado "☰ ÍNDICE | ⚙ AJUSTES" (botões ainda sem painel), contador "03 / 12" com barrinha de progresso.
8. Gradiente de legibilidade atrás da coluna esquerda (DESIGN.md §3).
9. Camadas: canvas (z 0) < grain (z 1) < UI (z 2). Stage da UI com `pointer-events: none`; só os controles com `pointer-events: auto`.
10. Mobile (< 768px): layout do DESIGN.md §3 (painel vira faixa inferior, sem régua).

## Pronto quando
- [ ] Rolar troca o painel com animação limpa, sem pulos nem texto sobreposto (inclusive rolando rápido).
- [ ] Callouts e cantoneiras acompanham os objetos sem tremer.
- [ ] 1440×900 e 390×844: header e barra inferior não cobrem a peça ativa.
- [ ] Ritual de fim de etapa.

## Não faça
Overlay da peça, painéis de Índice/Ajustes, hover real (etapa 05).
