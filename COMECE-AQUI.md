# Comece aqui (Kaique)

Kit pré-projeto do portfólio "Arquivo". Tudo que o Claude Code precisa já está nesta pasta.

## O que tem
| arquivo | pra quê |
|---|---|
| `CLAUDE.md` | regras que o Code lê sozinho em toda sessão (curto de propósito, economiza token) |
| `DESIGN.md` | estética, tokens, matemática da espiral, catálogo de objetos 3D |
| `docs/PLAN.md` | stack, arquitetura, etapas, orçamento de performance |
| `docs/REFERENCIA.md` | como o hamol.studio funciona e como mapeamos pro seu |
| `docs/CURSOS.md` | **você preenche** — seus cursos |
| `docs/CONTEUDO.md` | **você revisa** — textos, links, projetos |
| `docs/PROGRESS.md` | o Code atualiza a cada etapa — é a memória entre um /clear e outro |
| `docs/prompts/etapa-01…08.md` | o prompt de cada etapa |
| `.claude/commands/` | atalhos: `/etapa`, `/ajuste`, `/salvar` |

## Passo a passo
1. Extraia numa pasta nova, ex.: `C:\Users\User\Projetos\portfolio-arquivo`.
2. Preencha `docs/CURSOS.md` e revise `docs/CONTEUDO.md`. Pode começar sem: as etapas 01–05 rodam com exemplos; a 06 precisa da lista real.
3. Abra o terminal nessa pasta e rode `claude`.
4. Para cada etapa: `/clear` → `/etapa 01` → teste no navegador → ajustes → próxima.
   Se o `/etapa` não aparecer, cole o conteúdo de `docs/prompts/etapa-01.md`.
5. Etapas 02, 03 e 05: ative o modo plano (Shift+Tab) antes de mandar.
6. Calibrar a espiral (depois da etapa 02): abra `http://localhost:3000/?debug`, mexa em `radiusX`, `angleStep` e `scrollPerItem` até ficar do seu jeito → "Copiar config" → `/ajuste aplica esta config: <cola o JSON>`.
7. Mudança fora das etapas: `/ajuste <o que você quer>`. Vai parar no meio de algo: `/salvar` antes do `/clear`.
8. Deu ruim: cada etapa vira uma tag — `git checkout etapa-03` volta ao fim da etapa 03 (ou peça ao Code).

## Testar no celular (Android)
`npm run dev -- -H 0.0.0.0` e abra `http://<IP-do-PC>:3000` no celular, na mesma rede Wi-Fi.
Se o Next bloquear o acesso, mande: `/ajuste libera allowedDevOrigins para o IP do meu PC`.
