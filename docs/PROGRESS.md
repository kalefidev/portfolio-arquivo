# PROGRESS.md — estado e handoff entre sessões

> O Code lê isto no começo de toda sessão e atualiza no fim de toda etapa. Curto e factual.

## Estado atual
- Etapa atual: 08 concluída + passe final de UI/UX (2026-11-23, ver "Ajustes") — v1.0 pronta para publicar (falta o deploy, que é do Kaique: ver "Deploy" abaixo)
- Última tag: etapa-08 (= v1.0)
- Bloqueios / pendências do Kaique: deploy (GitHub + Vercel + DNS); foto, bio e Instagram; lista real do `docs/CURSOS.md` → `/ajuste`; revisar `docs/CONTEUDO.md`, `site.seo.description` e os textos do 404; QA no Android real

## Etapas
- [x] 01 Fundação
- [x] 02 Espiral 3D
- [x] 03 Objetos 3D (parte 1) + /lab
- [x] 04 Interface da espiral
- [x] 05 Interações, overlay e modos
- [x] 06 Objetos 3D (parte 2) (parcial: lista real pendente)
- [x] 07 Seções + saída da espiral
- [x] 08 Lançamento

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
| Automação com n8n (2024) | gears | — |
| Trilha Full Stack TypeScript (fora da espiral, só no índice) | icon `terminal-window` | — |

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

