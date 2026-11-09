# Portfólio "Arquivo" — Kaique Calefi

Portfólio pessoal com uma espiral 3D de cursos (mecânica inspirada no hamol.studio, estética própria).
Público: clientes (pequenos negócios) e recrutadores. Dev: Kaique (Windows, Claude Code no terminal).

## Mapa — leia só o que a tarefa pedir
- `docs/PROGRESS.md` — estado atual e handoff entre etapas. **Leia primeiro em toda sessão.**
- `docs/prompts/etapa-NN.md` — instruções de cada etapa.
- `DESIGN.md` — estética, tokens, espiral, objetos 3D, motion. Leia só as seções (§) citadas.
- `docs/PLAN.md` — visão, stack, arquitetura, etapas, orçamento de performance.
- `docs/REFERENCIA.md` — o que a referência faz. Só quando a etapa citar.
- `docs/CURSOS.md`, `docs/CONTEUDO.md` — dados e textos do Kaique (fonte de `src/content/`).

## Stack — não troque sem perguntar
Next.js (App Router, TS, `src/`) · Tailwind v4 (tokens em `@theme`) · three + @react-three/fiber + @react-three/drei · gsap (ScrollTrigger, SplitText) · lenis · zustand · vitest · @phosphor-icons/core. Só dev: lil-gui.
Deploy na Vercel. Manter compatível com `output: 'export'`: sem API routes, server actions ou dados no servidor.

## Regras de código
- Código, arquivos e commits em inglês; textos de UI e docs em PT-BR.
- Conteúdo só em `src/content/*`. Parâmetros da espiral só em `src/config/spiral.ts`. Cores, fontes e tamanhos só nos tokens (`globals.css`). Nada de número mágico espalhado.
- 3D: nenhum componente React assina `progress` — leia `useStore.getState()` dentro do `useFrame`. A UI assina só estados discretos (`activeIndex`, `focusSlug`…).
- Objetos 3D procedurais (sem GLB, sem HDR/texturas externas), cabem numa esfera de raio 1, usam materiais de `src/three/archetypes/materials.ts`.
- Todo conteúdo mostrado no 3D também existe em HTML. Respeitar `prefers-reduced-motion`. Foco visível sempre.
- Não copie código, textos, imagens, logos ou identidade do hamol.studio — só estrutura e mecânica.
- Não instale nada fora da stack sem perguntar.

## Economia de tokens
- Não varra o repo. Glob/Grep direcionados; leia trechos quando bastar.
- Prefira Edit a reescrever arquivo inteiro. Não cole logs longos — resuma o erro.
- Dúvida que muda o resultado: 1 pergunta objetiva antes de gastar.
- Resposta final curta (≤ 10 linhas): o que mudou, como testar, pendências.

## Skills instaladas (ajudam na execução; o DESIGN.md manda na estética)
frontend-design / impeccable (UI) · skills oficiais do GSAP (ScrollTrigger, SplitText) · skills do Emil Kowalski (micro-interações).
Vault do Obsidian (via CLAUDE.md global): consulte notas de design/segurança/hospedagem só se a etapa pedir.

## Ambiente
Windows (Git Bash dentro do Claude Code) · Node ≥ 20 · `npm run dev` → http://localhost:3000 · calibrar espiral: `/?debug` · laboratório de objetos: `/lab`.

## Ritual de fim de etapa (sempre)
1. `npm run typecheck && npm run lint && npm run test --if-present && npm run build` — corrija até passar.
2. Se tiver ferramenta de navegador, confira 1440×900 e 390×844; se não, liste em 3 linhas o que o Kaique deve olhar.
3. Atualize `docs/PROGRESS.md` (Estado atual, checkbox da etapa, Log: feito / decisões / pendências / como testar). Se uma decisão mudou, corrija a linha no DESIGN.md ou PLAN.md.
4. `git add -A && git commit -m "feat(etapa-NN): <resumo>" && git tag -f etapa-NN`
5. Termine com: "Etapa NN pronta. Dê /clear e rode /etapa <próxima>."
