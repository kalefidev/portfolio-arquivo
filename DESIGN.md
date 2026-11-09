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
- **Archivo** (variável, eixos `wght` + `wdth`) — títulos com `wdth` 112–125, peso 600–750, tracking −0.02em, entrelinha 0.92; texto corrido com `wdth` 100, peso 400.
- **IBM Plex Mono** 400/500 — rótulos técnicos em CAIXA ALTA, tracking 0.08em, 11–13px.

Escala: display `clamp(2.75rem, 6.2vw, 6.5rem)` · h2 `clamp(2rem, 4vw, 3.75rem)` · h3 `1.5rem` · corpo `1.0625rem/1.55` · pequeno `0.875rem` · rótulo `0.75rem` mono.

### Forma, linha, espaço
- Raio 0–2px (nada de pílula). Bordas 1px `--color-line`. Nenhuma sombra na UI.
- Grid de 12 colunas; margem lateral `clamp(16px, 4vw, 56px)`; respiro de seção `clamp(96px, 14vh, 180px)`.
- Textura: grid técnico de 64px (hairline ~5%) + grão SVG ~4%, num overlay fixo com `pointer-events: none`, **por cima** do canvas e abaixo da UI.
- Ícones de UI: setas tipográficas (↗ → ↓) e Phosphor (peso regular) quando precisar.

## §3 Layout da seção da espiral (tela fixa enquanto rola)
Desktop:
- **Header**: wordmark `kaique calefi■` (■ em signal) à esquerda · nav em mono separada por hairlines (CURSOS · PROJETOS · SOBRE · CONTATO) · CTA retangular signal "VAMOS CONVERSAR ↗".
- **Coluna esquerda** (cols 1–5): no começo, o hero (eyebrow + H1 + sub + "Explorar o arquivo ↓"). Quando `progress > 0.35`, troca pelo **painel da peça ativa** (e volta ao subir).
- **Espiral**: eixo em ~62% da largura; a peça ativa fica à frente, no centro-direita.
- **Borda direita — régua**: linha vertical com 1 tique por peça; ativa = tique longo em signal + "Nº 03"; clique no tique leva à peça. Rótulo vertical "ARQUIVO DE ESTUDOS".
- **Barra inferior**: dicas em mono à esquerda · controle segmentado central "☰ ÍNDICE | ⚙ AJUSTES" · contador "03 / 12" com barrinha de progresso à direita.
- Gradiente de papel atrás da coluna esquerda (paper 85% → 0) para o texto continuar legível quando um objeto passar atrás.

Mobile (< 768px): eixo centralizado; o painel da peça vira faixa logo acima da barra inferior; régua some (o contador basta); dicas: "Deslize para navegar · Toque numa peça".

Painel da peça ativa:
```
PEÇA Nº 03 / 12 ─────────────
AWS Cloud                  ↗
Practitioner
AWS Skill Builder · 2026 · 20h
● CLOUD
```
- **Callout** de cada objeto (drei `<Html>`): "Nº 03 — AWS CLOUD" em mono 11px + linha-guia (diagonal curta + horizontal). Some quando |d| > 2. Não capta ponteiro.
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
| `exitZone` | 0.6 | 0.6 | scroll extra após a última peça (fração da viewport) |
| `fogNear` / `fogFar` | 10 / 17 | 11 / 17 | profundidade (a partir da câmera) em que a peça começa a sumir / vira papel |
| `dpr` | 1.75 | 1.5 | teto do device pixel ratio do canvas |
| câmera | fov 35, z 10 | fov 40, z 11 | |

- Altura da seção: `100svh + (N − 1) × scrollPerItem + 60svh` (os 60svh finais = zona de saída).
- Preset: `aspect < 0.8` → mobile (transição suave no resize).

### Desenho
- **Eixo**: hairline vertical tracejada, tiques a cada `pitch` (cara de régua), ink 30%.
- **Trilho**: a curva da hélice desenhada como linha pontilhada fina (ink 18%, pontos de 2px, 36 por peça) passando pelas peças, da primeira à última.
- **Profundidade**: fog na cor do papel → peças distantes "somem no papel". `scene.background` = `--color-paper`; se o fundo e as peças distantes não casarem, ajuste a cor do fog.

