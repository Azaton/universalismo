#!/usr/bin/env node
/**
 * Segunda etapa do setup: roda DEPOIS que você instalou a GitHub App no
 * repositório (link impresso por create-github-app.mjs).
 *
 * O que este script faz sozinho, sem você copiar nada manualmente:
 *   1. Lê app-credentials.local.json (gerado por create-github-app.mjs).
 *   2. Assina um JWT com a chave da App e pergunta ao GitHub em qual
 *      instalação ela está — encontra o Installation ID sozinho.
 *   3. Grava os secrets no Cloudflare Worker via `wrangler secret put`
 *      (GITHUB_APP_ID, GITHUB_INSTALLATION_ID, GITHUB_PRIVATE_KEY).
 *   4. Se as variáveis de ambiente CLOUDFLARE_API_TOKEN e
 *      CLOUDFLARE_ACCOUNT_ID estiverem definidas, cria o site do
 *      Turnstile via API da Cloudflare e grava TURNSTILE_SECRET também
 *      — só falta colar a Site Key (não secreta) em contribuir.md.
 *      Caso contrário, imprime o passo manual (é rápido: 1 tela).
 *
 * Uso: node scripts/finish-setup.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { createSign } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKER_DIR = join(__dirname, "..");
const CREDS_PATH = join(WORKER_DIR, "app-credentials.local.json");
const REPO = "Azaton/universalismo";

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function signAppJwt(appId, pkcs8Pem) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({ iat: now - 60, exp: now + 9 * 60, iss: appId }));
  const signingInput = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = signer.sign(pkcs8Pem);
  return `${signingInput}.${base64url(signature)}`;
}

async function findInstallationId(jwt) {
  const res = await fetch("https://api.github.com/app/installations", {
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "universalismo-app-worker-setup"
    }
  });
  if (!res.ok) throw new Error(`GET /app/installations: ${res.status} ${await res.text()}`);
  const installations = await res.json();
  if (installations.length === 0) {
    throw new Error(
      "Nenhuma instalação encontrada. Você já instalou a App no repositório? " +
        "Abra o link impresso por create-github-app.mjs e instale antes de rodar este script."
    );
  }
  const [owner] = REPO.split("/");
  const match = installations.find((i) => i.account?.login?.toLowerCase() === owner.toLowerCase());
  if (!match) {
    throw new Error(
      `A App está instalada, mas não em "${owner}". Instalações encontradas: ` +
        installations.map((i) => i.account?.login).join(", ")
    );
  }
  return match.id;
}

function wranglerSecretPut(name, value) {
  console.log(`Gravando secret ${name}...`);
  const result = spawnSync("npx", ["wrangler", "secret", "put", name], {
    cwd: WORKER_DIR,
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
    shell: process.platform === "win32"
  });
  if (result.status !== 0) {
    throw new Error(`Falha ao gravar secret ${name} (código ${result.status})`);
  }
}

async function createTurnstileWidget(accountId, apiToken) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/challenges/widgets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Universalismo - contribuir",
      domains: ["azaton.github.io"],
      mode: "managed"
    })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(`Falha ao criar Turnstile: ${JSON.stringify(data.errors || data)}`);
  }
  return data.result; // { sitekey, secret, ... }
}

async function main() {
  if (!existsSync(CREDS_PATH)) {
    console.error(`Não encontrei ${CREDS_PATH}. Rode antes: node scripts/create-github-app.mjs`);
    process.exit(1);
  }
  const creds = JSON.parse(readFileSync(CREDS_PATH, "utf8"));

  console.log(`Procurando a instalação da App "${creds.name}" (id ${creds.id})...`);
  const jwt = signAppJwt(creds.id, creds.pem_pkcs8);
  const installationId = await findInstallationId(jwt);
  console.log(`Installation ID encontrado: ${installationId}`);

  wranglerSecretPut("GITHUB_APP_ID", String(creds.id));
  wranglerSecretPut("GITHUB_INSTALLATION_ID", String(installationId));
  wranglerSecretPut("GITHUB_PRIVATE_KEY", creds.pem_pkcs8);

  const cfToken = process.env.CLOUDFLARE_API_TOKEN;
  const cfAccount = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (cfToken && cfAccount) {
    console.log("Criando o site do Turnstile via API da Cloudflare...");
    const widget = await createTurnstileWidget(cfAccount, cfToken);
    wranglerSecretPut("TURNSTILE_SECRET", widget.secret);
    console.log(`\nTurnstile criado. Site Key (não secreta, vai em contribuir.md): ${widget.sitekey}`);
    console.log("SITE_KEY=" + widget.sitekey);
  } else {
    console.log("\nCLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID não definidos — pulei a criação automática do Turnstile.");
    console.log("Faça manualmente (1 tela): painel da Cloudflare -> Turnstile -> Add site -> domínio azaton.github.io.");
    console.log("Copie a Secret Key e rode:");
    console.log("  npx wrangler secret put TURNSTILE_SECRET");
    console.log("E guarde a Site Key para colar em contribuir.md.");
  }

  console.log("\nFalta apenas:");
  console.log("  1. npx wrangler deploy   (dentro de tools/universalismo-app-worker/)");
  console.log("  2. Atualizar WORKER_ENDPOINT em assets/js/contribuicao.js com a URL impressa pelo deploy.");
  console.log("  3. Atualizar a Site Key do Turnstile em contribuir.md.");
  console.log("  4. Testar o formulário e só então trocar o link em _includes/footer_custom.html.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
