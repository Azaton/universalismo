# uc-osasco

Site publicado via GitHub Pages (Jekyll + tema [Just the Docs](https://just-the-docs.com/)) a partir dos arquivos `.md` deste repositório.

## Estrutura

- `index.md` — homepage (antigo `Home.md`).
- Cada pasta temática tem um `Nome-da-Pasta.md` (página de entrada da seção) e uma pasta `Nome-da-Pasta/` com as subpáginas.
- Front matter (`title`, `parent`, `nav_order`, `has_children`) controla a navegação lateral do tema. Foi gerado automaticamente a partir da ordem original dos arquivos `.order` (convenção do Gollum/GitHub Wiki).

## Adicionar uma página nova

1. Crie o `.md` na pasta correta.
2. Rode `node tools/generate-front-matter.mjs --dry-run` para conferir o plano (não escreve nada).
3. Rode `node tools/generate-front-matter.mjs` para aplicar o front matter em todos os arquivos (reprocessa tudo; é idempotente — remove e reescreve o front matter existente).

## Publicação

Settings → Pages → Deploy from a branch → `main` → `/root`.
