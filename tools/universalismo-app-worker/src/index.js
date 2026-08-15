/**
 * Universalismo — ponte pública de contribuição.
 *
 * Recebe o formulário público de contribuir.md, valida a requisição e o
 * Cloudflare Turnstile, autentica como a GitHub App "Universalismo" (JWT
 * assinado com GITHUB_PRIVATE_KEY -> token de instalação) e cria uma Issue
 * em Azaton/universalismo. O visitante nunca precisa de conta no GitHub;
 * a Issue é atribuída à App, não a uma pessoa.
 *
 * Segredos esperados (nunca commitados — ver ../README.md):
 *   GITHUB_APP_ID           id numérico da GitHub App
 *   GITHUB_INSTALLATION_ID  id da instalação da App em Azaton/universalismo
 *   GITHUB_PRIVATE_KEY      conteúdo do .pem gerado para a App (PKCS#8 ou PKCS#1)
 *   TURNSTILE_SECRET        secret key do site Turnstile
 *
 * Variáveis não-secretas (wrangler.jsonc [vars]):
 *   ALLOWED_ORIGIN   origem do site (para CORS)
 *   GITHUB_REPO      "Azaton/universalismo" — fixo no Worker, o visitante
 *                    nunca escolhe o repositório (ver seção 14 da decisão).
 */

const MAX_FIELD_LENGTHS = {
  tipo: 60,
  titulo: 150,
  contribuicao: 4000,
  pagina: 300,
  paginaUrl: 500,
  fonte: 500,
  nome: 100
};

const TIPOS_VALIDOS = new Set([
  "Fazer uma pergunta",
  "Sugerir uma fonte",
  "Complementar um estudo",
  "Sugerir uma correção",
  "Sugerir um novo tema"
]);

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "https://azaton.github.io";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400, origin);
    }

    const validation = validatePayload(payload);
    if (!validation.ok) {
      return json({ error: validation.error }, 400, origin);
    }
    const data = validation.data;

    const turnstileOk = await verifyTurnstile(data.turnstileToken, env, request);
    if (!turnstileOk) {
      return json({ error: "turnstile_failed" }, 403, origin);
    }

    let installationToken;
    try {
      installationToken = await getInstallationToken(env);
    } catch (err) {
      console.error("Falha ao autenticar a GitHub App", err);
      return json({ error: "github_auth_failed" }, 502, origin);
    }

    let issue;
    try {
      issue = await createIssue(installationToken, data, env);
    } catch (err) {
      console.error("Falha ao criar a Issue", err);
      return json({ error: "github_issue_failed" }, 502, origin);
    }

    return json({ ok: true, issueNumber: issue.number, issueUrl: issue.html_url }, 201, origin);
  }
};

// ---------------------------------------------------------------------------
// Validação de entrada
// ---------------------------------------------------------------------------

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "payload_ausente" };
  }

  const tipo = trimOrEmpty(payload.tipo);
  const contribuicao = trimOrEmpty(payload.contribuicao);
  const pagina = trimOrEmpty(payload.pagina);
  const paginaUrl = trimOrEmpty(payload.paginaUrl);
  const fonte = trimOrEmpty(payload.fonte);
  const nome = trimOrEmpty(payload.nome);
  const turnstileToken = trimOrEmpty(payload.turnstileToken);

  if (!TIPOS_VALIDOS.has(tipo)) return { ok: false, error: "tipo_invalido" };
  if (!contribuicao) return { ok: false, error: "contribuicao_obrigatoria" };
  if (!turnstileToken) return { ok: false, error: "turnstile_ausente" };

  for (const [campo, valor] of Object.entries({ tipo, contribuicao, pagina, paginaUrl, fonte, nome })) {
    const limite = MAX_FIELD_LENGTHS[campo];
    if (limite && valor.length > limite) {
      return { ok: false, error: `campo_muito_longo:${campo}` };
    }
  }

  return {
    ok: true,
    data: { tipo, contribuicao, pagina, paginaUrl, fonte, nome, turnstileToken }
  };
}

