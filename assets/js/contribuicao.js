/**
 * Formulário público de contribuição (contribuir.md).
 *
 * Lê a página de origem pela query string (?pagina=...&url=...), preenchida
 * automaticamente pelo botão "Perguntar ou contribuir" em cada página do
 * site (ver _includes/footer_custom.html). Envia a contribuição para o
 * Cloudflare Worker (tools/universalismo-app-worker/), que cria a Issue em
 * nome da GitHub App — o visitante nunca precisa de conta no GitHub.
 *
 * PENDENTE DE IMPLANTAÇÃO: WORKER_ENDPOINT abaixo é um placeholder até o
 * Worker ser implantado (ver tools/universalismo-app-worker/README.md).
 * Até lá, este formulário não deve ser linkado a partir do rodapé global.
 */
const WORKER_ENDPOINT = "WORKER_ENDPOINT_AQUI"; // ex.: https://universalismo-app-worker.<subdominio>.workers.dev

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const pagina = params.get("pagina") || "";
  const paginaUrl = params.get("url") || "";

  document.getElementById("pagina").value = pagina;
  document.getElementById("paginaUrl").value = paginaUrl;

  const contexto = document.getElementById("contribuir-contexto");
  contexto.textContent = pagina
    ? `Você está contribuindo com: ${pagina}`
    : "Sua contribuição não está associada a uma página específica.";

  const form = document.getElementById("form-contribuir");
  const status = document.getElementById("contribuir-status");
  const botao = document.getElementById("btn-enviar");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    status.className = "";

    if (WORKER_ENDPOINT.includes("WORKER_ENDPOINT_AQUI")) {
      status.textContent =
        "O envio ainda não está disponível: o serviço que recebe as contribuições ainda não foi implantado.";
      status.className = "erro";
      return;
    }

    const turnstileToken = getTurnstileToken();
    if (!turnstileToken) {
      status.textContent = "Confirme que você não é um robô antes de enviar.";
      status.className = "erro";
      return;
    }

    const payload = {
      tipo: document.getElementById("tipo").value,
      contribuicao: document.getElementById("contribuicao").value.trim(),
      fonte: document.getElementById("fonte").value.trim(),
      nome: document.getElementById("nome").value.trim(),
      pagina,
      paginaUrl,
      turnstileToken
    };

    if (!payload.tipo || !payload.contribuicao) {
      status.textContent = "Preencha o tipo e a sua pergunta ou contribuição.";
      status.className = "erro";
      return;
    }

    botao.disabled = true;
    status.textContent = "Enviando...";
    status.className = "";

    try {
      const res = await fetch(WORKER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "falha_desconhecida");
      }

      status.textContent = "Contribuição enviada. Obrigado por colaborar com este estudo.";
      status.className = "sucesso";
      form.reset();
      if (window.turnstile) window.turnstile.reset();
    } catch (err) {
      console.error("Falha ao enviar contribuição", err);
      status.textContent = "Não foi possível enviar agora. Tente novamente em alguns minutos.";
      status.className = "erro";
    } finally {
      botao.disabled = false;
    }
  });
});

function getTurnstileToken() {
  const input = document.querySelector('[name="cf-turnstile-response"]');
  return input ? input.value : "";
}
