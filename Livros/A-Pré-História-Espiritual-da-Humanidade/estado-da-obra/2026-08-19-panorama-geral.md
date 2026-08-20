# Estado da obra — panorama geral

Data: 2026-08-19

## Situação geral

Este é o primeiro panorama de estado desde 2026-08-02. O snapshot anterior (`2026-08-02-pendencias-mural-o-novo-mundo.md`) cobria apenas o mural "O Novo Mundo" e ficou desatualizado: nas duas semanas seguintes a obra avançou de forma relevante (sumário de 18 capítulos consolidado, três capítulos em "rascunho avançado" a mais, nova fonte de centenas de milhões de anos incorporada), mas nenhuma fotografia de estado acompanhou esse avanço. Este registro não substitui o anterior — ele soma um panorama editorial mais amplo e reabre explicitamente as pendências de pesquisa que continuam sem solução.

## Estado dos 18 capítulos (fonte: `sumario-editorial.md`)

| Capítulo | Estado |
|---|---|
| Prólogo | revisão |
| 1 — Antes da Terra | revisão |
| 2 — Formação da Terra e semeadura da vida | rascunho |
| 3 — O mundo antes do homem | rascunho |
| 4 — Os primeiros humanos | rascunho |
| 5 — Guerra nos céus e chegada dos exilados | rascunho avançado |
| 6 — Anunnaki, Enki, Enlil | rascunho |
| 7 — Preparação dos corpos humanos | rascunho avançado |
| 8 — Era de Ouro: Atlântida, Lemúria e Mu | rascunho |
| 9 — Nefilins e cultura superior | rascunho |
| 10 — Pandora, Eva e o rompimento do modelo colmeia | rascunho |
| 11 — As grandes devastações | rascunho |
| 12 — Queda de Atlântida e o grande reinício | rascunho avançado |
| 13 — Dilúvio, Noé e recomeço dos povos | rascunho |
| 14 — Suméria, Babel, Acad e Nínive | rascunho |
| 15 — Egito: heranças antigas e Akhenaton | rascunho avançado |
| 16 — Javé, os hebreus e o monoteísmo | rascunho |
| 17 — Do mundo antigo ao cenário de Jesus | rascunho avançado |
| 18 — Jesus entra na história humana | rascunho avançado |

Nenhum capítulo está em `pronto`. Seis estão em `rascunho avançado` (5, 7, 12, 15, 17, 18) — candidatos naturais ao próximo ciclo de promoção para `revisão`, conforme a prioridade já registrada no sumário ("enriquecimento das fontes nucleares antes da promoção em bloco").

## Avanços desde 2026-08-02

- Sumário editorial reestruturado em 5 partes com os 18 capítulos e dossiês correspondentes em `fontes-capitulos/` (2026-08-16).
- Nova camada cronológica incorporada ao Capítulo 3 (e, secundariamente, ao Capítulo 2): a palestra de Jan Val Ellam sobre a Terra "vestida de branco" (VSC#44), cobrindo de ~970 milhões a ~700 mil anos atrás — congelamento global, Tiktaalik, intervenção atribuída a Cadru/Nagas e o sistema Marte/Yggdrasil (fonte registrada em `doc/source-context.md` em 2026-08-19).
- Segunda fonte primária de Celso Rey sobre o ciclo de Telos ("Capítulo II — A Sociedade de Telos"), aprofundando o Capítulo 12 com governo, tecnologia e a Rede Agartha da comunidade sobrevivente à queda da Lemúria (fonte registrada em `doc/source-context.md` em 2026-08-19).
- Decisão editorial vinculante Anfion/Antúlio/Jesus consolidada (2026-08-16), afetando os capítulos 17 e 18.
- Home do site (`uc-osasco/index.md`) recebeu destaque para a nova cronologia de Jan Val Ellam e, nesta rodada (2026-08-19), destaque adicional para Telos/Lemúria e para "A Guerra dos Deuses e o Holocausto Nuclear" (Sitchin) — conteúdo maduro que já existia, mas não aparecia na página inicial.

## Lacuna de governança identificada e corrigida (2026-08-19)

Auditoria feita a pedido do Mestre encontrou duas fontes com artefatos já publicados em `uc-osasco/` (fichas, páginas, mapas) mas nunca registradas em `doc/source-context.md` nem, quando aplicável, em `doc/persona/`: a palestra VSC#44 de Jan Val Ellam e o "Capítulo II" de Celso Rey sobre a sociedade de Telos. Ambas as sessões de origem rodaram no ChatGPT com escrita direta no repositório (fora do Claude Code), o que permitiu que o passo de sincronização fosse pulado. As duas lacunas foram fechadas retroativamente nesta data. A skill local `.agents/skills/ingestao-fonte-audiovisual/SKILL.md` foi criada para tornar essa sincronização etapa obrigatória em processamentos futuros de fonte audiovisual.

## Pendências reais reabertas (herdadas de 2026-08-02, ainda sem solução)

### 1. Cluster "O Apocalipse" do mural

Localizado, mas não lido em detalhe. Ficha-stub em `../fichas/2026-08-01-mural-apocalipse-stub.md`. Próxima ação: transcrever livros, imagens e alegações individuais.

### 2. Área "Reunião Planetária" / Sananda do mural

Localizada incidentalmente, ainda não lida ou transcrita. Ficha-stub em `../fichas/2026-08-01-mural-reuniao-planetaria-sananda-stub.md`. Próxima ação: captura estruturada e identificação da origem de cada nota.

### 3. Subfaixas do diagrama Sananda

Permanecem pendentes: Livros, Insights, Estudos, "Amazefia", Umbanda. Referência: `../fichas/2026-08-01-mural-diagrama-sananda.md`.

### 4. Clusters externos de livros e Wikipédia do mural

Ainda não inventariados como conjunto.

Nenhuma dessas quatro pendências avançou desde 2026-08-02. Elas continuam sendo, junto com a promoção dos seis capítulos em `rascunho avançado`, o maior potencial de enriquecimento de conteúdo já identificado pelo próprio projeto e ainda não executado.

## Próximo ciclo sugerido

1. Resolver ao menos uma das quatro pendências do mural (item mais simples primeiro: cluster "O Apocalipse", que já tem ficha-stub e delimitação clara).
2. Avaliar promoção de `rascunho avançado` para `revisão` nos capítulos 5, 7, 12, 15, 17 e 18, seguindo `criterios-de-pronto-capitulo.md`.
3. Ao processar qualquer nova palestra ou vídeo, seguir `.agents/skills/ingestao-fonte-audiovisual/SKILL.md` do início ao fim, incluindo a etapa de sincronização de governança.