function trimOrEmpty(value) {
  return typeof value === "string" ? value.trim() : "";
}

// ---------------------------------------------------------------------------
// Turnstile — validação server-side obrigatória (o token do navegador não
// prova nada sozinho; ver https://developers.cloudflare.com/turnstile/)
// ---------------------------------------------------------------------------

async function verifyTurnstile(token, env, request) {
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token
  });
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) return false;
  const result = await res.json();
  return result.success === true;
}

// ---------------------------------------------------------------------------
// Autenticação como GitHub App: assina um JWT com a chave privada da App,
// troca por um token de instalação de curta duração (expira em 1h).
// https://docs.github.com/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app
// ---------------------------------------------------------------------------

async function getInstallationToken(env) {
  const jwt = await signAppJwt(env.GITHUB_APP_ID, env.GITHUB_PRIVATE_KEY);

  const res = await fetch(
    `https://api.github.com/app/installations/${env.GITHUB_INSTALLATION_ID}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "universalismo-app-worker"
      }
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`installation token: ${res.status} ${text}`);
  }
  const { token } = await res.json();
  return token;
}

async function signAppJwt(appId, privateKeyPem) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    // 60s no passado tolera pequena diferença de relógio, como a própria
    // documentação do GitHub recomenda.
    iat: nowSeconds - 60,
    exp: nowSeconds + 9 * 60,
    iss: appId
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await importRsaPrivateKey(privateKeyPem);
  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    new TextEncoder().encode(signingInput)
  );

  return `${signingInput}.${base64url(new Uint8Array(signature))}`;
}

async function importRsaPrivateKey(pem) {
  const isPkcs1 = pem.includes("BEGIN RSA PRIVATE KEY");
  if (isPkcs1) {
    throw new Error(
      "Chave em formato PKCS#1 (BEGIN RSA PRIVATE KEY) — converta para PKCS#8 antes de configurar o secret. " +
        "Comando: openssl pkcs8 -topk8 -nocrypt -in chave-original.pem -out chave-pkcs8.pem"
    );
  }

  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const der = base64ToArrayBuffer(body);

  return crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

// ---------------------------------------------------------------------------
// Criação da Issue
// ---------------------------------------------------------------------------

async function createIssue(installationToken, data, env) {
  const repo = env.GITHUB_REPO || "Azaton/universalismo";
  const title = buildTitle(data);
  const body = buildBody(data);

  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `token ${installationToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "universalismo-app-worker",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      body,
      labels: ["contribuicao-publica"]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`create issue: ${res.status} ${text}`);
  }
  return res.json();
}

function buildTitle(data) {
  const tipoAbreviado = {
    "Fazer uma pergunta": "Pergunta",
    "Sugerir uma fonte": "Fonte",
    "Complementar um estudo": "Complemento",
    "Sugerir uma correção": "Correção",
    "Sugerir um novo tema": "Novo tema"
  }[data.tipo] || data.tipo;

  const resumo = data.contribuicao.slice(0, 80).replace(/\s+/g, " ").trim();
  return `[${tipoAbreviado}] ${resumo}${data.contribuicao.length > 80 ? "…" : ""}`;
}

function buildBody(data) {
  const linhas = [
    "Origem: formulário público do Projeto Universalismo",
    "",
    `Tipo: ${data.tipo}`,
    "",
    `Página relacionada: ${data.pagina || "não informada"}`,
    `URL da página: ${data.paginaUrl || "não informada"}`,
    "",
    "Contribuição:",
    data.contribuicao,
    "",
    `Fonte ou referência: ${data.fonte || "não informada"}`,
    "",
    `Nome informado: ${data.nome || "não informado"}`
  ];
  return linhas.join("\n");
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) }
  });
}

function base64url(input) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
