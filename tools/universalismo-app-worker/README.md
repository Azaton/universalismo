# universalismo-app-worker

Cloudflare Worker que recebe o formulário público de `contribuir.md`, valida o Cloudflare Turnstile, autentica como a **GitHub App do Universalismo** e cria uma Issue em `Azaton/universalismo`. Arquitetura decidida em 2026-08-15 (conversa "Interação e colaboração no site"):

```text
Pessoa → formulário público (contribuir.md) → Worker → GitHub App → GitHub API → Issue
```

O visitante nunca precisa de conta no GitHub. A Issue aparece criada pela App (ex.: `universalismo-app[bot]`), não por uma pessoa.

## Status

**Código pronto. Ainda não implantado.** Faltam os passos manuais abaixo — nenhum deles pode ser feito por aqui, porque exigem login no GitHub e na Cloudflare com sua conta.

**Enquanto isso não for feito, o botão "Perguntar ou contribuir" do site continua apontando para o GitHub Issue Form antigo** (`_includes/footer_custom.html` não foi alterado) — ele funciona hoje, exige conta GitHub, e só será substituído depois que este Worker estiver implantado e testado.

## Passo a passo — o que só você pode fazer

### 1. Criar a GitHub App

1. Acesse **github.com → sua foto → Settings → Developer settings → GitHub Apps → New GitHub App**.
2. Nome sugerido: `Universalismo Contributor` (ou outro nome único no GitHub — precisa ser globalmente único).
3. Homepage URL: `https://azaton.github.io/universalismo/`.
4. Webhook: **desmarque "Active"** — não precisamos de webhook nesta primeira versão.
5. Em **Repository permissions**, defina:
   - **Issues: Read and write**
   - Todas as outras permissões: **No access** (a App não deve poder tocar em código, Actions, Pull Requests etc.)
6. Em "Where can this GitHub App be installed?", escolha **Only on this account**.
7. Clique em **Create GitHub App**.

### 2. Gerar a chave privada

1. Na página da App recém-criada, role até **Private keys** → **Generate a private key**.
2. O GitHub baixa um arquivo `.pem` (ex.: `universalismo-contributor.2026-08-15.private-key.pem`). **Esse download só acontece uma vez** — o GitHub não guarda cópia recuperável.
3. Guarde esse arquivo **fora do repositório**, num lugar seguro do seu computador (nunca dentro de `uc-osasco/` nem de nenhum repositório git).
4. Anote também o **App ID**, que aparece no topo da página da App.

### 3. Instalar a App no repositório

1. Na página da App, vá em **Install App** (menu lateral).
2. Instale na conta `Azaton`, escolhendo **Only select repositories** → `universalismo`.
3. Depois de instalado, pegue o **Installation ID**: abra `https://github.com/settings/installations`, clique na instalação, e veja o número na URL (`.../installations/12345678`) — esse número é o `GITHUB_INSTALLATION_ID`.

### 4. Verificar o formato da chave (PKCS#8)

O código deste Worker espera uma chave no formato **PKCS#8** (`-----BEGIN PRIVATE KEY-----`). Se o `.pem` baixado do GitHub começar com `-----BEGIN RSA PRIVATE KEY-----` (PKCS#1), converta antes:

```bash
openssl pkcs8 -topk8 -nocrypt -in chave-original.pem -out chave-pkcs8.pem
```

Use o conteúdo de `chave-pkcs8.pem` no passo seguinte.

### 5. Criar uma conta/site no Cloudflare Turnstile

1. Acesse o painel da Cloudflare → **Turnstile** → **Add site**.
2. Domínio: `azaton.github.io`.
3. Copie a **Site Key** (vai para `contribuir.md`, não é secreta) e a **Secret Key** (vai para o Worker como secret, é secreta).

### 6. Configurar os secrets do Worker

Dentro desta pasta (`tools/universalismo-app-worker/`), com [Node.js](https://nodejs.org) e `npm install` já rodados:

```bash
npx wrangler login

npx wrangler secret put GITHUB_APP_ID
npx wrangler secret put GITHUB_INSTALLATION_ID
npx wrangler secret put GITHUB_PRIVATE_KEY   # cole o conteúdo INTEIRO do .pem PKCS#8
npx wrangler secret put TURNSTILE_SECRET
```

Para desenvolvimento local, copie `.dev.vars.example` para `.dev.vars` (já ignorado pelo git) e preencha os mesmos quatro valores lá, sem usar `wrangler secret put`.

### 7. Implantar

```bash
npm install
npx wrangler deploy
```

O comando imprime a URL pública do Worker (algo como `https://universalismo-app-worker.<seu-subdomínio>.workers.dev`). Essa URL precisa entrar em `assets/js/contribuicao.js` (constante `WORKER_ENDPOINT`) e a Site Key do Turnstile em `contribuir.md`.

## Depois de implantado

1. Testar o formulário em `contribuir.md` localmente (`bundle exec jekyll serve`) apontando para o Worker publicado.
2. Confirmar que a Issue criada aparece em `github.com/Azaton/universalismo/issues`, com o rótulo `contribuicao-publica` e atribuída à App, não a uma conta pessoal.
3. Só então atualizar `_includes/footer_custom.html` para apontar para `/contribuir/` em vez do GitHub Issue Form, e remover (ou manter como alternativa) `.github/ISSUE_TEMPLATE/contribuicao.yml`.

## Segurança — o que este Worker garante

- Nenhum segredo (App ID, Installation ID, chave privada, Turnstile secret) fica no HTML, no JavaScript público ou versionado no git.
- O repositório de destino (`Azaton/universalismo`) é fixo no Worker (`GITHUB_REPO`) — o visitante não pode escolher onde a Issue é criada.
- A permissão da GitHub App é restrita a `Issues: Read and write`; ela não pode alterar código, Actions nem configurações do repositório.
- O token de instalação expira em 1 hora e é gerado a cada requisição — não há token de longa duração circulando.
- Turnstile é validado no servidor (Worker), nunca só no navegador.
- CORS restrito a `https://azaton.github.io`.

## Limitações conscientes desta V1

- Sem rate limiting persistente (exigiria Cloudflare KV/Durable Objects) — se houver abuso, é o próximo reforço a adicionar.
- Sem painel administrativo, sem edição automática de conteúdo, sem banco de dados — o próprio GitHub Issues continua sendo o backlog editorial.
