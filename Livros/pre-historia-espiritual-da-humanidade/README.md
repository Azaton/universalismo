# A Pré-História Espiritual da Humanidade

## O que é esta pasta

Esta pasta é o **workspace editorial e de pesquisa** da obra **A Pré-História Espiritual da Humanidade**.

Ela reúne três camadas diferentes:

1. o **livro em construção**, localizado em `capitulos/`;
2. o **corpus bibliográfico**, localizado em `corpus-bibliografico/`;
3. os **bastidores da obra**, como fichas, cronologias, matrizes, revisões e decisões editoriais.

Portanto, esta pasta inteira sustenta o livro, mas somente a pasta `capitulos/` constitui o manuscrito que será lido em sequência.

## Onde começar a leitura do livro

Abra a pasta:

`capitulos/`

Leia os arquivos pela numeração:

1. `capitulos/00-prologo-por-que-investigar.md`;
2. `capitulos/01-o-que-chamamos-humanidade.md`;
3. depois os capítulos `02`, `03`, `04` e seguintes, conforme forem produzidos.

O arquivo `capitulos/README.md` explica a organização do manuscrito, mas **não faz parte do texto do livro**.

## Onde estão os livros que compõem a obra

A seleção de livros utilizada para construir o manuscrito está em:

`corpus-bibliografico/`

Comece por:

1. `corpus-bibliografico/README.md` — explica o conceito de corpus;
2. `corpus-bibliografico/catalogo-geral.md` — relaciona as obras selecionadas;
3. `corpus-bibliografico/mapa-livros-temas.md` — mostra quais livros sustentam cada tema;
4. `corpus-bibliografico/estado-de-leitura.md` — acompanha leitura e fichamento;
5. `corpus-bibliografico/obras-semelhantes-e-diferenciacao.md` — compara o projeto com obras próximas.

O corpus não é todo o acervo. É a seleção editorial das obras que participam efetivamente da construção do livro.

## Onde os capítulos são construídos

Todo capítulo que integra a obra deve ser criado diretamente em:

`capitulos/`

Convenção de nome:

`NN-titulo-curto-em-kebab-case.md`

Exemplo:

`02-como-ler-as-camadas.md`

O modelo de criação não fica dentro do manuscrito. Ele está em:

`../../../doc/templates/template-capitulo-historia-profunda.md`

## Estrutura da pasta

| Caminho | Função | Faz parte da leitura do livro? |
| --- | --- | --- |
| `capitulos/` | Manuscrito da obra, em ordem numérica | Sim |
| `corpus-bibliografico/` | Livros selecionados, funções, temas e estado de leitura | Não; sustenta a escrita |
| `sumario-editorial.md` | Arquitetura planejada da obra | Não |
| `criterios-de-pronto-capitulo.md` | Critérios de qualidade e conclusão | Não |
| `linha-do-tempo-multicamada.md` | Cronologias comparadas | Não |
| `fichas/` | Registro de alegações e fontes específicas | Não |
| `fontes-capitulos/` | Mapas de fontes por capítulo | Não |
| `matrizes/` | Comparações entre tradições e conceitos | Não |
| `glossario/` | Definições e ambiguidades terminológicas | Não |
| `mapas/` | Relações entre povos, seres, autores e ideias | Não |
| `revisoes/` | Pareceres editoriais e epistemológicos | Não |
| `decisoes-editoriais/` | Registro das decisões sobre a obra | Não |
| `estado-da-obra/` | Acompanhamento da evolução do manuscrito | Não |
| `planejamento/` | Planos futuros de produção | Não |
| `publicacao/` | Materiais para uma edição consolidada | Não |
| `referencias/` | Bibliografia final e padrões de citação | Não |
| `anexos/` | Materiais complementares da futura obra | Somente se incorporados à edição final |

## Objetivo da obra

Investigar a história remota da humanidade e as narrativas sobre suas origens, ciclos, migrações e possíveis relações com outros mundos ou grupos.

O objetivo não é apenas resumir os livros lidos. É **compilar, comparar e reorganizar criticamente suas contribuições** para construir uma narrativa própria sobre a pré-história espiritual da humanidade.

O estudo dá atenção especial a:

- cronologia paleoantropológica e arqueológica;
- tradições mesopotâmicas e Anunnaki;
- Dragões como seres, linhagens, símbolos ou civilizações;
- Capelinos e narrativas de exílio;
- transmigrações entre mundos;
- Atlântida, Lemúria e civilizações desaparecidas;
- catástrofes e reinícios civilizacionais;
- intervenção externa na humanidade;
- evolução da consciência;
- implicações morais e espirituais do conhecimento.

## Pergunta central

Que narrativa comparada das origens e da trajetória humana emerge quando cronologias científicas, históricas, mitológicas, religiosas, espiritualistas e especulativas são colocadas lado a lado sem serem confundidas?

## Hipótese orientadora

Há uma linha de investigação segundo a qual a história humana relevante poderia alcançar aproximadamente um milhão de anos.

Antes de avaliar essa hipótese, a obra distingue:

- ancestralidade dos hominínios;
- gênero `Homo`;
- humanidade anatomicamente moderna;
- humanidade comportamentalmente moderna;
- civilização organizada;
- humanidade espiritual ou consciência;
- ciclos, intervenções ou transmigrações descritos por tradições.

## Camadas de análise

- `científica`;
- `histórico-documental`;
- `arqueológica`;
- `mitológica`;
- `religiosa`;
- `espiritualista`;
- `especulativa`.

Essas camadas podem dialogar, mas não devem ser confundidas ou fundidas sem justificativa.

## Processo de produção

A criação e revisão dos capítulos seguem:

1. `../../../commands/producao-capitulos.md`;
2. `../../../.agents/skills/escrita-historico-espiritual-comparativa/SKILL.md`;
3. `sumario-editorial.md`;
4. `criterios-de-pronto-capitulo.md`;
5. `corpus-bibliografico/`;
6. `../../../doc/templates/template-capitulo-historia-profunda.md`.

## Estado atual da obra

Capítulos existentes:

- `00-prologo-por-que-investigar.md` — estado `esboço`;
- `01-o-que-chamamos-humanidade.md` — estado `esboço`.

Eles já compõem o início do livro, mas ainda contêm pendências editoriais e de pesquisa.

## Regra prática

- Para **ler o livro**: entre em `capitulos/` e siga a numeração.
- Para **ver quais livros constroem a obra**: entre em `corpus-bibliografico/`.
- Para **criar um capítulo**: copie o template de `doc/templates/` e salve o novo arquivo em `capitulos/`.
- Para **consultar a pesquisa**: use as demais pastas deste workspace.