# Manutenção do repositório

Guia técnico para quem edita ou publica conteúdo neste repositório. Para uma visão geral do projeto, veja o [README](README.md).

Site público do Projeto Universalismo, publicado via GitHub Pages com Jekyll e o tema [Just the Docs](https://just-the-docs.com/).

- Repositório: `https://github.com/Azaton/universalismo`
- Site: `https://azaton.github.io/universalismo/`

## Estrutura

- `index.md` — página inicial.
- `Sobre-o-Projeto.md` — propósito, eixos, metodologia e critérios editoriais.
- Cada seção temática possui um arquivo de entrada, como `Estudos.md`, e uma pasta com suas subpáginas.
- O front matter (`title`, `parent`, `nav_order`, `has_children`) controla a navegação lateral.
- `assets/` deve concentrar imagens e documentos autorizados para publicação.

## Conteúdo público e acervo privado

Este repositório é público. Tudo o que for versionado nele poderá ser consultado, copiado e distribuído por terceiros.

Devem permanecer fora deste repositório:

- PDFs integrais de livros protegidos por direitos autorais;
- documentos pessoais ou confidenciais;
- transcrições e pesquisas que ainda não foram revisadas para divulgação;
- chaves, credenciais e configurações locais;
- arquivos cuja licença ou autorização de uso não esteja clara.

O acervo completo de pesquisa pode permanecer no ambiente privado do MestreOps. A publicação deve ser seletiva: o site recebe sínteses, artigos, referências e materiais autorizados.

## Adicionar ou revisar uma página

1. Crie ou edite o arquivo `.md` na pasta correta.
2. Confira o front matter e a relação `parent` da página.
3. Rode `node tools/generate-front-matter.mjs --dry-run` para visualizar o plano.
4. Rode `node tools/generate-front-matter.mjs` somente quando quiser reprocessar o front matter de todo o acervo.
5. Revise links, imagens, proveniência das afirmações e direitos de publicação.
6. Faça commit e push para a branch `main`.

> O gerador é idempotente, mas reescreve o front matter existente. Alterações manuais especiais, como `permalink`, devem ser conferidas depois da execução.

## Imagens e anexos

A antiga Wiki utilizava caminhos no formato `/.attachments/...`. Esses caminhos não funcionam neste repositório quando os arquivos originais não foram migrados.

Nova convenção:

```text
assets/
├── images/
└── documents/
```

Antes de incluir um anexo:

1. localize o arquivo original;
2. confirme se pode ser publicado;
3. use um nome descritivo, sem identificadores aleatórios;
4. salve em `assets/images/` ou `assets/documents/`;
5. atualize o link relativo na página correspondente.

Enquanto o original não estiver disponível ou autorizado, a página deve exibir uma nota de anexo não migrado, sem criar links quebrados.

## Publicação

No GitHub:

```text
Settings → Pages → Deploy from a branch → main → /root
```

A configuração do site está em `_config.yml`.
