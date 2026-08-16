---
title: "README"
nav_order: 20
parent: "capitulos"
---

# Capítulos — A Pré-História Espiritual da Humanidade

## Finalidade

Esta pasta contém o **manuscrito do livro**.

A narrativa principal segue uma **ordem cronológica**, partindo dos marcos anteriores à formação da Terra e avançando até a chegada de Jesus à história humana.

## Princípio de organização

A cronologia é a espinha dorsal da obra.

Temas como Dragões, Anunnaki, Capela, Atlântida, Lemúria, Nefilins, genética, dilúvios e civilizações antigas devem entrar no ponto da linha do tempo em que as fontes os situam. Quando houver cronologias divergentes, elas serão apresentadas dentro do mesmo período ou capítulo, preservando a proveniência.

## Ordem inicial de leitura

1. `00-prologo-por-que-investigar.md`;
2. `01-antes-da-terra-origem-do-universo.md`;
3. capítulos `02`, `03`, `04` e seguintes, conforme o `../sumario-editorial.md`.

Este `README.md` é apenas orientação da pasta e **não faz parte do livro**.

## O que deve ficar aqui

Somente:

- prólogo;
- capítulos numerados;
- epílogo, se adotado futuramente;
- textos finais que integrem diretamente o manuscrito.

Não devem ficar aqui:

- templates;
- fichas de pesquisa;
- transcrições;
- matrizes comparativas;
- pareceres de revisão;
- decisões editoriais;
- arquivos de planejamento.

## Material conceitual preservado

O antigo `01-o-que-chamamos-humanidade.md` foi retirado da sequência cronológica e preservado em:

`../planejamento/base-conceitual-o-que-chamamos-humanidade.md`

Seu conteúdo continuará sendo usado para definir corpo, gênero Homo, Homo sapiens, civilização e humanidade espiritual, especialmente no prólogo e no futuro Capítulo 4 — `Os primeiros humanos`.

## Convenção de nomes

`NN-titulo-curto-em-kebab-case.md`

Exemplos:

- `00-prologo-por-que-investigar.md`;
- `01-antes-da-terra-origem-do-universo.md`;
- `02-formacao-da-terra-e-semeadura-da-vida.md`.

## Como criar um capítulo

Use o modelo localizado em:

`../../../../doc/templates/template-capitulo-historia-profunda.md`

Cada novo capítulo deve também possuir um dossiê correspondente em `../fontes-capitulos/`, reunindo fontes, fichas, marcos cronológicos, divergências e pendências antes da consolidação editorial.

## Estados editoriais permitidos

- `planejado`;
- `esboço`;
- `pesquisa`;
- `rascunho`;
- `revisão`;
- `pronto`;
- `publicável`.

## Fluxo obrigatório

1. consultar `../sumario-editorial.md` e confirmar a posição cronológica do capítulo;
2. consultar ou criar o dossiê correspondente em `../fontes-capitulos/`;
3. consultar fichas, corpus, linha do tempo, glossário e matrizes relacionadas;
4. consultar `../../../../commands/playbooks/producao-capitulos.md`;
5. aplicar `../../../../.agents/skills/escrita-historico-espiritual-comparativa/SKILL.md`;
6. usar o template de `../../../../doc/templates/`;
7. validar com `../criterios-de-pronto-capitulo.md`;
8. atualizar `../sumario-editorial.md` após mudança de estado.

## Atenção: `tools/generate-front-matter.mjs` reescreve o front matter do zero

O gerador de navegação do site (`generate-front-matter.mjs`, na raiz de `uc-osasco/`) **reconstrói o bloco de front matter inteiro a cada execução**, preservando apenas um eventual campo `description:`. Ele descarta silenciosamente `capitulo`, `titulo`, `estado`, `versao`, `ultima_atualizacao`, `pergunta_central` e `objetivo` — os campos editoriais deste manuscrito — deixando só `title`/`nav_order`/`parent`.

**Sempre que o gerador for executado sobre esta pasta**, restaurar manualmente os campos editoriais em cada capítulo afetado logo em seguida, antes de commitar. Isso já aconteceu uma vez (2026-08-16) e foi corrigido nessa mesma sessão.

## Capítulos existentes

- `00-prologo-por-que-investigar.md` — `revisão`;
- `01-antes-da-terra-origem-do-universo.md` — `revisão`;
- `02-formacao-da-terra-e-semeadura-da-vida.md` — `rascunho`;
- `03-o-mundo-antes-do-homem.md` — `rascunho`;
- `04-os-primeiros-humanos.md` — `rascunho`;
- `05-guerra-nos-ceus-e-chegada-dos-exilados.md` — `rascunho`;
- `06-anunnaki-enki-enlil-e-a-terra.md` — `rascunho`;
- `07-preparacao-dos-corpos-humanos.md` — `rascunho`;
- `08-era-de-ouro-atlantida-lemuria-mu.md` — `rascunho`;
- `09-nefilins-e-cultura-superior.md` — `rascunho`;
- `10-pandora-eva-e-modelo-colmeia.md` — `rascunho`;
- `11-as-grandes-devastacoes.md` — `rascunho`;
- `12-queda-de-atlantida-e-o-grande-reinicio.md` — `rascunho`;
- `13-diluvio-noe-e-recomeco-dos-povos.md` — `rascunho`;
- `14-sumeria-babel-acad-e-ninive.md` — `rascunho`;
- `15-egito-herancas-e-akhenaton.md` — `rascunho`;
- `16-jave-hebreus-e-monoteismo.md` — `rascunho`;
- `17-do-mundo-antigo-ao-cenario-de-jesus.md` — `rascunho`;
- `18-jesus-entra-na-historia-humana.md` — `rascunho`.

**A obra está completa: Prólogo + 18 capítulos.** A estrutura completa planejada está em `../sumario-editorial.md`.