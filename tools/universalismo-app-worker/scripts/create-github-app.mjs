#!/usr/bin/env node
/**
 * Automatiza a criação da GitHub App via GitHub App Manifest Flow.
 *
 * O que este script faz sozinho:
 *   1. Sobe um servidor local temporário.
 *   2. Abre o navegador padrão numa página que envia o manifesto da App
 *      pronto (nome, permissão única "Issues: Read and write", webhook
 *      desativado) para o GitHub.
 *   3. Você só precisa clicar em "Create GitHub App" na tela do GitHub.
 *   4. O GitHub redireciona de volta para o servidor local com um código
 *      de uso único; o script troca esse código pelos dados definitivos
 *      da App (App ID, chave privada .pem) via API, sem intervenção sua.
 *   5. Converte a chave para PKCS#8 (formato exigido pelo Worker) e grava
 *      tudo em app-credentials.local.json (arquivo IGNORADO pelo git).
 *
 * Depois de rodar isto, o próximo passo é `node scripts/finish-setup.mjs`.
 *
 * Uso: node scripts/create-github-app.mjs
 * Variável opcional: GITHUB_APP_OWNER_ORG=NomeDaOrg (se Azaton for uma
 * organização, não uma conta pessoal; por padrão assume conta pessoal).
 */

import { createServer } from "node:http";
import { createPrivateKey, randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "app-credentials.local.json");

const PORT = 45871;
const REDIRECT_URL = `http://127.0.0.1:${PORT}/callback`;
const OWNER_ORG = process.env.GITHUB_APP_OWNER_ORG;
const CREATE_URL = OWNER_ORG
  ? `https://github.com/organizations/${OWNER_ORG}/settings/apps/new`
  : "https://github.com/settings/apps/new";

const state = randomBytes(16).toString("hex");

const manifest = {
  name: `Universalismo Contributor ${randomBytes(2).toString("hex")}`,
  url: "https://azaton.github.io/universalismo/",
  redirect_url: REDIRECT_URL,
  hook_attributes: {
    url: "https://azaton.github.io/universalismo/",
    active: false
  },
  public: false,
  default_permissions: { issues: "write" },
  default_events: []
};

function formPageHtml() {
  return `<!doctype html>
<html lang="pt-br">
<head><meta charset="utf-8"><title>Criando GitHub App…</title></head>
<body>
  <p>Redirecionando para o GitHub…</p>
  <form id="f" method="post" action="${CREATE_URL}?state=${state}">
    <input type="hidden" name="manifest" value='${JSON.stringify(manifest).replace(/'/g, "&#39;")}'>
  </form>
  <script>document.getElementById('f').submit();</script>
</body>
</html>`;
}

function openBrowser(url) {
  const platform = process.platform;
  if (platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { stdio: "ignore", detached: true }).unref();
  } else if (platform === "darwin") {
    spawn("open", [url], { stdio: "ignore", detached: true }).unref();
  } else {
    spawn("xdg-open", [url], { stdio: "ignore", detached: true }).unref();
  }
}

async function exchangeCode(code) {
  const res = await fetch(`https://api.github.com/app-manifests/${code}/conversions`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "universalismo-app-worker-setup"
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Falha ao trocar o code pela App: ${res.status} ${text}`);
  }
  return res.json();
}

function toPkcs8(pem) {
  const key = createPrivateKey({ key: pem, format: "pem" });
  return key.export({ type: "pkcs8", format: "pem" }).toString();
}

async function main() {
  console.log("Abrindo o navegador para você confirmar a criação da GitHub App...");
  console.log(`(Se não abrir sozinho, acesse: ${REDIRECT_URL.replace("/callback", "/start")})`);

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

    if (url.pathname === "/start") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(formPageHtml());
      return;
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");

      if (!code || returnedState !== state) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<p>Estado inválido ou code ausente. Feche esta aba e rode o script novamente.</p>");
        return;
      }

      try {
        const app = await exchangeCode(code);
        const pkcs8 = toPkcs8(app.pem);

        writeFileSync(
          OUTPUT_PATH,
          JSON.stringify(
            {
              id: app.id,
              slug: app.slug,
              name: app.name,
              owner: app.owner?.login,
              html_url: app.html_url,
              client_id: app.client_id,
              client_secret: app.client_secret,
              webhook_secret: app.webhook_secret,
              pem_pkcs8: pkcs8
            },
            null,
            2
          )
        );

        const installUrl = `https://github.com/apps/${app.slug}/installations/new`;

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<!doctype html><html lang="pt-br"><body>
          <h1>App "${app.name}" criada com sucesso.</h1>
          <p>App ID: <b>${app.id}</b></p>
          <p>Falta só instalar a App no repositório. Abra:</p>
          <p><a href="${installUrl}">${installUrl}</a></p>
          <p>Depois de instalar, volte ao terminal e rode: <code>node scripts/finish-setup.mjs</code></p>
          <p>Pode fechar esta aba.</p>
        </body></html>`);

        console.log(`\nApp criada: ${app.name} (id ${app.id})`);
        console.log(`Credenciais salvas em: ${OUTPUT_PATH}`);
        console.log(`\nPróximo passo — instale a App no repositório:\n  ${installUrl}`);
        console.log(`\nDepois rode: node scripts/finish-setup.mjs`);

        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 500);
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<p>Erro ao processar: ${err.message}</p>`);
      }
      return;
    }

    res.writeHead(404);
    res.end();
  });

  server.listen(PORT, "127.0.0.1", () => {
    openBrowser(`http://127.0.0.1:${PORT}/start`);
  });
}

main();
