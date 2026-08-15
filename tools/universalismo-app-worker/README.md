# universalismo-app-worker

Cloudflare Worker que recebe o formulário público de `contribuir.md`, valida o Cloudflare Turnstile, autentica como a **GitHub App do Universalismo** e cria uma Issue em `Azaton/universalismo`. Arquitetura decidida em 2026-08-15 (conversa "Interação e colaboração no site"):

```text
Pessoa → formulário público (contribuir.md) → Worker → GitHub App → GitHub API → Issue
```

O visitante nunca precisa de conta no GitHub. A Issue aparece criada pela App (ex.: `universalismo-app[bot]`), não por uma pessoa.

## Status

**Em produção.** GitHub App criada e instalada, secrets configurados, Worker publicado em `https://universalismo-app-worker.mendesx84.workers.dev`, Turnstile configurado, `contribuir.md`/`contribuicao.js` apontam para os valores reais, e testado de ponta a ponta (Issues #1 e #2 criadas pela App e depois removidas). `_includes/footer_custom.html` já aponta para `/contribuir.html` em todas as páginas do site.

## Passo a passo — o que só você pode fazer

O processo foi automatizado ao máximo (scripts em `scripts/`). Você só precisa clicar em duas telas — o resto é feito pelos scripts. Requer [Node.js](https://nodejs.org).

```bash
npm install
npx wrangler login
```

### 1. Criar a GitHub App (1 clique seu)

```bash
node scripts/create-github-app.mjs
```

Isso abre o navegador com o formulário da App já preenchido (nome, permissão única `Issues: Read and write`, webhook desativado). Você só confirma clicando em **Create GitHub App**. O script captura o retorno sozinho, gera o App ID e a chave privada, converte para o formato PKCS#8 exigido pelo Worker e salva tudo em `app-credentials.local.json` (arquivo local, nunca versionado — ver `.gitignore`).

Ao final ele imprime o link para instalar a App no repositório.

### 2. Instalar a App no repositório (1 clique seu)

Abra o link impresso pelo passo anterior (formato `https://github.com/apps/<slug>/installations/new`) e instale em **Only select repositories → universalismo**.

### 3. Terminar a configuração (automático)

```bash
node scripts/finish-setup.mjs
```

Esse script encontra sozinho o Installation ID (pergunta ao GitHub em qual instalação a App está) e grava `GITHUB_APP_ID`, `GITHUB_INSTALLATION_ID` e `GITHUB_PRIVATE_KEY` como secrets do Worker via `wrangler secret put`.

Se você tiver um token da Cloudflare com escopo **Turnstile Sites Write** e o Account ID à mão, exporte antes de rodar para também automatizar o Turnstile:

```bash
export CLOUDFLARE_API_TOKEN="..."
export CLOUDFLARE_ACCOUNT_ID="..."
node scripts/finish-setup.mjs
```

Sem essas variáveis, o script grava os secrets do GitHub normalmente e só imprime o passo manual do Turnstile (painel Cloudflare → Turnstile → Add site → domínio `azaton.github.io` → copiar Secret Key e rodar `npx wrangler secret put TURNSTILE_SECRET`).

Para desenvolvimento local, copie `.dev.vars.example` para `.dev.vars` (já ignorado pelo git) e preencha os mesmos valores lá, sem usar `wrangler secret put`.

### 4. Implantar

```bash
npx wrangler deploy
```

O comando imprime a URL pública do Worker (algo como `https://universalismo-app-worker.<seu-subdomínio>.workers.dev`). Essa URL precisa entrar em `assets/js/contribuicao.js` (constante `WORKER_ENDPOINT`) e a Site Key do Turnstile em `contribuir.md`.

<details>
<summary>Fluxo manual (caso os scripts não funcionem no seu ambiente)</summary>

1. **github.com → sua foto → Settings → Developer settings → GitHub Apps → New GitHub App**. Nome único, Homepage `https://azaton.github.io/universalismo/`, webhook desmarcado, permissão `Issues: Read and write` (resto `No access`), instalável só nesta conta.
2. Na página da App: **Private keys → Generate a private key** (baixa um `.pem` uma única vez) e anote o **App ID** no topo da página.
3. **Install App** → conta `Azaton` → `Only select repositories` → `universalismo`. Depois pegue o Installation ID em `https://github.com/settings/installations` (número no final da URL da instalação).
4. Se o `.pem` começar com `-----BEGIN RSA PRIVATE KEY-----` (PKCS#1), converta: `openssl pkcs8 -topk8 -nocrypt -in chave-original.pem -out chave-pkcs8.pem`.
5. Painel Cloudflare → Turnstile → Add site → domínio `azaton.github.io` → copiar Site Key e Secret Key.
6. `npx wrangler secret put GITHUB_APP_ID` / `GITHUB_INSTALLATION_ID` / `GITHUB_PRIVATE_KEY` / `TURNSTILE_SECRET`.

</details>

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
