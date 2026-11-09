# REFERENCIA.md — como o hamol.studio funciona (observado em 06/11/2026)

> Copiamos **mecânica e estrutura**. Nunca código, textos, imagens, logos ou identidade visual.

## Técnico
- Next.js (Turbopack) + three r186, na Vercel. Uma fonte sans geométrica. Tema escuro.
- Um único `<canvas>` fixo em tela cheia atrás do HTML.
- Página ≈ 15,7 telas de altura. A seção da espiral ocupa ≈ 10 telas para 9 itens (≈ 1 tela de rolagem por item).

## Seção da espiral (hero)
- Hélice vertical de esferas facetadas (painéis hexagonais, cada uma com o logo do projeto) em volta de um eixo fino vertical, um pouco à direita do centro.
- Ao rolar, a hélice sobe e gira: o item em foco fica à frente (maior, mais perto), os anteriores sobem e recuam, os próximos esperam embaixo e menores.
- Cada esfera tem um rótulo pequeno ao lado com número, nome e categoria.
- Coluna esquerda: no topo, o hero (eyebrow, H1, texto, CTA para os trabalhos). A partir do 2º item, vira um painel "trabalho selecionado / número" com nome grande + seta + categoria, que troca conforme o item ativo.
- Borda direita: texto vertical com o nome da coleção e do "ambiente" visual.
- Barra inferior: dicas de interação (rolar / arrastar / clicar; no mobile, deslizar / tocar), botão central de projetos + ajustes, contador "atual / total".
- Ajustes da cena: movimento ambiente, resetar posições, ver sem a cena 3D.
- Loader com frase temática. Fundo: foto de paisagem lunar, luas pequenas flutuando, linhas finas ligando esferas.
- Clique abre overlay do projeto (link da página, fechar, voltar, próximo).
- Não confirmado: se arrastar gira a espiral inteira ou só a esfera → fazemos os dois (arrastar objeto gira o objeto; arrastar o vazio gira a espiral).

## Seções depois da espiral (ordem)
1. Transição sobre ser local e conectado ao mundo: linha horizontal com 4 cidades (pontos), texto e 2 CTAs.
2. Índice de projetos em linhas: número, logo, nome, categoria, status com bolinha colorida, seta.
3. Estúdio: título, texto, 3 pilares numerados (estratégia, design, tecnologia) e frase-resumo com contagem de projetos.
4. Pessoas: 2 sócios (foto, cargo, bullets, bio, LinkedIn).
5. Abordagem: 3 passos numerados.
6. Contato: título + e-mail; modal de formulário.
7. Footer: logo, e-mail, ©, voltar ao topo, privacidade.

## Mapeamento para o nosso
| referência | nosso |
|---|---|
| esferas = projetos | objetos 3D = cursos em destaque |
| texto vertical de coleção/ambiente | régua de peças + "ARQUIVO DE ESTUDOS" |
| painel "trabalho selecionado / Nº" | "PEÇA Nº 03 / 12" |
| transição local ↔ mundo (4 cidades) | "Feito em Brasília. Entregue em qualquer lugar." (4 pontos) |
| índice de projetos | índice completo de cursos **+** seção Projetos |
| estúdio com 3 pilares | O que eu faço: Sites · Automações · Sistemas |
| 2 sócios | Sobre mim (1 pessoa; componente aceita mais) |
| abordagem em 3 passos | Entender · Construir · Acompanhar (textos próprios) |
| e-mail + modal | WhatsApp com mensagem pronta + e-mail |
