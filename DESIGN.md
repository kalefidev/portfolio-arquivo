# DESIGN.md — "Arquivo de Estudos"

> Fonte da verdade visual. Mudou uma decisão? Atualize a linha aqui na mesma sessão.

## §1 Conceito
O portfólio é um **arquivo técnico**: cada curso é uma *peça catalogada* ("PEÇA Nº 03 / 12"), mostrada como objeto 3D de argila fosca numa espiral e anotada como desenho técnico (cotas, linhas-guia, marcas de registro).
É o oposto da referência de propósito: lá é escuro, espacial, foto lunar e vidro; aqui é **papel claro, tinta, linhas finas e um laranja de sinalização**.
Três palavras: preciso · tátil · curioso.

## §2 Tokens
### Cores — fonte única em `globals.css` (@theme); o 3D lê as mesmas variáveis
| token | valor | uso |
|---|---|---|
| `--color-paper` | `#ECE9E2` | fundo do site **e** fundo da cena 3D |
| `--color-paper-2` | `#E3DFD6` | superfícies (overlay, menus, hover de linha) |
| `--color-ink` | `#151515` | texto, linhas fortes |
| `--color-ink-2` | `#5E5B55` | texto secundário (AA sobre paper) |
| `--color-ink-3` | `#8C8880` | só decorativo / legendas grandes |
| `--color-line` | `rgb(21 21 21 / 0.14)` | hairlines, grid |
| `--color-signal` | `#FF4D1A` | acento: peça ativa, CTA primário, foco |

Regra: `signal` nunca é cor de texto pequeno (contraste baixo). Texto sobre `signal` é sempre `ink`.

Tons de argila por categoria (`--color-cat-<categoria>`):
cloud `#A8C0DA` · security `#D9A441` · frontend `#E2937F` · backend `#8DB39A` · data `#A99BD0` · automation `#E7B27C` · ai `#9CC7C1` · devops `#9BA3AE` · design `#E3A9C0` · fundamentals `#D8CFBF` · hardware `#B9A27E`

### Tipografia (next/font/google)
- **Archivo** (variável, eixos `wght` + `wdth`) — títulos com `wdth` 112–125, peso 600–750, tracking −0.02em (token `--tracking-title`, também nos títulos em `<span>`/`<a>`), entrelinha 0.92 no display e 0.95 no h2; texto corrido com `wdth` 100, peso 400.
- **IBM Plex Mono** 400/500 — rótulos técnicos em CAIXA ALTA, tracking 0.08em, 11–13px.

Escala: display `clamp(2.75rem, min(6.2vw, 12vh), 6.5rem)` (o `12vh` só pesa em janela baixa) · h2 `clamp(2rem, 4vw, 3.75rem)` · h3 `1.5rem` · corpo `1.0625rem/1.55` · pequeno `0.875rem` · rótulo `0.75rem` mono.

### Forma, linha, espaço
- Raio 0–2px (nada de pílula). Bordas 1px `--color-line`. Nenhuma sombra na UI.
- Grid de 12 colunas; margem lateral `clamp(16px, 4vw, 56px)`; respiro de seção `clamp(96px, 14vh, 180px)`.
- Textura: grid técnico de 64px (hairline ~5%) + grão SVG ~4%, num overlay fixo com `pointer-events: none`, **por cima** do canvas e abaixo da UI.
- Ícones de UI: setas tipográficas (↗ → ↓) e Phosphor (peso regular) quando precisar.

