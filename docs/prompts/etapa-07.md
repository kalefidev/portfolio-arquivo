# Etapa 07 — Seções depois da espiral + saída

Leia: `docs/PROGRESS.md`, `docs/REFERENCIA.md` (Seções depois da espiral + Mapeamento), `DESIGN.md` §2, §7 e §8, `src/content/site.ts`, `src/content/projects.ts`.

## Faça — na ordem da página, textos de `site.ts`
1. **Saída da espiral** (usa `exitProgress`): peças sobem com stagger e somem; o eixo vertical deita e vira a linha horizontal da seção seguinte. Se ficar frágil, fade simples — e me avise.
2. `Reach.tsx` — "Feito em Brasília…": linha horizontal com 4 pontos rotulados, texto, CTA primário (WhatsApp) e secundário (→ `#projetos`).
3. `CourseIndex.tsx` — índice completo de cursos (todos, não só destaques) em linhas (DESIGN.md §8), com filtro por categoria em mono. Destaque: rola até a peça na espiral e abre. Não destaque: abre o overlay sem 3D.
4. `Projects.tsx` (`#projetos`) — lista de projetos com hover que revela prévia (placeholder no tom da categoria + iniciais até ter imagem), status com bolinha e cursos relacionados (link de volta para a peça).
5. `Services.tsx` (`#sobre`) — "O que eu faço": título, texto, 3 pilares numerados e a frase-resumo com contagens calculadas dos dados.
6. `About.tsx` — pessoa(s) de `site.ts`: foto em moldura técnica (placeholder "FOTO" até ter imagem), cargo, bullets, bio, links. Recebe array; hoje é 1 pessoa.
7. `Process.tsx` — 3 passos numerados.
8. `Contact.tsx` (`#contato`) + `ContactDialog.tsx`: título, CTA WhatsApp, e-mail. Diálogo com nome, tipo (Site / Automação / Sistema / Outro) e mensagem → abre `wa.me` com o texto montado (`src/lib/whatsapp.ts`). Sem backend.
9. `Footer.tsx`: wordmark, e-mail, ©, voltar ao topo.
10. Reveals de entrada com ScrollTrigger (títulos por linha, listas com stagger), desligados em reduced motion.

## Pronto quando
- [ ] Página completa de ponta a ponta; a nav do header leva a cada seção.
- [ ] Render 3D pausado nas seções de baixo (confira FPS/CPU).
- [ ] WhatsApp abre com a mensagem certa (desktop e Android).
- [ ] Ritual de fim de etapa.