## §5 Objetos 3D (arquétipos)
Regras:
- Procedurais: primitivas, `ExtrudeGeometry`, `LatheGeometry`, `TubeGeometry`, `SVGLoader`. Sem GLB, sem HDR externo, sem textura baixada (`CanvasTexture` gerada em código pode).
- Normalizados: centrados na origem, cabem numa esfera de raio 1.
- Material argila: `MeshStandardMaterial` roughness 0.82, metalness 0, cor = tom da categoria. Detalhes em `ink` (roughness 0.6) ou `signal` (emissivo baixo). Materiais em cache compartilhado.
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
| `browser` | janela de navegador | HTML/CSS, React, front-end | tela fina + barra com 3 bolinhas + blocos de layout | parado | blocos se reorganizam (desktop → mobile) | reorganiza em loop lento |
| `database` | banco de dados | SQL, Postgres, NoSQL | 3 discos (Lathe, borda arredondada) empilhados com folga + aro ink + luz signal em cada (é a luz que deixa o giro visível); inclinado 17° para a câmera | parado | discos se separam e giram em velocidades diferentes | gira suave |
| `gears` | engrenagens | automação, n8n, RPA | 2 engrenagens (contorno dentado → Extrude) engrenadas | giram lento | aceleram 3× | velocidade média |
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
| `placeholder` | poliedro facetado | provisório (etapa 02) | Icosahedron detail 1, flatShading | gira lento | escala 1.08 | — |

Dois cursos da espiral no mesmo arquétipo → usar `variant` para não repetir igual (ex.: nuvem com raio, nuvem com servidor).

## §6 Iluminação
Environment só com `<Lightformer>` (sem HDR externo): softbox grande no topo, key quente `#FFF1E0` (`--color-light-key`) à esquerda, rim frio `#DCE8FF` (`--color-light-rim`) atrás-direita, uma "sala" de papel bem fraca em volta (rebatida, para nenhuma face ficar preta) + 1 directional fraca. Sem sombra em tempo real. Tone mapping padrão do R3F.
Meta: argila fosca com volume legível, nada estourado contra o papel claro.

## §7 Motion
- Easing UI `cubic-bezier(0.16, 1, 0.3, 1)` (entrada) · `cubic-bezier(0.7, 0, 0.84, 0)` (saída).
- Durações: micro 160ms · UI 320ms · títulos 640ms · overlay 520ms.
- Troca de peça ativa: título sai para cima com máscara, o novo entra de baixo, linhas com stagger de 60ms (SplitText); metadados em fade 200ms depois.
- Scroll: Lenis (lerp ~0.1) no ticker do GSAP; touch nativo (`syncTouch: false`).
- Hover em objeto: cursor vira mira (crosshair) + callout destacado + animação do arquétipo.
- Saída da espiral: peças sobem com stagger e somem; o eixo vertical "deita" e vira a linha horizontal da seção seguinte (se ficar frágil, fade simples).
- `prefers-reduced-motion`: sem sway, SplitText vira fade, damping alto, sem saída coreografada, Lenis desligado.

## §8 Componentes
- **CTA primário**: retângulo signal, texto ink em mono caixa alta + ↗; hover: seta anda 2px e fundo escurece 6%.
- **CTA secundário**: texto + sublinhado hairline que cresce no hover.
- **Linha de índice** (cursos e projetos): `Nº | nome (display 1.5rem) | instituição ou tipo | ano | ● status | ↗`, hairlines entre linhas; hover: fundo paper-2 e nome anda 8px. Numeração: destaques primeiro, na mesma ordem e número da espiral; depois os demais.
- **Overlay da peça** (clique): painel à direita (desktop, ~44vw) ou bottom sheet (mobile). A peça vai para o "palco" à esquerda, maior, e gira no arraste; as demais recuam e desbotam. Conteúdo: Nº, título, instituição · ano · horas · status, resumo, "O que aprendi" (3–5 itens), "Projetos com isso" (chips), "Ver certificado ↗", anterior / próxima, fechar (Esc).
- **Ajustes**: Movimento ambiente · Resetar posições · Ver sem 3D.
- **Índice (menu)**: lista Nº + nome; clique rola até a peça.
- **Loader**: "CATALOGANDO O ARQUIVO 064" (contador mono). Some quando fontes + primeiro frame estiverem prontos — sem tempo fake.

## §9 Acessibilidade
Canvas `aria-hidden`; tudo que o 3D mostra existe em HTML (índice + modo sem 3D). Foco: outline 2px signal, offset 3px. Teclado: ↑/↓ ou ←/→ navegam peças (com a seção na tela), Enter abre, Esc fecha. Skip link "Pular para o índice". Contraste AA em todo texto.

## §10 Não fazer
Fundo escuro/espacial, vidro, neon, gradiente roxo "de IA", pílulas, emoji na UI, texto em signal, qualquer código/texto/imagem/logo da referência.