## §3 Layout da seção da espiral (tela fixa enquanto rola)
Desktop:
- **Header**: wordmark `kaique calefi■` (■ em signal) à esquerda · nav em mono separada por hairlines (CURSOS · PROJETOS · SOBRE · CONTATO → `#cursos`, `#projetos`, `#sobre` = "Quem constrói", `#contato`; "O que eu faço" é `#servicos`, fora da nav) · CTA retangular signal "VAMOS CONVERSAR ↗". Transparente sobre a espiral; ganha fundo `paper` + hairline embaixo quando as seções passam por baixo (`pastSpiral`) e no modo sem 3D.
- **Coluna esquerda** (cols 1–5): no começo, o hero (eyebrow + H1 + sub + "Explorar o arquivo ↓"). O hero tem uma **zona de entrada** (`heroZone`, 25% da tela de rolagem) em que a espiral fica parada na peça 01; a 40% dela (`HERO_UNTIL`) ele troca pelo **painel da peça ativa** (e volta ao subir). Assim a peça 01 ganha o painel ainda centralizada.
- **Espiral**: eixo em ~62% da largura; a peça ativa fica à frente, no centro-direita.
- **Borda direita — régua**: linha vertical com 1 tique por peça (tiques para o lado da espiral); ativa = tique longo em signal + "Nº 03" do lado de fora da linha (onde nenhum callout alcança); clique no tique leva à peça. Rótulo vertical "ARQUIVO DE ESTUDOS" embaixo da régua. Os tiques se apertam se a tela for baixa demais para todos.
- **Barra inferior**: dicas em mono à esquerda · controle segmentado central "☰ ÍNDICE | ⚙ AJUSTES" · contador "03 / 12" com barrinha de progresso à direita.
- Gradiente de papel atrás da coluna esquerda (paper 85% → 0) para o texto continuar legível quando um objeto passar atrás. Fica na camada do canvas (abaixo do grão), para o grid técnico continuar por cima; no mobile o gradiente sobe de baixo, atrás da faixa do painel. Mais um fade de papel de 6rem no topo e na base: peça que passa ali some no papel em vez de ficar atrás do header ou da barra (`.spiral-fade`).

Mobile (tela em pé, proporção < 4:5 — a mesma regra do preset mobile da espiral, variante `wide:` no CSS; só o header troca por largura, em 768px): eixo centralizado; hero dividido (título acima da peça, texto + botão abaixo); o painel da peça vira faixa logo acima da barra inferior; régua some (o contador basta); dicas: "Deslize para navegar · Toque numa peça".

Painel da peça ativa:
```
PEÇA Nº 03 / 12 ─────────────
AWS Cloud                  ↗
Practitioner
AWS Skill Builder · 2026 · 20h
● CLOUD
```
- **Callout** de cada objeto (drei `<Html>`): "Nº 03 — AWS CLOUD" no estilo rótulo (mono 12px) + linha-guia (diagonal curta + horizontal). Sai para cima-direita; nas peças do lado direito da hélice vira para baixo-esquerda (não sai da tela nem bate nas cantoneiras), com fade na virada. Some quando |d| > 2. Não capta ponteiro. Abaixo de 1280px de largura (e no mobile) mostra só "Nº 03"; o título tem largura máxima e reticências para nunca chegar na régua.
- **Peça ativa**: 4 cantoneiras (marcas de registro) em signal em volta + anel fino em signal embaixo do objeto.

## §4 Espiral
### Matemática — função pura em `src/three/spiral/math.ts`, coberta por testes
Item `i`, progresso contínuo `p` (0 … N−1):
```
d     = i - p                          // 0 = ativa; < 0 já passou (sobe); > 0 próximas (descem)
θ     = d * angleStep + dragOffset + ambientSway
x     = axisX + radiusX * sin(θ)
y     = -d * pitch
z     = radiusZ * (cos(θ) - 1)         // ativa em z = 0, as demais vão para trás; câmera fixa
focus = 1 - smoothstep(0, 1, |d|)      // 1 na ativa, 0 a partir de 1 peça de distância
scale = (baseScale + (activeScale - baseScale) * focus) * vis
vis   = 1 - smoothstep(visibleRange - 1, visibleRange, |d|)   // vis ≈ 0 → visible = false
```
- Damping no **progresso** (um `THREE.MathUtils.damp` por frame, lambda = `damping`); posição e escala saem do progresso amortecido, então as peças nunca saem do trilho. Os parâmetros também são amortecidos em direção ao preset ativo (`PRESET_LAMBDA`) — é isso que suaviza a troca desktop ↔ mobile e os sliders do debug.
- `ambientSway` é oscilação suave, **nunca rotação contínua** (tiraria a peça ativa da frente).
- `dragOffset` (arraste do mouse no vazio) e o giro de cada peça (arraste sobre ela) vivem em `src/three/spiral/drag.ts` — módulo mutável lido no `useFrame`, fora do store. Inércia com atrito; a espiral volta a 0 por `dragReturn`, o giro da peça fica até "Resetar posições". Sensibilidades e limites em `DRAG` (`config/spiral.ts`). Toque não arrasta a espiral (rola a página).
- **Modo foco** (peça aberta no overlay): a peça interpola até o **palco** (`stageX` / `stageY` = fração da tela, `stageScale`); as outras recuam `FOCUS_MODE.recede` em z, para dentro do fog (os materiais são compartilhados: não existe opacidade por peça); eixo, trilho, cantoneiras e callouts somem por opacidade. A peça aberta é sempre a ativa: abrir / anterior / próxima salta o scroll até ela e o damping do progresso suaviza.
- Unidades de mundo: câmera fov 35 em z = 10 vê ~6.3 unidades de altura.

