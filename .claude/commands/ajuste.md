---
description: Ajuste pontual fora das etapas (ex.: /ajuste espiral mais aberta pros lados)
argument-hint: [o que mudar]
---
Ajuste pedido: $ARGUMENTS

1. Leia só "Estado atual" do `docs/PROGRESS.md` e os arquivos necessários (Glob/Grep direcionados).
2. Ambíguo ou caro? 1 pergunta antes. Senão, faça a menor mudança que resolve.
3. Valor visual → `src/config/spiral.ts` ou tokens. Se uma decisão de design mudou, corrija a linha no DESIGN.md.
4. `npm run typecheck && npm run build`. Commit `tweak: <resumo>`. 1 linha em "Ajustes" no PROGRESS.md.
5. Resposta em até 5 linhas: o que mudou e como ver.
