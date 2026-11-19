# PROGRESS.md — estado e handoff entre sessões

> O Code lê isto no começo de toda sessão e atualiza no fim de toda etapa. Curto e factual.

## Estado atual
- Etapa atual: 07 — Seções + saída da espiral
- Última tag: etapa-06
- Bloqueios / pendências do Kaique: lista real do `docs/CURSOS.md` → `/ajuste` (courses.ts + arquétipos que faltarem); revisar `docs/CONTEUDO.md`

## Etapas
- [x] 01 Fundação
- [x] 02 Espiral 3D
- [x] 03 Objetos 3D (parte 1) + /lab
- [x] 04 Interface da espiral
- [x] 05 Interações, overlay e modos
- [x] 06 Objetos 3D (parte 2) (parcial: lista real pendente)
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

<!-- modelo:
### Etapa NN — AAAA-MM-DD
Feito: …
Decisões: …
Pendências: …
Como testar: …
-->

## Ajustes
<!-- 1 linha por /ajuste: data — o que mudou — commit -->