### Parâmetros — `src/config/spiral.ts` (valores iniciais; calibrar em `/?debug`)
| parâmetro | desktop | mobile | comparado à referência (estimado) |
|---|---|---|---|
| `radiusX` | 3.6 | 1.15 | **bem maior** → espiral abre pros lados |
| `radiusZ` | 2.2 | 1.4 | elíptica: mais larga sem afundar demais |
| `angleStep` | 55° | 50° | mais giro por peça |
| `pitch` | 1.9 | 2.3 | descida por peça |
| `scrollPerItem` | 75vh | 70vh | **menor = anda mais a cada rolagem** (ref. ≈ 100vh) |
| `axisX` | 1.2 | 0 | eixo à direita no desktop |
| `baseScale` / `activeScale` | 0.78 / 1.2 | 0.6 / 0.9 | |
| `visibleRange` | 3.5 | 2.5 | |
| `damping` | 6 | 6 | |
| `dragReturn` | 0.6 | — | giro do arraste volta devagar |
| `heroZone` | 0.25 | 0.25 | scroll antes de a espiral começar a girar: hero → painel da peça 01 (fração da viewport) |
| `exitZone` | 0.6 | 0.6 | scroll extra após a última peça (fração da viewport) |
| `fogNear` / `fogFar` | 10 / 17 | 11 / 17 | profundidade (a partir da câmera) em que a peça começa a sumir / vira papel |
| `dpr` | 1.75 | 1.5 | teto do device pixel ratio do canvas |
| `stageX` / `stageY` | 0.28 / 0.5 | 0.5 / 0.2 | centro do palco do modo foco (fração da largura / altura da tela): o meio do que o overlay deixa livre |
| `stageScale` | 1.7 | 1.1 | escala da peça no palco |
| câmera | fov 35, z 10 | fov 40, z 11 | |

- Altura da seção: `100svh + heroZone + (N − 1) × scrollPerItem + exitZone` (25svh de entrada do hero; 60svh finais = zona de saída).
- Preset: `aspect < 0.8` → mobile (transição suave no resize).

### Desenho
- **Eixo**: hairline vertical tracejada, tiques a cada `pitch` (cara de régua), ink 30%.
- **Trilho**: a curva da hélice desenhada como linha pontilhada fina (ink 18%, pontos de 2px, 36 por peça) passando pelas peças, da primeira à última, com uma folga de 30% do passo de cada lado de cada peça (o trilho nunca cruza um objeto).
- **Profundidade**: fog na cor do papel → peças distantes "somem no papel". `scene.background` = `--color-paper`; se o fundo e as peças distantes não casarem, ajuste a cor do fog.

## §5 Objetos 3D (arquétipos)
Regras:
- Procedurais: primitivas, `ExtrudeGeometry`, `LatheGeometry`, `TubeGeometry`, `SVGLoader`. Sem GLB, sem HDR externo, sem textura baixada (`CanvasTexture` gerada em código pode).
- Normalizados: centrados na origem, cabem numa esfera de raio 1.
- Material argila: `MeshStandardMaterial` roughness 0.82, metalness 0, cor = tom da categoria. Detalhes em `ink` (roughness 0.6) ou `signal` (emissivo baixo); relevo sobre uma face do mesmo tom usa `paleClay` (tom 45% em direção ao papel — no mesmo tom o relevo some). Materiais em cache compartilhado.
- ≤ 15k triângulos por objeto. Hit area = esfera invisível r = 1 (raycast barato).
- Props: `{ tint, hovered, active, reducedMotion, detail: 'low' | 'high', variant?, icon? }`. Cada arquétipo anima a si mesmo (idle / hover / ativo) com progresso amortecido (`useDampedFlag`).
- `reducedMotion`: sem idle; hover vira só escala leve.

