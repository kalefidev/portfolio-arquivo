# Etapa 08 — Loader, performance, acessibilidade, SEO e deploy

Leia: `docs/PROGRESS.md`, `docs/PLAN.md` (Orçamento de performance), `DESIGN.md` §8 (Loader) e §9. Para hospedagem, consulte a nota do vault se existir.

## Faça
1. **Loader** "CATALOGANDO O ARQUIVO 064": espera `document.fonts.ready` + primeiro frame do canvas (ou o modo sem 3D) e some com transição. Nada de timer artificial.
2. **Performance**: medir (Lighthouse + drei Stats no `?debug`). Se precisar: baixar `detail`, DPR e segmentos, callouts só para |d| ≤ 2, `React.memo` nos itens. Testar N8AO só no desktop e manter apenas se custar < 2ms/frame. Conferir o bundle no `next build` e o lazy do 3D.
3. **Acessibilidade**: auditoria WCAG AA (foco, contraste, ordem, nomes acessíveis, reduced motion, nenhuma armadilha de foco) e correções.
4. **SEO**: metadata (title "Kaique Calefi — Desenvolvedor de sites, automações e sistemas", description, canonical com o domínio de `site.ts`), Open Graph 1200×630 (`opengraph-image.tsx`; se não gerar no build, PNG estático), JSON-LD `Person`, `sitemap.ts`, `robots.ts`, favicon SVG (■ em signal).
5. **Erros**: página 404 no estilo do site; fallback sem WebGL testado.
6. **Deploy**: deixar pronto para a Vercel (sem segredos). Passo a passo curto no PROGRESS.md: criar repo no GitHub, importar na Vercel, apontar o domínio (DNS conforme a Vercel indicar). Não faça login nem crie contas — eu faço.
7. **QA final**: Chrome desktop, Android real (via IP local), Safari se der. Checklist no PROGRESS.md.

## Pronto quando
- [ ] Lighthouse: desktop ≥ 90 em tudo; mobile ≥ 70 em performance e ≥ 90 no resto.
- [ ] Console limpo; 404 ok; sem WebGL ok.
- [ ] PROGRESS.md com passo a passo de deploy e checklist de QA.
- [ ] Ritual de fim de etapa (tag `etapa-08` = v1.0).