### Etapa 03 — 2026-11-09
Feito: `src/three/archetypes/` — `types.ts` (`ArchetypeProps`), `materials.ts` (cache `clay(tint)` / `ink()` / `signal()` + `disposeMaterials()`, chamado quando `Scene` e `Lab` desmontam), `motion.ts` (`useDampedFlag`, `useIdleTime`, `step`), `normalize.ts` + teste, `icons.ts` (SVG cru do Phosphor), `index.ts` (registro + `<ArchetypeObject archetype=… />`), e os objetos `Cloud`, `Shield`, `Brackets`, `Database`, `Icon`. `SpiralItem` desenha o arquétipo do curso (`active` = `activeIndex === index`, `hovered = false`); `detail = 'low'` no preset mobile. `/lab` (`src/app/lab/page.tsx` + `src/three/lab/`): grade com drei `<View>` num canvas só, `OrbitControls` por célula, toggles hovered / active / reducedMotion / detail low, seletor de tom, seletor de ícone (só na célula `icon`), contagem de triângulos.
Triângulos (high / low): cloud 8.548 / 2.052 · shield 4.352 / 1.120 · brackets 256 / 128 · database 5.508 / 2.196 · icon (certificate) 2.516 / 1.692.
Decisões:
- SVG do Phosphor entra como **texto** por uma regra no `next.config.ts` (`"*-fill.svg": { type: "raw" }`). O atributo de import `with { turbopackModuleType: 'text' }` (docs do Next 16) não funcionou em SVG: o import continuou devolvendo a URL. Consequência: **ícone novo = 1 linha de import em `archetypes/icons.ts`**; nome não registrado cai em `certificate` com aviso em dev. Não usei import dinâmico por nome porque empacotaria os ~1.500 ícones `fill`.
- Registro é `Partial<Record<Archetype, …>>` e quem desenha é `<ArchetypeObject>`: chave sem objeto cai em `Icon` (aviso 1× por chave, só em dev). `browser` e `gears` ganharam `icon: 'browser' | 'gear'` em `courses.ts` para o fallback não ser genérico.
- `normalize()` roda 1× por objeto (layout effect) na pose de repouso; partes que só aparecem animadas (pacotes da nuvem, anel do escudo, cursor) nascem com escala 0 dentro do corpo, então não entram na conta. Na animação elas passam um pouco de r = 1 (anel do escudo ≈ 1,15).
- Só o corpo do escudo tem material próprio (o emissivo da borda anima por instância); todo o resto vem do cache. Sumir/aparecer é sempre por escala, nunca por opacidade (não exige material por instância).
- `brackets` em idle **balança ±26°** em vez de girar: no giro completo o `</>` aparece espelhado e de perfil. `icon` tem o glifo nas duas faces por causa do giro. `database` ganhou luz signal + inclinação de 17° (sem a luz o giro dos discos não aparece). DESIGN §5 atualizado.
- `useIdleTime` zera em reduced motion (pose de repouso = frente). Hover em reduced motion = só escala +6%.
- Subi o `npm run dev` nesta sessão: o servidor que estava no ar caiu ao reiniciar pelo `next.config.ts`.
Pendências:
- O trilho pontilhado passa **na frente** de peças finas (escudo, colchetes) quando elas não são a ativa — antes o poliedro tapava. Ver na etapa 04/07 (encurtar o trilho perto da peça ou desenhar o trilho antes, sem depth).
- Os dois `icon` giram em fase (mesmo ângulo) — dar um offset por índice quando houver mais de um na tela.
- `fundamentals` (#d8cfbf) quase some no papel: o `</>` fica com pouco contraste. Decisão de token (DESIGN §2), não mexi.
- Seguem da etapa 02: texto do hero por cima da peça ativa (etapa 04); calibrar `angleStep` no `/?debug`.
Como testar: `npm run dev` → `http://localhost:3000/lab`: marcar `hovered` (nuvem solta pacotes, anel desce no escudo, `<` `>` abrem com cursor piscando, discos separam e giram, ícone dá um giro com salto) e `active` (nuvem gira + pacotes, borda do escudo acende, colchetes pulsam, banco gira); `detail low` derruba a contagem; arrastar gira a célula. Na home: AWS = nuvem, Cyber = escudo, HTML/CSS e n8n = ícone na placa. Em build de produção `/lab` é 404 (libera com `NEXT_PUBLIC_LAB=1`). Screenshots em `artifacts/etapa-03-*.png` (não versionados).

### Etapa 04 — 2026-11-10
Feito: `Header` (wordmark, nav em caixa com hairlines, CTA signal; abaixo de 768px um `<dialog>` em tela cheia), `ui/PrimaryCta`, `lib/whatsapp.ts`; no palco sticky de `#cursos`: `HeroIntro`, `ActivePanel` (SplitText com máscara por linha), `RightRail`, `BottomBar` (ícones Phosphor `regular` inline); no 3D: `Callout` (drei `<Html>`) em cada peça e `FocusMarks` (cantoneiras + anel) na ativa; gradientes de legibilidade (`.spiral-fade`); `scrollToCourse(i)` em `lib/scroll.ts`; `pastHero` no store; `heroZone` no preset + `HERO_UNTIL`, `CALLOUT`, `FOCUS_MARKS` em `config/spiral.ts`; `categoryLabels` + `pieceNo()` em `courses.ts`; `site.header` + rótulos de a11y em `site.ts`.
Decisões:
- **Zona de entrada do hero (`heroZone` = 0,25 tela)**: a espiral fica parada na peça 01 enquanto o hero dá lugar ao painel (a 40% da zona, `HERO_UNTIL`). Antes o hero sumia em `progress` 0,35 e a peça 02 assumia em 0,5: a peça 01 tinha ~100px de painel e nunca aparecia centralizada com ele; agora são ~450px. `scrollToProgress` devolve também `heroProgress`; `courseScroll(i)` em `math.ts` é a conta única de "onde a peça i fica centralizada" (régua, CTA do hero). "Explorar o arquivo ↓" leva à peça 01 com painel. DESIGN §3/§4 atualizados; slider no `/?debug`.
- **Layout mobile troca por proporção (< 4:5), não por 768px**: variante `wide:` no `globals.css`, a mesma regra do `pickPreset()`. Com 768px um iPad em pé ficava com espiral mobile (eixo no centro) + painel desktop por cima dela. Só o header troca por largura (`md`). Variante `short:` (altura ≤ 560px) aperta o hero para celular deitado (sem eyebrow, texto menor); o display ganhou teto de `12vh`.
- **Painel**: só existe um título no DOM. O antigo sai (320ms), e entra a peça que estiver ativa *naquele momento* — rolando rápido ele pula peças, mas nunca empilha dois títulos. O número "PEÇA Nº 03 / 06" troca na hora (sem animação). O bloco do título tem `key` por peça porque o SplitText reescreve os filhos do `<h2>`. O efeito de saída depende de `[leaving, shown]`: só com `leaving` o título travava numa peça velha quando o scroll andava durante a troca.
- **Âncoras**: `anchors: true` do Lenis (nenhum JS no header); sem Lenis (reduced motion) é o pulo nativo. `#topo` é o wrapper da página.
- **Callouts**: o `<Html>` do drei ia parar no `<body>` (é o `eventSource` do canvas) e rolaria com a página → `portal` na caixa do canvas. `Spiral` passou para prioridade −2 e `SpiralItem` para −1, senão o `<Html>` (prioridade 0, registrado antes do pai) projetava a posição do frame anterior e o rótulo "arrastava". Nas peças do lado direito o rótulo vira para baixo-esquerda (para cima-esquerda batia nas cantoneiras). Título só a partir de 1280px, com largura máxima + reticências.
- **Régua**: o "Nº 03" fica do lado de fora da linha e o rótulo vertical embaixo — do lado de dentro o callout da peça ativa passava por cima dele. Tiques flexíveis (cabem 14 peças em 720px de altura).
- **Gradientes** ficam dentro do `Scene` (acima do canvas e dos callouts, abaixo do grão), não na UI: assim o grid de 64px não some atrás do texto. Inclui fade de 6rem no topo e na base, para peça nenhuma ficar atrás do nav ou do contador.
- **Trilho** com folga de 30% do passo em volta de cada peça (pendência da etapa 03: ele passava na frente das peças finas).
- `--z-*` continuam 0 / 10 / 20 (a ordem canvas < grão < UI é a mesma do prompt).
- CTA do WhatsApp: enquanto `site.whatsapp` for TODO, o link aponta para `#contato` em vez de um `wa.me` quebrado.
- Durações do GSAP vêm dos tokens (`cssSeconds`); o build minifica `640ms` → `.64s`, o helper trata os dois. `expo.out` / `expo.in` são as curvas de `--ease-enter` / `--ease-exit`.
- Callout usa o rótulo de 12px (token) em vez dos 11px do DESIGN; ⚙ / ☰ viraram ícones Phosphor (⚙ vira emoji em alguns celulares — DESIGN §10).
Pendências (nenhuma desta etapa; tudo abaixo tem dono):
- Etapa 05: ÍNDICE / AJUSTES sem ação e ↗ só grava `focusSlug`. O canvas escuta o `<body>`, então passar o mouse num botão da UI também atinge a peça que está atrás — filtrar por `event.target`.
- Etapa 07: header é transparente (vai precisar de fundo paper + hairline quando as seções passarem por baixo); `#projetos`, `#sobre`, `#contato` ainda não existem (os links só mudam o hash).
- Kaique: WhatsApp e demais TODOs do `site.ts`; calibrar `angleStep` / `pitch` no `/?debug` (vizinhas ±1 e ±2 ainda caem quase no mesmo x); contraste do tom `fundamentals` (token).
- Dev: ao editar `globals.css` com o `next dev` no ar, uma regra CSS nova pode não chegar ao navegador até a próxima edição do arquivo (cache do Turbopack) — se "a classe não pegou", salve o arquivo de novo antes de investigar.
Como testar: `npm run dev` → `http://localhost:3000`. Primeira rolada: o hero troca pelo painel da peça 01 com a nuvem ainda no centro; continuar rolando devagar e rápido (título troca com máscara, nunca dois ao mesmo tempo; contador e régua acompanham); voltar ao topo (hero volta); clicar num tique da régua e em "Explorar o arquivo ↓"; CURSOS no header rola suave até o topo; estreitar a janela até ficar em pé → layout mobile + MENU (Esc fecha); janela baixa e larga (ex.: 844×390) → hero cabe entre header e barra. Screenshots em `artifacts/etapa-04-*.png` (não versionados).

### Etapa 05 — 2026-11-12
Feito: hover real (crosshair, callout destacado, `hovered` no arquétipo) e clique nas peças; **modo foco** + `CourseOverlay` (`<dialog>` modal: palco + painel 44vw / bottom sheet 62svh, anterior / próxima, hash `#peca-<slug>`); arraste com inércia (`three/spiral/drag.ts` + 5 testes): vazio gira a espiral e ela volta, sobre a peça gira a peça, no palco gira a peça aberta (mouse e toque); teclado (↑↓←→, Enter) + skip link; `IndexMenu` e `SettingsPanel` (popovers nativos); modo sem 3D (`StaticCourses`, `archetypeIcons.ts`, `SceneLoader` desmonta o canvas; automático sem WebGL); preferências em localStorage (`arquivo:prefs`); reduced motion (`REDUCED_DAMPING`, sem inércia, sem slide). Novos: `ui/Icon.tsx`; `hasWebGL()` / `reaches3d()` em `viewport.ts`; `scrollToCourse(i, { immediate })`, `scrollToTop()`, `pieceId()` em `scroll.ts`; `stageX/Y/Scale` no preset + `FOCUS_MODE`, `DRAG`, `REDUCED_DAMPING` em `config/spiral.ts`; `statusLabels` em `courses.ts`.
Decisões:
- **Overlay = `<dialog>` + `showModal()`**: foco preso, Esc, `aria-modal` e "foco volta para quem abriu" são do navegador. Entrada / saída só com CSS (`@starting-style` + `transition-behavior: allow-discrete`). ÍNDICE / AJUSTES = Popover API (Esc, clique fora, um fecha o outro); só as setas da lista são JS.
- **A peça aberta é sempre a ativa**: abrir (ou anterior / próxima) salta o scroll (`immediate`) e o damping do progresso suaviza. Cada peça tem o próprio caminho até o palco (`frame.staged[i]`), então "próxima" troca duas peças em voo.
- **"Desbotar" = recuar em z para dentro do fog** (`FOCUS_MODE.recede`): os materiais são cache compartilhado, não existe opacidade por peça. Header, UI da espiral e véu de legibilidade somem por CSS (`.fades-in-focus`, ligado em `html:has(dialog.piece[open])`) — nenhum componente assina `focusSlug` para isso.
- **`dragOffset` saiu do store** → `drag.ts` (módulo mutável, sem `three`), junto com o giro de cada peça. O alvo do arraste é o `hoveredSlug` (sem raycast extra).
- **Eventos do R3F**: `events={…}` com `compute` próprio no lugar de `eventPrefix="client"`: ponteiro sobre controle HTML ou fora de `#cursos` (`reaches3d`) conta como fora da tela, e o R3F dispara o `pointerout` sozinho. Peça escondida fica com escala 0 — antes a hit area de uma peça nunca desenhada ficava na origem, clicável.
- **"Movimento ambiente" desligado** = sem sway **e** idle dos objetos congelado (hover e ativo continuam). Só o sway (0,06 rad) seria um botão que não parece fazer nada. É 1 linha em `archetypes/motion.ts`.
- **Sem 3D desmonta o `<Canvas>`** (não esconde); a página que já abre nesse modo não baixa o chunk do three (`prefsLoaded` no store segura o `<Scene>` até ler o localStorage). "Ver sem 3D" virou botão (não checkbox): o painel de Ajustes só existe com o 3D ligado; a volta é "Ver em 3D →" no topo da grade.
- Trava de scroll: `lenis.stop()`; sem Lenis (reduced motion) `html:has(dialog.piece[open]) { overflow: hidden }`. `scrollbar-gutter: stable` no `html` para o layout e o canvas não mudarem de largura.
- "Anterior" / "Próxima" nas pontas usam `aria-disabled` (com `disabled` o botão em foco perdia o foco do teclado). Enter no `keydown` global dá `preventDefault` (sem isso a mesma tecla "clicava" no Fechar que o overlay acabou de focar).
- Saída do overlay em 320ms (entrada 520ms). `DRAG.spiral` = 0,002 rad/px: a peça da frente acompanha o ponteiro ~1:1.
- Skip link → `#indice`, que por enquanto é a seção provisória (a `CourseIndex` real herda o id na etapa 07).
Pendências:
- Kaique: os cursos de exemplo não têm `summary` / `learned` / `certificateUrl` — o overlay fica quase vazio até o `CURSOS.md` ser preenchido. Calibrar `stageX/Y/Scale` no `/?debug` e as sensibilidades em `DRAG`.
- Windows (barra de rolagem clássica): com o overlay aberto sobra uma faixa de ~15px de papel à direita do painel — é o espaço reservado da barra (`scrollbar-gutter`), o preço de nada se deslocar.
- Etapa 07: chips "Projetos com isso" fecham o overlay e apontam para `#projetos` (a seção ainda não existe — conferir a rolagem); `#indice` provisório; no modo sem 3D o header transparente passa por cima do texto ao rolar.
- Etapa 08: navegador sem Popover API / `@starting-style` (anterior a 2024) não abre ÍNDICE / AJUSTES e não anima o painel; Firefox fecha o overlay sem slide (não tem `overlay`). Decidir se vale fallback.
- O anel de foco aparece no "Fechar" sempre que o overlay abre (comportamento nativo do `<dialog>`).
Como testar: `npm run dev` → `http://localhost:3000`. **Teclado**: Tab (skip link) → ↓/↑ → Enter → Tab dentro do overlay → Próxima / Anterior → Esc. **Mouse**: passar numa peça (mira + animação), clicar (abre), arrastar > 5px na peça (gira, não abre), arrastar no vazio (espiral gira e volta), arrastar no palco. **URL**: `/#peca-sql-e-banco-de-dados` abre direto. **AJUSTES**: Movimento ambiente, Resetar posições, Ver sem 3D → grade → recarregar (continua) → "Ver em 3D". **Mobile** (390×844): tocar abre o bottom sheet, deslizar rola. Reduced motion: tudo funciona, sem deslizar. `npm run test` (18 testes). Screenshots em `artifacts/etapa-05-*.png` (não versionados).

### Etapa 06 — 2026-11-19 (parcial: sem a lista real de cursos)
Feito: o `CURSOS.md` ainda não tem a lista real e o Kaique pediu para seguir sem ela. Entraram só os 2 arquétipos que os cursos atuais usavam e que caíam no fallback `icon`: `Browser.tsx` (janela + barra com 3 bolinhas + 6 blocos de layout que vão da grade desktop para uma coluna mobile) e `Gears.tsx` (2 engrenagens engrenadas, 12 e 8 dentes). `archetypes/shapes.ts` (`roundedRect`, usado também pelo `Icon`), `paleClay(tint)` em `materials.ts`, registro + `/lab` (`DEFAULT_TONE`) atualizados, linhas `icon:` de fallback removidas de `courses.ts` e os SVGs `browser` / `gear` (fill) removidos de `icons.ts`, porque nenhum conteúdo usa mais.
Triângulos (high / low): browser 1.104 / 336 · gears 2.240 / 848.
Decisões:
- **Blocos do browser em `paleClay`** (tom 45% em direção ao papel), não em `clay(tint)`: na mesma argila o relevo só aparecia como linhas de sombra. O CTA em `signal` aparece bem sobre o salmão do `frontend`, então ficou signal. DESIGN §5 atualizado (regra dos materiais + linha `browser`).
- **Morph do browser**: `morph = max(hover, loop·on)`, com `loop = 0,5 − 0,5·cos(t·0,9)` (~7 s por ciclo) e `t` acumulado por `dt·on`. Cada bloco anda numa janela própria do morph (`STAGGER` 0,08), então eles não se movem juntos. O flag de hover usa `lambda` 4, mais lento que os outros, para a reorganização ser visível. Os blocos só mudam posição e escala, nunca a janela, então o `normalize` continua valendo.
- **Engrenagens**: mesmo módulo (0,1); distância entre centros = soma dos raios primitivos; a pequena começa defasada meio dente e gira a `−ω·12/8`. O chanfro é para dentro (`bevelOffset = −bevel`): sem isso os dentes engordam e se atravessam. Velocidade = `IDLE·(idle + extra)`, com o extra acumulando `dt·max(2·hover, active)`. Resultado: hover 3×, ativo 2×. Com "Movimento ambiente" desligado só a parte idle congela.
- Inclinações fixas: browser (−0,15 / 0,35 rad) e gears (0,35 / −0,3 rad), para a espessura aparecer. Ajustar no `/lab` se precisar.
- Não construí outros arquétipos "por garantia". Eles entram quando a lista real pedir.
- Resolvida a pendência dos dois `icon` girando em fase: não existe mais `icon` na espiral.
- Revisão na espiral (1440 e 390): os tamanhos aparentes de janela e engrenagens ficam próximos dos da nuvem e do banco. `frontend` e `automation` são tons parecidos, mas estão nas peças 04 e 06, sem ser vizinhos. A 1440×900 deu 60 fps (`/?debug`, GTX 1060).
Pendências:
- Kaique: lista real do `CURSOS.md` → `/ajuste` (troca `courses.ts`, faz os arquétipos que faltarem e preenche a tabela Curso → objeto). Medir FPS de novo com a espiral cheia (estimativa: ≤ 14 peças × 8,5k ≈ 120k triângulos, abaixo de 200k).
- Durante o morph do browser, blocos em trânsito se sobrepõem por um instante (mesmo plano z, mesmo material, então não aparece cintilação).
Como testar: `npm run dev` → `/lab`. Na célula `browser`, marcar `hovered` (os blocos viram coluna, um atrás do outro) e `active` (vai e volta em loop lento). Na célula `gears`, `hovered` acelera e `active` deixa em velocidade média. `reducedMotion` deixa só a escala no hover; `detail low` derruba a contagem de triângulos. Na home, a peça 04 é a janela e a 06 as engrenagens (hover, clique abre o overlay); com AJUSTES → Movimento ambiente desligado, as engrenagens fora de foco param. Screenshots em `artifacts/etapa-06-*.png` (não versionados).

### Etapa 07 — 2026-11-23
Feito: **saída coreografada** (`EXIT` em `config/spiral.ts`, `exitStagger` em `math.ts` + 3 testes): as peças sobem com stagger e somem por escala; o eixo deita, espera em `restY` e acompanha a `#linha` de `Reach`, com crossfade (`handoff`) para a linha HTML; `pastSpiral` no store apaga o palco sticky (`inert`), o véu `.spiral-fade` e fecha os popovers. **Seções** em `components/sections/`: `Reach`, `CourseIndex` (`#indice`, filtro por categoria), `Projects` (`#projetos`, prévia só em CSS), `Services` (`#sobre`), `About`, `Process`, `Contact` + `ContactDialog` (`#contato`); `layout/Footer` e `layout/Reveals` (SplitText por linha + stagger, `once`, off em reduced motion); `ui/{SecondaryCta,Wordmark,Dot,SectionHead}`, `PrimaryCta` vira link ou botão. **Conteúdo**: `site.ts` (`projects`, `index.all`, `about.people`, `contact.dialog.{close,notReady}`, `↗` fora dos textos de `PrimaryCta`), `archiveCourses()`, `projectStatusLabels` / `projectId` / `projectTone`, `lib/whatsapp.ts` (`contactMessage`, `whatsappReady()`) + `whatsapp.test.ts` (número fictício só no teste), `scrollToId`. **Overlay** aceita qualquer curso do arquivo (hash `#peca-<slug>` também); chips levam a `#projeto-<slug>`. Header com `bg-paper` + hairline em `pastSpiral || staticMode`.
Decisões:
- **Tudo é função da posição.** O 3D lê `#linha.getBoundingClientRect().top` por frame (só com o eixo deitado) e a linha HTML usa um ScrollTrigger `scrub` na mesma régua (`top 50%` → `top 42%`): nada depende de pixel fixo, e rolar para cima desfaz.
- Eixo: fase `p − round(p)` (pivô no centro na saída); a altura do mundo vem de `fov` + profundidade do eixo (`camera.z + radiusZ`) e `size.height`. O `lift` saiu do `SpiralFrame` (agora `viewHeight`): `SpiralItem` aplica `rise = t²·viewHeight` e o palco soma `y + rise`.
- Reduced motion: `stagger` 0 (todas juntas), sem vanish por escala, eixo só some por opacidade, sem ScrollTrigger na linha (HTML sempre visível). Sem 3D: linha HTML sempre visível.
- `whatsappReady()` é função (não constante) para o teste poder trocar `site.whatsapp`; `whatsapp.ts` importa `../content/site` (o vitest não tem o alias `@/`). `contactMessage` usa replacer em função: um `$&` digitado pelo visitante não vira padrão do `replace`.
- Peça do arquivo que não é da espiral: `focus` do 3D recua as peças (invisível, o índice está fora do `#cursos`), palco de véu; Nº = posição no arquivo, total = tamanho do arquivo.
- Render pausado: medido com contador de `drawElements`/`drawArrays` — 1159 draws/s no topo, 0 com `#projetos` na tela.
- O h2 de Projetos ("O que saiu do papel.") é proposta minha: revisar.
Pendências:
- Kaique: número do WhatsApp (1 linha em `site.ts`) — o diálogo está com o Enviar desabilitado até lá; teste ponta a ponta no desktop e no Android (`npm run dev -- -H 0.0.0.0`); foto, bio, redes (TODO visíveis); revisar h2 de Projetos; lista real de cursos (hoje todos são destaque: o índice não mostra nenhum fora da espiral — o caminho foi testado com 2 cursos temporários).
- Conferir no celular real o encaixe 3D → HTML (barra do navegador mexe na altura). Se ficar frágil: eixo some + linha por reveal (aviso).
- Etapa 08: Popover API / `@starting-style` em navegadores antigos (da 05); `<dialog>` de contato herda o mesmo risco.
Como testar: `npm run dev` → `http://localhost:3000`. Rolar até o fim da espiral: peças sobem uma a uma, o eixo deita no meio da tela e espera; continuar rolando até a linha de "Feito em Brasília" chegar nele (crossfade) e voltar (desfaz). Nav do header (CURSOS / PROJETOS / SOBRE / CONTATO) e skip link → índice. Índice: filtro, clicar num destaque (rola até a peça e abre). Projetos: hover mostra a prévia; chip "J.A.R.V.I.S" no overlay do curso n8n fecha e rola até a linha; "Nº 06 · Automação com n8n" volta à peça. Contato: "Chamar no WhatsApp" abre o diálogo (Esc fecha, campos obrigatórios, aviso de WhatsApp não configurado). Reduced motion (DevTools → Rendering): saída simples, sem reveals. AJUSTES → Ver sem 3D: header com fundo, linha visível. `npm run test` (24 testes). Screenshots em `artifacts/etapa-07-*.png` (não versionados).

### Etapa 08 — 2026-11-23
Feito: **Loader** (`layout/Loader.tsx`, só na home): papel + grid, "■ CATALOGANDO O ARQUIVO 000"; contador = progresso real (JS · `document.fonts.ready` · cena acesa e desenhada ou modo sem 3D), some com fade; `--z-loader`; `<noscript>` esconde. `sceneReady` no store. **SEO**: `site.seo` + `site.domain` = `site.kaiquecalefi.online`; `metadataBase`, title/description, Open Graph, Twitter em `layout.tsx`; canonical + JSON-LD `Person` (com `<` escapado) em `page.tsx`; `opengraph-image.tsx` (1200×630, gerado no build, Archivo/Plex Mono via Google Fonts com `text=`; sem rede cai na fonte padrão); `robots.ts`, `sitemap.ts` (`force-static`); `icon.svg` (■ signal) no lugar do `favicon.ico`. **404** (`app/not-found.tsx`, textos em `site.notFound`; `Wordmark` ganhou `href`). **Erros**: `SceneBoundary` em `SceneLoader` (chunk 3D ou contexto WebGL que falha → modo sem 3D, não salvo). **A11y**: anel de foco com borda ink; placeholder do contato `ink-2`; ÍNDICE/AJUSTES escondidos sem Popover API (`.needs-popover`). **Deploy**: `vercel.json` só com headers (nosniff, Referrer-Policy, X-Frame-Options DENY, Permissions-Policy).
Lighthouse (build de produção, `next start -p 3002`, `npx lighthouse@12`, sem entrar no package.json):
- Antes: desktop 86 / 100 / 100 / 100 (TBT 330 ms); mobile 50–67 (TBT 1,7–2,1 s, LCP simulado 3,2–5,7 s).
- Depois: **desktop 97 / 100 / 100 / 100** (2 rodadas iguais: LCP 0,7 s, TBT 140 ms, CLS 0); **mobile 69 / 73 / 74** em performance (LCP 3,0 s, TBT 830–940 ms, CLS 0) e 100 em a11y, boas práticas e SEO. O 404 não entra no Lighthouse (ele recusa páginas com status 404); conferido à mão e no Playwright.
Decisões:
- **Luz sem mapa de ambiente** (DESIGN §6): o `<Environment>` do drei (PMREM: 3 shaders + convolução) era a maior tarefa do carregamento (~950 ms simulados no mobile). Agora as mesmas 4 lightformers são desenhadas uma vez num cubo de 16px e viram um `LightProbe` (harmônicos esféricos, leitura assíncrona). A sonda entra vazia na cena desde o 1º frame (o shader compila uma vez só) e recebe os coeficientes depois; `<Lights>` marca `sceneReady` depois do frame aceso. Diferença no `/lab`: ≤ 2,3/255 por objeto. Some o chunk de loaders HDR/EXR do drei (123 KB). Desktop 86 → 97.
- **WebGL só depois do primeiro paint** (`SceneLoader`): `PerformanceObserver` de `paint` (FCP), com teto de 2 s. Quando o processo de GPU ainda está subindo, criar um contexto (o `hasWebGL()` e depois o canvas) travava ~200 ms e atrasava o FCP em até 1 s, e o Lighthouse mobile oscilava entre 50 e 67. Agora fica entre 69 e 74.
- **Reveals esperam `document.fonts.ready`**: dividem os títulos uma vez, já com a fonte final (antes o `autoSplit` dividia tudo de novo quando a fonte chegava).
- **N8AO testado e descartado** (pedido da etapa): tempo de GPU por frame medido com `EXT_disjoint_timer_query_webgl2` (GTX 1060, 1440×900, DPR 1 e 1,75). Mediana de 0,3–0,4 ms sem AO; com N8AO (halfRes) ~10 ms, inclusive na qualidade `performance` sem MSAA. Além disso o composer tira o tone mapping ACES (argila mais saturada) e o AO quase não aparece. `@react-three/postprocessing` e `postprocessing` desinstalados.
- **Anel de foco** (DESIGN §9): signal sobre paper dá 2,7:1 (< 3:1 do WCAG 1.4.11). Mantive o anel signal com vão de 3px e somei 1px de ink por fora (`box-shadow`: faixa paper + ink). Linhas dos popovers e segmentos do contato: anel ink. Obs.: o `transition-colors` do Tailwind também anima `outline-color` (160ms de ink → signal ao focar).
- **Sem polyfill de Popover**: sem a API (navegadores antes de 2024) os botões ÍNDICE/AJUSTES somem (`@supports not selector(:popover-open)`); o índice completo continua em `#indice`. Sem `@starting-style` só perde a animação. `<dialog>` tem suporte geral desde 2022.
- Testados e sem ganho, revertidos: ambiente a 32px e `checkShaderErrors = false`.
- `site.seo.description` e os textos do 404 são proposta minha: revisar.
Pendências:
- Kaique: deploy (passo a passo abaixo), QA no Android/Safari (checklist abaixo), WhatsApp, revisar textos novos. Seguem da 07: h2 de Projetos, lista real de cursos, foto/bio/redes.
- O aviso `THREE.Clock: This module has been deprecated` segue no console: vem de dentro do R3F 9.8.2, que já é a última versão. É aviso, não erro (Lighthouse: boas práticas 100).
- Lighthouse mobile oscila 69–74 (mediana 73). A rodada de 69 teve Speed Index alto porque o loader ficou mais tempo enquanto o GPU do Chrome headless subia. Se a nota real (PageSpeed Insights) ficar abaixo de 70: o loader passa a cobrir só a área do 3D e o texto do hero aparece na hora (decisão de design: perguntar antes).
- `npm audit`: 0 vulnerabilidades no que vai para o site; 7 moderadas só em dev (`minimatch` dentro do `typescript-eslint`).
Como testar: `npm run build && npx next start -p 3002` → `http://localhost:3002` (a 3000 é de outro projeto; o dev segue na 3001). Recarregar: o loader conta 000 → 100 e some. Tab mostra o anel signal com borda escura. `/qualquer-coisa` → 404. DevTools → Rendering → reduced motion. Sem WebGL: `chrome://flags` → WebGL desligado (ou AJUSTES → Ver sem 3D). `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/icon.svg`. Screenshots em `artifacts/etapa-08-*.png` e relatórios do Lighthouse em `artifacts/lh-final-*.json` (não versionados).

## Deploy (Kaique — sem segredos, nenhuma variável de ambiente)
1. **GitHub**: criar um repositório vazio (sem README), por exemplo `portfolio-arquivo`. Na pasta do projeto: `git remote add origin https://github.com/<seu-usuario>/portfolio-arquivo.git` e `git push -u origin main --tags`.
2. **Vercel**: vercel.com → Add New → Project → importar o repositório. O framework (Next.js) é detectado; não precisa de variável de ambiente → Deploy. O `/lab` fica 404 em produção (só abre com `NEXT_PUBLIC_LAB=1`).
3. **Domínio**: Project → Settings → Domains → adicionar `site.kaiquecalefi.online`. No painel de DNS do domínio, criar (ou trocar, se o `site` já aponta para o link atual da bio) o registro que a Vercel mostrar (CNAME `site` → valor indicado). Esperar "Valid Configuration" e o certificado SSL.
4. **Conferir no ar**: `https://site.kaiquecalefi.online/robots.txt`, `/sitemap.xml`, prévia do link colando a URL no WhatsApp/LinkedIn (imagem OG), e PageSpeed Insights (pagespeed.web.dev) na URL real.
5. Domínio diferente no futuro: troque só `site.domain` em `src/content/site.ts` (canonical, sitemap, robots, OG e JSON-LD saem dele).

## QA final
- [x] Chrome desktop 1440×900 (Playwright, build de produção): loader, espiral, overlay só no teclado (Enter / Tab / Esc, foco volta), ÍNDICE (setas, Esc, foco volta), contato (Esc, foco volta), skip link, 404, sem WebGL (grade estática), chunk 3D falhando (grade estática), sem JS (sem loader), reduced motion. Console sem erros.
- [x] 390×844 emulado (toque, DPR 2): loader e espiral.
- [ ] Android real: `npm run build && npx next start -H 0.0.0.0 -p 3002` → no celular, no mesmo Wi-Fi, `http://<IP-do-PC>:3002` (liberar o Node no firewall do Windows se pedir). Roteiro: loader some; rolar a espiral devagar e rápido (não pode encaixar sozinha: o encaixe é só de mouse); tocar no painel (abre a peça **ativa**) e numa peça (bottom sheet) e fechar — também pelo **botão Voltar** do Android, que deve fechar a peça e não sair do site (o Chrome fecha `<dialog>` pelo CloseWatcher; se sair, avisar); arrastar a peça; dicas "Deslize… · Toque…" no hero e sem "Esc" no Fechar; saída da espiral até a linha de Brasília com a barra do navegador aparecendo e sumindo; índice (abrir uma peça e fechar volta para o índice); contato.
- [ ] Safari / iPhone (se der): mesmo roteiro; conferir se o favicon (SVG) aparece.
- [ ] WhatsApp de ponta a ponta (o número já está em `site.ts`): mandar uma mensagem pelo formulário de contato e abrir o "Vamos conversar" do header.
- [ ] Depois do deploy: PageSpeed Insights mobile e desktop na URL real.

<!-- modelo:
### Etapa NN — AAAA-MM-DD
Feito: …
Decisões: …
Pendências: …
Como testar: …
-->

## Ajustes
<!-- 1 linha por /ajuste: data — o que mudou — commit -->
- 2026-11-23 — revisão 02–07: `normalize()` não quebra mais com o pai em escala 0 (peças mudavam de tamanho ao trocar de preset); `scrollToCourse` mira pela fração do ScrollTrigger (svh × innerHeight no celular); títulos não refazem o reveal no resize; brackets e ícone ativos seguem animando com "Movimento ambiente" desligado; `piece-hover` limpo ao desmontar; sem arquétipo `placeholder`, `Dot.hollow` e `projects.courses`; eixo/anel em `config/spiral.ts` (`AXIS`, `FOCUS_MARKS.ring*`); tokens `--spacing-bar(-wide)` e `--text-wordmark`. Decisões do Kaique: títulos −0.02em via `--tracking-title` (inclusive em `<span>`/`<a>`); display 0.92 e h2 0.95 (o painel ativo perdeu o 1.08); grão 4%; projetos sem ano (DESIGN §8); `#sobre` = About ("Quem constrói"), Services = `#servicos`. A máscara de linhas cortava 3px da cedilha com 0.95: agora sangra 0.15em (`.split-line-mask`, `clip-path`) e as linhas andam `MASK_TRAVEL` = 135% (`lib/split.ts`) — conferido com "Ética Çãogj" em 2 linhas: nada cortado, nada vaza escondido. Popover do ÍNDICE/AJUSTES 8px acima da barra. #4 conferido no navegador (diferença de pixels só na peça ativa com ambiente desligado, brackets e icon). Pendência: redimensionar 1440 → 390 com a página na espiral pode cair na zona de saída (a seção muda de altura em svh e o scrollY fica) — `commit fix(review)`

- 2026-11-23 — resize mantém a posição na espiral: `SpiralSection` guarda o estado (progress/hero/exit) no `refreshInit` e quando a seção muda de altura, e depois do `ScrollTrigger.refresh()` pula de volta sem animação (`progressToScroll` em `math.ts`, inverso de `scrollToProgress`, + teste). Só de dentro da seção: acima ou abaixo dela a página fica como está. Conferido: 1440 → 390 → 1440 na peça 05 (4.000 nos três) e 390×844 ↔ 844×390 em 2.202 (desvio ≤ 0.002). Dev fixo em `next dev -p 3001` (a 3000 é de outro projeto). `npm run test`: 27 testes — `fix(resize)`

- 2026-11-23 — Projetos: saiu a prévia flutuante do hover (cartão com iniciais, mais alto que a linha, vazava sobre as vizinhas e parecia placeholder sem imagem); hover = fundo paper-2 + nome anda 8px. `projectTone` removido. DESIGN §8 atualizado — `fix(projects)`

- 2026-11-23 — passe final pós-08, **defeitos** (auditados no Playwright antes de mexer):
  - o toque no painel do mobile abria a peça de trás (tocar na 01 abria a 02): o ↗ se estica sobre o painel (o painel inteiro abre a peça ativa), hero e barra têm `data-ui` (excluído em `reaches3d`) e o header segura o ponteiro;
  - fechar uma peça aberta pelo índice ou por um projeto deixava a página na espiral, com o foco num botão fora da tela: agora volta para onde estava (o chip "Projetos com isso" continua levando ao projeto). No modo sem 3D, `scrollToCourse` passou a usar `scrollToY` para o Lenis não ficar com a posição velha;
  - retrato baixo (iPhone no Safari ≈ 390×664, 375×600) batia o H1 e o painel nas cantoneiras e no anel: o `short` vale em retrato até 740px (sem eyebrow, texto menor, barra de 1 linha), e o bloco de baixo do hero desceu (`pb-24`);
  - peça +2 atrás do "03 / 06" e "Nº 02" atrás do texto do painel: faixa de papel sólido de 4rem no topo e na base + véu sólido atrás do painel no retrato (`.spiral-fade`);
  - o eixo 3D que espera riscava "DE ÁGUAS CLARAS…": `Reach` começa na linha e a frase virou a legenda dela (`figure`/`figcaption`);
  - dicas de mouse em tablet/celular deitado (o arraste é só de mouse): dicas por tipo de ponteiro;
  - linhas de Projetos com hover sem link;
  - link do wordmark com 487px (header) e a largura toda (footer);
  - loader sem saída se a cena nunca marcasse pronta: teto de 8s;
  - mensagem "Quero um(a) outro": "Assunto: {tipo}";
  - faixa de 15px ao lado do overlay no Windows: fundo do html paper-2 com a peça aberta.

  — `fix(ux)`
- 2026-11-23 — passe final pós-08, **interações**:
  - encaixe suave na peça mais próxima depois que o scroll para (mouse/trackpad; fora do hero e da saída; sem reduced motion; `SNAP` em `config/spiral.ts`);
  - em retrato as dicas ficam só no hero; "Esc" escondido no toque;
  - pressão em todo controle (`active:` = fundo do hover, e escala 0.97 nos botões soltos), porque no toque não havia resposta nenhuma;
  - ←/→ no overlay;
  - foco inicial no próprio diálogo (peça, contato e menu): acabou o anel no "Fechar" a cada abertura (pendência da etapa 05);
  - `SecondaryCta` único (hero com alvo de 40px, redes, certificado);
  - `text-wrap: pretty/balance`;
  - scrollbar e tap highlight na paleta.

  Verificado:
  - typecheck, lint, 27 testes e build;
  - Playwright em 1440×900, 1366×768, 1920×1080, 390×844, 390×664, 375×600, 360×720, 844×390 e contexto de toque;
  - detector do Impeccable: só os 2 alertas fixados pelo DESIGN (papel creme, eyebrow do hero no desktop);
  - Lighthouse não foi refeito.

  — `fix(ux)`
- 2026-11-23 — WhatsApp (5561994028229), GitHub e LinkedIn em `site.ts`: os CTAs do header e de Brasília abrem o `wa.me`, o formulário de contato envia e as redes viram links (e entram no `sameAs` do JSON-LD); redes do Sobre alinhadas pelo centro (o "Instagram · TODO" ficava mais alto que os links novos) — `tweak`
- 2026-11-24 — Ajustes pós-deploy: (1) o hero sai acompanhando o scroll (`heroProgress` no store, `HERO_FADE_FROM`→`HERO_UNTIL`, style escrito por `subscribe`, sem re-render) e o painel da peça 01 entra depois (delay = `--duration-ui`); reduced motion mantém o fade por tempo; (2) Full Stack TypeScript saiu da espiral (`featured: false`, segue no índice): 6 peças; (3) a linha que sai da espiral virou "Estudo · Construo · Entrego · Seu negócio" (`site.reach`, destaque no último ponto, `STOPS` iguais); `seo.locality` e a meta description seguem com Brasília (SEO local, não aparece na tela); (4–5) SQL 2026, n8n 2024; (6) 10 projetos (Prospector e Clínica como `conceito`, sem link; o link do Ferro & Fio antigo dava 404, a barbearia usa `base-barbearias.vercel.app`); (7) no modo sem 3D, "Ver em 3D →" também no hero (ou o motivo, sem WebGL); (8) fundo com pontos a cada 64px no lugar da grade — `fix(ux)`
- 2026-11-24 — Prévia nos projetos, foto do Sobre e menos vazio: (1) `ProjectPreview`: cartão com o print que segue o cursor (quickTo, inclinação ±6°, só ponteiro fino, foco por teclado fixa na linha, reduced motion sem animar); 7 prints em `public/images/projects/` (896×560); NeoVian OS, Prospector e Clínica ficam sem print (sem URL pública) — é só soltar `<slug>.jpg` e preencher `image` em `projects.ts`; (2) Sobre: foto em 5 colunas com a altura do bloco de texto (`wide:self-stretch`), sem a coluna vazia; recorte `object-[50%_30%]` pra não cortar o queixo; (3) seções com `pt-section` (não somam mais o padding), `mt-8` entre cabeçalho e conteúdo, Contato com `pb-12`; DESIGN §2 e §8 corrigidos. Pendência: `kaique.jpg` tem 640×853 e ocupa ~533px de largura: nítida em tela 1x, levemente suave em retina; se incomodar, trocar por uma foto maior — `fix(ux)`
- 2026-11-24 — Ajustes: (1) linha de projeto com link inteira clicável (o ↗ é um link esticado com `after:absolute after:inset-0`; cursor de mãozinha; botões de curso ficam por cima com `z-10`); sem link, nada reage; (2) foto do Sobre volta a 4:5 em 4 colunas, alinhada ao centro do texto: esticar até a altura do texto cortava o rosto em telas largas; (3) `--spacing-section` subiu para `clamp(96px, 11vh, 144px)` — `fix(ux)`