Catálogo — a chave vai no campo `archetype` de `courses.ts`:
| chave | objeto | cursos típicos | receita | idle | hover | ativo |
|---|---|---|---|---|---|---|
| `cloud` | nuvem | AWS, Azure, GCP | 6–8 esferas agrupadas e achatadas (Y × 0.75) | flutua | cubinhos "pacote" sobem e somem (upload) | gira lento + pacotes em loop |
| `shield` | escudo | Cyber, segurança, LGPD | contorno de escudo → Extrude com chanfro + fechadura em relevo | balança ±8° | anel de varredura signal desce de cima a baixo | borda com emissivo signal leve |
| `lock` | cadeado | criptografia, autenticação | RoundedBox + haste (Torus meio arco) | balança | haste sobe e gira (abre) | abre/fecha a cada 3s |
| `brackets` | `</>` | lógica, JS, Python | 3 formas extrudadas com chanfro | balança ±26° (giro completo mostraria `</>` espelhado e de perfil) | `<` e `>` se afastam, `/` gira, cursor piscando no meio | pulso |
| `browser` | janela de navegador | HTML/CSS, React, front-end | janela (retângulo arredondado → Extrude com chanfro) + barra com 3 bolinhas ink + 6 blocos de layout em relevo `paleClay`, um deles o CTA em signal; inclinada para a espessura aparecer | parado | blocos se reorganizam, um atrás do outro (grade desktop → coluna mobile) | reorganiza em loop lento (~7 s) |
| `database` | banco de dados | SQL, Postgres, NoSQL | 3 discos (Lathe, borda arredondada) empilhados com folga + aro ink + luz signal em cada (é a luz que deixa o giro visível); inclinado 17° para a câmera | parado | discos se separam e giram em velocidades diferentes | gira suave |
| `gears` | engrenagens | automação, n8n, RPA | 2 engrenagens engrenadas (contorno com dentes trapezoidais + furo → Extrude, chanfro para dentro), mesmo módulo, 12 e 8 dentes, eixo ink em cada; inclinadas para a espessura aparecer | giram lento | aceleram 3× | velocidade média (2×) |
| `neural` | rede neural | IA, LLM, agentes | 12–18 nós em 3 camadas + arestas | nós pulsam | pulsos signal correm pelas arestas | pulsos contínuos |
| `terminal` | terminal | Linux, CLI, DevOps | monitor + tela `CanvasTexture` com `>_` | cursor pisca | digita `npm run dev` | digita em loop |
| `containers` | contêineres | Docker, Kubernetes | 3–4 caixas com frisos, empilhadas | parado | trocam de lugar com saltinho | flutuação alternada |
| `server` | servidor | back-end, Node, APIs | rack com gavetas + LEDs emissivos | LEDs aleatórios | LEDs em cascata | cascata lenta |
| `chart` | gráfico | dados, Excel, BI | base + 5 barras | parado | barras animam para novos valores | oscilam |
| `git-branch` | ramos | Git, GitHub | Tube (CatmullRom) tronco + 2 ramos + nós | parado | um ramo novo cresce (drawRange) | ramos pulsam |
| `chip` | chip | eletrônica, IoT | placa + pinos + trilhas em relevo | parado | trilhas acendem em sequência | brilho lento |
| `palette` | paleta | design, UX/UI, Figma | 5 amostras presas num pino, em leque | levemente aberta | leque abre ~120° | abre/fecha lento |
| `bulb` | lâmpada | lógica, soft skills, carreira | Lathe (bulbo + rosca) | parado | acende (emissivo quente + halo) | acesa suave |
| `icon` | ícone extrudado | qualquer outro tema | ícone Phosphor peso `fill` → SVGLoader → Extrude nas duas faces de uma placa chanfrada (nome registrado em `archetypes/icons.ts`) | gira lento | gira 360° com salto | gira lento |

Dois cursos da espiral no mesmo arquétipo → usar `variant` para não repetir igual (ex.: nuvem com raio, nuvem com servidor).

## §6 Iluminação
Uma "sala" procedural (sem HDR externo): softbox grande no topo, key quente `#FFF1E0` (`--color-light-key`) à esquerda, rim frio `#DCE8FF` (`--color-light-rim`) atrás-direita e papel bem fraco em volta (rebatido, para nenhuma face ficar preta), + 1 directional fraca. A sala é desenhada **uma vez** num cubo de 16px e guardada como `LightProbe` (harmônicos esféricos: a luz difusa dela). Sem mapa de ambiente: o pré-filtro (PMREM) custava ~0,6 s de thread principal no celular do Lighthouse, para reflexos que a argila (rugosidade 0,82) quase não mostra — diferença medida no `/lab`: ≤ 2,3/255 por objeto. Sem sombra em tempo real, sem pós-processamento (N8AO testado e descartado na etapa 08). Tone mapping padrão do R3F.
Meta: argila fosca com volume legível, nada estourado contra o papel claro.

## §7 Motion
- Easing UI `cubic-bezier(0.16, 1, 0.3, 1)` (entrada) · `cubic-bezier(0.7, 0, 0.84, 0)` (saída).
- Durações: micro 160ms · UI 320ms · títulos 640ms · overlay 520ms.
- Troca de peça ativa: título sai para cima com máscara, o novo entra de baixo, linhas com stagger de 60ms (SplitText); metadados em fade 200ms depois.
- Scroll: Lenis (lerp ~0.1) no ticker do GSAP; touch nativo (`syncTouch: false`).
- Hover em objeto: cursor vira mira (crosshair) + callout destacado + animação do arquétipo.
- **Saída da espiral** (`EXIT` em `config/spiral.ts`; `exit` = `exitProgress`, 0 … 1): as peças sobem com stagger (`exitStagger`: a visível mais alta sai primeiro, a ativa por último, depois de `stagger` 0.5), aceleram (`rise = t²·altura da tela`) e somem por **escala** (a partir de `vanishFrom` 0.4), nunca por opacidade. As cantoneiras somem antes de a ativa subir; o trilho some por opacidade. O **eixo deita** (`lieFrom` 0.3: `rotation.z = lie·π/2`, os tiques viram marcas de régua), sobe/desce até `restY` (50%) da tela e **espera** lá; quando a linha HTML (`#linha`, em `Reach`) chega nessa altura, o eixo a acompanha (`min(restY·altura, top da #linha)`, convertido para mundo na profundidade do eixo) e faz crossfade com ela ao longo de `handoff` (8% da tela). Os dois lados leem a posição real da `#linha` no DOM (nenhum pixel mágico) e tudo é função da posição: rolar de volta desfaz. A UI da espiral (palco sticky, véu `.spiral-fade`) sai junto, em `uiOut` 0.5 (`pastSpiral`). Se o encaixe 3D → HTML ficar frágil num navegador: o eixo some e a linha entra por reveal.
- **Reveals** das seções (`layout/Reveals.tsx`): títulos `[data-reveal="lines"]` por linha com máscara (stagger 60ms), listas `[data-reveal="stagger"]` com opacidade + y 16px; ScrollTrigger em `top 85%`, uma vez só.
- `prefers-reduced-motion`: sem sway, SplitText vira fade, damping alto (`REDUCED_DAMPING`: progresso e modo foco chegam quase na hora), arraste sem inércia, overlay, menus e diálogo sem slide, sem saída coreografada (todas as peças sobem juntas, o eixo só some por opacidade e a linha HTML fica sempre visível), sem reveals, Lenis desligado.

## §8 Componentes
- **CTA primário**: retângulo signal, texto ink em mono caixa alta + ↗; hover: seta anda 2px e fundo escurece 6%.
- **CTA secundário**: texto + sublinhado hairline que cresce no hover.
- **Linha de índice** (cursos e projetos): `Nº | nome (display 1.5rem) | instituição ou tipo | ano | ● status | ↗` — projetos sem a coluna de ano, hairlines entre linhas; hover: fundo paper-2 e nome anda 8px. Numeração: destaques primeiro, na mesma ordem e número da espiral; depois os demais.
- **Projetos**: sem prévia flutuante (o cartão de iniciais saiu: sem imagem real parecia placeholder e vazava sobre as linhas vizinhas). Volta quando houver imagem dos projetos. Os cursos relacionados são botões "Nº 06 · Automação com n8n" que abrem a peça.
- **Diálogo de contato** (`ContactDialog`): `<dialog>` modal centrado sobre véu de papel (Lenis parado, Esc fecha). Nome e mensagem obrigatórios, tipo em rádio segmentado (Site / Automação / Sistema / Outro). Enviar abre `wa.me` com a mensagem montada (`contactMessage`), sem backend; enquanto o número do `site.ts` for TODO o botão fica desabilitado, com o aviso "WhatsApp ainda não configurado".
- **Overlay da peça** (clique, Enter ou ↗): `<dialog>` modal em tela cheia e transparente — painel paper-2 à direita (desktop, 44vw) ou bottom sheet (mobile, 62svh). A peça vai para o "palco" (a parte livre), maior, e gira no arraste (mouse e toque); as demais recuam e somem no papel; header e UI da espiral somem junto. Conteúdo: Nº, título, instituição · ano · horas · status, resumo, "O que aprendi" (3–5 itens), "Projetos com isso" (chips), "Ver certificado ↗", anterior / próxima, fechar (Esc). Campo vazio não aparece. A URL ganha `#peca-<slug>` (abre direto ao carregar). Serve para qualquer curso do arquivo: um que não é peça da espiral abre com o véu de papel no lugar do palco, Nº e total do arquivo e anterior / próxima só entre os não destaques. Os chips "Projetos com isso" levam à linha `#projeto-<slug>`. Entra em 520ms, sai em 320ms.
- **Ajustes** (popover acima da barra): Movimento ambiente (sway da espiral + idle dos objetos; hover e ativo continuam) · Resetar posições (espiral e giros voltam a 0, animado) · Ver sem 3D. Lembrados em localStorage.
- **Índice (menu)** (popover acima da barra): lista Nº + nome, atual marcada com ■ signal; clique rola até a peça; ↑/↓/Home/End.
- **Sem 3D** (Ajustes, ou automático sem WebGL): o canvas é desmontado e `#cursos` vira hero + grade de cartões (Nº, ícone Phosphor do arquétipo, nome, instituição · ano, categoria) que abrem o mesmo overlay, com véu de papel no lugar do palco. "Ver em 3D →" no topo da grade.
- **Loader**: "CATALOGANDO O ARQUIVO 064" (■ signal + rótulo mono + contador de 3 dígitos), papel com o grid, no centro. O contador é progresso real em 3 marcos — JS rodou · fontes prontas · cena 3D acesa e desenhada (ou modo sem 3D) — e anda até o marco em 320ms; some com fade de 520ms. Uma vez por carregamento, só na home, `aria-hidden`; sem JS não aparece. Sem tempo fake.

## §9 Acessibilidade
Canvas `aria-hidden`; tudo que o 3D mostra existe em HTML (índice + modo sem 3D). Foco: outline 2px signal, offset 3px, com borda de 1px ink por fora (`box-shadow`: faixa paper no vão + ink) — signal sobre paper dá 2,7:1, a borda garante o 3:1 do WCAG 1.4.11; dentro dos popovers e nos segmentos do contato, anel ink. Teclado: ↑/↓ ou ←/→ navegam peças (com o palco fixo na tela e o foco fora de campo, menu ou diálogo; nas pontas o scroll nativo sai da seção), Enter abre a ativa, Esc fecha. Skip link "Pular para o índice". Contraste AA em todo texto.

## §10 Não fazer
Fundo escuro/espacial, vidro, neon, gradiente roxo "de IA", pílulas, emoji na UI, texto em signal, qualquer código/texto/imagem/logo da referência.
